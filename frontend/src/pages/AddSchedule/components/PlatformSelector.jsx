function PlatformSelector({ platforms, selectedPlatform, onSelect }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {platforms.map((platform) => {
        const isSelected = selectedPlatform === platform.id

        return (
          <button
            key={platform.id}
            type="button"
            onClick={() => onSelect(platform.id)}
            className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-left transition hover:-translate-y-0.5 hover:shadow-md ${
              isSelected ? 'border-blue-700 bg-blue-50 shadow-sm' : 'border-slate-200 bg-slate-50'
            }`}
          >
            <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${platform.accent}`}>
              <platform.icon className="h-5 w-5" />
            </span>
            <span className="text-sm font-medium text-slate-700">{platform.label}</span>
          </button>
        )
      })}
    </div>
  )
}

export default PlatformSelector