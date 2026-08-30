import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  CalendarDays,
  ChevronDown,
  RefreshCcw,
  Sparkles,
  Send,
  WandSparkles,
  Clock3,
} from 'lucide-react'

import { buildApiUrl } from '../../services/api'
import { publishFacebookPost } from '../../services/facebookService'
import { addScheduleData } from '../AddSchedule/addScheduleData'
import PlatformSelector from '../AddSchedule/components/PlatformSelector'
import ToggleSwitch from '../AddSchedule/components/ToggleSwitch'
import { createScheduledPost } from '../../services/scheduledPostService'
import { getClients } from '../../services/clientsService'

const toneOptions = [
  'Professional',
  'Friendly',
  'Bold',
  'Insightful',
]

const initialKeywords = [
  'Security',
  'Cloud',
]

const initialFormState = {
  topic: '',
  caption: '',
  platforms: [],
  scheduleDate: '',
  scheduleTime: '',
  approvalRequired: false,

  storeSelection: 'all',
  selectedStores: [],
}


function AIGenerator() {

  const navigate = useNavigate()

  const [tone, setTone] = useState('Professional')
  const [topic, setTopic] = useState('')
  const [targetAudience, setTargetAudience] = useState('')

  const [keywords, setKeywords] =
    useState(initialKeywords)

  const [keywordInput, setKeywordInput] =
    useState('')

  const [generatedCaption, setGeneratedCaption] =
    useState('')

  // ==================================================
  // AI GENERATED IMAGE
  // ==================================================

  const [generatedImage, setGeneratedImage] =
    useState('')

  const [generating, setGenerating] =
    useState(false)

  const [publishing, setPublishing] =
    useState(false)

  // Existing manual media file.
  // DO NOT REMOVE - manual upload flow stays same.
  const [mediaFile, setMediaFile] =
    useState(null)

  const [formState, setFormState] =
    useState(initialFormState)


  // ==================================================
  // CLIENTS / STORES
  // ==================================================

  const [clients, setClients] =
    useState([])

  const [loadingClients, setLoadingClients] =
    useState(true)


  // ==================================================
  // LOAD CLIENTS / STORES
  // ==================================================

  const loadClients = async () => {

    try {

      setLoadingClients(true)

      const data = await getClients()

      setClients(
        Array.isArray(data)
          ? data
          : []
      )

    } catch (error) {

      console.log(
        'Load Clients Error:',
        error
      )

    } finally {

      setLoadingClients(false)

    }

  }


  useEffect(() => {

    loadClients()

  }, [])


  // ==================================================
  // KEYWORDS
  // ==================================================

  const addKeyword = (event) => {

    if (event.key !== 'Enter') {
      return
    }

    event.preventDefault()

    const value =
      keywordInput.trim()

    if (
      !value ||
      keywords.includes(value)
    ) {
      return
    }

    setKeywords(
      (current) => [
        ...current,
        value,
      ]
    )

    setKeywordInput('')

  }


  const removeKeyword = (
    keywordToRemove
  ) => {

    setKeywords(
      (current) =>
        current.filter(
          (keyword) =>
            keyword !== keywordToRemove
        )
    )

  }


  // ==================================================
  // RESET
  // ==================================================

  const handleReset = () => {

    setTone('Professional')

    setTopic('')

    setTargetAudience('')

    setKeywords(
      initialKeywords
    )

    setKeywordInput('')

    setGeneratedCaption('')

    // Clear AI generated image
    setGeneratedImage('')

    // Keep existing manual media reset
    setMediaFile(null)

    setFormState(
      initialFormState
    )

  }


  // ==================================================
  // USE GENERATED POST
  // ==================================================

  const handleUseThisPost = () => {

    if (!generatedCaption) {
      return
    }

    setFormState(
      (current) => ({
        ...current,

        caption:
          generatedCaption,
      })
    )

  }


  // ==================================================
  // AI GENERATION
  // ==================================================

  const handleGenerateContent =
    async () => {

      try {

        setGenerating(true)

        const response =
          await fetch(
            buildApiUrl('/ai/generate'),
            {
              method: 'POST',

              headers: {
                'Content-Type':
                  'application/json',
              },

              body: JSON.stringify({
                topic,

                // Existing backend flow
                platform: 'LinkedIn',

                tone,

                targetAudience,

                keywords,
              }),
            }
          )


        if (!response.ok) {

          throw new Error(
            'AI generation failed'
          )

        }


        const data =
          await response.json()


        // ==================================================
        // GENERATED CAPTION
        // ==================================================

        const generated =
          data.generatedCaption ?? ''


        setGeneratedCaption(
          generated
        )


        // ==================================================
        // GENERATED IMAGE
        // ==================================================

        const generatedImageData =
          data.generatedImage ?? ''


        setGeneratedImage(
          generatedImageData
        )


        // ==================================================
        // PUT CAPTION INTO SCHEDULER
        // ==================================================

        if (generated) {

          setFormState(
            (current) => ({
              ...current,

              caption:
                generated,
            })
          )

        }

      } catch (error) {

        console.log(
          'AI Generate Error:',
          error
        )

      } finally {

        setGenerating(false)

      }

    }


  // ==================================================
  // FORM CHANGE
  // ==================================================

  const handleChange = (
    event
  ) => {

    const {
      name,
      value,
      type,
      checked,
    } = event.target


    setFormState(
      (current) => ({
        ...current,

        [name]:
          type === 'checkbox'
            ? checked
            : value,
      })
    )

  }


  // ==================================================
  // MANUAL MEDIA
  // ==================================================

  // Existing manual upload flow.
  // DO NOT CHANGE.
  const handleMediaChange = (
    event
  ) => {

    setMediaFile(
      event.target.files?.[0] ??
        null
    )

  }


  // ==================================================
  // STORE SELECTION
  // ==================================================

  const handleStoreSelectionChange =
    (selection) => {

      setFormState(
        (current) => ({
          ...current,

          storeSelection:
            selection,

          selectedStores:
            selection === 'all'
              ? []
              : current.selectedStores,
        })
      )

    }


  const handleSelectedStoresChange =
    (event) => {

      const selected =
        Array.from(
          event.target.selectedOptions,
          (option) =>
            option.value
        )


      setFormState(
        (current) => ({
          ...current,

          selectedStores:
            selected,
        })
      )

    }


  // ==================================================
  // AI IMAGE → FILE
  // ==================================================
  //
  // Converts the base64 image returned by the AI
  // into a browser File object.
  //
  // This allows us to reuse the EXISTING backend:
  //
  // media_file
  //     ↓
  // save_media_file()
  //     ↓
  // MediaPath
  //
  // Manual uploads are completely unaffected.
  // ==================================================

  const convertGeneratedImageToFile = () => {

    if (!generatedImage) {
      return null
    }

    try {

      let base64Data =
        generatedImage

      let mimeType =
        'image/png'


      // ------------------------------------------------
      // Support data URL format too.
      //
      // Example:
      // data:image/png;base64,AAAA...
      // ------------------------------------------------

      if (
        generatedImage.startsWith(
          'data:'
        )
      ) {

        const parts =
          generatedImage.split(',')

        const header =
          parts[0]

        base64Data =
          parts[1]

        const mimeMatch =
          header.match(
            /data:(.*?);base64/
          )

        if (mimeMatch?.[1]) {

          mimeType =
            mimeMatch[1]

        }

      }


      // ------------------------------------------------
      // Base64 → binary
      // ------------------------------------------------

      const byteCharacters =
        window.atob(
          base64Data
        )

      const byteArrays = []

      const chunkSize = 1024


      for (
        let offset = 0;
        offset < byteCharacters.length;
        offset += chunkSize
      ) {

        const slice =
          byteCharacters.slice(
            offset,
            offset + chunkSize
          )

        const byteNumbers =
          new Array(
            slice.length
          )


        for (
          let index = 0;
          index < slice.length;
          index++
        ) {

          byteNumbers[index] =
            slice.charCodeAt(index)

        }


        byteArrays.push(
          new Uint8Array(
            byteNumbers
          )
        )

      }


      const blob =
        new Blob(
          byteArrays,
          {
            type: mimeType,
          }
        )


      return new File(
        [
          blob,
        ],
        `ai-generated-${Date.now()}.png`,
        {
          type: mimeType,
        }
      )

    } catch (error) {

      console.log(
        'AI Image Conversion Error:',
        error
      )

      return null

    }

  }


  // ==================================================
  // SUBMIT / SCHEDULE
  // ==================================================

  const handleSubmit = async (
    event
  ) => {

    event.preventDefault()


    try {

      // ==============================================
      // GET CLIENT IDS
      // ==============================================

      const clientIds =
        formState.storeSelection === 'all'

          ? clients
              .map(
                (client) =>
                  client.id ??
                  client.Id
              )
              .filter(
                (id) =>
                  id !== null &&
                  id !== undefined &&
                  id !== ''
              )
              .map(Number)

          : formState.selectedStores
              .map(Number)
              .filter(
                (id) =>
                  Number.isInteger(id) &&
                  id > 0
              )


      // ==============================================
      // VALIDATE STORES
      // ==============================================

      if (clientIds.length === 0) {

        console.log(
          'No stores selected'
        )

        return

      }


      // ==============================================
      // VALIDATE PLATFORMS
      // ==============================================

      if (
        formState.platforms.length === 0
      ) {

        console.log(
          'No platform selected'
        )

        return

      }


      // ==============================================
      // IMPORTANT:
      //
      // If manual media exists, keep using it.
      //
      // Otherwise, if AI image exists, convert the
      // AI image into a File and use the SAME
      // media_file backend flow.
      //
      // If neither exists, keep the existing JSON flow.
      // ==============================================

      let mediaToSchedule =
        mediaFile


      if (
        !mediaToSchedule &&
        generatedImage
      ) {

        mediaToSchedule =
          convertGeneratedImageToFile()

      }


      // ==============================================
      // CREATE REQUEST DATA
      // ==============================================

      const scheduleData =
        mediaToSchedule

          ? new FormData()

          : {

              platforms:
                formState.platforms,

              message:
                formState.caption ||
                formState.topic,

              scheduled_date:
                formState.scheduleDate,

              scheduled_time:
                formState.scheduleTime,

              approval_required:
                formState.approvalRequired,

              store_selection:
                formState.storeSelection,

              client_ids:
                clientIds,

            }


      // ==============================================
      // MEDIA REQUEST
      // ==============================================

      if (mediaToSchedule) {

        // --------------------------------------------
        // Platforms
        // --------------------------------------------

        formState.platforms.forEach(
          (platform) => {

            scheduleData.append(
              'platforms',
              platform
            )

          }
        )


        // --------------------------------------------
        // Message
        // --------------------------------------------

        scheduleData.append(
          'message',
          formState.caption ||
            formState.topic
        )


        // --------------------------------------------
        // Date
        // --------------------------------------------

        scheduleData.append(
          'scheduled_date',
          formState.scheduleDate
        )


        // --------------------------------------------
        // Time
        // --------------------------------------------

        scheduleData.append(
          'scheduled_time',
          formState.scheduleTime
        )


        // --------------------------------------------
        // Approval
        // --------------------------------------------

        scheduleData.append(
          'approval_required',
          String(
            formState.approvalRequired
          )
        )


        // --------------------------------------------
        // Store selection
        // --------------------------------------------

        scheduleData.append(
          'store_selection',
          formState.storeSelection
        )


        // --------------------------------------------
        // Client IDs
        // --------------------------------------------

        clientIds.forEach(
          (clientId) => {

            scheduleData.append(
              'client_ids',
              String(clientId)
            )

          }
        )


        // --------------------------------------------
        // MEDIA
        //
        // IMPORTANT:
        //
        // This is still called media_file.
        // Therefore the existing backend upload
        // pipeline remains unchanged.
        // --------------------------------------------

        scheduleData.append(
          'media_file',
          mediaToSchedule
        )

      }


      // ==============================================
      // DEBUG
      // ==============================================

      console.log(
        'Store Selection:',
        formState.storeSelection
      )

      console.log(
        'Client IDs:',
        clientIds
      )

      console.log(
        'Platforms:',
        formState.platforms
      )

      console.log(
        'Manual Media:',
        mediaFile
      )

      console.log(
        'AI Image Available:',
        Boolean(generatedImage)
      )

      console.log(
        'Media Being Scheduled:',
        mediaToSchedule
      )

      console.log(
        'Schedule Data:',
        scheduleData
      )


      // ==============================================
      // CREATE SCHEDULED POST
      // ==============================================

      const response =
        await createScheduledPost(
          scheduleData
        )


      console.log(
        'Schedule Created:',
        response
      )


      // ==============================================
      // REDIRECT
      // ==============================================

      navigate(
        '/schedule-posts'
      )


    } catch (error) {

      console.log(
        'Schedule Create Error:',
        error
      )

    }

  }


  // ==================================================
  // PUBLISH NOW
  // ==================================================

  const handlePublish = async () => {

    try {

      setPublishing(true)

      const data =
        await publishFacebookPost(
          formState.caption ||
            formState.topic
        )


      console.log(
        'PUBLISH RESPONSE:',
        data
      )

    } catch (error) {

      console.log(
        'Publish Error:',
        error
      )

    } finally {

      setPublishing(false)

    }

  }


  // ==================================================
  // UI
  // ==================================================

  return (

    <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-7 text-slate-900">

      {/* HEADER */}

      <section className="flex flex-col gap-6 rounded-[2rem] border border-slate-200/80 bg-white/80 px-6 py-6 shadow-[0_18px_50px_rgba(15,23,42,0.05)] backdrop-blur xl:flex-row xl:items-center xl:justify-between xl:px-8 xl:py-7">

        <div>

          <div className="flex items-center gap-3">

            <h1 className="text-3xl font-semibold tracking-[-0.06em] text-slate-900 sm:text-4xl">

              Create & Schedule

            </h1>

          </div>


          <p className="mt-2 text-sm leading-6 text-slate-500 sm:text-[0.95rem]">

            Build optimized social posts and preview the result before publishing.

          </p>

        </div>


        <div className="hidden items-center gap-3 sm:flex">

          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50 hover:shadow-md"
          >

            <RefreshCcw className="h-4 w-4" />

            Reset

          </button>

        </div>

      </section>


      {/* MAIN */}

      <section className="grid gap-6 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] xl:items-start">

        {/* LEFT - AI GENERATOR */}

        <article className="rounded-[1.6rem] border border-slate-200/80 bg-white p-5 shadow-[0_14px_36px_rgba(15,23,42,0.05)] sm:p-6">

          <div className="mb-6 flex items-center justify-between gap-4">

            <div>

              <h2 className="text-lg font-semibold tracking-[-0.02em] text-slate-900">

                AI Generator

              </h2>


              <p className="mt-1 text-sm leading-6 text-slate-500">

                Create a high quality post with AI.

              </p>

            </div>

          </div>


          <div className="space-y-5">

            {/* TOPIC */}

            <label className="grid gap-2">

              <span className="text-sm font-medium text-slate-700">

                Core Topic or Announcement

              </span>


              <textarea
                value={topic}
                onChange={(event) =>
                  setTopic(
                    event.target.value
                  )
                }
                rows={5}
                placeholder="e.g. Launching our new enterprise-grade security features for distributed teams."
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />

            </label>


            {/* TONE + AUDIENCE */}

            <section className="grid gap-4 sm:grid-cols-2">

              <label className="grid gap-2">

                <span className="text-sm font-medium text-slate-700">

                  Tone of Voice

                </span>


                <div className="relative">

                  <select
                    value={tone}
                    onChange={(event) =>
                      setTone(
                        event.target.value
                      )
                    }
                    className="h-12 w-full appearance-none rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                  >

                    {toneOptions.map(
                      (option) => (

                        <option
                          key={option}
                          value={option}
                        >

                          {option}

                        </option>

                      )
                    )}

                  </select>


                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                </div>

              </label>


              <label className="grid gap-2">

                <span className="text-sm font-medium text-slate-700">

                  Target Audience

                </span>


                <input
                  value={targetAudience}
                  onChange={(event) =>
                    setTargetAudience(
                      event.target.value
                    )
                  }
                  placeholder="e.g. CTOs, Security"
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                />

              </label>

            </section>


            {/* KEYWORDS */}

            <section className="grid gap-2">

              <span className="text-sm font-medium text-slate-700">

                Keywords (Optional)

              </span>


              <div className="flex min-h-12 flex-wrap items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-100">

                {keywords.map(
                  (keyword) => (

                    <button
                      key={keyword}
                      type="button"
                      onClick={() =>
                        removeKeyword(
                          keyword
                        )
                      }
                      className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 transition hover:bg-blue-100"
                    >

                      {keyword}

                      <span className="text-blue-500">

                        ×

                      </span>

                    </button>

                  )
                )}


                <input
                  value={keywordInput}
                  onChange={(event) =>
                    setKeywordInput(
                      event.target.value
                    )
                  }
                  onKeyDown={addKeyword}
                  placeholder="Add tag..."
                  className="min-w-32 flex-1 border-0 bg-transparent px-1 py-1 text-sm text-slate-700 outline-none placeholder:text-slate-400"
                />

              </div>

            </section>


            {/* GENERATE BUTTON */}

            <button
              type="button"
              onClick={
                handleGenerateContent
              }
              disabled={generating}
              className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-700 to-blue-600 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(37,99,235,0.28)] transition hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50"
            >

              <Sparkles className="h-4 w-4" />

              {generating
                ? 'Generating...'
                : 'Generate Content'}

              <ArrowRight className="h-4 w-4" />

            </button>

          </div>

        </article>


        {/* RIGHT - PREVIEW */}

        <article className="rounded-[1.6rem] border border-slate-200/80 bg-white p-5 shadow-[0_14px_36px_rgba(15,23,42,0.05)] sm:p-6">

          <div className="mb-6 flex items-center justify-between gap-4">

            <div>

              <h2 className="text-lg font-semibold tracking-[-0.02em] text-slate-900">

                Preview &amp; Edit

              </h2>


              <p className="mt-1 text-sm leading-6 text-slate-500">

                Review the generated post before sending it to the queue.

              </p>

            </div>


            <div className="flex items-center gap-2 text-slate-400">

              <button
                type="button"
                className="rounded-full p-2 transition hover:bg-slate-100 hover:text-slate-700"
              >

                <RefreshCcw className="h-4 w-4" />

              </button>


              <button
                type="button"
                className="rounded-full p-2 transition hover:bg-slate-100 hover:text-slate-700"
              >

                <WandSparkles className="h-4 w-4" />

              </button>

            </div>

          </div>


          <div className="flex min-h-[640px] flex-col items-center justify-center rounded-[1.5rem] border border-slate-200 bg-gradient-to-b from-slate-50 to-white px-6 py-12 text-center">

            {generatedCaption ? (

              <div className="flex w-full flex-col gap-4 text-left">

                {/* AI GENERATED IMAGE */}

                {generatedImage && (

                  <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                    <img
                      src={
                        generatedImage.startsWith(
                          'data:'
                        )
                          ? generatedImage
                          : `data:image/png;base64,${generatedImage}`
                      }
                      alt="AI generated social media"
                      className="h-auto max-h-[420px] w-full object-cover"
                    />

                  </div>

                )}


                {/* AI GENERATED CAPTION */}

                <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm leading-7 text-slate-700 shadow-sm">

                  {generatedCaption}

                </div>


                {/* USE THIS POST */}

                <button
                  type="button"
                  onClick={
                    handleUseThisPost
                  }
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-700 to-blue-600 px-5 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(37,99,235,0.28)] transition hover:-translate-y-0.5 hover:shadow-lg"
                >

                  Use This Post

                  <ArrowRight className="h-4 w-4" />

                </button>

              </div>

            ) : (

              <>

                <div className="grid h-20 w-20 place-items-center rounded-full bg-blue-100 text-blue-700 shadow-[0_10px_20px_rgba(37,99,235,0.12)]">

                  <Sparkles className="h-8 w-8" />

                </div>


                <h3 className="mt-6 text-xl font-semibold tracking-[-0.02em] text-slate-900">

                  Ready to create?

                </h3>


                <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">

                  Fill out the details on the left and let Lumina&apos;s AI engine craft your perfect social media post.

                </p>

              </>

            )}

          </div>

        </article>

      </section>


      {/* SCHEDULER */}

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.25fr)_minmax(360px,0.75fr)] xl:items-start">

        <form
          id="schedule-form"
          onSubmit={handleSubmit}
          className="rounded-[1.6rem] border border-slate-200/80 bg-white p-6 shadow-[0_14px_36px_rgba(15,23,42,0.05)]"
        >

          <div className="space-y-6">

            {/* HEADER */}

            <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">

              <div className="max-w-3xl">

                <h2 className="text-xl font-semibold tracking-[-0.02em] text-slate-900">

                  New Scheduled Post

                </h2>


                <p className="mt-1 text-sm leading-6 text-slate-500">

                  Plan your content across multiple platforms with AI-powered optimization.

                </p>

              </div>


              <div className="flex flex-wrap gap-3">

                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      '/schedule-posts'
                    )
                  }
                  className="inline-flex h-14 items-center gap-3 rounded-full border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >

                  <Clock3 className="h-4 w-4" />

                  Back to Queue

                </button>

              </div>

            </div>


            {/* TOPIC */}

            <Field label="Topic">

              <input
                name="topic"
                value={formState.topic}
                onChange={handleChange}
                placeholder="e.g., Product Launch Announcement"
                className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
              />

            </Field>


            {/* CAPTION */}

            <Field label="Caption">

              <textarea
                name="caption"
                value={formState.caption}
                onChange={handleChange}
                rows={5}
                placeholder="Write your post content here..."
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
              />

            </Field>


            {/* PLATFORM SELECTION */}

            <section>

              <div className="mb-3 flex items-center gap-3">

                <h3 className="text-sm font-semibold tracking-[0.04em] text-slate-900">

                  Platform Selection

                </h3>

              </div>


              <PlatformSelector
                platforms={
                  addScheduleData.platformOptions
                }
                selectedPlatforms={
                  formState.platforms
                }
                onSelect={(platforms) =>
                  setFormState(
                    (current) => ({
                      ...current,
                      platforms,
                    })
                  )
                }
              />

            </section>


            {/* STORE SELECTION */}

            <section>

              <h3 className="mb-3 text-sm font-semibold tracking-[0.04em] text-slate-900">

                Store Selection

              </h3>


              <div className="grid gap-3 sm:grid-cols-2">

                {/* ALL STORES */}

                <button
                  type="button"
                  onClick={() =>
                    handleStoreSelectionChange(
                      'all'
                    )
                  }
                  className={`rounded-2xl border px-4 py-4 text-left transition ${
                    formState.storeSelection ===
                    'all'
                      ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-100'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >

                  <div className="text-sm font-semibold text-slate-900">

                    All Stores

                  </div>


                  <div className="mt-1 text-xs text-slate-500">

                    Schedule this post for all stores

                  </div>

                </button>


                {/* SELECTED STORES */}

                <button
                  type="button"
                  onClick={() =>
                    handleStoreSelectionChange(
                      'selected'
                    )
                  }
                  className={`rounded-2xl border px-4 py-4 text-left transition ${
                    formState.storeSelection ===
                    'selected'
                      ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-100'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >

                  <div className="text-sm font-semibold text-slate-900">

                    Selected Stores

                  </div>


                  <div className="mt-1 text-xs text-slate-500">

                    Choose specific stores

                  </div>

                </button>

              </div>


              {/* STORE DROPDOWN */}

              {formState.storeSelection ===
                'selected' && (

                <div className="mt-4">

                  <label className="grid gap-2">

                    <span className="text-sm font-medium text-slate-700">

                      Select Stores

                    </span>


                    <select
                      multiple
                      value={
                        formState.selectedStores
                      }
                      onChange={
                        handleSelectedStoresChange
                      }
                      disabled={
                        loadingClients
                      }
                      className="min-h-40 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                    >

                      {clients.map(
                        (client) => {

                          const clientId =
                            client.id ??
                            client.Id


                          const clientName =
                            client.clientName ??
                            client.ClientName ??
                            `Store ${clientId}`


                          return (

                            <option
                              key={clientId}
                              value={clientId}
                            >

                              {clientName}

                            </option>

                          )

                        }
                      )}

                    </select>


                    {loadingClients && (

                      <span className="text-xs text-slate-500">

                        Loading stores...

                      </span>

                    )}


                    {!loadingClients &&
                      clients.length === 0 && (

                        <span className="text-xs text-red-500">

                          No stores found.

                        </span>

                    )}


                    {!loadingClients &&
                      clients.length > 0 && (

                        <span className="text-xs text-slate-500">

                          Hold Ctrl and select multiple stores.

                        </span>

                    )}

                  </label>

                </div>

              )}

            </section>


            {/* MEDIA */}

            <section>

              <h3 className="mb-3 text-sm font-semibold tracking-[0.04em] text-slate-900">

                Upload Media

              </h3>


              <label className="flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-[1.5rem] border-2 border-dashed border-slate-200 bg-slate-50 px-6 py-8 text-center transition hover:border-blue-300 hover:bg-blue-50/60">

                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={
                    handleMediaChange
                  }
                  className="sr-only"
                />


                <span className="grid h-14 w-14 place-items-center rounded-full bg-blue-100 text-blue-700 shadow-[0_10px_20px_rgba(37,99,235,0.12)]">

                  <CalendarDays className="h-6 w-6" />

                </span>


                <span className="mt-4 text-sm font-medium text-slate-700">

                  Click to upload or drag and drop

                </span>


                <span className="mt-1 text-xs text-slate-500">

                  PNG, JPG, MP4 or GIF (max. 50MB)

                </span>


                {mediaFile && (

                  <span className="mt-2 text-xs font-medium text-blue-600">

                    Selected: {mediaFile.name}

                  </span>

                )}

                {/* Show AI image status */}

                {!mediaFile &&
                  generatedImage && (

                    <span className="mt-2 text-xs font-medium text-emerald-600">

                      AI generated image will be scheduled automatically.

                    </span>

                  )}

              </label>

            </section>


            {/* DATE + TIME */}

            <section className="grid gap-4 md:grid-cols-2">

              <Field label="Schedule Date">

                <input
                  type="date"
                  name="scheduleDate"
                  value={
                    formState.scheduleDate
                  }
                  onChange={
                    handleChange
                  }
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                />

              </Field>


              <Field label="Schedule Time">

                <input
                  type="time"
                  name="scheduleTime"
                  value={
                    formState.scheduleTime
                  }
                  onChange={
                    handleChange
                  }
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                />

              </Field>

            </section>


            {/* APPROVAL */}

            <ToggleSwitch
              checked={
                formState.approvalRequired
              }
              onChange={(
                approvalRequired
              ) =>
                setFormState(
                  (current) => ({
                    ...current,
                    approvalRequired,
                  })
                )
              }
              label="Approval Required"
            />


            {/* BUTTONS */}

            <div className="flex flex-wrap items-center justify-end gap-3 border-t border-slate-200 pt-6">

              <button
                type="button"
                onClick={
                  handlePublish
                }
                disabled={
                  publishing
                }
                className="rounded-full bg-gradient-to-r from-emerald-600 to-green-600 px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(16,185,129,0.22)] transition hover:brightness-105 disabled:opacity-50"
              >

                {publishing
                  ? 'Publishing...'
                  : 'Publish Now'}

              </button>


              <button
                type="submit"
                className="rounded-full bg-gradient-to-r from-blue-700 to-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(37,99,235,0.28)] transition hover:brightness-105"
              >

                <Send className="mr-2 inline-block h-4 w-4" />

                Schedule Post

              </button>

            </div>

          </div>

        </form>


        <aside className="grid gap-6" />

      </section>

    </div>

  )

}


// ==================================================
// FIELD COMPONENT
// ==================================================

function Field({
  label,
  action,
  children,
}) {

  return (

    <label className="grid gap-2">

      <div className="flex items-center justify-between gap-3">

        <span className="text-sm font-semibold tracking-[0.02em] text-slate-900">

          {label}

        </span>


        {action}

      </div>


      {children}

    </label>

  )

}


export default AIGenerator
