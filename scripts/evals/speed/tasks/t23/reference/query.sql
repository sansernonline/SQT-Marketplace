select c.name as name, sum(case when o.status='paid' then o.amount when o.status='refunded' then -o.amount else 0 end) as net
from orders o join customers c on c.id=o.customer_id
where o.order_date between '2026-07-01' and '2026-09-30' and o.status in ('paid','refunded')
group by c.id order by net desc, name limit 3;
