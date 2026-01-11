const fs = require('fs');
const path = require('path');
const db = require('../config/database');

const schemaPath = path.join(__dirname, '..', 'models', 'schema.sql');

const schema = fs.readFileSync(schemaPath, 'utf8');

db.exec(schema, (err) => {
  if (err) {
    console.error('❌ Failed to create schema', err);
    return;
  }

  console.log('✅ Database schema created');

 const products = [
    [
      'Teal Blue & Red Checkered Oversized Cropped Shirt',
      1499,
      10,
      'product1.png'
    ],
    [
      'Burgundy & Blue Checkered Oversized Cropped Shirt',
      1499,
      10,
      'product2.webp'
    ],
    [
      'Light Blue Checkered Oversized Cropped Shirt',
      1499,
      10,
      'product3.webp'
    ],
    [
      'Brown Checkered Oversized Cropped Shirt',
      1499,
      10,
      'product4.png'
    ],
    [
      'Olive Checkered Oversized Cropped Shirt',
      1499,
      10,
      'product5.png'
    ],
    [
      'Off White Checkered Oversized Cropped Shirt',
      1499,
      10,
      'product6.webp'
    ],
    [
      'Rust Orange Checkered Oversized Cropped Shirt',
      1499,
      10,
      'product7.png'
    ],
    [
      'Blue Checkered Woolen Pants',
      1999,
      10,
      'product8.png'
    ],
    [
      'Beige Checkered Woolen Pants',
      1999,
      10,
      'product9.webp'
    ]
  ];

  const stmt = db.prepare(
    'INSERT INTO products (name, price, stock, image) VALUES (?, ?, ?, ?)'
  );

  products.forEach(p => stmt.run(p));

  stmt.finalize(() => {
    console.log('✅ Sample products inserted');
    process.exit(0);
  });
});
