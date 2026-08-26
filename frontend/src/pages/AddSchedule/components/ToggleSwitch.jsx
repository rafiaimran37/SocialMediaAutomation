function ToggleSwitch({ checked, onChange, label }) {
  return (
    <button
      type="button"
      aria-pressed={checked}
      onClick={() => onChange(!checked)}
      className={`flex w-full items-center justify-between gap-4 rounded-[1.35rem] border px-4 py-4 text-left transition duration-200 ${
        checked ? 'border-blue-200 bg-gradient-to-br from-blue-50 to-white shadow-[0_12px_28px_rgba(37,99,235,0.10)]' : 'border-slate-200 bg-white'
      }`}
    >
      <span>
        <span className="block text-sm font-semibold tracking-[-0.01em] text-slate-800">{label}</span>
        <span className="mt-1 block text-xs leading-5 text-slate-500">Notify manager for content review before publishing</span>
      </span>
      <span
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
          checked ? 'bg-blue-600' : 'bg-slate-300'
        }`}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition ${
            checked ? 'translate-x-5' : 'translate-x-1'
          }`}
        />
      </span>
    </button>
  )
}

export default ToggleSwitch