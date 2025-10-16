export default function NotificationsPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl p-6 md:p-10">
        <header className="mb-6 flex items-center justify-between">
          <h1 className="text-pretty text-2xl font-semibold md:text-3xl">Notifications</h1>
          <a
            href="/student"
            className="text-sm text-muted-foreground hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded-md px-2 py-1"
          >
            Back to Dashboard
          </a>
        </header>
        <p className="text-muted-foreground">
          Notifications placeholder. We can show alerts about approvals, schedule changes, or room updates here.
        </p>
      </div>
    </main>
  )
}
