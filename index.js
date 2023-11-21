import express from 'express';
import sql from './db.js';
import cors from 'cors';
import 'dotenv/config';

const app = express();

const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());

app.disable('x-powered-by');

app.get('/products', async (req, res) => {
  const query = await sql`SELECT * FROM product;`;
  res.json(query);
});

app.get('/product/:id', async (req, res) => {
  const { id } = req.params;
  const query = await sql`SELECT * FROM product WHERE id = ${id}`;
  res.json(query);
});

app.post('/product', async (req, res) => {
  const product = req.body;
  const { name, amount, price, description, image_url } = product;
  const totalPrice = price * amount;
  const query =
    await sql`INSERT INTO product (name, amount, price, description, total_price, image_url) VALUES (${name}, ${amount}, ${price}, ${description}, ${totalPrice}, ${image_url}) returning *`;
  res.status(201).json(query);
});

app.delete('/product/:id', async (req, res) => {
  const { id } = req.params;

  const query = await sql`DELETE FROM product WHERE id = ${id}`;

  res.status(202).json(query);
});

app.patch('/product/:id', async (req, res) => {
  const product = req.body;
  const { id } = req.params;

  let newProductInfo;

  if (product.amount && product.price) {
    const total_price = product.amount * product.price;

    newProductInfo = { ...product, total_price };
  } else if (product.amount) {
    const query = await sql`SELECT * FROM product WHERE id = ${id}`;
    const foundProduct = query[0];
    const total_price = product.amount * foundProduct.price;
    newProductInfo = { ...product, total_price };
  } else if (product.price) {
    const query = await sql`SELECT * FROM product WHERE id = ${id}`;
    const foundProduct = query[0];
    const total_price = product.price * foundProduct.amount;
    newProductInfo = { ...product, total_price };
  }

  const query = await sql`UPDATE product SET ${sql(
    newProductInfo
  )} WHERE id = ${id} `;

  res.status(200).send(query);
});

app.listen(PORT, () => {
  console.log(`Listening at port ${PORT}`);
});
