function QuickActionCard({ icon: Icon, label, helper }) {
  return (
    <button
      type="button"
      className="flex w-full items-center gap-4 rounded-[1.35rem] border border-slate-200/80 bg-white p-4 text-left shadow-[0_14px_36px_rgba(15,23,42,0.05)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_42px_rgba(15,23,42,0.08)]"
    >
      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-[0_12px_22px_rgba(15,23,42,0.16)]">
        <Icon className="h-5 w-5" />
      </span>
      <span>
        <span className="block text-sm font-semibold tracking-[-0.01em] text-slate-900">{label}</span>
        <span className="mt-1 block text-xs leading-5 text-slate-500">{helper}</span>
      </span>
    </button>
  )
}

export default QuickActionCard