import express from 'express';
import cors from 'cors';
import { buildDashboard } from './dataService.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'Painel Serviço Assinatura' });
});

app.get('/api/dashboard', (req, res) => {
  try {
    const plano = req.query.plano || 'Todos';
    const churn = req.query.churn || 'Todos';
    const data = buildDashboard({ plano, churn });
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Falha ao processar a base de churn.' });
  }
});

app.listen(PORT, () => {
  console.log(`API rodando em http://localhost:${PORT}`);
});
