function PlatformSelector({
  platforms,
  selectedPlatforms,
  onSelect
}) {

  const togglePlatform = (platformId) => {

    if (selectedPlatforms.includes(platformId)) {

      onSelect(
        selectedPlatforms.filter(
          (id) => id !== platformId
        )
      )

    } else {

      onSelect([
        ...selectedPlatforms,
        platformId
      ])

    }

  }

  return (

    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">

      {platforms.map((platform) => {

        const isSelected =
          selectedPlatforms.includes(platform.id)

        return (

          <button
            key={platform.id}
            type="button"
            onClick={() => togglePlatform(platform.id)}
            className={`flex items-center gap-3 rounded-[1.35rem] border px-4 py-3 text-left transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_34px_rgba(15,23,42,0.08)] ${
              isSelected
                ? "border-blue-700 bg-gradient-to-br from-blue-50 to-white shadow-[0_12px_28px_rgba(37,99,235,0.12)]"
                : "border-slate-200 bg-white"
            }`}
          >

            <input
              type="checkbox"
              checked={isSelected}
              readOnly
            />

            <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl shadow-sm ${platform.accent}`}>
              <platform.icon className="h-5 w-5" />
            </span>

            <span className="text-sm font-semibold tracking-[-0.01em] text-slate-700">
              {platform.label}
            </span>

          </button>

        )

      })}

    </div>

  )

}

export default PlatformSelector