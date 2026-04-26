import { useEffect, useMemo, useState, type ReactNode } from "react";

import { LoaderCircle } from "lucide-react";

type IconId = "inbox" | "contacts" | "employees" | "workflows" | "campaigns";
type LoadingPhase = "idle" | "loading" | "animating" | "loaded";

type IconDefinition = {
  id: IconId;
  label: string;
  iconSvg: ReactNode;
  endpoint: string;
  destinationClass: string;
};

type DataStore = Partial<Record<IconId, unknown[]>>;
type PhaseStore = Record<IconId, LoadingPhase>;
type HoneycombSvgLayer = {
  id: "withoutHover" | "withHover";
  pathClassName: string;
  d: string;
};

const iconDefinitions: IconDefinition[] = [
  {
    id: "inbox",
    label: "Inbox",
    iconSvg: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2 18C1.45 18 0.979167 17.8042 0.5875 17.4125C0.195833 17.0208 0 16.55 0 16V2C0 1.45 0.195833 0.979167 0.5875 0.5875C0.979167 0.195833 1.45 0 2 0H16C16.55 0 17.0208 0.195833 17.4125 0.5875C17.8042 0.979167 18 1.45 18 2V16C18 16.55 17.8042 17.0208 17.4125 17.4125C17.0208 17.8042 16.55 18 16 18H2ZM2 15.0643C2 15.5811 2.41891 16 2.93567 16H15.0643C15.5811 16 16 15.5811 16 15.0643V12H13C12.5 12.6333 11.9042 13.125 11.2125 13.475C10.5208 13.825 9.78333 14 9 14C8.21667 14 7.47917 13.825 6.7875 13.475C6.09583 13.125 5.5 12.6333 5 12H2V15.0643ZM9 12C9.53333 12 10.025 11.8625 10.475 11.5875C10.925 11.3125 11.2917 10.95 11.575 10.5C11.675 10.35 11.8 10.2292 11.95 10.1375C12.1 10.0458 12.2667 10 12.45 10H16V2.93567C16 2.41892 15.5811 2 15.0643 2H2.93567C2.41892 2 2 2.41891 2 2.93567V10H5.55C5.73333 10 5.9 10.0458 6.05 10.1375C6.2 10.2292 6.325 10.35 6.425 10.5C6.70833 10.95 7.075 11.3125 7.525 11.5875C7.975 11.8625 8.46667 12 9 12Z" fill="white" fillOpacity="0.6" />
      </svg>
    ),
    endpoint: "https://dummyjson.com/comments?limit=8",
    destinationClass: "to-inbox",
  },
  {
    id: "contacts",
    label: "Contacts",
    iconSvg: (
      <svg width="20" height="15" viewBox="0 0 20 15" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M7.27275 7.2728C9.2819 7.2728 10.9091 5.6455 10.9091 3.63638C10.9091 1.62728 9.2819 0 7.27275 0C5.26366 0 3.63638 1.62728 3.63638 3.63638C3.63638 5.6455 5.26366 7.2728 7.27275 7.2728ZM7.27275 1.81819C8.2728 1.81819 9.0909 2.63637 9.0909 3.63638C9.0909 4.63638 8.2728 5.4546 7.27275 5.4546C6.27275 5.4546 5.45457 4.63638 5.45457 3.63638C5.45457 2.63637 6.27275 1.81819 7.27275 1.81819ZM16.3636 3.63638C16.3636 5.6455 14.7363 7.2728 12.7272 7.2728C12.3 7.2728 11.9 7.1818 11.5182 7.0546C12.2727 6.1182 12.7272 4.92729 12.7272 3.63638C12.7272 2.34546 12.2727 1.15455 11.5182 0.21818C11.9 0.0909102 12.3 0 12.7272 0C14.7363 0 16.3636 1.62728 16.3636 3.63638ZM16.3636 11.8182C16.3636 10.2909 15.4909 9.1455 14.2454 8.3C16.7545 8.6637 20 9.8364 20 11.8182V13.5455C20 14.0978 19.5523 14.5455 19 14.5455H17.3636C16.8113 14.5455 16.3636 14.0978 16.3636 13.5455V11.8182ZM0 11.8182C0 9.4 4.84547 8.1818 7.27275 8.1818C9.7 8.1818 14.5455 9.4 14.5455 11.8182V13.5455C14.5455 14.0978 14.0978 14.5455 13.5455 14.5455H1C0.44772 14.5455 0 14.0978 0 13.5455V11.8182ZM1.81819 11.8273V12.7273H12.7273V11.8182C12.5455 11.1728 9.7273 10 7.27275 10C4.8182 10 2.00001 11.1728 1.81819 11.8273Z" fill="#90909B" />
      </svg>
    ),
    endpoint: "https://dummyjson.com/users?limit=8",
    destinationClass: "to-contacts",
  },
  {
    id: "employees",
    label: "Employees",
    iconSvg: (
      <svg width="20" height="15" viewBox="0 0 20 15" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M7.27275 7.2728C9.2819 7.2728 10.9091 5.6455 10.9091 3.63638C10.9091 1.62728 9.2819 0 7.27275 0C5.26366 0 3.63638 1.62728 3.63638 3.63638C3.63638 5.6455 5.26366 7.2728 7.27275 7.2728ZM7.27275 1.81819C8.2728 1.81819 9.0909 2.63637 9.0909 3.63638C9.0909 4.63638 8.2728 5.4546 7.27275 5.4546C6.27275 5.4546 5.45457 4.63638 5.45457 3.63638C5.45457 2.63637 6.27275 1.81819 7.27275 1.81819ZM16.3636 3.63638C16.3636 5.6455 14.7363 7.2728 12.7272 7.2728C12.3 7.2728 11.9 7.1818 11.5182 7.0546C12.2727 6.1182 12.7272 4.92729 12.7272 3.63638C12.7272 2.34546 12.2727 1.15455 11.5182 0.21818C11.9 0.0909102 12.3 0 12.7272 0C14.7363 0 16.3636 1.62728 16.3636 3.63638ZM16.3636 11.8182C16.3636 10.2909 15.4909 9.1455 14.2454 8.3C16.7545 8.6637 20 9.8364 20 11.8182V13.5455C20 14.0978 19.5523 14.5455 19 14.5455H17.3636C16.8113 14.5455 16.3636 14.0978 16.3636 13.5455V11.8182ZM0 11.8182C0 9.4 4.84547 8.1818 7.27275 8.1818C9.7 8.1818 14.5455 9.4 14.5455 11.8182V13.5455C14.5455 14.0978 14.0978 14.5455 13.5455 14.5455H1C0.44772 14.5455 0 14.0978 0 13.5455V11.8182ZM1.81819 11.8273V12.7273H12.7273V11.8182C12.5455 11.1728 9.7273 10 7.27275 10C4.8182 10 2.00001 11.1728 1.81819 11.8273Z" fill="#90909B" />
      </svg>
    ),
    endpoint: "https://reqres.in/api/users?page=1",
    destinationClass: "to-employees",
  },
  {
    id: "workflows",
    label: "Workflows",
    iconSvg: (
      <svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M7.5 2.5C7.5 1.11929 8.61929 0 10 0H12.5C13.8807 0 15 1.11929 15 2.5V5C15 6.12346 14.2589 7.07383 13.239 7.38898C12.8432 7.51126 12.5 7.83579 12.5 8.25V9.25C12.5 9.66421 12.8358 10 13.25 10H17.5C18.8807 10 20 11.1193 20 12.5V15C21.3807 15 22.5 16.1193 22.5 17.5V20C22.5 21.3807 21.3807 22.5 20 22.5H17.5C16.1193 22.5 15 21.3807 15 20V17.5C15 16.1193 16.1193 15 17.5 15V13.25C17.5 12.8358 17.1642 12.5 16.75 12.5H5.75C5.33579 12.5 5 12.8358 5 13.25V15C6.38071 15 7.5 16.1193 7.5 17.5V20C7.5 21.3807 6.38071 22.5 5 22.5H2.5C1.11929 22.5 0 21.3807 0 20V17.5C0 16.1193 1.11929 15 2.5 15V12.5C2.5 11.1193 3.61929 10 5 10H9.25C9.66421 10 10 9.66421 10 9.25V8.25C10 7.83579 9.65676 7.51126 9.26101 7.38898C8.24105 7.07383 7.5 6.12346 7.5 5V2.5ZM12.5 3.25C12.5 2.83579 12.1642 2.5 11.75 2.5H10.75C10.3358 2.5 10 2.83579 10 3.25V4.25C10 4.66421 10.3358 5 10.75 5H11.75C12.1642 5 12.5 4.66421 12.5 4.25V3.25ZM3.25 17.5C2.83579 17.5 2.5 17.8358 2.5 18.25V19.25C2.5 19.6642 2.83579 20 3.25 20H4.25C4.66421 20 5 19.6642 5 19.25V18.25C5 17.8358 4.66421 17.5 4.25 17.5H3.25ZM18.25 17.5C17.8358 17.5 17.5 17.8358 17.5 18.25V19.25C17.5 19.6642 17.8358 20 18.25 20H19.25C19.6642 20 20 19.6642 20 19.25V18.25C20 17.8358 19.6642 17.5 19.25 17.5H18.25Z" fill="white" fillOpacity="0.6" />
      </svg>
    ),
    endpoint: "https://dummyjson.com/todos?limit=6",
    destinationClass: "to-workflows",
  },
  {
    id: "campaigns",
    label: "Campaigns",
    iconSvg: (
      <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8.33329 0C8.79353 1.58197e-07 9.16663 0.373096 9.16663 0.833333C9.16663 1.29357 8.79353 1.66667 8.33329 1.66667C7.01475 1.66667 5.726 2.05799 4.62968 2.79053C3.53341 3.52304 2.67903 4.56397 2.17444 5.78206C1.66988 7.00017 1.53721 8.34065 1.79439 9.63379C2.05163 10.927 2.68659 12.1153 3.61894 13.0477C4.55129 13.98 5.73963 14.615 7.03284 14.8722C8.32598 15.1294 9.66645 14.9967 10.8846 14.4922C12.1027 13.9876 13.1436 13.1332 13.8761 12.0369C14.6086 10.9406 15 9.65188 15 8.33333C15 7.8731 15.3731 7.5 15.8333 7.5C16.2935 7.5 16.6666 7.8731 16.6666 8.33333C16.6666 9.98151 16.1777 11.5926 15.262 12.9631C14.3463 14.3334 13.0452 15.402 11.5226 16.0327C9.99986 16.6634 8.32382 16.8279 6.70731 16.5063C5.09091 16.1848 3.60593 15.3915 2.44055 14.2261C1.27517 13.0607 0.481853 11.5757 0.160277 9.95931C-0.161266 8.3428 0.00317882 6.66676 0.63391 5.14404C1.26463 3.62139 2.33322 2.32028 3.70357 1.40462C5.07398 0.488946 6.68512 5.89868e-07 8.33329 0ZM6.95471 3.52702C7.39709 3.40017 7.85891 3.65595 7.9858 4.09831C8.11266 4.54072 7.85692 5.00254 7.41451 5.1294L7.21106 5.1945C6.74298 5.36185 6.31719 5.63203 5.96594 5.98633C5.56449 6.3913 5.27365 6.89275 5.12121 7.44222C4.9688 7.99181 4.95961 8.57199 5.09517 9.12598C5.23072 9.6797 5.50641 10.1893 5.89514 10.6063C6.28406 11.0233 6.77375 11.3341 7.31685 11.508C7.86003 11.6818 8.43929 11.7136 8.99817 11.5999C9.55695 11.4862 10.0774 11.2308 10.5094 10.8586C10.9414 10.4863 11.2706 10.0093 11.4656 9.47347C11.623 9.04109 12.1009 8.81823 12.5333 8.97542C12.9658 9.13282 13.1887 9.61069 13.0314 10.0431C12.7388 10.8469 12.2454 11.5624 11.5975 12.1208C10.9494 12.6792 10.1685 13.0627 9.3302 13.2332C8.49193 13.4038 7.62376 13.3565 6.80904 13.0957C5.99431 12.8349 5.26031 12.3688 4.67688 11.7432C4.09343 11.1175 3.67986 10.3525 3.47652 9.52148C3.27325 8.6906 3.28618 7.82135 3.51477 6.99707C3.74339 6.1727 4.18041 5.4212 4.78267 4.81364C5.38487 4.20617 6.1325 3.76285 6.95471 3.52702ZM11.8684 0.673014C12.0807 0.460722 12.3913 0.378844 12.6806 0.458984C12.9699 0.539135 13.1937 0.769135 13.2666 1.06038L13.7345 2.93213L15.6062 3.40007C15.8975 3.47288 16.1275 3.69669 16.2076 3.986C16.2878 4.27534 16.2059 4.58589 15.9936 4.79818L13.3422 7.44954C13.1633 7.62845 12.9125 7.71661 12.6611 7.6888L10.406 7.43815L8.92248 8.92253C8.59705 9.24796 8.06954 9.24796 7.7441 8.92253C7.41866 8.59709 7.41866 8.06958 7.7441 7.74414L9.22766 6.25977L8.97782 4.00635C8.94987 3.75474 9.03807 3.50339 9.21708 3.32438L11.8684 0.673014ZM10.6787 4.21875L10.8553 5.81055L12.4471 5.98714L13.7736 4.65983L12.845 4.4279C12.5466 4.35322 12.3134 4.12005 12.2387 3.82161L12.006 2.89225L10.6787 4.21875Z" fill="white" fillOpacity="0.8" />
      </svg>
    ),
    endpoint: "https://dummyjson.com/products?limit=6",
    destinationClass: "to-campaigns",
  },
];

const defaultPhases = iconDefinitions.reduce<PhaseStore>((acc, icon) => {
  acc[icon.id] = "idle";
  return acc;
}, {} as PhaseStore);

const honeycombSvgLayers: HoneycombSvgLayer[] = [
  {
    id: "withoutHover",
    pathClassName: "honeycomb-svg-base-stroke",
    d: "M45 6 Q48 6 50 7 L74 20 Q77 22 77 25 L77 65 Q77 68 74 70 L50 83 Q48 84 45 84 Q42 84 40 83 L16 70 Q13 68 13 65 L13 25 Q13 22 16 20 L40 7 Q42 6 45 6 Z",
  },
  {
    id: "withHover",
    pathClassName: "honeycomb-svg-hover-stroke",
    d: "M45 6 Q48 6 50 7 L74 20 Q77 22 77 25 L77 65 Q77 68 74 70 L50 83 Q48 84 45 84 Q42 84 40 83 L16 70 Q13 68 13 65 L13 25 Q13 22 16 20 L40 7 Q42 6 45 6 Z",
  },
];

function HoneycombIcon({
  children,
  className = "",
  svgLayers = honeycombSvgLayers,
}: {
  children: ReactNode;
  className?: string;
  svgLayers?: HoneycombSvgLayer[];
}) {
  return (
    <span className={`honeycomb-shell ${className}`.trim()}>
      <svg viewBox="0 0 90 90" className="honeycomb-svg" aria-hidden="true">
        <path
          d="M45 6 Q48 6 50 7 L74 20 Q77 22 77 25 L77 65 Q77 68 74 70 L50 83 Q48 84 45 84 Q42 84 40 83 L16 70 Q13 68 13 65 L13 25 Q13 22 16 20 L40 7 Q42 6 45 6 Z"
          className="honeycomb-svg-fill"
        />
        {svgLayers.map((layer) => (
          <path key={layer.id} d={layer.d} className={layer.pathClassName} />
        ))}
      </svg>
      <span className="honeycomb-icon">{children}</span>
    </span>
  );
}

function AssessmentDashboard({
  onOpenNextPage,
}: {
  onOpenNextPage?: () => void;
}) {
  const [dashboardReady, setDashboardReady] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState<IconId>("inbox");
  const [loadingPhases, setLoadingPhases] = useState<PhaseStore>(defaultPhases);
  const [dataByIcon, setDataByIcon] = useState<DataStore>({});
  const [errorByIcon, setErrorByIcon] = useState<Partial<Record<IconId, string>>>({});

  useEffect(() => {
    const timer = window.setTimeout(() => setDashboardReady(true), 1000);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (dashboardReady) {
      void hydrateIconData("inbox");
    }
  }, [dashboardReady]);

  const selectedData = useMemo(
    () => dataByIcon[selectedIcon] ?? [],
    [dataByIcon, selectedIcon]
  );
  const selectedPhase = loadingPhases[selectedIcon];

  async function hydrateIconData(iconId: IconId): Promise<void> {
    if (loadingPhases[iconId] !== "idle") return;

    setLoadingPhases((prev) => ({ ...prev, [iconId]: "loading" }));
    setErrorByIcon((prev) => ({ ...prev, [iconId]: undefined }));

    const target = iconDefinitions.find((item) => item.id === iconId);
    if (!target) return;

    try {
      const res = await fetch(target.endpoint, {
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Failed request");
      const json = (await res.json()) as Record<string, unknown>;
      const payload = normalizeApiPayload(iconId, json);

      setLoadingPhases((prev) => ({ ...prev, [iconId]: "animating" }));
      window.setTimeout(() => {
        setDataByIcon((prev) => ({ ...prev, [iconId]: payload }));
        setLoadingPhases((prev) => ({ ...prev, [iconId]: "loaded" }));
      }, 680);
    } catch {
      setLoadingPhases((prev) => ({ ...prev, [iconId]: "idle" }));
      setErrorByIcon((prev) => ({
        ...prev,
        [iconId]: "Could not fetch this section right now.",
      }));
    }
  }

  function onSelectIcon(iconId: IconId): void {
    setSelectedIcon(iconId);
    if (!dataByIcon[iconId]) {
      void hydrateIconData(iconId);
    }
  }

  // Mobile: show icons in a horizontal scrollable row at the bottom of the viz area
  // Desktop: keep original absolute positioning
  const mobileIconOrder: IconId[] = ["inbox", "contacts", "employees", "workflows", "campaigns"];

  const desktopPositions: Record<IconId, { x: number; y: number }> = {
    inbox: { x: 10, y: 50 },
    contacts: { x: 20, y: 70 },
    employees: { x: 82, y: 18 },
    workflows: { x: 71, y: 50 },
    campaigns: { x: 82, y: 70 },
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#070d1e] px-2 pt-2 text-white sm:px-3 sm:pt-3 lg:px-4 lg:pt-4">
      <div className="absolute inset-0 left-[30%] top-0 right-0 bottom-0" />
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <filter id="orbitLineGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1.6" result="softGlow" />
            <feMerge>
              <feMergeNode in="softGlow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <g
          filter="url(#orbitLineGlow)"
          className="origin-center [transform-box:fill-box] animate-[spin_7s_linear_infinite]"
        >
          <circle cx="180" cy="20" r="100" stroke="rgba(126, 224, 255, 0.98)" strokeWidth="1.1" strokeLinecap="round" strokeDasharray="238 26" fill="none" />
          <circle cx="180" cy="20" r="100" stroke="rgba(107, 219, 255, 0.65)" strokeWidth="2" strokeLinecap="round" strokeDasharray="238 26" fill="none" />
        </g>
        <g
          filter="url(#orbitLineGlow)"
          className="origin-center [transform-box:fill-box] animate-[spin_7s_linear_infinite]"
        >
          <circle cx="-80" cy="100" r="100" stroke="rgba(126, 224, 255, 0.98)" strokeWidth="1.1" strokeLinecap="round" strokeDasharray="238 26" fill="none" />
          <circle cx="-80" cy="100" r="100" stroke="rgba(107, 219, 255, 0.65)" strokeWidth="2" strokeLinecap="round" strokeDasharray="238 26" fill="none" />
        </g>
      </svg>

      <section className="relative mx-auto flex min-h-screen w-full max-w-[1680px] flex-col overflow-hidden rounded-[14px] sm:rounded-[22px] border border-blue-100/20 bg-white/[0.03] px-3 pb-3 pt-5 sm:px-6 sm:pb-6 sm:pt-8 lg:px-12 backdrop-blur-md">
        <div className="pointer-events-none absolute inset-0 rounded-[14px] sm:rounded-[22px] shadow-[inset_0_0_0_1px_rgba(125,182,255,0.15)]" />

        {/* ── Visualization area ── */}
        <div className="relative w-full" style={{ height: "clamp(200px, 45vw, 440px)" }}>
          {/* Radial glow behind centre */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[200px] w-[200px] sm:h-[290px] sm:w-[290px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(78,140,255,0.2)_0%,rgba(54,119,255,0.12)_35%,transparent_68%)] blur-[6px]" />
          <img
            src="/src/public/image.gif"
            alt="Animated ring"
            className="pointer-events-none absolute left-1/2 top-1/2 h-[200px] w-[200px] sm:h-[290px] sm:w-[290px] -translate-x-1/2 -translate-y-1/2 object-contain mix-blend-screen opacity-68 [filter:brightness(2.35)_contrast(2.05)_saturate(1.45)] [clip-path:circle(37%_at_50%_50%)]"
          />

          {/* Centre sparkle icon — hidden on very small screens to reduce clutter */}
          <div className="honeycomb hidden sm:block" style={{ left: "18%", top: "18%" }}>
            <HoneycombIcon>
              <svg width="22" height="25" viewBox="0 0 22 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.5168 13.4628C15.9227 13.3178 16.1953 12.9302 16.1953 12.4993C16.1953 12.0684 15.9227 11.6808 15.5185 11.5358L13.6598 10.8657C12.7556 10.5413 11.9344 10.0208 11.2551 9.34146C10.5758 8.66216 10.0552 7.84092 9.73083 6.93668L9.06072 5.07802C8.98901 4.88029 8.85831 4.70934 8.68629 4.58829C8.51427 4.46725 8.30922 4.40196 8.09888 4.40124C7.66881 4.40124 7.28125 4.67296 7.13455 5.07802L6.46527 6.93668C6.14094 7.84109 5.62034 8.66247 4.94087 9.34179C4.2614 10.0211 3.43992 10.5415 2.53543 10.8657L0.678449 11.5358C0.272547 11.6817 0 12.0684 0 12.4993C0 12.9302 0.272547 13.3169 0.676783 13.4628L2.53543 14.1329C3.43974 14.4572 4.26103 14.9777 4.94034 15.657C5.61966 16.3363 6.14014 17.1576 6.46444 18.0619L7.13455 19.9214C7.28041 20.3256 7.66798 20.5973 8.09805 20.5973C8.52812 20.5973 8.91569 20.3248 9.06072 19.9206L9.73083 18.0619C10.0552 17.1577 10.5758 16.3364 11.2551 15.6571C11.9344 14.9778 12.7556 14.4573 13.6598 14.1329L15.5168 13.4628ZM12.6563 5.38391L13.5973 5.72313C13.9982 5.86698 14.3623 6.09776 14.6635 6.39894C14.9647 6.70011 15.1954 7.0642 15.3393 7.4651L15.6777 8.40526C15.8102 8.77366 16.1619 9.0212 16.5528 9.0212C16.9437 9.0212 17.2963 8.77366 17.428 8.40609L17.7672 7.4651C17.9109 7.06412 18.1416 6.69994 18.4428 6.39875C18.744 6.09756 19.1082 5.86682 19.5092 5.72313L20.451 5.38391C20.8169 5.25139 21.0644 4.90049 21.0653 4.51126C21.0661 4.12203 20.8211 3.76947 20.451 3.63444L19.5092 3.29522C19.1083 3.15127 18.7443 2.92045 18.4431 2.61929C18.142 2.31814 17.9111 1.9541 17.7672 1.55326L17.428 0.612261C17.3626 0.432802 17.2436 0.277798 17.0871 0.168273C16.9306 0.0587468 16.7442 0 16.5532 0C16.3622 0 16.1759 0.0587468 16.0194 0.168273C15.8629 0.277798 15.7439 0.432802 15.6785 0.612261L15.3393 1.55326C15.1954 1.95415 14.9647 2.31825 14.6635 2.61942C14.3623 2.92059 13.9982 3.15138 13.5973 3.29522L12.6538 3.63528C12.2871 3.76863 12.0404 4.12119 12.0412 4.51126C12.0421 4.90133 12.2896 5.25222 12.6563 5.38391ZM20.4502 19.6147L19.5092 19.2754C19.1083 19.1315 18.7443 18.9007 18.4431 18.5995C18.142 18.2984 17.9111 17.9343 17.7672 17.5335L17.428 16.5925C17.3624 16.4131 17.2433 16.2582 17.0867 16.1488C16.9302 16.0394 16.7438 15.9807 16.5528 15.9807C16.3618 15.9807 16.1755 16.0394 16.0189 16.1488C15.8624 16.2582 15.7433 16.4131 15.6777 16.5925L15.3385 17.5335C15.1948 17.9345 14.964 18.2986 14.6628 18.5998C14.3617 18.901 13.9975 19.1318 13.5965 19.2754L12.6563 19.6138C12.2888 19.7455 12.0412 20.0973 12.0404 20.4873C12.0396 20.8774 12.2854 21.23 12.6555 21.3641L13.5965 21.7034C13.9975 21.847 14.3618 22.0776 14.663 22.3789C14.9642 22.6801 15.1949 23.0443 15.3385 23.4453L15.6768 24.3855C15.742 24.5655 15.861 24.721 16.0177 24.8309C16.1744 24.9409 16.3611 24.9999 16.5525 25C16.7439 25.0001 16.9307 24.9412 17.0875 24.8314C17.2443 24.7216 17.3635 24.5662 17.4288 24.3863L17.768 23.4453C17.912 23.0445 18.1428 22.6804 18.444 22.3793C18.7451 22.0781 19.1092 21.8473 19.51 21.7034L20.4552 21.3633C20.8211 21.2291 21.0669 20.8774 21.0661 20.4873C21.0653 20.0973 20.8169 19.7472 20.4502 19.6147Z" fill="#90909B" />
              </svg>
            </HoneycombIcon>
          </div>

          {/* ── Desktop honeycomb icons (absolute positioned) ── */}
          {iconDefinitions.map((item) => {
            const phase = loadingPhases[item.id];
            const pos = desktopPositions[item.id];
            const baseClass = `honeycomb hidden sm:block ${phase === "animating" ? item.destinationClass : ""}`;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectIcon(item.id)}
                className={baseClass}
                style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              >
                <HoneycombIcon>
                  {phase === "loading" ? (
                    <LoaderCircle className="h-5 w-5 animate-spin" />
                  ) : (
                    item.iconSvg
                  )}
                </HoneycombIcon>
              </button>
            );
          })}

          {/* Heading overlaid on viz */}
          <div className="pointer-events-none absolute inset-x-0 top-[90%] sm:top-[84%] -translate-y-1/2 px-4">
            <h1 className="text-center text-[22px] sm:text-[32px] md:text-[46px] font-semibold tracking-[-0.04em] text-white/95 leading-tight">
              Extracting Information...
            </h1>
            <p className="mx-auto mt-1 sm:mt-3 max-w-[260px] sm:max-w-[320px] md:max-w-[560px] text-center text-[11px] sm:text-[12px] md:text-[13px] leading-[1.35] text-blue-100/80">
              We are extracting information from the above honey combs to your system
            </p>
          </div>
        </div>

        {/* ── Mobile icon row (visible only on small screens) ── */}
        <div className="flex sm:hidden items-center justify-center gap-3 py-4">
          {mobileIconOrder.map((iconId) => {
            const item = iconDefinitions.find((d) => d.id === iconId)!;
            const phase = loadingPhases[item.id];
            const isSelected = selectedIcon === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectIcon(item.id)}
                className={`flex flex-col items-center gap-1 focus:outline-none`}
                aria-label={item.label}
              >
                {/* Mini hexagon wrapper */}
                <span
                  className={`relative flex h-11 w-11 items-center justify-center rounded-[10px] border transition-all duration-200 ${
                    isSelected
                      ? "border-blue-400/60 bg-blue-500/20 shadow-[0_0_12px_rgba(96,165,250,0.4)]"
                      : "border-blue-100/20 bg-white/[0.06]"
                  }`}
                >
                  {phase === "loading" ? (
                    <LoaderCircle className="h-4 w-4 animate-spin text-white/70" />
                  ) : (
                    <span className="scale-75">{item.iconSvg}</span>
                  )}
                </span>
                <span
                  className={`text-[9px] font-medium tracking-wide transition-colors ${
                    isSelected ? "text-blue-300" : "text-white/40"
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── Bottom panel ── */}
        <button
          type="button"
          onClick={onOpenNextPage}
          className="mt-2 sm:mt-5 flex-1 rounded-xl sm:rounded-2xl border border-blue-100/20 bg-white/95 p-3 sm:p-4 text-left text-slate-800 shadow-2xl shadow-blue-950/30 transition hover:scale-[1.01] hover:border-blue-300/40 active:scale-[0.99]"
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
  );
}

function SkeletonPanel() {
  return (
    <div className="space-y-2 animate-pulse">
      <div className="h-9 w-full rounded-md bg-slate-200" />
      <div className="grid h-[200px] sm:h-[360px] grid-cols-[14%_21%_43%_22%] gap-0 overflow-hidden rounded-md border border-slate-200">
        <div className="border-r border-slate-200 bg-slate-100" />
        <div className="border-r border-slate-200 bg-slate-100" />
        <div className="border-r border-slate-200 bg-slate-100" />
        <div className="bg-slate-100" />
      </div>
    </div>
  );
}

function LivePanel({
  selectedIcon,
  selectedPhase,
  selectedData,
  error,
}: {
  selectedIcon: IconId;
  selectedPhase: LoadingPhase;
  selectedData: unknown[];
  error?: string;
}) {
  return (
    <div className="h-full">
      <img src="/src/assets/dashboard.PNG" alt="" className="w-full h-auto object-contain" />
    </div>
  );
}

function normalizeApiPayload(
  iconId: IconId,
  payload: Record<string, unknown>
): unknown[] {
  if (Array.isArray(payload.data)) return payload.data;
  if (Array.isArray(payload.users)) return payload.users;
  if (Array.isArray(payload.comments)) return payload.comments;
  if (Array.isArray(payload.todos)) return payload.todos;
  if (Array.isArray(payload.products)) return payload.products;
  if (Array.isArray(payload.posts)) return payload.posts;
  if (iconId === "workflows" && Array.isArray(payload.todos)) return payload.todos;
  return [];
}

export default AssessmentDashboard;