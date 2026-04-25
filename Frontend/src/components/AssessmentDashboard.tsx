import { useEffect, useMemo, useState } from 'react'
import {
  ChevronDown,
  CircleUserRound,
  CircleDollarSign,
  ContactRound,
  Cog,
  Crown,
  Inbox,
  LoaderCircle,
  MessageSquareText,
  PanelLeft,
  Search,
  SlidersHorizontal,
  Sparkles,
  SquarePen,
  User,
  UserRound,
  Users,
  Workflow,
} from 'lucide-react'

type IconId = 'inbox' | 'contacts' | 'employees' | 'workflows' | 'campaigns'
type LoadingPhase = 'idle' | 'loading' | 'animating' | 'loaded'

type IconDefinition = {
  id: IconId
  label: string
  Icon: typeof Inbox
  endpoint: string
  destinationClass: string
}

type DataStore = Partial<Record<IconId, unknown[]>>
type PhaseStore = Record<IconId, LoadingPhase>

const iconDefinitions: IconDefinition[] = [
  {
    id: 'inbox',
    label: 'Inbox',
    Icon: Inbox,
    endpoint: 'https://dummyjson.com/comments?limit=8',
    destinationClass: 'to-inbox',
  },
  {
    id: 'contacts',
    label: 'Contacts',
    Icon: ContactRound,
    endpoint: 'https://dummyjson.com/users?limit=8',
    destinationClass: 'to-contacts',
  },
  {
    id: 'employees',
    label: 'Employees',
    Icon: UserRound,
    endpoint: 'https://reqres.in/api/users?page=1',
    destinationClass: 'to-employees',
  },
  {
    id: 'workflows',
    label: 'Workflows',
    Icon: Workflow,
    endpoint: 'https://dummyjson.com/todos?limit=6',
    destinationClass: 'to-workflows',
  },
  {
    id: 'campaigns',
    label: 'Campaigns',
    Icon: CircleDollarSign,
    endpoint: 'https://dummyjson.com/products?limit=6',
    destinationClass: 'to-campaigns',
  },
]

const defaultPhases = iconDefinitions.reduce<PhaseStore>((acc, icon) => {
  acc[icon.id] = 'idle'
  return acc
}, {} as PhaseStore)

function AssessmentDashboard({ onOpenNextPage }: { onOpenNextPage?: () => void }) {
  const [dashboardReady, setDashboardReady] = useState(false)
  const [selectedIcon, setSelectedIcon] = useState<IconId>('inbox')
  const [loadingPhases, setLoadingPhases] = useState<PhaseStore>(defaultPhases)
  const [dataByIcon, setDataByIcon] = useState<DataStore>({})
  const [errorByIcon, setErrorByIcon] = useState<Partial<Record<IconId, string>>>({})

  useEffect(() => {
    const timer = window.setTimeout(() => setDashboardReady(true), 1000)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (dashboardReady) {
      void hydrateIconData('inbox')
    }
  }, [dashboardReady])

  const selectedData = useMemo(() => dataByIcon[selectedIcon] ?? [], [dataByIcon, selectedIcon])
  const selectedPhase = loadingPhases[selectedIcon]

  async function hydrateIconData(iconId: IconId): Promise<void> {
    if (loadingPhases[iconId] !== 'idle') return

    setLoadingPhases((prev) => ({ ...prev, [iconId]: 'loading' }))
    setErrorByIcon((prev) => ({ ...prev, [iconId]: undefined }))

    const target = iconDefinitions.find((item) => item.id === iconId)
    if (!target) return

    try {
      const res = await fetch(target.endpoint, { headers: { 'Content-Type': 'application/json' } })
      if (!res.ok) throw new Error('Failed request')
      const json = (await res.json()) as Record<string, unknown>
      const payload = normalizeApiPayload(iconId, json)

      setLoadingPhases((prev) => ({ ...prev, [iconId]: 'animating' }))
      window.setTimeout(() => {
        setDataByIcon((prev) => ({ ...prev, [iconId]: payload }))
        setLoadingPhases((prev) => ({ ...prev, [iconId]: 'loaded' }))
      }, 680)
    } catch {
      setLoadingPhases((prev) => ({ ...prev, [iconId]: 'idle' }))
      setErrorByIcon((prev) => ({ ...prev, [iconId]: 'Could not fetch this section right now.' }))
    }
  }

  function onSelectIcon(iconId: IconId): void {
    setSelectedIcon(iconId)
    if (!dataByIcon[iconId]) {
      void hydrateIconData(iconId)
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#070d1e] px-3 pt-3 text-white lg:px-4 lg:pt-4">
      <div className="absolute inset-0 bg-[linear-gradient(110deg,#060912_0%,#0a1430_32%,#0e2d72_58%,#0a5bcf_74%,#0a2f75_92%,#081124_100%)]" />
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M110 -5 C 90 20, 76 44, 87 62 C 97 78, 93 95, 84 112"
          stroke="rgba(94, 187, 255, 0.85)"
          strokeWidth="0.28"
          fill="none"
        />
      </svg>
      <div className="pointer-events-none absolute inset-y-0 right-[11%] w-[230px] bg-[radial-gradient(ellipse_at_center,rgba(90,197,255,0.62)_0%,rgba(58,145,255,0.34)_45%,transparent_78%)] blur-[10px]" />

      <section className="relative mx-auto flex min-h-screen w-full max-w-[1680px] flex-col overflow-hidden rounded-[22px] border border-blue-100/20 bg-white/[0.03] px-6 pb-6 pt-8 backdrop-blur-md lg:px-12">
        <div className="pointer-events-none absolute inset-0 rounded-[22px] shadow-[inset_0_0_0_1px_rgba(125,182,255,0.15)]" />

        <div className="relative h-[340px] w-full">
          <div className="pointer-events-none absolute left-1/2 top-[30%] h-[210px] w-[210px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(78,140,255,0.2)_0%,rgba(54,119,255,0.12)_35%,transparent_68%)] blur-[6px]" />
          <img
            src="/src/public/image.gif"
            alt="Animated ring"
            className="pointer-events-none absolute left-1/2 top-[30%] h-[210px] w-[210px] -translate-x-1/2 -translate-y-1/2 object-contain mix-blend-screen opacity-68 [filter:brightness(2.35)_contrast(2.05)_saturate(1.45)] [clip-path:circle(37%_at_50%_50%)]"
          />
          <div className="honeycomb pointer-events-none" style={{ left: '18%', top: '18%' }}>
            <span className="flex h-full w-full items-center justify-center rounded-[17px] border border-blue-100/15 bg-[#0b1229]/55">
              <Sparkles className="h-4 w-4 text-blue-50/90" />
            </span>
          </div>
          {iconDefinitions.map((item) => {
            const isSelected = selectedIcon === item.id
            const phase = loadingPhases[item.id]
            const positions: Record<IconId, { x: number; y: number }> = {
              inbox: { x: 10, y: 50 },
              contacts: { x: 20, y: 70 },
              employees: { x: 82, y: 18 },
              workflows: { x: 71, y: 50 },
              campaigns: { x: 82, y: 70 },
            }
            const selectedPosition = positions[item.id]
            const baseClass = `honeycomb ${phase === 'animating' ? item.destinationClass : ''}`
            const IconComp = item.Icon

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectIcon(item.id)}
                className={baseClass}
                style={{ left: `${selectedPosition.x}%`, top: `${selectedPosition.y}%` }}
              >
                <span
                  className={[
                    'flex h-full w-full items-center justify-center rounded-[17px] border backdrop-blur-sm transition duration-300',
                    isSelected
                      ? 'border-blue-200/70 bg-gradient-to-br from-[#5bc1ff]/75 via-[#2f7eff]/65 to-[#1844bf]/80 shadow-[0_0_24px_rgba(63,155,255,0.55)]'
                      : 'border-blue-100/15 bg-[#0b1229]/55 hover:scale-[1.05] hover:border-blue-200/45 hover:bg-[#102756]/60',
                  ].join(' ')}
                >
                  {phase === 'loading' ? (
                    <LoaderCircle className="h-5 w-5 animate-spin text-blue-50" />
                  ) : (
                    <IconComp className="h-5 w-5 text-blue-50" />
                  )}
                </span>
              </button>
            )
          })}

          <div className="absolute inset-x-0 top-[60%]">
            <h1 className="text-center text-[46px] font-semibold tracking-[-0.04em] text-white/95">Extracting Information...</h1>
            <p className="mx-auto mt-3 max-w-[560px] text-center text-[13px] leading-[1.35] text-blue-100/80">
              We are extracting information from the above honey combs to your system
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenNextPage}
          className="mt-5 flex-1 rounded-2xl border border-blue-100/20 bg-white/95 p-4 text-left text-slate-800 shadow-2xl shadow-blue-950/30 transition hover:scale-[1.01] hover:border-blue-300/40"
        >
          {!dashboardReady ? (
            <SkeletonPanel />
          ) : (
            <LivePanel
              selectedIcon={selectedIcon}
              selectedPhase={selectedPhase}
              selectedData={selectedData}
              error={errorByIcon[selectedIcon]}
            />
          )}
        </button>
      </section>
    </main>
  )
}

function SkeletonPanel() {
  return (
    <div className="space-y-2 animate-pulse">
      <div className="h-9 w-full rounded-md bg-slate-200" />
      <div className="grid h-[360px] grid-cols-[14%_21%_43%_22%] gap-0 overflow-hidden rounded-md border border-slate-200">
        <div className="border-r border-slate-200 bg-slate-100" />
        <div className="border-r border-slate-200 bg-slate-100" />
        <div className="border-r border-slate-200 bg-slate-100" />
        <div className="bg-slate-100" />
      </div>
    </div>
  )
}

function LivePanel({
  selectedIcon,
  selectedPhase,
  selectedData,
  error,
}: {
  selectedIcon: IconId
  selectedPhase: LoadingPhase
  selectedData: unknown[]
  error?: string
}) {
  return (
    <div className="h-full">
      <header className="flex h-[38px] items-center justify-between rounded-t-md border border-slate-200 bg-[#fbfbfc] px-3">
        <div className="flex items-center gap-2.5 text-[10px] font-semibold text-slate-600">
          <span className="mr-2 text-[17px] font-bold tracking-[-0.02em] text-[#2a86e6]">BOXpad</span>
          {iconDefinitions.map((item) => (
            <span
              key={item.id}
              className={[
                'inline-flex items-center gap-1 rounded-[3px] px-1.5 py-1 leading-none',
                selectedIcon === item.id
                  ? 'border border-slate-200 bg-white text-slate-900 shadow-[0_1px_0_rgba(0,0,0,0.03)]'
                  : 'text-slate-600',
              ].join(' ')}
            >
              {item.id === 'inbox' ? (
                <MessageSquareText className="h-[11px] w-[11px]" />
              ) : item.id === 'contacts' ? (
                <ContactRound className="h-[11px] w-[11px]" />
              ) : item.id === 'employees' ? (
                <UserRound className="h-[11px] w-[11px]" />
              ) : item.id === 'workflows' ? (
                <Workflow className="h-[11px] w-[11px]" />
              ) : (
                <CircleDollarSign className="h-[11px] w-[11px]" />
              )}
              {item.label}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-2 text-[10px] font-semibold text-slate-700">
          <Cog className="h-3 w-3 text-slate-400" />
          <span className="inline-flex h-[15px] w-[15px] items-center justify-center rounded-full bg-pink-500 text-[8px] text-white">
            M
          </span>
          <span className="inline-flex items-center gap-1 text-[10px]">
            Michael Johnson
            <Crown className="h-[10px] w-[10px] text-slate-400" />
          </span>
        </div>
      </header>

      <div className="grid h-[360px] grid-cols-[14%_21%_43%_22%] overflow-hidden rounded-b-md border-x border-b border-slate-200">
        <aside className="border-r border-slate-200 bg-[#f8f8f9] px-3 py-2.5">
          <p className="text-[17px] font-semibold text-[#1f1f24]">Inbox</p>

          <div className="mt-4 space-y-2 text-[11px]">
            <div className="flex items-center gap-2 text-[#15181f]">
              <User className="h-3.5 w-3.5" />
              <span className="font-medium">My Inbox</span>
            </div>
            <div className="flex items-center justify-between text-[#3f434d]">
              <span className="inline-flex items-center gap-2">
                <Users className="h-3.5 w-3.5" />
                All
              </span>
              <span>28</span>
            </div>
            <div className="flex items-center justify-between text-[#3f434d]">
              <span className="inline-flex items-center gap-2">
                <CircleUserRound className="h-3.5 w-3.5" />
                Unassigned
              </span>
              <span>5</span>
            </div>
          </div>

          <div className="mt-4 text-[12px] font-semibold text-[#2b2f37]">Teams</div>
          <div className="mt-3 space-y-2 text-[11px] text-[#3f434d]">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-2">
                <CircleDollarSign className="h-3.5 w-3.5 text-slate-400" />
                Sales
              </span>
              <span>7</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-2">
                <ContactRound className="h-3.5 w-3.5 text-slate-400" />
                Customer Support
              </span>
              <span>16</span>
            </div>
          </div>

          <div className="mt-4 text-[12px] font-semibold text-[#2b2f37]">Users</div>
        </aside>

        <section className="border-r border-slate-200 bg-white p-0">
          <div className="flex h-10 items-center justify-between border-b border-slate-200 px-3">
            <p className="inline-flex items-center gap-2 text-[14px] font-semibold text-[#22252c]">
              <PanelLeft className="h-3.5 w-3.5" />
              Michael Johnson
            </p>
            <SquarePen className="h-3.5 w-3.5 text-slate-500" />
          </div>

          <div className="flex h-10 items-center justify-between border-b border-slate-200 px-3 text-[11px] text-slate-500">
            <span className="inline-flex items-center gap-2">
              <Search className="h-3.5 w-3.5" />
              Search Chat
            </span>
            <SlidersHorizontal className="h-3.5 w-3.5 text-slate-600" />
          </div>

          <div className="flex h-8 items-center justify-between border-b border-slate-200 px-3 text-[11px] font-semibold text-[#2f323a]">
            <span className="inline-flex items-center gap-1">Open <ChevronDown className="h-3 w-3" /></span>
            <span className="inline-flex items-center gap-1">Newest <ChevronDown className="h-3 w-3" /></span>
          </div>

          <div className="px-0">
            {selectedPhase === 'loading' ? (
              <div className="space-y-2 p-2">
                {[...Array.from({ length: 5 })].map((_, idx) => (
                  <div key={`loading-chat-${idx}`} className="h-10 animate-pulse rounded-md bg-slate-100" />
                ))}
              </div>
            ) : (
              <ul>
                {selectedData.slice(0, 5).map((item, idx) => {
                  const name = pickDisplayText(item as Record<string, unknown>, 'name')
                  const preview = pickDisplayText(item as Record<string, unknown>, 'body')
                  const colors = ['#9b8cff', '#f2cf61', '#8eb7ff', '#a0d5ff', '#f6a7d8']
                  return (
                    <li
                      key={`${name}-${idx}`}
                      className="flex items-center gap-2 border-b border-slate-100 px-3 py-2 animate-[populate_420ms_ease_forwards] opacity-0"
                      style={{ animationDelay: `${idx * 90}ms` }}
                    >
                      <span
                        className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[9px] font-bold text-slate-700"
                        style={{ backgroundColor: colors[idx % colors.length] }}
                      >
                        {name.charAt(0)}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[11px] font-semibold text-slate-700">{name}</span>
                        <span className="block truncate text-[11px] text-slate-500">{preview}</span>
                      </span>
                      <span className="text-[9px] font-medium text-slate-500">{`${23 - idx}:${idx}3`}</span>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        </section>

        <section className="border-r border-slate-200 bg-[#fcfcfd]">
          <div className="flex h-10 items-center justify-between border-b border-slate-200 px-3">
            <p className="text-[18px] font-semibold text-[#20242c]">Olivia Mckinsey</p>
            <div className="flex items-center gap-1.5">
              <button className="rounded bg-[#ececec] p-1 text-slate-600">
                <SlidersHorizontal className="h-3 w-3" />
              </button>
              <button className="rounded bg-[#ececec] p-1 text-slate-600">
                <MessageSquareText className="h-3 w-3" />
              </button>
              <button className="rounded bg-black p-1 text-white">
                <SquarePen className="h-3 w-3" />
              </button>
            </div>
          </div>

          <div className="flex h-[320px] flex-col bg-[#f7f7f8] p-2">
            <div className="mx-auto mb-2 rounded-md bg-[#d9dcdf] px-2 py-1 text-[9px] font-semibold text-slate-700">
              28 August 2025
            </div>

            {selectedPhase === 'loading' ? (
              <div className="space-y-2">
                {[...Array.from({ length: 4 })].map((_, idx) => (
                  <div key={`conv-loading-${idx}`} className="h-12 animate-pulse rounded-md bg-slate-200" />
                ))}
              </div>
            ) : error ? (
              <p className="rounded-md bg-rose-50 p-2 text-xs text-rose-700">{error}</p>
            ) : (
              <>
                <div className="mb-3 max-w-[230px] rounded-md bg-white p-2 text-[11px] text-slate-700 shadow-[0_1px_0_rgba(0,0,0,0.03)]">
                  <p>{pickDisplayText((selectedData[0] as Record<string, unknown>) ?? {}, 'body')}</p>
                </div>

                <div className="mb-3 ml-auto max-w-[255px] rounded-md bg-[#dcd3ff] p-2 text-[11px] text-slate-700 shadow-[0_1px_0_rgba(0,0,0,0.03)]">
                  <p>
                    Hello Olivia 👋 I'm Michael, your AI customer support assistant. Let's fix this quickly.
                    Could you confirm the email address?
                  </p>
                </div>

                <div className="mb-3 max-w-[200px] rounded-md bg-white p-2 text-[11px] text-slate-700 shadow-[0_1px_0_rgba(0,0,0,0.03)]">
                  <p>Yes, it's olivia.Mckinsey@gmail.com</p>
                </div>

                <div className="ml-auto max-w-[190px] rounded-md bg-[#e5d8ff] p-2 text-[11px] text-slate-700 shadow-[0_1px_0_rgba(0,0,0,0.03)]">
                  <p>Thanks! Looks like your reset wasn't completed.</p>
                </div>
              </>
            )}
          </div>
        </section>

        <aside className="bg-[#fcfcfd]">
          <div className="flex h-10 items-center justify-between border-b border-slate-200 px-3">
            <p className="text-[18px] font-semibold text-[#20242c]">Details</p>
            <PanelLeft className="h-3.5 w-3.5 text-slate-600" />
          </div>

          <div className="p-3">
            <div className="flex items-center justify-between text-[12px] font-semibold text-[#2d313a]">
              <span>Chat Data</span>
              <ChevronDown className="h-3 w-3" />
            </div>

            <div className="mt-4 space-y-3 text-[11px]">
              <div className="grid grid-cols-[40%_60%] text-slate-400">
                <span>Assignee</span>
                <span className="inline-flex items-center gap-2 font-semibold text-slate-700">
                  <CircleUserRound className="h-3.5 w-3.5" /> James West
                </span>
              </div>
              <div className="grid grid-cols-[40%_60%] text-slate-400">
                <span>Team</span>
                <span className="inline-flex items-center gap-2 font-semibold text-slate-700">
                  <Users className="h-3.5 w-3.5" /> Sales Team
                </span>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between text-[12px] font-semibold text-[#2d313a]">
              <span>Contact Data</span>
              <ChevronDown className="h-3 w-3" />
            </div>

            <div className="mt-4 space-y-3 text-[11px]">
              <div className="grid grid-cols-[40%_60%] text-slate-400">
                <span>First Name</span>
                <span className="font-semibold text-slate-700">Olivia</span>
              </div>
              <div className="grid grid-cols-[40%_60%] text-slate-400">
                <span>Last Name</span>
                <span className="font-semibold text-slate-700">Mckinsey</span>
              </div>
              <div className="grid grid-cols-[40%_60%] text-slate-400">
                <span>Phone number</span>
                <span className="font-semibold text-slate-700">+1 (312) 555-0134</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

function pickDisplayText(item: Record<string, unknown>, preferredField: string): string {
  const direct = item[preferredField]
  if (typeof direct === 'string') return direct

  const fallbackFields = ['name', 'title', 'email', 'body', 'firstName']
  for (const key of fallbackFields) {
    const value = item[key]
    if (typeof value === 'string') return value
  }
  return 'Loaded record'
}

function normalizeApiPayload(iconId: IconId, payload: Record<string, unknown>): unknown[] {
  if (Array.isArray(payload.data)) return payload.data
  if (Array.isArray(payload.users)) return payload.users
  if (Array.isArray(payload.comments)) return payload.comments
  if (Array.isArray(payload.todos)) return payload.todos
  if (Array.isArray(payload.products)) return payload.products
  if (Array.isArray(payload.posts)) return payload.posts
  if (iconId === 'workflows' && Array.isArray(payload.todos)) return payload.todos
  return []
}

export default AssessmentDashboard
