import { MoreHorizontal } from 'lucide-react'

function ActionMenu() {
  return (
    <button
      type="button"
      aria-label="Open row actions"
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-700 hover:shadow-md"
    >
      <MoreHorizontal className="h-4 w-4" />
    </button>
  )
}

export default ActionMenu