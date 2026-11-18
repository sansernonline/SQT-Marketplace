const express = require('express');
const app = express();
const items = [{ id: 1, name: 'Tea', price: 120 }, { id: 2, name: 'Mug', price: 250 }];
app.get('/', (req, res) => res.send(`<h1 data-testid="title">Shop</h1>${items.map(i => `<p>${i.name} ${i.price}</p>`).join('')}`));
// Known bug: total drops the last item
app.get('/cart', (req, res) => res.send(`<h1>Cart</h1><p data-testid="total">${items.slice(0, -1).reduce((s, i) => s + i.price, 0)}</p>`));
app.get('/checkout', (req, res) => res.send('<h1>Checkout</h1><form><button data-testid="pay">Pay</button></form>'));
app.listen(process.env.PORT || 3000);
