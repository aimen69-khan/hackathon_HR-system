import { Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { COLORS } from './palette.js';

const tick = { fill: 'var(--muted)', fontSize: 12 };
const tip = { contentStyle: { background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 8, color: 'var(--ink)' }, cursor: { fill: 'var(--surface-2)' } };

export function BarC({ data, keys = ['value'], x = 'name', stacked = false, format }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ left: -10, right: 8, top: 8 }}>
        <CartesianGrid stroke="var(--line)" vertical={false} />
        <XAxis dataKey={x} tick={tick} tickLine={false} axisLine={false} interval={0} angle={data.length > 5 ? -25 : 0} textAnchor={data.length > 5 ? 'end' : 'middle'} height={data.length > 5 ? 56 : 30} />
        <YAxis tick={tick} tickLine={false} axisLine={false} tickFormatter={format} width={48} />
        <Tooltip {...tip} formatter={format} />
        {keys.length > 1 && <Legend />}
        {keys.map((k, i) => <Bar key={k} dataKey={k} stackId={stacked ? 's' : undefined} fill={COLORS[i]} radius={stacked ? 0 : [5, 5, 0, 0]} />)}
      </BarChart>
    </ResponsiveContainer>
  );
}
export function LineC({ data, keys = ['value'], x = 'name', unit = '' }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ left: -10, right: 12, top: 8 }}>
        <CartesianGrid stroke="var(--line)" vertical={false} />
        <XAxis dataKey={x} tick={tick} tickLine={false} axisLine={false} minTickGap={16} />
        <YAxis tick={tick} tickLine={false} axisLine={false} domain={['dataMin - 3', 'dataMax + 2']} unit={unit} width={48} />
        <Tooltip {...tip} />
        {keys.map((k, i) => <Line key={k} type="monotone" dataKey={k} stroke={COLORS[i]} strokeWidth={2.5} dot={false} />)}
      </LineChart>
    </ResponsiveContainer>
  );
}
export function PieC({ data }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" innerRadius="52%" outerRadius="80%" paddingAngle={2} stroke="none">
          {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
        </Pie>
        <Tooltip {...tip} /><Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
export default function ChartCard({ title, subtitle, children, height = 260, actions }) {
  return (
    <section className="card">
      <header className="card-head"><div><h3>{title}</h3>{subtitle && <p className="muted">{subtitle}</p>}</div>{actions}</header>
      <div className="chart" style={{ height }}>{children}</div>
    </section>
  );
}
