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
# DNS only to the resolvers this container was given (Docker's embedded 127.0.0.11 on a
# compose network, already covered by the lo rule), not to any server on the internet.
# Limit: the resolver still forwards lookups upstream, so DNS tunnelling through it stays
# possible. For code that must not leak anything, run with no network at all.
for ns in $(awk '/^nameserver/ {print $2}' /etc/resolv.conf | grep -E '^[0-9]+(\.[0-9]+){3}$' || true); do
  iptables -A OUTPUT -p udp -d "$ns" --dport 53 -j ACCEPT
  iptables -A OUTPUT -p tcp -d "$ns" --dport 53 -j ACCEPT
done
iptables -A OUTPUT -m set --match-set sandbox-allowed dst -j ACCEPT
iptables -P OUTPUT DROP

echo "firewall on: $count addresses allowed"
if curl -s --max-time 5 https://example.com >/dev/null; then
  echo "FAIL: example.com is reachable — firewall not effective" >&2; exit 1
fi
echo "check passed: example.com blocked"
