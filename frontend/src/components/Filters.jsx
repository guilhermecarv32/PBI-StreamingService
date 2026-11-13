export default function Filters({ filters, onChange, meta }) {
  const planos = ['Todos', 'Básico', 'Standard', 'Premium'];
  const statuses = ['Todos', 'Ativo', 'Cancelado'];

  return (
    <aside className="filter-panel">
      <div>
        <h2>Filtragem Dinâmica</h2>
        <p>Escolha plano e status para explorar a base ao vivo.</p>
      </div>

      <div className="filter-group">
        <label>Plano de assinatura</label>
        <div className="segmented">
          {planos.map((plano) => (
            <button
              key={plano}
              type="button"
              className={filters.plano === plano ? 'active' : ''}
              onClick={() => onChange({ ...filters, plano })}
            >
              {plano}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-group">
        <label>Status de cancelamento</label>
        <div className="segmented">
          {statuses.map((churn) => (
            <button
              key={churn}
              type="button"
              className={filters.churn === churn ? 'active' : ''}
              onClick={() => onChange({ ...filters, churn })}
            >
              {churn}
            </button>
          ))}
        </div>
      </div>

      {meta && (
        <div className="chip">
          {meta.filtrados} de {meta.totalBase} clientes no recorte
        </div>
      )}
    </aside>
  );
}
