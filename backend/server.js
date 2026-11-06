import express from 'express';
import cors from 'cors';
import { products } from './data/products.js';

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors({ origin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173' }));
app.use(express.json());

app.get('/api/health', (_req, res) => res.json({ status: 'ok', service: 'flower-art-store-api' }));
app.get('/api/products', (req, res) => {
  const { category, search } = req.query;
  let result = products;
  if (category && category !== 'All') result = result.filter(p => p.category === category);
  if (search) result = result.filter(p => `${p.name} ${p.description}`.toLowerCase().includes(String(search).toLowerCase()));
  res.json({ count: result.length, products: result });
});
app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === Number(req.params.id));
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
});
app.listen(PORT, () => console.log(`Flower Art API running at http://localhost:${PORT}`));
