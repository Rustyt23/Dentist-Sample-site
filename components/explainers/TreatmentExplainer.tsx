"use client";

import dynamic from "next/dynamic";
import { Component, createContext, useCallback, useContext, useEffect, useId, useRef, useState, type ComponentType } from "react";
import { createPortal } from "react-dom";
import { Loader2, PlayCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type ExplainerKind = "implant" | "rootCanal";

type DialogContext = { kind: ExplainerKind; dialogId: string; onClose: () => void };
const LoadingContext = createContext<DialogContext | null>(null);

function FallbackSheet({ failed = false, onRetry }: { failed?: boolean; onRetry?: () => void }) {
  const context = useContext(LoadingContext);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => closeRef.current?.focus({ preventScroll: true }), []);
  if (!context) return null;

  const { kind, dialogId, onClose } = context;
  return createPortal(
    <div
      className="fixed inset-0 z-[80] flex items-end justify-center bg-navy-950/55 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={onClose}
    >
      <div
        id={dialogId}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${dialogId}-title`}
        aria-busy={!failed}
        onClick={(event) => event.stopPropagation()}
        className="relative max-h-[94svh] w-full overflow-y-auto rounded-t-[2rem] bg-white pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-lift sm:max-w-lg sm:rounded-[2rem] sm:pb-6"
      >
        <div className="mx-auto mt-2.5 h-1.5 w-10 rounded-full bg-navy-100 sm:hidden" aria-hidden />
        <div className="flex items-start justify-between gap-4 px-5 pt-4 sm:px-7 sm:pt-6">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] text-brand-600 uppercase">How it works</p>
            <h2 id={`${dialogId}-title`} className="mt-1 text-xl font-semibold tracking-tight sm:text-2xl">
              {kind === "implant" ? "How a dental implant works" : "How a root canal works"}
            </h2>
          </div>
          <button ref={closeRef} type="button" onClick={onClose} aria-label="Close" className="grid size-11 shrink-0 place-items-center rounded-full bg-mist-100 text-navy-700 transition hover:bg-mist-200">
            <X className="size-5" aria-hidden />
          </button>
        </div>
        <div className="px-5 pt-6 sm:px-7">
          <div className="flex aspect-[400/330] flex-col items-center justify-center gap-4 rounded-3xl bg-linear-to-b from-mist-50 to-mist-100 px-6 text-center text-navy-500 sm:aspect-[400/360]" role={failed ? "alert" : "status"}>
            {failed ? (
              <>
                <p className="text-sm">Your treatment guide couldn’t load. Please try again.</p>
                <button type="button" onClick={onRetry} className="inline-flex min-h-11 items-center justify-center rounded-full bg-navy-900 px-5 text-sm font-semibold text-white transition hover:bg-navy-800">
                  Try again
                </button>
              </>
            ) : (
              <>
                <Loader2 className="size-7 animate-spin text-brand-600 motion-reduce:animate-none" aria-hidden />
                <p className="text-sm">Preparing your treatment guide…</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}

function LoadingSheet() {
  return <FallbackSheet />;
}

function createSheet() {
  return dynamic<DialogContext>(() => import("./TreatmentExplainerSheet"), {
    ssr: false,
    loading: LoadingSheet,
  });
}

// React.lazy caches a rejected import. A new component lets explicit retries
// attempt the chunk again without resetting the surrounding dialog lifecycle.
class SheetBoundary extends Component<DialogContext, { failed: boolean; Sheet: ComponentType<DialogContext> }> {
  state = { failed: false, Sheet: createSheet() };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  retry = () => this.setState({ failed: false, Sheet: createSheet() });

  render() {
    if (this.state.failed) return <FallbackSheet failed onRetry={this.retry} />;
    const Sheet = this.state.Sheet;
    return <Sheet {...this.props} />;
  }
}

function warmSheet() {
  void import("./TreatmentExplainerSheet").catch(() => {});
}

type ExplainerTriggerProps = {
  kind: ExplainerKind;
  label?: string;
  tone?: "light" | "dark" | "glass";
  className?: string;
};

/** "See how it works" button that opens a step-by-step treatment explainer. */
export function ExplainerTrigger({ kind, label = "See how it works", tone = "light", className }: ExplainerTriggerProps) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dialogId = useId();
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    const trigger = buttonRef.current;
    document.body.style.overflow = "hidden";

    const focusable = () => {
      const dialog = document.getElementById(dialogId);
      return Array.from(dialog?.querySelectorAll<HTMLElement>('button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex="0"]') ?? [])
        .filter((element) => element.getClientRects().length > 0);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        close();
      }
      if (event.key !== "Tab") return;
      const items = focusable();
      const first = items[0];
      const last = items.at(-1);
      if (!first || !last) return;
      const active = document.activeElement;
      if (event.shiftKey && (active === first || !items.includes(active as HTMLElement))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (active === last || !items.includes(active as HTMLElement))) {
        event.preventDefault();
        first.focus();
      }
    };
    const containFocus = (event: FocusEvent) => {
      const dialog = document.getElementById(dialogId);
      if (dialog && event.target instanceof Node && !dialog.contains(event.target)) focusable()[0]?.focus({ preventScroll: true });
    };
    window.addEventListener("keydown", onKey, true);
    document.addEventListener("focusin", containFocus);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey, true);
      document.removeEventListener("focusin", containFocus);
      if (trigger?.isConnected) trigger.focus({ preventScroll: true });
    };
  }, [open, dialogId, close]);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        onPointerEnter={warmSheet}
        onFocus={warmSheet}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          setOpen(true);
        }}
        className={cn(
          "relative z-10 inline-flex min-h-10 items-center gap-2 rounded-full py-1.5 pr-4 pl-1.5 text-sm font-semibold transition",
          tone === "light" && "bg-white text-navy-900 ring-1 ring-navy-200 hover:ring-brand-300",
          tone === "dark" && "bg-navy-900 text-white hover:bg-navy-800",
          tone === "glass" && "bg-white/15 text-white ring-1 ring-white/30 backdrop-blur hover:bg-white/25",
          className,
        )}
      >
        <span className={cn("grid size-7 place-items-center rounded-full", tone === "light" ? "bg-brand-600 text-white" : "bg-white text-brand-700")}>
          <PlayCircle className="size-4" aria-hidden />
        </span>
        {label}
      </button>
      {open ? (
        <LoadingContext.Provider value={{ kind, dialogId, onClose: close }}>
          <SheetBoundary kind={kind} dialogId={dialogId} onClose={close} />
        </LoadingContext.Provider>
      ) : null}
    </>
  );
}
