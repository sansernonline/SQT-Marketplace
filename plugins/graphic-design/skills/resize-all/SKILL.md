---
name: resize-all
description: Derive every needed platform format from a master asset — sizes, crops, safe zones, correct naming — ready to export.
argument-hint: <path to master asset> [platforms needed]
disable-model-invocation: true
---

Run `social-formats` and `campaign-set` derivation steps on: **$ARGUMENTS**

Never stretches an image. Every derived file has the platform and format in its name.
