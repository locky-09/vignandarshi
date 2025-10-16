import type { Metadata } from "next"
import { cn } from "@/lib/utils"
import { LoginForm } from "@/components/login-form"

export const metadata: Metadata = {
  title: "Login — LearnSpace",
  description: "Sign in to LearnSpace Booking & Management System",
}

export default function LoginPage() {
  return (
    <main className={cn("relative min-h-svh overflow-hidden bg-background text-foreground")}>
      <section className="relative z-10 mx-auto flex min-h-svh w-full max-w-md items-center justify-center p-6">
        <div className="w-full">
          <div className="mb-8 text-center">
            <h1 className="text-balance text-3xl font-semibold md:text-4xl animate-in fade-in-0 zoom-in-95 duration-700">
              Sign in to LearnSpace
            </h1>
            <p className="mt-2 text-muted-foreground animate-in fade-in-0 slide-in-from-bottom-2 duration-700 delay-150">
              Welcome back. Choose your role and enter your credentials.
            </p>
          </div>
          <LoginForm />
        </div>
      </section>
    </main>
  )
}
