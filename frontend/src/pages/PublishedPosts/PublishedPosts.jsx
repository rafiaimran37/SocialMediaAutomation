import { useState } from 'react'
import { CalendarDays, Eye, Filter, Heart, LineChart, MessageSquareText, MoreHorizontal, Repeat2, Search, Share2, Sparkles } from 'lucide-react'
import { publishedPostsData } from './publishedPostsData'

function PublishedPosts() {
  const [dateRange, setDateRange] = useState('Last 30 Days')
  const [platform, setPlatform] = useState('All Platforms')

  return (
    <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-6 text-slate-900">
      <section className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div className="max-w-4xl">
          <h1 className="text-3xl font-semibold tracking-[-0.05em] text-slate-900 sm:text-4xl lg:text-[3rem]">
            Published Posts
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600 sm:text-[1.05rem]">
            Analyze the performance of your AI-generated content across all connected channels.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <FilterSelect label="Date Range" value={dateRange} onChange={setDateRange} options={publishedPostsData.filters.dateRange} />
          <FilterSelect label="Platform" value={platform} onChange={setPlatform} options={publishedPostsData.filters.platform} />
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {publishedPostsData.summaryCards.map((card) => (
          <SummaryCard key={card.id} {...card} />
        ))}
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {publishedPostsData.posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}

        <CreateMoreCard />
      </section>

      <section className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Performance Overview</h2>
            <p className="mt-1 text-sm text-slate-500">Reusable table data is ready for API-backed analytics later.</p>
          </div>
          <button type="button" className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50">
            <Filter className="h-4 w-4" />
            Filter Metrics
          </button>
        </div>

        <div className="mt-5 overflow-x-auto">
          <table className="min-w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-[0.72rem] uppercase tracking-[0.08em] text-slate-400">
                <th className="px-5 py-3 font-medium">Post</th>
                <th className="px-5 py-3 font-medium">Channel</th>
                <th className="px-5 py-3 font-medium">Published</th>
                <th className="px-5 py-3 font-medium">Likes</th>
                <th className="px-5 py-3 font-medium">Comments</th>
                <th className="px-5 py-3 font-medium">Shares</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {publishedPostsData.tableRows.map((row) => (
                <tr key={row.id} className="border-b border-slate-100 last:border-0 transition hover:bg-slate-50/70">
                  <td className="px-5 py-4 text-sm font-medium text-slate-900">{row.title}</td>
                  <td className="px-5 py-4">
                    <span className={`rounded-full px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.08em] ${row.channelTone}`}>
                      {row.channel}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-600">{row.publishedAt}</td>
                  <td className="px-5 py-4 text-sm text-slate-600">{row.likes}</td>
                  <td className="px-5 py-4 text-sm text-slate-600">{row.comments}</td>
                  <td className="px-5 py-4 text-sm text-slate-600">{row.shares}</td>
                  <td className="px-5 py-4 text-right">
                    <button
                      type="button"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-700"
                      aria-label="Open post actions"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

function FilterSelect({ label, value, onChange, options }) {
  return (
    <label className="grid gap-2">
      <span className="text-xs font-medium text-slate-500">{label}</span>
      <div className="relative">
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-12 w-full appearance-none rounded-2xl border border-slate-200 bg-white px-4 pr-10 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <CalendarDays className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      </div>
    </label>
  )
}

function SummaryCard({ icon: Icon, label, value, toneClassName }) {
  return (
    <article className="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start gap-4">
        <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl ${toneClassName}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-1 text-[2rem] font-semibold tracking-[-0.06em] text-slate-900">{value}</p>
        </div>
      </div>
    </article>
  )
}

function PostCard({ post }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative">
        <div className={`h-56 ${post.heroClassName}`} />
        <span className="absolute right-3 bottom-3 rounded-full bg-blue-700 px-3 py-1 text-[0.68rem] font-semibold text-white shadow-lg shadow-blue-700/20">
          {post.publishedLabel}
        </span>
        {post.badge ? (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[0.66rem] font-semibold text-slate-600 shadow-sm backdrop-blur">
            {post.badge}
          </span>
        ) : null}
      </div>

      <div className="space-y-4 p-4">
        <p className="line-clamp-3 text-sm leading-6 text-slate-600">{post.excerpt}</p>

        <div className="flex items-center justify-between gap-4 border-t border-slate-100 pt-4 text-xs text-slate-500">
          <Metric icon={Heart} value={post.likes} label="LIKES" />
          <Metric icon={MessageSquareText} value={post.comments} label="COMMENTS" />
          <Metric icon={Share2} value={post.shares} label="SHARES" />
        </div>

        <div className="flex gap-2 border-t border-slate-100 pt-4">
          <button type="button" className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50">
            <Eye className="h-4 w-4" />
            View
          </button>
          <button type="button" className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50">
            <LineChart className="h-4 w-4" />
            Analytics
          </button>
          <button type="button" className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-100">
            <Repeat2 className="h-4 w-4" />
            Re-post
          </button>
        </div>
      </div>
    </article>
  )
}

function CreateMoreCard() {
  return (
    <button
      type="button"
      className="flex min-h-[420px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-white px-6 py-8 text-center text-slate-500 transition hover:border-blue-300 hover:bg-blue-50/40"
    >
      <span className="grid h-16 w-16 place-items-center rounded-full bg-blue-100 text-blue-700">
        <Sparkles className="h-8 w-8" />
      </span>
      <span className="mt-5 text-2xl font-semibold text-slate-800">Publish More Content</span>
      <span className="mt-2 max-w-xs text-sm leading-6 text-slate-400">
        Add more content to your published archive and compare engagement trends.
      </span>
    </button>
  )
}

function Metric({ icon: Icon, value, label }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="flex items-center gap-1 text-blue-700">
        <Icon className="h-4 w-4" />
        <span className="text-sm font-semibold">{value}</span>
      </div>
      <span className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-slate-400">{label}</span>
    </div>
  )
}

export default PublishedPosts