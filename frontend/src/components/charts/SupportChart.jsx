import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { formatPercent } from '../../utils/format';
import { cursorFill, tooltipStyle } from './chartTheme';

export default function SupportChart({ data }) {
  return (
    <article className="panel">
      <div className="panel-header">
        <div>
          <h3>Cancelamento por Chamados no Suporte</h3>
          <p>4+ chamados sinalizam atrito e insatisfação.</p>
        </div>
      </div>
      <div className="chart-wrap">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={data} layout="vertical" margin={{ left: 16 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(1,93,71,0.12)" />
            <XAxis
              type="number"
              tick={{ fill: '#015d47', fontSize: 12 }}
              tickFormatter={(v) => `${v}%`}
            />
            <YAxis
              type="category"
              dataKey="faixa"
              width={96}
              tick={{ fill: '#015d47', fontSize: 12 }}
            />
            <Tooltip
              cursor={{ fill: cursorFill }}
              contentStyle={tooltipStyle}
              formatter={(value, _name, props) => [
                formatPercent(value),
                `Taxa · ${props.payload.churn}/${props.payload.total} clientes`,
              ]}
            />
            <Bar
              dataKey="taxa"
              name="Taxa de cancelamento"
              fill="#fd550a"
              radius={[0, 10, 10, 0]}
              background={{ fill: 'rgba(224,243,84,0.28)', radius: 10 }}
              cursor="pointer"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </article>
  );
}
