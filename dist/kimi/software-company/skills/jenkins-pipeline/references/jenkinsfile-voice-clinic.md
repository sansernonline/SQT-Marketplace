# Jenkinsfile ตัวอย่าง — voice agent คลินิกทันตกรรม

ใช้คู่กับ `SKILL.md` ของ `jenkins-pipeline` · ชื่อ credential · registry · namespace · chart เป็นชื่อสมมุติ ให้แทนด้วยของจริง · **ยังไม่ได้รันกับ Jenkins จริง** ผ่านการอ่านเทียบเอกสารเท่านั้น (ตรวจ 2026-10-27) · ตรวจไวยากรณ์ด้วย `declarative-linter` ก่อน commit

## สารบัญ

- [Jenkinsfile](#jenkinsfile)
- [จุดที่ต้องแทนค่า](#จุดที่ต้องแทนค่า)
- [ข้อที่ยังไม่ได้ตรวจ](#ข้อที่ยังไม่ได้ตรวจ)

## Jenkinsfile

```groovy
@Library('clinic-pipeline@v1.2.0') _   // ถ้ามี shared library · ล็อกรุ่น · ถ้ายังไม่มีลบบรรทัดนี้

pipeline {
  agent none
  options {
    timeout(time: 60, unit: 'MINUTES')
    disableConcurrentBuilds()
    buildDiscarder(logRotator(numToKeepStr: '30'))
  }
  environment {
    REGISTRY = 'registry.example.com/clinic'
  }

  stages {
    stage('Lint and unit test') {
      agent { label 'docker-build' }
      steps {
        sh 'make lint test'
      }
    }

    stage('Build, push, scan') {
      when { branch 'main' }
      agent { label 'docker-build' }
      steps {
        script {
          env.TAG = env.GIT_COMMIT.take(12)
        }
        withCredentials([usernamePassword(credentialsId: 'registry-push',
                                          usernameVariable: 'REG_USER',
                                          passwordVariable: 'REG_PASS')]) {
          // single quote ทั้งหมด: shell อ่าน REG_USER REG_PASS เอง
          sh '''
            set +x
            echo "$REG_PASS" | docker login registry.example.com -u "$REG_USER" --password-stdin
            for svc in gateway asr dialog booking; do
              docker buildx build "services/$svc" \
                -t "$REGISTRY/$svc:$TAG" --push --metadata-file "meta-$svc.json"
              jq -r '."containerimage.digest"' "meta-$svc.json" > "digest-$svc.txt"
              trivy image --severity HIGH,CRITICAL --ignore-unfixed --exit-code 1 \
                "$REGISTRY/$svc@$(cat digest-$svc.txt)"
            done
          '''
        }
        archiveArtifacts artifacts: 'digest-*.txt', fingerprint: true
        stash name: 'digests', includes: 'digest-*.txt'
      }
    }

    stage('Deploy staging') {
      when { branch 'main' }
      agent { kubernetes { yamlFile 'ci/helm-pod.yaml'; defaultContainer 'helm' } }
      steps {
        unstash 'digests'
        withCredentials([file(credentialsId: 'kubeconfig-staging', variable: 'KUBECONFIG')]) {
          sh '''
            for svc in gateway asr dialog booking; do
              helm upgrade --install "$svc" ./charts/"$svc" -n clinic-staging \
                --atomic --timeout 5m --history-max 10 \
                --set image.repository="$REGISTRY/$svc" \
                --set image.digest="$(cat digest-$svc.txt)"
            done
          '''
        }
      }
    }

    stage('Test on staging') {
      when { branch 'main' }
      agent { label 'docker-build' }
      steps {
        sh 'make smoke-staging'   // เรียก /healthz ของทั้ง 4 service + สายทดสอบ 1 สาย
      }
    }

    stage('Production') {
      when { branch 'main' }
      options { timeout(time: 2, unit: 'HOURS') }
      // input อยู่ก่อน agent: ไม่ถือ executor ระหว่างรอคน
      input {
        message 'Deploy to production?'
        ok 'Deploy'
        submitter 'clinic-release-managers'
        submitterParameter 'APPROVER'
      }
      agent { kubernetes { yamlFile 'ci/helm-pod.yaml'; defaultContainer 'helm' } }
      steps {
        echo "Approved by ${APPROVER}"        // ชื่อผู้ใช้ ไม่ใช่ค่าลับ
        unstash 'digests'
        withCredentials([file(credentialsId: 'kubeconfig-production', variable: 'KUBECONFIG')]) {
          sh '''
            for svc in gateway asr dialog booking; do
              helm upgrade --install "$svc" ./charts/"$svc" -n clinic-prod \
                --atomic --timeout 5m --history-max 10 \
                --set image.repository="$REGISTRY/$svc" \
                --set image.digest="$(cat digest-$svc.txt)"
            done
            ./ci/smoke.sh clinic-prod
          '''
        }
      }
      post {
        failure {
          withCredentials([file(credentialsId: 'kubeconfig-production', variable: 'KUBECONFIG')]) {
            // ย้อนกลับทุก release ไปรุ่นก่อนหน้า (ไม่ใส่เลขรุ่น)
            sh '''
              for svc in gateway asr dialog booking; do
                helm rollback "$svc" -n clinic-prod --wait --timeout 5m || true
              done
            '''
          }
        }
      }
    }
  }
}
```

## จุดที่ต้องแทนค่า

| ที่ | แทนด้วย |
|---|---|
| `ci/helm-pod.yaml` | pod ที่มี container ชื่อ `helm` (image ที่มี `helm` กับ `kubectl` ปักเลขรุ่น ไม่ใช้ `latest`) |
| `registry-push` · `kubeconfig-staging` · `kubeconfig-production` | ID ของ credential ใน Jenkins · kubeconfig ของ production ให้ใช้ ServiceAccount ที่แก้ได้เฉพาะ namespace `clinic-prod` |
| `clinic-release-managers` | กลุ่มผู้อนุมัติ · เริ่มจากไม่ใช้คนเดียวกับผู้ push |
| `make lint test` · `make smoke-staging` · `ci/smoke.sh` | คำสั่งของโปรเจกต์ |
| `image.repository` · `image.digest` | ชื่อค่าใน `values.yaml` ของ chart (`kubernetes-helm`) |
| Helm 4 | ตรวจ `helm upgrade --help` แล้วเปลี่ยน `--atomic` เป็น `--rollback-on-failure` ถ้าแฟล็กเดิมไม่รับ |

## ข้อที่ยังไม่ได้ตรวจ

- `--atomic` ยังใช้ได้ใน Helm 4 ไหม (หน้า 4.3.1 ไม่เอ่ยถึง)
- `jq` และ `trivy` ต้องติดตั้งบนเครื่องที่ติดป้าย `docker-build`
- `stash` ไฟล์ digest ข้าม agent ทำงานตามที่เขียน (ยังไม่ได้ทดลอง)
- รูปแบบ `yamlFile` + `defaultContainer` บรรทัดเดียวคั่น `;` ใน declarative (หน้าปลั๊กอินแสดงแบบหลายบรรทัด)
- `||true` ใน rollback ทำให้ stage ไม่ล้มซ้ำ แต่ซ่อนข้อผิดพลาดของ rollback ต้องดูใน log
