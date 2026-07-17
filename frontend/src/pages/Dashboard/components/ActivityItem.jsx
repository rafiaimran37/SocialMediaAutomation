function ActivityItem({ title, description, time, tone }) {
  return (
    <li className="flex gap-3">
      <span className={`mt-1 h-3 w-3 shrink-0 rounded-full ${tone}`} />
      <div className="min-w-0">
        <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
        <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>
        <p className="mt-2 text-xs text-slate-400">{time}</p>
      </div>
    </li>
  )
}

export default ActivityItem