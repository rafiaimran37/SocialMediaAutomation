import { useEffect, useState } from 'react'

import {
  deleteSocialAccount,
  getSocialAccounts,
} from '../../services/socialAccountService'

import {
  createClient,
  getClients,
} from '../../services/clientService'

import {
  CircleAlert,
  Link2,
  Trash2,
  RefreshCw,
} from 'lucide-react'


function SocialConnectors() {
  const [connectors, setConnectors] = useState([])
  const [clients, setClients] = useState([])
  const [selectedClientId, setSelectedClientId] = useState(null)

  const [isPlatformModalOpen, setIsPlatformModalOpen] = useState(false)
  const [isAddClientModalOpen, setIsAddClientModalOpen] = useState(false)
  const [newClientName, setNewClientName] = useState('')
  const [isCreatingClient, setIsCreatingClient] = useState(false)
  const [modalMessage, setModalMessage] = useState('')


  // =========================================================
  // LOAD SOCIAL ACCOUNTS
  // =========================================================

  useEffect(() => {
    async function loadAccounts() {
      try {
        const data = await getSocialAccounts()

        console.log('Social Accounts:', data)

        const formatted = data.map((account) => ({
          id: account.Id,
          clientId: account.ClientId,

          platform: account.Platform.toLowerCase(),
          platformLabel: account.Platform,

          accountName: account.AccountName,
          email: account.Email,

          status: account.Status.toLowerCase(),

          statusMessage:
            `${account.Platform} account connected successfully`,

          lastSynced: 'Just now',

          requiresPageId: false,
          pageIdPlaceholder: 'Not required',

          config: {
            appId: '',
            appSecret: '',
            accessToken: '••••••••••••',
            pageId: account.PageId || '',
            callbackUrl: '',
            notes: '',
          },
        }))

        setConnectors(formatted)

        console.log('Connectors State:', formatted)
      } catch (error) {
        console.log('Failed to load social accounts:', error)
      }
    }

    loadAccounts()
  }, [])


  // =========================================================
  // LOAD CLIENTS
  // =========================================================

  const loadClients = async (preferredClientId = null) => {
    try {
      const data = await getClients()

      console.log('Clients:', data)

      setClients(data)

      if (data.length > 0) {
        setSelectedClientId(
          preferredClientId ?? data[0].Id,
        )
      } else {
        setSelectedClientId(null)
      }
    } catch (error) {
      console.log('Failed to load clients:', error)
    }
  }

  useEffect(() => {
    loadClients()
  }, [])


  // =========================================================
  // UPDATE CONNECTOR FIELD
  // =========================================================

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


  // =========================================================
  // DELETE SOCIAL ACCOUNT
  // =========================================================

  const handleDeleteConnector = async (connectorId) => {
    const confirmed = window.confirm(
      'Are you sure you want to disconnect this account?',
    )

    if (!confirmed) {
      return
    }

    try {
      await deleteSocialAccount(connectorId)

      setConnectors((current) =>
        current.filter(
          (connector) => connector.id !== connectorId,
        ),
      )
    } catch (error) {
      console.log('Failed to delete social account:', error)
    }
  }


  // =========================================================
  // CONNECT NEW ACCOUNT
  // =========================================================

  const handleConnectNewAccountClick = () => {
    setModalMessage('')
    setIsPlatformModalOpen(true)
  }


  const handleAddClientClick = () => {
    setNewClientName('')
    setIsAddClientModalOpen(true)
  }


  const handleCreateClient = async (event) => {
    event.preventDefault()

    const clientName = newClientName.trim()

    if (!clientName) {
      setModalMessage('Client name is required')
      return
    }

    try {
      setIsCreatingClient(true)

      const response = await createClient(clientName)
      const createdClient = response.client ?? response

      setIsAddClientModalOpen(false)
      setNewClientName('')
      setModalMessage('')

      await loadClients(createdClient.Id)
    } catch (error) {
      console.log('Failed to create client:', error)
      setModalMessage('Failed to create client')
    } finally {
      setIsCreatingClient(false)
    }
  }


const handleFacebookConnect = () => {
  if (!selectedClientId) {
    setModalMessage('Please select a client first')
    return
  }

  window.location.href =
    `http://127.0.0.1:8000/auth/facebook/login?user_id=1&client_id=${selectedClientId}`
}


  const handleInstagramConnect = () => {
    window.location.href =
      'http://127.0.0.1:8000/auth/instagram/login?user_id=1'
  }


  const handleLinkedInConnect = () => {
    window.location.href =
      'http://127.0.0.1:8000/auth/linkedin/login?user_id=1'
  }


  const handlePlatformSelect = (platform) => {
    if (platform === 'facebook') {
      setIsPlatformModalOpen(false)
      handleFacebookConnect()
      return
    }

    if (platform === 'instagram') {
      setIsPlatformModalOpen(false)
      handleInstagramConnect()
      return
    }

    if (platform === 'linkedin') {
      setIsPlatformModalOpen(false)
      handleLinkedInConnect()
      return
    }

    setModalMessage(`${platform} Coming Soon`)
  }


  // =========================================================
  // FILTER ACCOUNTS BY SELECTED CLIENT
  // =========================================================

  const filteredConnectors = connectors.filter(
    (connector) => {
      if (!selectedClientId) {
        return true
      }

      return connector.clientId === selectedClientId
    },
  )


  // =========================================================
  // SUMMARY COUNTS
  // =========================================================

  const activeCount = filteredConnectors.filter(
    (connector) => connector.status === 'connected',
  ).length


  // =========================================================
  // RETURN
  // =========================================================

  return (
    <div className="mx-auto flex w-full max-w-[1120px] flex-col gap-7 px-6 py-8 text-slate-800">

      {/* Page Header */}

      <section className="flex flex-col gap-6 rounded-[2rem] border border-slate-200/80 bg-white/80 px-6 py-6 shadow-[0_18px_50px_rgba(15,23,42,0.05)] backdrop-blur sm:flex-row sm:items-center sm:justify-between xl:px-8 xl:py-7">

        <div>
          <h1 className="text-3xl font-semibold tracking-[-0.06em] text-slate-900 sm:text-4xl">
            Social Connectors
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500 sm:text-[0.95rem]">
            Manage and sync your cross-platform social media channels.
          </p>
        </div>


        <button
          type="button"
          onClick={handleConnectNewAccountClick}
          className="inline-flex h-12 items-center gap-2 whitespace-nowrap rounded-full bg-gradient-to-r from-blue-700 to-blue-600 px-5 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(37,99,235,0.24)] transition hover:-translate-y-0.5 hover:shadow-lg"
        >
          <Link2
            className="h-4 w-4"
            strokeWidth={2}
          />

          Connect New Account
        </button>

      </section>


      {/* =====================================================
          CLIENT SELECTOR
          ===================================================== */}

      <section className="rounded-[1.4rem] border border-slate-200/80 bg-white p-5 shadow-[0_14px_36px_rgba(15,23,42,0.05)]">

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
              Select Client
            </p>

            <p className="mt-1 text-[14px] font-medium text-slate-500">
              Choose a client to view its connected social accounts.
            </p>
          </div>


          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">

            <select
              value={selectedClientId || ''}
              onChange={(event) =>
                setSelectedClientId(
                  event.target.value ? Number(event.target.value) : null,
                )
              }
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >

              <option value="">
                {clients.length > 0 ? 'Select a client' : 'No clients yet'}
              </option>

              {clients.map((client) => (
                <option
                  key={client.Id}
                  value={client.Id}
                >
                  {client.ClientName}
                </option>
              ))}

            </select>


            <button
              type="button"
              onClick={handleAddClientClick}
              className="inline-flex h-11 items-center justify-center whitespace-nowrap rounded-full border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:text-blue-700"
            >
              Add Client
            </button>

          </div>

        </div>

      </section>


      {/* =====================================================
          PLATFORM MODAL
          ===================================================== */}

      {isPlatformModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 py-6 backdrop-blur-[2px]">

          <div className="w-full max-w-[420px] rounded-[1.6rem] border border-slate-200/80 bg-white p-5 shadow-[0_24px_70px_rgba(15,23,42,0.22)]">

            <div className="flex items-start justify-between gap-4">

              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                  Choose Platform
                </p>

                <h2 className="mt-1 text-[18px] font-semibold tracking-[-0.03em] text-slate-950">
                  Connect New Account
                </h2>
              </div>


              <button
                type="button"
                onClick={() => {
                  setIsPlatformModalOpen(false)
                  setModalMessage('')
                }}
                className="grid h-8 w-8 place-items-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                aria-label="Close platform modal"
              >
                <span className="text-lg leading-none">
                  ×
                </span>
              </button>

            </div>


            <div className="mt-5 space-y-3">

              <PlatformOptionButton
                label="Facebook"
                tone="facebook"
                onClick={() =>
                  handlePlatformSelect('facebook')
                }
              />


              <PlatformOptionButton
                label="Instagram"
                tone="instagram"
                onClick={() =>
                  handlePlatformSelect('instagram')
                }
              />


              <PlatformOptionButton
                label="LinkedIn"
                tone="linkedin"
                onClick={() =>
                  handlePlatformSelect('linkedin')
                }
              />

            </div>


            {modalMessage ? (
              <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-[13px] font-medium text-amber-900 shadow-sm">
                {modalMessage}
              </div>
            ) : null}

          </div>

        </div>
      ) : null}


      {isAddClientModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 py-6 backdrop-blur-[2px]">

          <div className="w-full max-w-[420px] rounded-[1.6rem] border border-slate-200/80 bg-white p-5 shadow-[0_24px_70px_rgba(15,23,42,0.22)]">

            <div className="flex items-start justify-between gap-4">

              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                  New Client
                </p>

                <h2 className="mt-1 text-[18px] font-semibold tracking-[-0.03em] text-slate-950">
                  Add Client
                </h2>
              </div>


              <button
                type="button"
                onClick={() => {
                  setIsAddClientModalOpen(false)
                  setModalMessage('')
                }}
                className="grid h-8 w-8 place-items-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                aria-label="Close add client modal"
              >
                <span className="text-lg leading-none">
                  ×
                </span>
              </button>

            </div>


            <form
              className="mt-5 space-y-4"
              onSubmit={handleCreateClient}
            >

              <div>
                <label
                  htmlFor="client-name"
                  className="text-[12px] font-semibold uppercase tracking-[0.14em] text-slate-400"
                >
                  Client name
                </label>

                <input
                  id="client-name"
                  type="text"
                  value={newClientName}
                  onChange={(event) => setNewClientName(event.target.value)}
                  placeholder="Enter client name"
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>


              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddClientModalOpen(false)
                    setModalMessage('')
                  }}
                  className="rounded-full px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
                >
                  Cancel
                </button>


                <button
                  type="submit"
                  disabled={isCreatingClient}
                  className="inline-flex h-11 items-center justify-center rounded-full bg-gradient-to-r from-blue-700 to-blue-600 px-5 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(37,99,235,0.24)] transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isCreatingClient ? 'Creating...' : 'Create Client'}
                </button>
              </div>

            </form>

            {modalMessage ? (
              <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-[13px] font-medium text-amber-900 shadow-sm">
                {modalMessage}
              </div>
            ) : null}

          </div>

        </div>
      ) : null}


      {/* =====================================================
          SUMMARY CARDS
          ===================================================== */}

      <section className="grid gap-4 md:grid-cols-3">

        <SummaryCard
          label="TOTAL ACTIVE"
          value={`${activeCount} Channels`}
          icon={Link2}
          accentClassName="bg-[#EBF3FF] text-[#1D63ED]"
        />


        <SummaryCard
          label="ACTION NEEDED"
          value="0 Expired"
          icon={CircleAlert}
          accentClassName="bg-[#FFF0F0] text-[#E03A3A]"
        />


        <SummaryCard
          label="AVG. SYNC DELAY"
          value="1.2 Minutes"
          icon={RefreshCw}
          accentClassName="bg-[#EBF3FF] text-[#1D63ED]"
        />

      </section>


      {/* =====================================================
          CONNECTORS LIST
          ===================================================== */}

      <section className="space-y-4">

        {filteredConnectors.length > 0 ? (

          filteredConnectors.map((connector) => (
            <ConnectorCard
              key={connector.id}
              connector={connector}
              onFieldChange={updateField}
              onDelete={handleDeleteConnector}
            />
          ))

        ) : (

          <div className="rounded-[1.5rem] border border-dashed border-slate-300 bg-white p-10 text-center">

            <p className="text-sm font-semibold text-slate-700">
              No social accounts connected
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Connect a social account for this client.
            </p>

          </div>

        )}

      </section>


      {/* Divider */}

      <div className="mt-8 w-full border-t border-slate-200/80" />


      {/* Security Footer */}

      <section className="mt-6 text-center text-xs leading-6 text-slate-500">

        Security Guarantee: We use OAuth 2.0 to ensure your credentials never leave the platform.{' '}

        <button
          type="button"
          className="font-semibold text-[#1D63ED] hover:underline"
        >
          View Security Policy
        </button>

      </section>

    </div>
  )
}


// =========================================================
// SUMMARY CARD
// =========================================================

function SummaryCard({
  icon: Icon,
  label,
  value,
  accentClassName,
}) {
  return (
    <article className="rounded-[1.4rem] border border-slate-200/80 bg-white p-5 shadow-[0_14px_36px_rgba(15,23,42,0.05)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_42px_rgba(15,23,42,0.08)]">

      <div className="flex items-center gap-4">

        <div
          className={`grid h-10 w-10 shrink-0 place-items-center rounded-2xl ring-1 ring-inset ${accentClassName}`}
        >

          <Icon
            className="h-4 w-4"
            strokeWidth={2}
          />

        </div>


        <div>

          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
            {label}
          </p>

          <p className="mt-0.5 text-[14px] font-semibold text-slate-800">
            {value}
          </p>

        </div>

      </div>

    </article>
  )
}


// =========================================================
// PLATFORM OPTION BUTTON
// =========================================================

function PlatformOptionButton({
  label,
  tone,
  onClick,
}) {

  const toneClasses = {
    facebook:
      'border-[#D9E7FF] bg-[#F6F9FF] text-[#0F52BA] hover:bg-[#ECF4FF]',

    instagram:
      'border-[#FFE0EA] bg-[#FFF7FA] text-[#D22B6A] hover:bg-[#FFF0F5]',

    linkedin:
      'border-[#D9E7FF] bg-[#F6F9FF] text-[#0A66C2] hover:bg-[#ECF4FF]',
  }


  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center justify-between rounded-[1rem] border px-4 py-3 text-left text-[14px] font-semibold transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(15,23,42,0.08)] ${toneClasses[tone]}`}
    >

      <span>
        {label}
      </span>


      <span className="text-[11px] font-medium uppercase tracking-[0.14em] opacity-70">
        Continue
      </span>

    </button>
  )
}


// =========================================================
// DISPLAY HELPERS
// =========================================================

function getDisplayLabel(connector) {

  if (
    connector.platform === 'twitter' ||
    connector.platform === 'x'
  ) {
    return 'Twitter/X'
  }

  return connector.platformLabel
}


function getBadge(connector) {

  if (connector.platform === 'linkedin') {
    return 'Corporate'
  }

  return connector.badge || null
}


// =========================================================
// CONNECTOR CARD
// =========================================================

function ConnectorCard({
  connector,
  onDelete,
}) {

  const isConnected =
    connector.status === 'connected'

  const isReconnect =
    connector.status === 'reconnect'

  const badge =
    getBadge(connector)


  return (
    <article className="rounded-[1.5rem] border border-slate-200/80 bg-white p-5 shadow-[0_14px_36px_rgba(15,23,42,0.05)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_42px_rgba(15,23,42,0.08)]">

      <div className="flex items-center justify-between gap-4">

        <div className="flex min-w-0 flex-1 items-center gap-4">

          <PlatformMark
            platform={connector.platform}
          />


          <div className="min-w-0">

            <div className="flex items-center gap-2">

              <h2 className="text-[15px] font-semibold tracking-[-0.01em] text-slate-900">
                {getDisplayLabel(connector)}
              </h2>


              {badge ? (
                <span className="whitespace-nowrap rounded-full bg-blue-50 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-blue-700 ring-1 ring-blue-100">
                  {badge}
                </span>
              ) : null}

            </div>


            <div className="mt-1 flex flex-wrap items-center gap-2 text-[12px]">

              <span
                className={`inline-flex h-1.5 w-1.5 shrink-0 rounded-full ${statusDotClass(
                  connector.status,
                )}`}
              />


              <span className="font-medium text-slate-500">

                {isConnected
                  ? 'Connected as'
                  : isReconnect
                    ? 'Session Expired'
                    : 'Disconnected'}

              </span>


              {isReconnect ? (
                <button
                  type="button"
                  className="font-semibold text-rose-600 underline underline-offset-2"
                >
                  Reconnect now
                </button>
              ) : null}


              {isConnected ? (
                <span className="font-bold text-slate-800">
                  {connector.accountName}
                </span>
              ) : null}

            </div>

          </div>

        </div>


        <div className="flex shrink-0 items-center gap-4">

          <div className="flex flex-col items-end">

            <span className="whitespace-nowrap text-[11px] text-slate-400">
              Last Synced: {connector.lastSynced}
            </span>


            <div className="mt-2 flex items-center gap-2">

              <button
                type="button"
                onClick={() =>
                  onDelete(connector.id)
                }
                className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                aria-label="Remove connector"
              >

                <Trash2 className="h-4 w-4" />

              </button>

            </div>

          </div>

        </div>

      </div>

    </article>
  )
}


// =========================================================
// PLATFORM MARK
// =========================================================

function PlatformMark({
  platform,
}) {

  if (platform === 'linkedin') {
    return (
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-[#0077B5] text-white shadow-sm">

        <svg
          className="h-5 w-5 fill-current"
          viewBox="0 0 24 24"
        >

          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />

        </svg>

      </div>
    )
  }


  if (
    platform === 'twitter' ||
    platform === 'twitter/x' ||
    platform === 'x'
  ) {
    return (
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-black text-white shadow-sm">

        <svg
          className="h-4 w-4 fill-current"
          viewBox="0 0 24 24"
        >

          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />

        </svg>

      </div>
    )
  }


  if (platform === 'instagram') {
    return (
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-[radial-gradient(ellipse_at_20%_150%,#ffbe46_0%,#ff2464_50%,#e100ff_100%)] text-white shadow-sm">

        <svg
          className="h-5 w-5 fill-none stroke-current"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >

          <rect
            x="2"
            y="2"
            width="20"
            height="20"
            rx="5"
          />

          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />

          <line
            x1="17.5"
            y1="6.5"
            x2="17.51"
            y2="6.5"
          />

        </svg>

      </div>
    )
  }


  if (platform === 'facebook') {
    return (
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-[#1877F2] text-white shadow-sm">

        <svg
          className="h-5 w-5 fill-current"
          viewBox="0 0 24 24"
        >

          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />

        </svg>

      </div>
    )
  }


  return (
    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-black text-white shadow-sm">

      <svg
        className="h-5 w-5 fill-current"
        viewBox="0 0 24 24"
      >

        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 1 1-5.2-1.74 2.89 2.89 0 0 1 2.31-1.42V8.9a6.34 6.34 0 0 0-5.38 2.22 6.38 6.38 0 0 0 1.25 8.91 6.34 6.34 0 0 0 8.87-1.63 6.3 6.3 0 0 0 1.1-3.64V9.32a8.27 8.27 0 0 0 4.27 1.17V7.04a4.84 4.84 0 0 1-3.77-3.65z" />

      </svg>

    </div>
  )
}


// =========================================================
// STATUS DOT
// =========================================================

function statusDotClass(status) {

  if (status === 'connected') {
    return 'bg-emerald-500'
  }

  if (status === 'reconnect') {
    return 'bg-rose-500'
  }

  return 'bg-slate-400'
}


export default SocialConnectors