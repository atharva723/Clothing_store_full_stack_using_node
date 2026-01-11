const db = require('../config/database');

exports.getCart = (req, res) => {
  const sql = `
    SELECT 
      c.id,
      p.name,
      p.price,
      c.quantity,
      c.size
    FROM cart_items c
    JOIN products p ON p.id = c.product_id
  `;

  db.all(sql, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};

exports.addToCart = (req, res) => {
  const { productId, size } = req.body;

  // 🔒 size is now part of uniqueness
  const selectSql = `
    SELECT * FROM cart_items 
    WHERE product_id = ? AND size = ?
  `;

  db.get(selectSql, [productId, size || null], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (row) {
      db.run(
        'UPDATE cart_items SET quantity = quantity + 1 WHERE id = ?',
        [row.id],
        () => {
          res.json({ message: 'Added to cart', productId, size });
        }
      );
    } else {
      db.run(
        'INSERT INTO cart_items (product_id, quantity, size) VALUES (?, 1, ?)',
        [productId, size || null],
        () => {
          res.json({ message: 'Added to cart', productId, size });
        }
      );
    }
  });
};
