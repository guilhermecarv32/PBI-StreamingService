import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { formatPercent } from '../../utils/format';
import { cursorFill, tooltipStyle } from './chartTheme';

const COLORS = ['#fd550a', '#ff7a3d', '#015d47', '#e0f354'];

export default function InactivityChart({ data }) {
  return (
    <article className="panel">
      <div className="panel-header">
        <div>
          <h3>Cancelamento por Faixa de Inatividade</h3>
          <p>Salto brusco após ~3 semanas sem acesso (21–30 dias).</p>
        </div>
      </div>
      <div className="chart-wrap">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(1,93,71,0.12)" />
            <XAxis dataKey="faixa" tick={{ fill: '#015d47', fontSize: 11 }} />
            <YAxis
              tick={{ fill: '#015d47', fontSize: 12 }}
              tickFormatter={(v) => `${v}%`}
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
              radius={[10, 10, 0, 0]}
              cursor="pointer"
            >
              {data.map((_, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                  stroke={index === 3 ? '#06261e' : 'transparent'}
                  strokeWidth={index === 3 ? 2 : 0}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </article>
  );
}
