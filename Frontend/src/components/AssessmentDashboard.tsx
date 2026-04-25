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
  <img src="/src/assets/dashboard.PNG" alt="" />
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
