import { formatCurrency, formatNumber, formatPercent } from '../utils/format';

export default function KpiCards({ kpis }) {
  const cards = [
    {
      label: 'Total de Clientes',
      value: formatNumber(kpis.totalClientes),
      hint: 'Tamanho da amostra no filtro atual',
    },
    {
      label: 'Clientes em Cancelamento',
      value: formatNumber(kpis.clientesChurn),
      hint: 'Volume absoluto de cancelamentos',
      accent: true,
    },
    {
      label: 'Taxa de Cancelamento (%)',
      value: formatPercent(kpis.taxaChurn),
      hint: 'Evidencia o desbalanceamento da base',
    },
    {
      label: 'Receita Mensal (MRR)',
      value: formatCurrency(kpis.mrrTotal),
      hint: 'Faturamento mensal da plataforma',
    },
    {
      label: 'Receita Perdida (MRR Cancelamento)',
      value: formatCurrency(kpis.mrrChurn),
      hint: `${formatPercent(kpis.pctReceitaPerdida)} da receita mensal`,
      accent: true,
    },
  ];

  const shapes = ['shape-slash', 'shape-blade', 'shape-wedge', 'shape-stripe', 'shape-burst'];

  return (
    <section className="kpi-grid">
      {cards.map((card, index) => (
        <article
          key={card.label}
          className={`kpi-card ${shapes[index]}${card.accent ? ' accent' : ''}`}
        >
          <div className="kpi-label">
            <span>{card.label}</span>
          </div>
          <div className="kpi-value">{card.value}</div>
          <div className="kpi-hint">{card.hint}</div>
        </article>
      ))}
    </section>
  );
}
