import { auth } from "@clerk/nextjs/server"
import { ArrowLeft, ShieldCheck } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"

import { Button } from "@/components/ui/button"

export default async function ProtectedTestPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect("/sign-in")
  }

  return (
    <main className="flex min-h-[calc(100svh-61px)] items-center justify-center p-6">
      <div className="flex w-full max-w-lg flex-col gap-6">
        <div className="flex size-12 items-center justify-center rounded-md border bg-muted">
          <ShieldCheck className="size-6" aria-hidden="true" />
        </div>
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">
            Authenticated
          </p>
          <h1 className="text-2xl font-semibold">Protected test route</h1>
          <p className="text-sm text-muted-foreground">
            Your Clerk session was verified successfully.
          </p>
        </div>
        <Button asChild variant="outline" className="w-fit">
          <Link href="/">
            <ArrowLeft />
            Back home
          </Link>
        </Button>
      </div>
    </main>
  )
}
