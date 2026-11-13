import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parse } from 'csv-parse/sync';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CSV_PATH = path.resolve(
  __dirname,
  '../../dados/Minimundo_servico_assinatura - Base_Churn_Realista (1).csv'
);

function parseMoney(value) {
  if (typeof value === 'number') return value;
  return Number(
    String(value)
      .replace(/R\$\s?/g, '')
      .replace(/\./g, '')
      .replace(',', '.')
      .trim()
  );
}

function parseNumber(value) {
  if (typeof value === 'number') return value;
  return Number(String(value).replace(',', '.').trim());
}

function loadClients() {
  const raw = fs.readFileSync(CSV_PATH, 'utf-8');
  const rows = parse(raw, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    relax_quotes: true,
  });

  return rows.map((row) => ({
    id: row.id_usuario,
    plano: row.plano_assinatura,
    valorMensal: parseMoney(row.valor_mensal_brl),
    mesesCliente: parseNumber(row.meses_como_cliente),
    diasSemAcessar: parseNumber(row.dias_sem_acessar),
    horasUso: parseNumber(row.horas_uso_mes_atual),
    chamados: parseNumber(row.qtd_chamados_suporte),
    falhaPagamento: Number(row.teve_falha_pagamento) === 1,
    churn: Number(row.churn) === 1,
  }));
}

function applyFilters(clients, { plano, churn } = {}) {
  return clients.filter((c) => {
    if (plano && plano !== 'Todos' && c.plano !== plano) return false;
    if (churn === 'Ativo' && c.churn) return false;
    if (churn === 'Cancelado' && !c.churn) return false;
    return true;
  });
}

function avg(arr, key) {
  if (!arr.length) return 0;
  return arr.reduce((sum, item) => sum + item[key], 0) / arr.length;
}

function churnRate(list) {
  if (!list.length) return 0;
  return (list.filter((c) => c.churn).length / list.length) * 100;
}

function buildDashboard(filters = {}) {
  const all = loadClients();
  const clients = applyFilters(all, filters);
  const churned = clients.filter((c) => c.churn);
  const ativos = clients.filter((c) => !c.churn);

  const mrrTotal = clients.reduce((s, c) => s + c.valorMensal, 0);
  const mrrChurn = churned.reduce((s, c) => s + c.valorMensal, 0);

  const semFalha = clients.filter((c) => !c.falhaPagamento);
  const comFalha = clients.filter((c) => c.falhaPagamento);

  const inactivityBuckets = [
    { faixa: '0–5 dias', min: 0, max: 5 },
    { faixa: '6–15 dias', min: 6, max: 15 },
    { faixa: '16–20 dias', min: 16, max: 20 },
    { faixa: '21–30 dias', min: 21, max: 30 },
  ].map(({ faixa, min, max }) => {
    const group = clients.filter(
      (c) => c.diasSemAcessar >= min && c.diasSemAcessar <= max
    );
    return {
      faixa,
      total: group.length,
      churn: group.filter((c) => c.churn).length,
      taxa: Number(churnRate(group).toFixed(1)),
    };
  });

  const supportBuckets = [
    { faixa: '0 chamados', test: (n) => n === 0 },
    { faixa: '1–3 chamados', test: (n) => n >= 1 && n <= 3 },
    { faixa: '4+ chamados', test: (n) => n >= 4 },
  ].map(({ faixa, test }) => {
    const group = clients.filter((c) => test(c.chamados));
    return {
      faixa,
      total: group.length,
      churn: group.filter((c) => c.churn).length,
      taxa: Number(churnRate(group).toFixed(1)),
    };
  });

  const planosOrder = ['Básico', 'Standard', 'Premium'];
  const porPlano = planosOrder.map((plano) => {
    const group = clients.filter((c) => c.plano === plano);
    const groupChurn = group.filter((c) => c.churn);
    return {
      plano,
      total: group.length,
      churn: groupChurn.length,
      taxa: Number(churnRate(group).toFixed(1)),
      receitaPerdida: Number(
        groupChurn.reduce((s, c) => s + c.valorMensal, 0).toFixed(2)
      ),
      mrr: Number(group.reduce((s, c) => s + c.valorMensal, 0).toFixed(2)),
    };
  });

  return {
    meta: {
      totalBase: all.length,
      filtrados: clients.length,
      filtros: {
        plano: filters.plano || 'Todos',
        churn: filters.churn || 'Todos',
      },
    },
    kpis: {
      totalClientes: clients.length,
      clientesChurn: churned.length,
      taxaChurn: Number(churnRate(clients).toFixed(1)),
      mrrTotal: Number(mrrTotal.toFixed(2)),
      mrrChurn: Number(mrrChurn.toFixed(2)),
      pctReceitaPerdida: mrrTotal
        ? Number(((mrrChurn / mrrTotal) * 100).toFixed(1))
        : 0,
    },
    falhaPagamento: {
      semFalha: {
        total: semFalha.length,
        churn: semFalha.filter((c) => c.churn).length,
        taxa: Number(churnRate(semFalha).toFixed(1)),
      },
      comFalha: {
        total: comFalha.length,
        churn: comFalha.filter((c) => c.churn).length,
        taxa: Number(churnRate(comFalha).toFixed(1)),
      },
    },
    inatividade: inactivityBuckets,
    suporte: supportBuckets,
    planos: porPlano,
    comparativoMedias: {
      diasSemAcessar: {
        ativos: Number(avg(ativos, 'diasSemAcessar').toFixed(1)),
        churn: Number(avg(churned, 'diasSemAcessar').toFixed(1)),
      },
      horasAssistidas: {
        ativos: Number(avg(ativos, 'horasUso').toFixed(1)),
        churn: Number(avg(churned, 'horasUso').toFixed(1)),
      },
      tempoContrato: {
        ativos: Number(avg(ativos, 'mesesCliente').toFixed(1)),
        churn: Number(avg(churned, 'mesesCliente').toFixed(1)),
      },
    },
  };
}

export { buildDashboard, loadClients };
