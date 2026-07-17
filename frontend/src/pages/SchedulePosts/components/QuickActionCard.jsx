function QuickActionCard({ icon: Icon, label, helper }) {
  return (
    <button
      type="button"
      className="flex w-full items-center gap-4 rounded-2xl border border-slate-200/70 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-slate-900 text-white">
        <Icon className="h-5 w-5" />
      </span>
      <span>
        <span className="block text-sm font-semibold text-slate-900">{label}</span>
        <span className="mt-1 block text-xs leading-5 text-slate-500">{helper}</span>
      </span>
    </button>
  )
}

export default QuickActionCard