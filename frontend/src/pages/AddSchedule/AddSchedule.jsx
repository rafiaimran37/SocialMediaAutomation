import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CalendarDays, Check, Clock3, Send, Sparkles } from 'lucide-react'
import { addScheduleData } from './addScheduleData'
import PlatformSelector from './components/PlatformSelector'
import ToggleSwitch from './components/ToggleSwitch'
import PreviewPanel from './components/PreviewPanel'

function AddSchedule() {
  const navigate = useNavigate()
  const [formState, setFormState] = useState({
    topic: '',
    caption: '',
    platform: 'facebook',
    scheduleDate: '',
    scheduleTime: '',
    approvalRequired: true,
  })

  const selectedPlatform = useMemo(
    () => addScheduleData.platformOptions.find((platform) => platform.id === formState.platform),
    [formState.platform],
  )

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target
    setFormState((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    navigate('/schedule-posts')
  }

  return (
    <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-6 text-slate-900">
      <section className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div className="max-w-3xl">
          <h1 className="text-3xl font-semibold tracking-[-0.05em] text-slate-900 sm:text-4xl lg:text-[3rem]">
            Add / Edit Schedule
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-500 sm:text-[1.05rem]">
            Plan content across multiple platforms with AI-powered optimization and a review flow ready for future API integration.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => navigate('/schedule-posts')}
            className="inline-flex h-14 items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <Clock3 className="h-4 w-4" />
            Back to Queue
          </button>
          <button
            type="submit"
            form="schedule-form"
            className="inline-flex h-14 items-center gap-3 rounded-2xl border border-blue-700 bg-blue-700 px-5 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(37,99,235,0.28)] transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <Send className="h-4 w-4" />
            Save Schedule
          </button>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.25fr)_minmax(360px,0.75fr)]">
        <form id="schedule-form" onSubmit={handleSubmit} className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm">
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">New Scheduled Post</h2>
              <p className="mt-1 text-sm text-slate-500">Plan your content across multiple platforms with AI-powered optimization.</p>
            </div>

            <Field label="Topic">
              <input
                name="topic"
                value={formState.topic}
                onChange={handleChange}
                placeholder="e.g., Product Launch Announcement"
                className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
              />
            </Field>

            <Field
              label="Caption"
              action={
                <button type="button" className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 transition hover:bg-blue-100">
                  <Sparkles className="h-3.5 w-3.5" />
                  Generate with AI
                </button>
              }
            >
              <textarea
                name="caption"
                value={formState.caption}
                onChange={handleChange}
                rows={5}
                placeholder="Write your post content here..."
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
              />
            </Field>

            <section>
              <div className="mb-3 flex items-center gap-3">
                <h3 className="text-sm font-semibold text-slate-900">Platform Selection</h3>
              </div>
              <PlatformSelector
                platforms={addScheduleData.platformOptions}
                selectedPlatform={formState.platform}
                onSelect={(platform) => setFormState((current) => ({ ...current, platform }))}
              />
            </section>

            <section>
              <h3 className="mb-3 text-sm font-semibold text-slate-900">Upload Media</h3>
              <label className="flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 px-6 py-8 text-center transition hover:border-blue-300 hover:bg-blue-50/60">
                <input type="file" className="sr-only" />
                <span className="grid h-14 w-14 place-items-center rounded-full bg-blue-100 text-blue-700">
                  <CalendarDays className="h-6 w-6" />
                </span>
                <span className="mt-4 text-sm font-medium text-slate-700">Click to upload or drag and drop</span>
                <span className="mt-1 text-xs text-slate-500">PNG, JPG, MP4 or GIF (max. 50MB)</span>
              </label>
            </section>

            <section className="grid gap-4 md:grid-cols-2">
              <Field label="Schedule Date">
                <input
                  type="date"
                  name="scheduleDate"
                  value={formState.scheduleDate}
                  onChange={handleChange}
                  className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                />
              </Field>
              <Field label="Schedule Time">
                <input
                  type="time"
                  name="scheduleTime"
                  value={formState.scheduleTime}
                  onChange={handleChange}
                  className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                />
              </Field>
            </section>

            <ToggleSwitch
              checked={formState.approvalRequired}
              onChange={(approvalRequired) => setFormState((current) => ({ ...current, approvalRequired }))}
              label="Approval Required"
            />

            <div className="flex flex-wrap items-center justify-end gap-3 border-t border-slate-200 pt-6">
              <button type="button" className="rounded-2xl px-5 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-100">
                Cancel
              </button>
              <button type="button" className="rounded-2xl border border-blue-200 bg-white px-5 py-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-50">
                Save Draft
              </button>
              <button type="submit" className="rounded-2xl bg-blue-700 px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(37,99,235,0.28)] transition hover:brightness-105">
                Schedule Post
              </button>
            </div>
          </div>
        </form>

        <aside className="grid gap-6">
          <PreviewPanel previewPost={addScheduleData.previewPost} metrics={addScheduleData.previewMetrics} />

          <section className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm">
            <h2 className="text-base font-semibold text-slate-900">Quick Summary</h2>
            <div className="mt-4 grid gap-3">
              <SummaryRow label="Platform" value={selectedPlatform?.label ?? 'Facebook'} />
              <SummaryRow label="Approval" value={formState.approvalRequired ? 'Required' : 'Optional'} />
              <SummaryRow label="Attachments" value="Ready to upload" />
            </div>
          </section>
        </aside>
      </section>
    </div>
  )
}

function Field({ label, action, children }) {
  return (
    <label className="grid gap-2">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-semibold text-slate-900">{label}</span>
        {action}
      </div>
      {children}
    </label>
  )
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-sm">
      <span className="font-medium text-slate-500">{label}</span>
      <span className="font-semibold text-slate-900">{value}</span>
    </div>
  )
}

export default AddSchedule