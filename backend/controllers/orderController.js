const db = require('../config/database');

exports.placeOrder = (req, res) => {
  const { name, email, address } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: 'Name and email are required' });
  }

  db.all(
    `
    SELECT 
      c.product_id,
      c.quantity,
      c.size,
      p.price
    FROM cart_items c
    JOIN products p ON p.id = c.product_id
    `,
    [],
    (err, items) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (!items.length) {
        return res.status(400).json({ message: 'Cart is empty' });
      }

      const total = items.reduce(
        (sum, i) => sum + i.price * i.quantity,
        0
      );

      db.run(
        `
        INSERT INTO orders 
        (customer_name, email, address, total_amount)
        VALUES (?, ?, ?, ?)
        `,
        [name, email, address || '', total],
        function (err) {
          if (err) {
            return res.status(500).json({ error: err.message });
          }

          const orderId = this.lastID;

          const stmt = db.prepare(
            `
            INSERT INTO order_items 
            (order_id, product_id, quantity, size, price)
            VALUES (?, ?, ?, ?, ?)
            `
          );

          items.forEach(i => {
            stmt.run(
              orderId,
              i.product_id,
              i.quantity,
              i.size || null,
              i.price
            );
          });

          stmt.finalize(err => {
            if (err) {
              return res.status(500).json({ error: err.message });
            }

            db.run('DELETE FROM cart_items', () => {
              res.json({
                message: 'Order placed successfully',
                orderId
              });
            });
          });
        }
      );
    }
  );
};
