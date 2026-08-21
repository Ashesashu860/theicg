"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { SiteFooter } from "@/components/site-footer";
import {
  getAuthErrorMessage,
  signInWithGoogle,
} from "@/lib/auth-client";

export function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleGoogleSignIn() {
    setError("");
    setSubmitting(true);
    try {
      await signInWithGoogle();
      const next = searchParams.get("next") || "/portal/profile";
      router.replace(next.startsWith("/portal") ? next : "/portal/profile");
      router.refresh();
    } catch (err) {
      setError(getAuthErrorMessage(err));
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-off-white text-on-surface antialiased">
      <main className="relative flex flex-grow items-center justify-center pb-20 pt-20">
        <div className="absolute inset-0 z-0 opacity-10">
          <Image
            src="/images/login-bg.jpg"
            alt=""
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        </div>

        <div className="relative z-10 w-full max-w-md px-margin-mobile md:px-0">
          <div className="animate-fade-up border border-outline-variant bg-pure-white p-8 transition-all duration-300 hover:border-outline md:p-12">
            <div className="mb-10 text-center">
              <h1 className="mb-2 font-serif text-headline-lg-mobile text-primary md:text-headline-md">
                Consultant Portal
              </h1>
              <p className="font-sans text-body-md text-on-surface-variant">
                Sign in to access ICG consulting resources.
              </p>
            </div>

            <div className="space-y-6">
              {error ? (
                <p className="font-sans text-body-md text-error">{error}</p>
              ) : null}

              <button
                className="group relative flex w-full items-center justify-center gap-3 overflow-hidden bg-primary-container px-6 py-4 font-sans text-label-md uppercase tracking-widest text-pure-white transition-transform duration-200 hover:scale-[1.02] disabled:opacity-70"
                type="button"
                disabled={submitting}
                onClick={handleGoogleSignIn}
              >
                <GoogleGlyph />
                <span className="relative z-10">
                  {submitting ? "Signing In…" : "Continue with Google"}
                </span>
                <div className="absolute bottom-0 left-0 h-1 w-full origin-left scale-x-0 bg-secondary-fixed transition-transform duration-300 group-hover:scale-x-100" />
              </button>
            </div>

            <div className="mt-8 text-center">
              <p className="font-sans text-label-md text-on-surface-variant">
                Secure Access for Authorized Personnel Only.
              </p>
            </div>
          </div>
        </div>
      </main>

      <div className="relative z-10 mt-auto w-full">
        <SiteFooter />
      </div>
    </div>
  );
}

function GoogleGlyph() {
  return (
    <svg
      className="relative z-10 h-5 w-5"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        fill="#ffffff"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
      />
      <path
        fill="#ffffff"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#ffffff"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#ffffff"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}
