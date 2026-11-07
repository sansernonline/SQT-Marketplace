# Compare offers by numbers — example input and result

```json
{"criteria":[{"name":"total per year","weight":0.4,"better":"high"},{"name":"commute min","weight":0.2,"better":"low"},{"name":"growth 1-5","weight":0.25,"better":"high"},{"name":"leave days","weight":0.15,"better":"high"}],
 "must":[{"criterion":"total per year","min":850000}],
 "options":[{"name":"A","values":{"total per year":912000,"commute min":90,"growth 1-5":3,"leave days":12}},
            {"name":"B","values":{"total per year":858000,"commute min":60,"growth 1-5":4,"leave days":15}},
            {"name":"C","values":{"total per year":800000,"commute min":30,"growth 1-5":5,"leave days":15}}]}
```

Result when run: C is dropped by the iron rule, B 60 and A 40, B stays first when each weight moves ±20%. With only 2 options every criterion becomes 0 or 100, so read the raw numbers in brackets too.
