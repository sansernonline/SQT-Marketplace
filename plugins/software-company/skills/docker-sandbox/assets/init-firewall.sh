#!/usr/bin/env bash
# Default-deny outbound firewall for locked mode. Runs as root inside the container only.
# Hosts are resolved once; services whose IPs rotate may need the script re-run.
set -euo pipefail
ALLOW=/etc/sandbox/allowlist.txt
[ -f "$ALLOW" ] || { echo "missing $ALLOW" >&2; exit 1; }

iptables -F OUTPUT
ipset destroy sandbox-allowed 2>/dev/null || true
ipset create sandbox-allowed hash:net

count=0
while IFS= read -r line; do
  host="${line%%#*}"; host="$(echo "$host" | xargs)"
  [ -z "$host" ] && continue
  for ip in $(dig +short A "$host" | grep -E '^[0-9]+(\.[0-9]+){3}$' || true); do
    ipset add -exist sandbox-allowed "$ip"; count=$((count+1))
  done
done < "$ALLOW"

iptables -A OUTPUT -o lo -j ACCEPT
iptables -A OUTPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT
iptables -A OUTPUT -p udp --dport 53 -j ACCEPT
iptables -A OUTPUT -p tcp --dport 53 -j ACCEPT
iptables -A OUTPUT -m set --match-set sandbox-allowed dst -j ACCEPT
iptables -P OUTPUT DROP

echo "firewall on: $count addresses allowed"
if curl -s --max-time 5 https://example.com >/dev/null; then
  echo "FAIL: example.com is reachable — firewall not effective" >&2; exit 1
fi
echo "check passed: example.com blocked"
