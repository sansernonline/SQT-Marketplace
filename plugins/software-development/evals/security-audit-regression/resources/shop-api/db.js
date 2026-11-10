// In-memory demo data. Real deployment uses PostgreSQL with the same shapes.
module.exports = {
  users: [{ id: 'u1', email: 'a@shop.test', passwordHash: '' }, { id: 'u2', email: 'b@shop.test', passwordHash: '' }],
  orders: [
    { id: 'A1001', customerId: 'u1', name: 'สมชาย', phone: '0812345678', address: 'กรุงเทพ', citizenId: '1100000000001', status: 'paid' },
    { id: 'A1002', customerId: 'u2', name: 'สมหญิง', phone: '0898765432', address: 'เชียงใหม่', citizenId: '1100000000002', status: 'shipped' },
  ],
  sessions: new Map(),
  pushLine: (userId, text) => console.log('push', userId, text),
};
