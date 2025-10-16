"use client"

import Link from "next/link"

export default function HeroCover() {
  return (
    <section
      aria-label="Welcome to LearnSpace Booking & Management System"
      className="relative isolate min-h-svh w-full overflow-hidden"
    >
      {/* Background image (intentionally blurred) */}
      <img
        src="/images/campus.jpg"
        alt="College campus exterior with palm trees and blue sky"
        className="absolute inset-0 h-full w-full object-cover blur-[1.5px]"
      />

      {/* Overlay for contrast */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(120deg, color-mix(in oklch, var(--brand-primary) 22%, transparent) 0%, color-mix(in oklch, var(--brand-accent) 18%, transparent) 50%, transparent 90%), oklch(0 0 0 / 0.30)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(120% 80% at 50% 45%, transparent 45%, oklch(0 0 0 / 0.25) 100%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex min-h-svh items-center justify-center px-6 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-balance text-4xl font-semibold text-primary-foreground md:text-6xl drop-shadow-[0_4px_18px_rgba(0,0,0,0.55)]">
            Welcome to LearnSpace Booking & Management System
          </h1>

          <p className="mt-4 text-pretty text-lg text-primary-foreground/95 md:text-xl drop-shadow-[0_3px_12px_rgba(0,0,0,0.45)]">
            Your Gateway to Smart Learning and Seamless Classroom Booking
          </p>

          <p className="mt-4 text-pretty text-base text-primary-foreground/90 md:text-lg drop-shadow-[0_3px_12px_rgba(0,0,0,0.45)]">
            “Connecting Students, Faculty, and Administrators through an intelligent classroom scheduling system.”
          </p>

          <div className="mt-10 flex items-center justify-center">
            <Link
              href="/login"
              className="group relative inline-flex items-center justify-center rounded-xl px-7 py-3 text-base font-medium text-primary-foreground transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              style={{
                background: "linear-gradient(90deg, var(--brand-primary), var(--brand-accent))",
              }}
            >
              {/* Glow aura */}
              <span
                aria-hidden
                className="pointer-events-none absolute -inset-px -z-10 rounded-[14px] opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100"
                style={{
                  background:
                    "radial-gradient(60% 60% at 50% 50%, color-mix(in oklch, var(--brand-accent) 70%, transparent) 0%, transparent 70%)",
                }}
              />
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
