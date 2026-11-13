import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { formatPercent } from '../../utils/format';
import { cursorFill, tooltipStyle } from './chartTheme';

const COLORS = {
  total: '#fd550a',
  cancelamento: '#015d47',
};

const LABELS = {
  total: 'Clientes',
  cancelamento: 'Cancelamento',
};

export default function PaymentFailChart({ data }) {
  const chartData = [
    {
      grupo: 'Sem falha',
      total: data.semFalha.total,
      cancelamento: data.semFalha.churn,
      taxa: data.semFalha.taxa,
    },
    {
      grupo: 'Com falha',
      total: data.comFalha.total,
      cancelamento: data.comFalha.churn,
      taxa: data.comFalha.taxa,
    },
  ];

  return (
    <article className="panel">
      <div className="panel-header">
        <div>
          <h3>Impacto da Falha de Pagamento</h3>
          <p>
            Sem falha: {formatPercent(data.semFalha.taxa)} · Com falha:{' '}
            {formatPercent(data.comFalha.taxa)}
          </p>
        </div>
      </div>
      <div className="chart-wrap">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={chartData} barGap={6} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(1,93,71,0.12)" />
            <XAxis dataKey="grupo" tick={{ fill: '#015d47', fontSize: 12 }} />
            <YAxis tick={{ fill: '#015d47', fontSize: 12 }} />
            <Tooltip
              cursor={{ fill: cursorFill }}
              contentStyle={tooltipStyle}
              formatter={(value, _name, item) => [
                value,
                LABELS[item.dataKey] || _name,
              ]}
              labelFormatter={(label, payload) => {
                const taxa = payload?.[0]?.payload?.taxa;
                return `${label} · taxa ${formatPercent(taxa || 0)}`;
              }}
            />
            <Legend />
            <Bar
              dataKey="total"
              name="Clientes"
              fill={COLORS.total}
              radius={[10, 10, 0, 0]}
              cursor="pointer"
            />
            <Bar
              dataKey="cancelamento"
              name="Cancelamento"
              fill={COLORS.cancelamento}
              radius={[10, 10, 0, 0]}
              cursor="pointer"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </article>
  );
}
