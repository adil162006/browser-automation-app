import { TaskChooseOrganization } from "@clerk/nextjs"

export default function ChooseOrganizationPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <TaskChooseOrganization redirectUrlComplete="/" />
    </main>
  )
}
