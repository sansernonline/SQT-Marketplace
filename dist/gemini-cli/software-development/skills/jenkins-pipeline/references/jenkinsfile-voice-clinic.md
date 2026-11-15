# Example Jenkinsfile: dental clinic voice agent

Use with the `SKILL.md` of `jenkins-pipeline`. Service names, chart, namespaces and probes match `kubernetes-helm` (one chart `clinic-voice`, release `clinic`). Credential names and the registry are made up, so replace them with real ones. **`ยังไม่ได้ตรวจ` against a real Jenkins**: it was only read against the docs (checked 2026-10-27). Check the syntax with `declarative-linter` before you commit.

## Contents

- [Jenkinsfile](#jenkinsfile)
- [Values to replace](#values-to-replace)
- [Not yet checked](#not-yet-checked)

## Jenkinsfile

```groovy
@Library('clinic-pipeline@v1.2.0') _   // if you have a shared library · pin the version · delete this line if you have none

pipeline {
  agent none
  options {
    timeout(time: 4, unit: 'HOURS')   // must exceed the whole build time plus the 2-hour approval wait, because the top-level timeout also counts the wait for input
    disableConcurrentBuilds()
    buildDiscarder(logRotator(numToKeepStr: '30'))
  }
  environment {
    REGISTRY = 'registry.example.com/clinic'
    CHART    = 'deploy/chart/clinic-voice'
  }

  stages {
    stage('Lint and unit test') {
      agent { label 'docker-build' }
      steps {
        sh 'make lint test'
        // the committed values need a temporary digest that passes the chart's required check, or lint fails before the step that writes the real digest
        sh 'helm lint "$CHART" --strict -f "$CHART/values-production.yaml"'
      }
    }

    stage('Build, push, scan, pin digest') {
      when { branch 'main'; beforeAgent true }
      agent { label 'docker-build' }
      steps {
        script { env.TAG = env.GIT_COMMIT.take(12) }
        withCredentials([usernamePassword(credentialsId: 'registry-push',
                                          usernameVariable: 'REG_USER',
                                          passwordVariable: 'REG_PASS')]) {
          // all single quotes: the shell reads REG_USER and REG_PASS itself
          sh '''
            set +x
            echo "$REG_PASS" | docker login registry.example.com -u "$REG_USER" --password-stdin
            # image name : key name in values.yaml
            for pair in web:web api:api voice-gateway:voiceGateway stt:stt tts:tts; do
              svc=${pair%%:*}; key=${pair##*:}
              docker buildx build "services/$svc" \
                -t "$REGISTRY/$svc:$TAG" --push --metadata-file "meta-$svc.json"
              D=$(jq -r '."containerimage.digest"' "meta-$svc.json")
              trivy image --severity HIGH,CRITICAL --ignore-unfixed --exit-code 1 \
                "$REGISTRY/$svc@$D"
              # the digest lives in each environment's values · staging and production get the same one
              for env in staging production; do
                D="$D" yq -i ".$key.image.digest = strenv(D)" "$CHART/values-$env.yaml"
              done
            done
          '''
        }
        archiveArtifacts artifacts: 'meta-*.json, deploy/chart/clinic-voice/values-*.yaml', fingerprint: true
        stash name: 'pinned', includes: 'deploy/chart/clinic-voice/values-*.yaml'
      }
    }

    stage('Deploy staging') {
      when { branch 'main'; beforeAgent true }
      agent { kubernetes { yamlFile 'ci/helm-pod.yaml'; defaultContainer 'helm' } }
      steps {
        unstash 'pinned'
        withCredentials([file(credentialsId: 'kubeconfig-staging', variable: 'KUBECONFIG')]) {
          // long timeout because stt/tts pull large images and load models (real value not yet measured)
          sh '''
            helm upgrade --install clinic "$CHART" -n clinic-staging --create-namespace \
              -f "$CHART/values.yaml" -f "$CHART/values-staging.yaml" \
              --atomic --timeout 20m
            kubectl -n clinic-staging rollout status deploy --timeout=10m
          '''
        }
      }
    }

    stage('Test on staging') {
      when { branch 'main'; beforeAgent true }
      agent { label 'docker-build' }
      steps {
        // hits /health/live and /health/ready of web, api and voice-gateway, plus 1 test call
        sh 'make smoke-staging'
      }
    }

    stage('Production') {
      // beforeOptions true: keeps the approval prompt from appearing on branches other than main
      when { branch 'main'; beforeOptions true }
      options { timeout(time: 2, unit: 'HOURS') }
      // input comes before agent: no executor is held while waiting for a person
      input {
        message 'Deploy to production (namespace clinic-production)?'
        ok 'Deploy'
        submitter 'clinic-release-managers'
        submitterParameter 'APPROVER'
      }
      agent { kubernetes { yamlFile 'ci/helm-pod.yaml'; defaultContainer 'helm' } }
      steps {
        echo "Approved by ${APPROVER}"        // a user name, not a secret
        unstash 'pinned'
        withCredentials([file(credentialsId: 'kubeconfig-production', variable: 'KUBECONFIG')]) {
          sh '''
            helm upgrade --install clinic "$CHART" -n clinic-production \
              -f "$CHART/values.yaml" -f "$CHART/values-production.yaml" \
              --atomic --timeout 20m
            kubectl -n clinic-production rollout status deploy --timeout=10m
            ./ci/smoke.sh clinic-production
          '''
        }
      }
      post {
        failure {
          withCredentials([file(credentialsId: 'kubeconfig-production', variable: 'KUBECONFIG')]) {
            // roll the single release back to the previous revision (no revision number) · see the number with helm history clinic
            sh 'helm rollback clinic -n clinic-production --wait --timeout 20m'
          }
        }
      }
    }
  }
}
```

## Values to replace

| Where | Replace with |
|---|---|
| `ci/helm-pod.yaml` | A pod with a container named `helm` (an image that has `helm` and `kubectl`, pinned to a version, never `latest`) |
| `registry-push` · `kubeconfig-staging` · `kubeconfig-production` | Credential IDs in Jenkins · the production kubeconfig uses a ServiceAccount that can change only the namespace `clinic-production` |
| `clinic-release-managers` | The approver group · start with people other than the one who pushed |
| `make lint test` · `make smoke-staging` · `ci/smoke.sh` | The project's own commands |
| key in `.<key>.image.digest` | The value name in the chart's `values-<env>.yaml` (`kubernetes-helm` `references/helm-chart.md` uses `api.image.digest`) |
| `--atomic` | Helm 4 uses `--rollback-on-failure` (`--atomic` is deprecated) · run `helm version` before you choose |
| digest in values | The pipeline edits the file only in the workspace and the artifact · whether to commit it back to git is the team's call `(รอยืนยัน)` |

## Not yet checked

- `jq`, `yq` and `trivy` must be installed on machines labelled `docker-build` · `ยังไม่ได้ตรวจ`: the docs for `yq -i` with `strenv()` have not been opened
- Stashing the values files across agents, then running `unstash` over the checked-out files, works as written (`ยังไม่ได้ตรวจ`: not tried)
- The one-line forms: `yamlFile` + `defaultContainer` separated by `;`, and `when { branch 'main'; beforeAgent true }` (the docs show a multi-line form) · let `declarative-linter` decide
- The `--timeout 20m` value for stt/tts has not been measured
