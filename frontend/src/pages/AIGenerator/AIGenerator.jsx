import { useState } from 'react'
import {
  ArrowRight,
  Check,
  ChevronDown,
  MessageSquareText,
  RefreshCcw,
  Sparkles,
  WandSparkles,
} from 'lucide-react'

const platformOptions = [
  { id: 'linkedin', label: 'LinkedIn', shortLabel: 'LinkedIn' },
  { id: 'instagram', label: 'Instagram', shortLabel: 'Instagram' },
  { id: 'twitter', label: 'Twitter / X', shortLabel: 'Twitter / X' },
  { id: 'facebook', label: 'Facebook', shortLabel: 'Facebook' },
]

const toneOptions = ['Professional', 'Friendly', 'Bold', 'Insightful']

const initialKeywords = ['Security', 'Cloud']

function AIGenerator() {
  const [selectedPlatform, setSelectedPlatform] = useState('linkedin')
  const [tone, setTone] = useState('Professional')
  const [topic, setTopic] = useState('')
  const [targetAudience, setTargetAudience] = useState('')
  const [keywords, setKeywords] = useState(initialKeywords)
  const [keywordInput, setKeywordInput] = useState('')

  const addKeyword = (event) => {
    if (event.key !== 'Enter') {
      return
    }

    event.preventDefault()

    const value = keywordInput.trim()
    if (!value || keywords.includes(value)) {
      return
    }

    setKeywords((current) => [...current, value])
    setKeywordInput('')
  }

  const removeKeyword = (keywordToRemove) => {
    setKeywords((current) => current.filter((keyword) => keyword !== keywordToRemove))
  }

  return (
    <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-6 text-slate-900">
      <section className="flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-semibold tracking-[-0.05em] text-slate-900 sm:text-4xl">
              AI Post Architect
            </h1>
            <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 ring-1 ring-blue-100">
              <Sparkles className="h-3.5 w-3.5" />
              GPT-4o Powered
            </span>
          </div>
          <p className="mt-2 text-sm text-slate-500 sm:text-[0.95rem]">
            Build optimized social posts and preview the result before publishing.
          </p>
        </div>

        <div className="hidden items-center gap-3 sm:flex">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
          >
            <RefreshCcw className="h-4 w-4" />
            Reset
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
          >
            <WandSparkles className="h-4 w-4" />
            Templates
          </button>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
        <article className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">AI Generator</h2>
              <p className="mt-1 text-sm text-slate-500">Create a high quality post brief for the selected platform.</p>
            </div>

            <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 ring-1 ring-blue-100">
              <Check className="h-3.5 w-3.5" />
              AI Ready
            </span>
          </div>

          <div className="space-y-5">
            <label className="grid gap-2">
              <span className="text-sm font-medium text-slate-700">Core Topic or Announcement</span>
              <textarea
                value={topic}
                onChange={(event) => setTopic(event.target.value)}
                rows={5}
                placeholder="e.g. Launching our new enterprise-grade security features for distributed teams."
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </label>

            <section>
              <div className="mb-3 flex items-center justify-between gap-3">
                <span className="text-sm font-medium text-slate-700">Select Platform</span>
                <span className="text-xs text-slate-400">Choose one or more</span>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {platformOptions.map((platform) => {
                  const isActive = selectedPlatform === platform.id

                  return (
                    <button
                      key={platform.id}
                      type="button"
                      onClick={() => setSelectedPlatform(platform.id)}
                      className={`flex flex-col items-center justify-center gap-2 rounded-2xl border px-3 py-4 text-center transition hover:-translate-y-0.5 hover:shadow-md ${
                        isActive ? 'border-blue-600 bg-blue-50 shadow-sm' : 'border-slate-200 bg-white'
                      }`}
                    >
                      <span className={`grid h-10 w-10 place-items-center rounded-xl ${isActive ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                        <MessageSquareText className="h-4 w-4" />
                      </span>
                      <span className="text-xs font-medium text-slate-700">{platform.shortLabel}</span>
                    </button>
                  )
                })}
              </div>
            </section>

            <section className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-sm font-medium text-slate-700">Tone of Voice</span>
                <div className="relative">
                  <select
                    value={tone}
                    onChange={(event) => setTone(event.target.value)}
                    className="h-12 w-full appearance-none rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                  >
                    {toneOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                </div>
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-medium text-slate-700">Target Audience</span>
                <input
                  value={targetAudience}
                  onChange={(event) => setTargetAudience(event.target.value)}
                  placeholder="e.g. CTOs, Security"
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                />
              </label>
            </section>

            <section className="grid gap-2">
              <span className="text-sm font-medium text-slate-700">Keywords (Optional)</span>
              <div className="flex min-h-12 flex-wrap items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-100">
                {keywords.map((keyword) => (
                  <button
                    key={keyword}
                    type="button"
                    onClick={() => removeKeyword(keyword)}
                    className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 transition hover:bg-blue-100"
                  >
                    {keyword}
                    <span className="text-blue-500">×</span>
                  </button>
                ))}
                <input
                  value={keywordInput}
                  onChange={(event) => setKeywordInput(event.target.value)}
                  onKeyDown={addKeyword}
                  placeholder="Add tag..."
                  className="min-w-32 flex-1 border-0 bg-transparent px-1 py-1 text-sm text-slate-700 outline-none placeholder:text-slate-400"
                />
              </div>
            </section>

            <button
              type="button"
              className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-blue-700 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(37,99,235,0.28)] transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <Sparkles className="h-4 w-4" />
              Generate Content
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </article>

        <article className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Preview &amp; Edit</h2>
              <p className="mt-1 text-sm text-slate-500">Review the generated post before sending it to the queue.</p>
            </div>

            <div className="flex items-center gap-2 text-slate-400">
              <button type="button" className="rounded-full p-2 transition hover:bg-slate-100 hover:text-slate-700">
                <RefreshCcw className="h-4 w-4" />
              </button>
              <button type="button" className="rounded-full p-2 transition hover:bg-slate-100 hover:text-slate-700">
                <WandSparkles className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="flex min-h-[640px] flex-col items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 px-6 py-12 text-center">
            <div className="grid h-20 w-20 place-items-center rounded-full bg-blue-100 text-blue-700 shadow-sm">
              <Sparkles className="h-8 w-8" />
            </div>
            <h3 className="mt-6 text-xl font-semibold text-slate-900">Ready to create?</h3>
            <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
              Fill out the details on the left and let Lumina&apos;s AI engine craft your perfect social media post.
            </p>
          </div>
        </article>
      </section>
    </div>
  )
}

export default AIGenerator