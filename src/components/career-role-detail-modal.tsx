"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { ArrowForwardIcon, CloseIcon } from "@/components/icons";
import type { CareerRoleRecord } from "@/lib/careers-data";

type CareerRoleDetailModalProps = {
  role: CareerRoleRecord;
  categoryName: string;
  onClose: () => void;
};

const CLOSE_MS = 280;

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function CareerRoleDetailModal({
  role,
  categoryName,
  onClose,
}: CareerRoleDetailModalProps) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closedRef = useRef(false);
  const closeTimerRef = useRef<number>(0);
  const [entered, setEntered] = useState(false);

  function finishClose() {
    if (closedRef.current) return;
    closedRef.current = true;
    onClose();
  }

  function requestClose() {
    if (closedRef.current) return;
    if (prefersReducedMotion()) {
      finishClose();
      return;
    }
    setEntered(false);
    window.clearTimeout(closeTimerRef.current);
    closeTimerRef.current = window.setTimeout(finishClose, CLOSE_MS);
  }

  const requestCloseRef = useRef(requestClose);
  requestCloseRef.current = requestClose;

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        requestCloseRef.current();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();

    let innerFrame = 0;
    const outerFrame = requestAnimationFrame(() => {
      innerFrame = requestAnimationFrame(() => setEntered(true));
    });

    return () => {
      cancelAnimationFrame(outerFrame);
      cancelAnimationFrame(innerFrame);
      window.clearTimeout(closeTimerRef.current);
      document.body.style.overflow = previous;
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div
        className={`absolute inset-0 bg-primary/50 transition-opacity duration-300 ease-out motion-reduce:transition-none ${
          entered ? "opacity-100" : "opacity-0"
        }`}
        role="presentation"
        onClick={requestClose}
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={`relative z-10 flex max-h-[90vh] w-full max-w-2xl flex-col border border-outline-variant bg-pure-white shadow-lg outline-none transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transform-none motion-reduce:transition-none ${
          entered
            ? "translate-y-0 scale-100 opacity-100"
            : "translate-y-6 scale-[0.97] opacity-0"
        }`}
      >
        <div className="flex items-start justify-between gap-4 border-b border-outline-variant px-6 py-5">
          <div>
            <p className="mb-2 font-sans text-label-md uppercase tracking-widest text-primary-container">
              {categoryName}
            </p>
            <h2
              id={titleId}
              className="font-serif text-headline-md text-primary"
            >
              {role.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={requestClose}
            className="shrink-0 text-on-surface-variant transition-colors hover:text-primary"
            aria-label="Close"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="overflow-y-auto px-6 py-6">
          <p className="whitespace-pre-wrap font-sans text-body-md text-on-surface-variant">
            {role.description}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-3 border-t border-outline-variant px-6 py-4">
          <button
            type="button"
            onClick={requestClose}
            className="border border-outline-variant px-4 py-2 font-sans text-label-md uppercase tracking-widest text-on-surface-variant transition-colors hover:border-primary hover:text-primary"
          >
            Close
          </button>
          <Link
            href={`/careers/apply?role=${encodeURIComponent(role.id)}`}
            className="hover-btn-primary inline-flex items-center bg-primary-container px-8 py-3 font-sans text-label-md uppercase tracking-wider text-pure-white transition-all duration-300"
          >
            Apply
            <ArrowForwardIcon className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
