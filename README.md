# Painel Serviço Assinatura

Painel analítico no estilo Power BI, com visual SaaS premium, para explorar churn em serviço de assinatura.

## Stack

- **Frontend:** React + Vite + Recharts
- **Backend:** Node.js + Express
- **Dados:** CSV em `dados/`

## Como rodar

```bash
npm run install:all
```

Em um terminal:

```bash
npm run dev:backend
```

Em outro:

```bash
npm run dev:frontend
```

- API: http://localhost:3001
- Painel: http://127.0.0.1:5173 (ou http://localhost:5173)

> Abra a porta **5173** (frontend). A porta 3001 é só a API.
> Na primeira carga o React vem via CDN (esm.sh), então precisa de internet.

## Paleta

- `#fd550a` (principal)
- `#015d47` (secundária)
- `#e0f354` (detalhes / ação)
