import StatusBadge from './StatusBadge'
import ActionMenu from './ActionMenu'

function SchedulePostsTable({ rows }) {
  return (
    <section className="overflow-hidden rounded-[1.5rem] border border-slate-200/80 bg-white shadow-[0_14px_36px_rgba(15,23,42,0.05)]">
      <div className="flex items-center justify-between gap-4 border-b border-slate-100/90 px-5 py-4">
        <div>
          <h2 className="text-base font-semibold tracking-[-0.02em] text-slate-900">Scheduled Queue</h2>
          <p className="mt-1 text-sm leading-6 text-slate-500">API-ready list of scheduled content items</p>
        </div>
        <button type="button" className="text-sm font-semibold text-blue-700 transition hover:text-blue-800">
          Export
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-100 bg-gradient-to-b from-slate-50 to-white text-[0.72rem] uppercase tracking-[0.12em] text-slate-400">
              <th className="px-5 py-3.5 font-semibold">Date &amp; Time</th>
              <th className="px-5 py-3.5 font-semibold">Platform</th>
              <th className="px-5 py-3.5 font-semibold">Content Preview</th>
              <th className="px-5 py-3.5 font-semibold">Status</th>
              <th className="px-5 py-3.5 font-semibold">Owner</th>
              <th className="px-5 py-3.5 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-slate-100/90 last:border-0 transition hover:bg-slate-50/70">
                <td className="px-5 py-4 text-sm font-medium text-slate-700">{row.dateTime}</td>
                <td className="px-5 py-4">
                  <span className={`rounded-full px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.12em] ${row.platformAccent}`}>
                    {row.platform}
                  </span>
                </td>
                <td className="px-5 py-4 text-sm leading-6 text-slate-600">{row.contentPreview}</td>
                <td className="px-5 py-4">
                  <StatusBadge status={row.status} className={row.statusAccent} />
                </td>
                <td className="px-5 py-4 text-sm text-slate-600">{row.assignedTo}</td>
                <td className="px-5 py-4 text-right">
                  <ActionMenu />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default SchedulePostsTable