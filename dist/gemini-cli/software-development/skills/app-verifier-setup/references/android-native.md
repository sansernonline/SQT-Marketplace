# Driving a native Android / Flutter app on an emulator

> Summarized from a real app, `Lumio - Light Meter` (Flutter · Android). The script that ran and passed is `lumio-light-meter/test/e2e/verify.mjs`.
> Values marked "measured" come from an emulator on Windows using software GPU rendering. Other machines may be faster.

## Choose how to drive

| Method | Strength | Limit | Use when |
|---|---|---|---|
| Node/Python calling `adb` + `uiautomator dump` | Nothing extra to install · can drive the virtual sensor and camera · can check `dumpsys` | Reading the screen takes 3–4 seconds each time (measured) | Default · tests the whole path hardware → native → Dart → screen |
| Flutter `integration_test` (`flutter test integration_test/`) | Finds widgets directly with `find` · fast | Cannot feed real sensor values, so it needs a fake data source · cannot check system state (was the camera released?) | Long screen sequences that do not touch hardware |
| Maestro | Flows written in readable YAML | Needs an extra install · not yet tested in this setup | The team already uses Maestro |

## Script structure (verify.mjs style)

1. **Check before starting** that a device is connected (`adb devices`) and the APK exists (`build/app/outputs/flutter-apk/app-debug.apk`). If either is missing, exit 1 and print the command to run.
2. **Install** with `adb install -r <apk>`, then **start clean for every feature**: `adb shell pm clear <package>` → `adb shell am start -n <package>/.MainActivity` → wait for the text on the first screen.
3. **Read the screen**: `rm -f /sdcard/ui.xml` → `uiautomator dump /sdcard/ui.xml` → `exec-out cat` → pull `text` and `content-desc` with the center point from `bounds`.
4. **Tap** with `adb shell input tap x y` · **feed a value** with `adb emu sensor set light <lux>` · **take a screenshot** with `adb exec-out screencap -p > shot.png`.
5. **Result**: `PASS/FAIL` with expected and actual values, and exit 0 only when at least 1 check ran and all checks passed.

## Rules learned from real runs

| Topic | Do this | Because |
|---|---|---|
| Text in Flutter | Add `Semantics(label: ...)` to every value you must check | The label appears as `content-desc` in `uiautomator dump`, so it can be checked, and it also helps screen-reader users. |
| Stale dump file | Delete `/sdcard/ui.xml` before every dump | When a dump fails it does **not overwrite** the old file, so you may read an old screen without knowing. |
| "could not get idle state" | Treat it as an app bug and fix the app | The app redraws constantly (Lumio redrew 5 times per second even when the value did not change). That wastes battery and makes TalkBack repeat itself. Fix it by notifying the UI only when the displayed value really changes (for a jittery sensor: a change over 1 %). For a secondary value that drifts slowly, update about once per second. |
| Moving targets | Tap only when 2 reads in a row give the same position | A dialog shifts up when the keyboard opens. A tap at the old position hits the backdrop and the dialog closes (probably the cause of the 1 remaining flaky (inconsistent) result, but not yet re-checked). |
| Permissions | Run `adb shell pm grant <package> android.permission.CAMERA` before any check that does not test the permission screen | The system permission dialog is not what that check is testing. |
| "Released" check | Check the precondition first (the camera is held) → press Home → poll `dumpsys media.camera` for "Active Camera Clients" every 1 second for up to 20 seconds | The emulator releases the camera in 5–8 seconds (measured). Without the precondition check, the check passes while testing nothing. |
| Git Bash | Call `adb` from Node/Python (`execFile`) or set `MSYS_NO_PATHCONV=1` | Git Bash rewrites `/sdcard/...` into `C:/Program Files/Git/sdcard/...`. |

## Feeding hardware values

| What to feed | On the emulator | Note |
|---|---|---|
| Light sensor | `adb emu sensor set light <lux>`, and the app receives the value through `Sensor.TYPE_LIGHT` (measured) | For other sensors use `adb emu sensor set <name> <value>` (not checked one by one) |
| Camera | The virtual front camera sends an image with ISO and exposure time (measured) | The image is a synthetic scene, so you can only check that "a value comes out", not its accuracy |
| Anything else, or what the emulator cannot do | A fake data source compiled into the debug build only | It must never leak into a release build |

Label every check: `emulator` means the data path is right, and `เครื่องจริง` (real device) means the value is right. If a check needs a real device but has not run there, report "ยังไม่ได้ตรวจบนเครื่องจริง" (not yet checked on a real device).

## Time and memory

| Step | Measured time | Set a separate timeout |
|---|---|---|
| First Gradle build (downloads NDK · platform) | ~10 minutes | 20 minutes |
| Later Gradle builds | 1–2 minutes | 5 minutes |
| Emulator boot | Several minutes (not timed) | Poll `adb shell getprop sys.boot_completed` = 1 |
| Open the app until the first screen shows | A few seconds | 20 seconds |
| Per check (waiting for a value on screen) | 3–4 seconds per read | 15–20 seconds |

- The emulator and Gradle use a lot of memory. Claude Code once closed a background emulator because memory ran out.
- Run one emulator only, and stop the Gradle daemon after the build (`gradlew --stop` in `android/`).
- If the emulator is closed midway, report "ยังไม่ได้รันซ้ำ" (not yet re-run) with the list of checks that did not run. Never retry silently and report only the later run.
- No Docker: an emulator in Docker needs KVM, which Docker Desktop on Windows does not have, so run it on the host.
