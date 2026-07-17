import { useState } from 'react'
import {
  CheckCircle2,
  CircleAlert,
  Database,
  Eye,
  KeyRound,
  Link2,
  RefreshCw,
  ShieldCheck,
  Smartphone,
  Sparkles,
  TestTube2,
  Unlink2,
  Wifi,
} from 'lucide-react'
import { connectorsData } from './connectorsData'

function SocialConnectors() {
  const [connectors, setConnectors] = useState(connectorsData.connectors)

  const updateField = (connectorId, fieldName, value) => {
    setConnectors((current) =>
      current.map((connector) =>
        connector.id === connectorId
          ? {
              ...connector,
              config: {
                ...connector.config,
                [fieldName]: value,
              },
            }
          : connector,
      ),
    )
  }

  return (
    <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-6 text-slate-900">
      <section className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-[-0.05em] text-slate-900 sm:text-4xl lg:text-[3rem]">
            Social Connectors
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600 sm:text-[1.05rem]">
            Manage and sync your cross-platform social media connections with an API-ready configuration structure.
          </p>
        </div>

        <button
          type="button"
          className="inline-flex h-14 items-center gap-3 rounded-2xl border border-blue-700 bg-blue-700 px-5 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(37,99,235,0.28)] transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <Link2 className="h-4 w-4" />
          Connect New Account
        </button>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        {connectorsData.summaryCards.map((card) => (
          <SummaryCard key={card.id} {...card} />
        ))}
      </section>

      <section className="grid gap-4">
        {connectors.map((connector) => (
          <ConnectorCard
            key={connector.id}
            connector={connector}
            onFieldChange={updateField}
          />
        ))}
      </section>

      <section className="rounded-2xl border border-slate-200/70 bg-white px-5 py-4 text-sm text-slate-500 shadow-sm">
        <span className="font-medium text-slate-700">Security Guarantee:</span>{' '}
        We use OAuth 2.0 to ensure your credentials never leave the platform.
        <button type="button" className="ml-1 font-semibold text-blue-700 hover:text-blue-800">
          View Security Policy
        </button>
      </section>
    </div>
  )
}

function SummaryCard({ icon: Icon, label, value, accentClassName }) {
  return (
    <article className="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-center gap-4">
        <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl ${accentClassName}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-slate-400">{label}</p>
          <p className="mt-1 text-base font-semibold text-slate-900">{value}</p>
        </div>
      </div>
    </article>
  )
}

function ConnectorCard({ connector, onFieldChange }) {
  const isConnected = connector.status === 'connected'

  return (
    <article className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <PlatformMark platform={connector.platform} />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-semibold text-slate-900">{connector.platformLabel}</h2>
                {connector.badge ? (
                  <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-blue-700">
                    {connector.badge}
                  </span>
                ) : null}
              </div>
              <div className="mt-2 flex items-center gap-2 text-sm">
                <span className={`inline-flex h-2.5 w-2.5 rounded-full ${statusDotClass(connector.status)}`} />
                <span className={`font-medium ${statusTextClass(connector.status)}`}>
                  {statusLabel(connector.status)}
                </span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-500">Last synced: {connector.lastSynced}</span>
              </div>
            </div>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
            <Field
              label="App ID"
              icon={Database}
              value={connector.config.appId}
              onChange={(value) => onFieldChange(connector.id, 'appId', value)}
              placeholder="Enter App ID"
            />
            <Field
              label="App Secret"
              icon={KeyRound}
              type="password"
              value={connector.config.appSecret}
              onChange={(value) => onFieldChange(connector.id, 'appSecret', value)}
              placeholder="Enter App Secret"
            />
            <Field
              label="Access Token"
              icon={ShieldCheck}
              value={connector.config.accessToken}
              onChange={(value) => onFieldChange(connector.id, 'accessToken', value)}
              placeholder="Enter Access Token"
            />
            <Field
              label="Page ID"
              icon={Smartphone}
              value={connector.config.pageId}
              onChange={(value) => onFieldChange(connector.id, 'pageId', value)}
              placeholder={connector.pageIdPlaceholder}
              optional={!connector.requiresPageId}
            />
            <Field
              label="Webhook / Callback URL"
              icon={Wifi}
              value={connector.config.callbackUrl}
              onChange={(value) => onFieldChange(connector.id, 'callbackUrl', value)}
              placeholder="https://api.yourdomain.com/webhooks/social"
            />
            <Field
              label="Connection Notes"
              icon={Sparkles}
              value={connector.config.notes}
              onChange={(value) => onFieldChange(connector.id, 'notes', value)}
              placeholder="Add internal notes for this connector"
            />
          </div>
        </div>

        <div className="xl:w-[260px]">
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Connection Status</p>
            <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-4">
              <p className={`text-sm font-semibold ${statusTextClass(connector.status)}`}>{statusLabel(connector.status)}</p>
              <p className="mt-1 text-sm leading-6 text-slate-500">{connector.statusMessage}</p>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <ActionButton icon={TestTube2} label="Test Connection" />
              <ActionButton icon={Eye} label="Save Configuration" active />
              {isConnected ? (
                <ActionButton icon={Unlink2} label="Disconnect" danger />
              ) : (
                <ActionButton icon={CheckCircle2} label="Connect" active />
              )}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <ActionButton icon={RefreshCw} label="Refresh Token" />
              <ActionButton icon={CircleAlert} label="Verify Status" />
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}

function Field({ label, icon: Icon, value, onChange, placeholder, type = 'text', optional = false }) {
  return (
    <label className="grid gap-2">
      <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
        <Icon className="h-4 w-4 text-slate-400" />
        <span>{label}</span>
        {optional ? <span className="text-xs font-semibold text-slate-400">Optional</span> : null}
      </div>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
      />
    </label>
  )
}

function PlatformMark({ platform }) {
  const markClasses = {
    linkedin: 'bg-blue-600 text-white',
    instagram: 'bg-gradient-to-br from-fuchsia-500 to-orange-400 text-white',
    facebook: 'bg-blue-500 text-white',
    twitter: 'bg-slate-900 text-white',
    tiktok: 'bg-black text-white',
  }

  const labels = {
    linkedin: 'in',
    instagram: 'ig',
    facebook: 'f',
    twitter: 'x',
    tiktok: 'tt',
  }

  return (
    <div className={`grid h-12 w-12 place-items-center rounded-2xl text-sm font-bold ${markClasses[platform]}`}>
      {labels[platform]}
    </div>
  )
}

function ActionButton({ icon: Icon, label, active = false, danger = false }) {
  return (
    <button
      type="button"
      className={`inline-flex min-w-[108px] items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition hover:-translate-y-0.5 hover:shadow-sm ${
        danger
          ? 'border border-rose-200 bg-white text-rose-700 hover:bg-rose-50'
          : active
            ? 'border border-blue-700 bg-blue-700 text-white'
            : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
      }`}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  )
}

function statusLabel(status) {
  if (status === 'connected') return 'Connected'
  if (status === 'reconnect') return 'Reconnect Required'
  return 'Disconnected'
}

function statusDotClass(status) {
  if (status === 'connected') return 'bg-emerald-500'
  if (status === 'reconnect') return 'bg-rose-500'
  return 'bg-slate-400'
}

function statusTextClass(status) {
  if (status === 'connected') return 'text-emerald-700'
  if (status === 'reconnect') return 'text-rose-700'
  return 'text-slate-600'
}

export default SocialConnectors