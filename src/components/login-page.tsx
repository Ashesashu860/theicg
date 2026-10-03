"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { VisibilityIcon, VisibilityOffIcon } from "@/components/icons";
import { SiteFooter } from "@/components/site-footer";
import {
  getAuthErrorMessage,
  signInWithEmailPassword,
} from "@/lib/auth-client";

export function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await signInWithEmailPassword(email, password);
      const next = searchParams.get("next") || "/portal/requests";
      router.replace(next.startsWith("/portal") ? next : "/portal/requests");
      router.refresh();
    } catch (err) {
      setError(getAuthErrorMessage(err));
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-off-white text-on-surface antialiased">
      <main className="relative flex flex-grow items-center justify-center pb-24 pt-36">
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
              <h1 className="mb-2 text-headline-lg-mobile text-primary md:text-headline-md">
                Admin
              </h1>
              <p className="font-sans text-body-md text-on-surface-variant">
                Sign in to access the ICG consultant portal.
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              {error ? (
                <p className="font-sans text-body-md text-error">{error}</p>
              ) : null}

              <div className="space-y-2">
                <label
                  className="block font-sans text-label-md uppercase tracking-widest text-on-surface-variant"
                  htmlFor="admin-email"
                >
                  Email
                </label>
                <input
                  id="admin-email"
                  name="email"
                  type="email"
                  autoComplete="username"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full border border-outline-variant bg-pure-white px-4 py-3 font-sans text-body-md text-on-surface outline-none transition-colors focus:border-outline"
                  disabled={submitting}
                />
              </div>

              <div className="space-y-2">
                <label
                  className="block font-sans text-label-md uppercase tracking-widest text-on-surface-variant"
                  htmlFor="admin-password"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="admin-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="w-full border border-outline-variant bg-pure-white py-3 pl-4 pr-12 font-sans text-body-md text-on-surface outline-none transition-colors focus:border-outline"
                    disabled={submitting}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-on-surface-variant transition-colors hover:text-on-surface disabled:opacity-70"
                    onClick={() => setShowPassword((visible) => !visible)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    aria-pressed={showPassword}
                    disabled={submitting}
                  >
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </button>
                </div>
              </div>

              <button
                className="btn btn-primary w-full"
                type="submit"
                disabled={submitting}
              >
                <span className="relative z-10">
                  {submitting ? "Signing In…" : "Sign In"}
                </span>
                <div className="absolute bottom-0 left-0 h-1 w-full origin-left scale-x-0 bg-secondary-fixed transition-transform duration-300 group-hover:scale-x-100" />
              </button>
            </form>

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
