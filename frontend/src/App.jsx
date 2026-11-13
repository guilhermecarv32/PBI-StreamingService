import { useState } from 'react';
import Filters from './components/Filters';
import KpiCards from './components/KpiCards';
import PaymentFailChart from './components/charts/PaymentFailChart';
import InactivityChart from './components/charts/InactivityChart';
import SupportChart from './components/charts/SupportChart';
import PlanChart from './components/charts/PlanChart';
import CompareAverages from './components/CompareAverages';
import { useDashboard } from './hooks/useDashboard';

export default function App() {
  const [filters, setFilters] = useState({
    plano: 'Todos',
    churn: 'Todos',
  });

  const { data, loading, error } = useDashboard(filters);

  if (loading && !data) {
    return (
      <div className="loading">
        <div className="loading-card">
          <div className="spinner" />
          <h2>Montando o Painel Serviço Assinatura…</h2>
          <p>Carregando indicadores e gatilhos de cancelamento.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error">
        <div className="error-card">
          <h2>Não foi possível carregar o painel</h2>
          <p>{error}</p>
          <p style={{ marginTop: 10 }}>
            Confirme se a API Node está rodando em <strong>:3001</strong>.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <header className="hero">
        <div className="hero-card">
          <span className="hero-deco hero-deco-a" aria-hidden="true" />
          <span className="hero-deco hero-deco-b" aria-hidden="true" />
          <span className="hero-deco hero-deco-c" aria-hidden="true" />
          <span className="eyebrow">SaaS Analytics</span>
          <h1>Painel Serviço Assinatura</h1>
          <div className="hero-meta">
            <span className="chip">
              Base de Dados com {data.meta.totalBase} Clientes
            </span>
            <span className="chip chip-accent">
              Taxa de Cancelamento{' '}
              {data.kpis.taxaChurn.toFixed(1).replace('.', ',')}%
            </span>
          </div>
        </div>

        <Filters filters={filters} onChange={setFilters} meta={data.meta} />
      </header>

      <div className="section-title">
        <h2>Cartões de KPI</h2>
      </div>
      <KpiCards kpis={data.kpis} />

      <div className="section-title">
        <h2>Gatilhos de Cancelamento</h2>
      </div>
      <section className="charts-grid">
        <div className="panel-shell deco-corner">
          <PaymentFailChart data={data.falhaPagamento} />
        </div>
        <div className="panel-shell deco-ribbon">
          <InactivityChart data={data.inatividade} />
        </div>
        <div className="panel-shell deco-cut">
          <SupportChart data={data.suporte} />
        </div>
      </section>

      <div className="section-title">
        <h2>Perfil e Comportamento</h2>
      </div>
      <section className="bottom-grid">
        <div className="panel-shell deco-jag">
          <PlanChart data={data.planos} />
        </div>
        <div className="panel-shell deco-tilt">
          <CompareAverages data={data.comparativoMedias} />
        </div>
      </section>
    </div>
  );
}
