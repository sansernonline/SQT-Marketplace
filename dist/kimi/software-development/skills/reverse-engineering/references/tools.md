# Tools that are not on the machine · reverse-engineering

Open from SKILL.md section 5 when you must tell the user which tool to install.

| Tool | Used for | Install from (official) | Needs first |
|---|---|---|---|
| Ghidra | native decompile · headless analysis | github.com/NationalSecurityAgency/ghidra/releases | JDK 21 (adoptium.net) |
| jadx | DEX → Java | github.com/skylot/jadx/releases | Java 11 or later |
| apktool | decode APK resources and manifest | apktool.org | Java 8 or later |
| `aapt2` · `apksigner` | read the manifest · view the APK certificate | Android SDK Build-Tools (developer.android.com/tools) | — |
| `ilspycmd` | .NET → C# | `dotnet tool install ilspycmd` from nuget.org (ICSharpCode) into the work folder | A matching .NET SDK |
| Wireshark · tshark | read pcap files | wireshark.org | — |
| mitmproxy | capture a test app's traffic through a proxy (must ask) | mitmproxy.org | — |
| adb | control an Android device (must ask) | Android SDK Platform-Tools (developer.android.com/tools) | — |
| Binwalk · Unblob | find and extract sections in firmware | github.com/ReFirmLabs/binwalk · unblob.org | Linux or WSL |
| Playwright Core | drive a browser through agreed steps (must ask) | playwright.dev, installed in the project | Chrome or Edge |
| 7-Zip | extract installers and archives | 7-zip.org | — |
