export default function CompareAverages({ data }) {
  const rows = [
    {
      label: 'Média de Dias sem Acessar',
      ativos: `${data.diasSemAcessar.ativos} dias`,
      cancelamento: `${data.diasSemAcessar.churn} dias`,
    },
    {
      label: 'Média de Horas Assistidas',
      ativos: `${data.horasAssistidas.ativos} h`,
      cancelamento: `${data.horasAssistidas.churn} h`,
    },
    {
      label: 'Tempo Médio de Contrato',
      ativos: `${data.tempoContrato.ativos} meses`,
      cancelamento: `${data.tempoContrato.churn} meses`,
    },
  ];

  return (
    <article className="panel">
      <div className="panel-header">
        <div>
          <h3>Comparativo de Médias: Ativos vs. Cancelamento</h3>
          <p>Leitura demográfica e comportamental da base.</p>
        </div>
      </div>

      <div className="compare-list">
        {rows.map((row) => (
          <div className="compare-item" key={row.label}>
            <strong>{row.label}</strong>
            <div className="compare-metrics">
              <div className="metric">
                <span>Ativos</span>
                <b>{row.ativos}</b>
              </div>
              <div className="metric metric-accent">
                <span>Cancelamento</span>
                <b>{row.cancelamento}</b>
              </div>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}
