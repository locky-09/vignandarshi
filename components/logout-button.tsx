"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function LogoutButton({ className }: { className?: string }) {
  const router = useRouter()
  return (
    <Button
      className={className}
      variant="secondary"
      onClick={() => {
        // You can attach real auth cleanup here later.
        router.push("/login")
      }}
    >
      Logout
    </Button>
  )
}
