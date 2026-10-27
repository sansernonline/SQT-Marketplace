# Jenkinsfile ตัวอย่าง — voice agent คลินิกทันตกรรม

ใช้คู่กับ `SKILL.md` ของ `jenkins-pipeline` · ชื่อ service · chart · namespace · probe ตรงกับ `kubernetes-helm` (chart เดียว `clinic-voice` · release `clinic`) · ชื่อ credential · registry เป็นชื่อสมมุติ ให้แทนด้วยของจริง · **ยังไม่ได้รันกับ Jenkins จริง** ผ่านการอ่านเทียบเอกสารเท่านั้น (ตรวจ 2026-10-27) · ตรวจไวยากรณ์ด้วย `declarative-linter` ก่อน commit

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
    timeout(time: 4, unit: 'HOURS')   // ต้องมากกว่าเวลา build ทั้งหมดรวมเวลารออนุมัติ 2 ชั่วโมง เพราะ timeout ระดับบนนับเวลารอ input ด้วย
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
        // values ที่ commit ต้องมี digest ชั่วคราวที่ผ่าน required ของ chart ไม่งั้น lint ล้มก่อนขั้นเขียน digest จริง
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
          // single quote ทั้งหมด: shell อ่าน REG_USER REG_PASS เอง
          sh '''
            set +x
            echo "$REG_PASS" | docker login registry.example.com -u "$REG_USER" --password-stdin
            # ชื่อ image : ชื่อ key ใน values.yaml
            for pair in web:web api:api voice-gateway:voiceGateway stt:stt tts:tts; do
              svc=${pair%%:*}; key=${pair##*:}
              docker buildx build "services/$svc" \
                -t "$REGISTRY/$svc:$TAG" --push --metadata-file "meta-$svc.json"
              D=$(jq -r '."containerimage.digest"' "meta-$svc.json")
              trivy image --severity HIGH,CRITICAL --ignore-unfixed --exit-code 1 \
                "$REGISTRY/$svc@$D"
              # digest อยู่ใน values ของแต่ละ environment · staging กับ production ได้ตัวเดียวกัน
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
          // timeout ยาวเพราะ stt/tts ดึง image ใหญ่และโหลดโมเดล (ค่าจริงยังไม่ได้วัด)
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
        // ต่อ /health/live และ /health/ready ของ web api voice-gateway + สายทดสอบ 1 สาย
        sh 'make smoke-staging'
      }
    }

    stage('Production') {
      // beforeOptions true: ไม่ให้คำถามอนุมัติเด้งบน branch ที่ไม่ใช่ main
      when { branch 'main'; beforeOptions true }
      options { timeout(time: 2, unit: 'HOURS') }
      // input อยู่ก่อน agent: ไม่ถือ executor ระหว่างรอคน
      input {
        message 'Deploy to production (namespace clinic-production)?'
        ok 'Deploy'
        submitter 'clinic-release-managers'
        submitterParameter 'APPROVER'
      }
      agent { kubernetes { yamlFile 'ci/helm-pod.yaml'; defaultContainer 'helm' } }
      steps {
        echo "Approved by ${APPROVER}"        // ชื่อผู้ใช้ ไม่ใช่ค่าลับ
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
            // ย้อน release เดียวไปรุ่นก่อนหน้า (ไม่ใส่เลขรุ่น) ดูเลขด้วย helm history clinic
            sh 'helm rollback clinic -n clinic-production --wait --timeout 20m'
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
| `registry-push` · `kubeconfig-staging` · `kubeconfig-production` | ID ของ credential ใน Jenkins · kubeconfig ของ production ใช้ ServiceAccount ที่แก้ได้เฉพาะ namespace `clinic-production` |
| `clinic-release-managers` | กลุ่มผู้อนุมัติ · เริ่มจากไม่ใช้คนเดียวกับผู้ push |
| `make lint test` · `make smoke-staging` · `ci/smoke.sh` | คำสั่งของโปรเจกต์ |
| key ใน `.<key>.image.digest` | ชื่อค่าใน `values-<env>.yaml` ของ chart (`kubernetes-helm` `references/helm-chart.md` ใช้ `api.image.digest`) |
| `--atomic` | Helm 4 ใช้ `--rollback-on-failure` (`--atomic` deprecated) · รัน `helm version` ก่อนเลือก |
| digest ใน values | ไฟล์ที่ pipeline แก้อยู่แค่ใน workspace และ artifact · จะ commit กลับเข้า git หรือไม่เป็นเรื่องของทีม `(รอยืนยัน)` |

## ข้อที่ยังไม่ได้ตรวจ

- `jq` `yq` `trivy` ต้องติดตั้งบนเครื่องที่ติดป้าย `docker-build` · `yq -i` กับ `strenv()` ยังไม่ได้เปิดอ่านเอกสาร
- `stash` ไฟล์ values ข้าม agent แล้ว `unstash` ทับไฟล์ที่ checkout ทำงานตามที่เขียน (ยังไม่ได้ทดลอง)
- รูปแบบ `yamlFile` + `defaultContainer` บรรทัดเดียวคั่น `;` และ `when { branch 'main'; beforeAgent true }` บรรทัดเดียว (หน้าเอกสารแสดงแบบหลายบรรทัด) · ให้ `declarative-linter` ตัดสิน
- ค่า `--timeout 20m` ของ stt/tts ยังไม่ได้วัด
