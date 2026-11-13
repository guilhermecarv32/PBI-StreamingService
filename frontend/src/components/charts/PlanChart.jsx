import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { formatCurrency, formatNumber, formatPercent } from '../../utils/format';
import { cursorFill, tooltipStyle } from './chartTheme';

export default function PlanChart({ data }) {
  return (
    <article className="panel">
      <div className="panel-header">
        <div>
          <h3>Distribuição e Cancelamento por Plano</h3>
          <p>Básico concentra o maior volume de perda financeira.</p>
        </div>
      </div>
      <div className="chart-wrap">
        <ResponsiveContainer width="100%" height={260}>
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(1,93,71,0.12)" />
            <XAxis dataKey="plano" tick={{ fill: '#015d47', fontSize: 12 }} />
            <YAxis yAxisId="left" tick={{ fill: '#015d47', fontSize: 12 }} />
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fill: '#015d47', fontSize: 12 }}
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip
              cursor={{ fill: cursorFill }}
              contentStyle={tooltipStyle}
              formatter={(value, _name, item) => {
                if (item.dataKey === 'taxa') {
                  return [formatPercent(value), 'Taxa de cancelamento'];
                }
                if (item.dataKey === 'receitaPerdida') {
                  return [formatCurrency(value), 'Receita perdida'];
                }
                return [formatNumber(value), 'Clientes'];
              }}
            />
            <Legend />
            <Bar
              yAxisId="left"
              dataKey="total"
              name="Clientes"
              fill="#fd550a"
              radius={[10, 10, 0, 0]}
              cursor="pointer"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="taxa"
              name="Taxa de cancelamento"
              stroke="#015d47"
              strokeWidth={3}
              activeDot={{ r: 7, fill: '#e0f354', stroke: '#06261e', strokeWidth: 2 }}
              dot={{ r: 5, fill: '#e0f354', stroke: '#06261e', strokeWidth: 2 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <table className="plan-table">
        <thead>
          <tr>
            <th>Plano</th>
            <th>Clientes</th>
            <th>Cancelamento</th>
            <th>Perda</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.plano}>
              <td>{row.plano}</td>
              <td>{formatNumber(row.total)}</td>
              <td>
                <span className={`badge${row.taxa > 25 ? ' warn' : ''}`}>
                  {formatPercent(row.taxa)}
                </span>
              </td>
              <td>{formatCurrency(row.receitaPerdida)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </article>
  );
}
