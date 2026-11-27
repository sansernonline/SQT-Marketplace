## Worked example: voice agent for a dental clinic

Task: a web app (customer page + back office) · several services talk through Kafka · STT/TTS on GPU · Jenkins build → staging → production

| Piece | How |
|---|---|
| image | `web` `api` `voice-gateway` `stt` `tts`, all multi-stage · non-root · digest · Jenkins builds once and records the digest |
| chart | 1 chart `clinic-voice` · `services.web` `api` `voiceGateway` `stt` `tts` · values split by environment · secrets (Kafka · database · STT/TTS keys) via `ExternalSecret` |
| web · api · gateway | probes point at `/health/live` `/health/ready` · PDB `maxUnavailable: 1` · HPA at CPU 60% |
| stt · tts | `nodeSelector` + toleration + `limits.nvidia.com/gpu: 1` · separate namespace or NetworkPolicy · long `startupProbe` for model loading |
| consumer that processes after the call | KEDA watches topic lag · max not above the number of partitions |
| NetworkPolicy | open only ingress → web · web → api · gateway → stt/tts · api → Kafka |
| metric | the pod exposes `/metrics` for Prometheus (per `incidents-and-monitoring`) |
| staging → production | test real voice on staging · record the digest · approve · `helm upgrade` production with that digest · no new build |

Result: `helm lint` and `helm template | kubeconform` pass for both environments · the production image `@sha256` matches staging · no secrets in the repo or values
