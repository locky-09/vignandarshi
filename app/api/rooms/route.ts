import { NextResponse } from "next/server"
import { readJson, writeJson } from "@/lib/storage"
import { prisma } from "@/lib/prisma"

type Room = {
  id: string
  name: string
  capacity: number
  facilities: string[]
  status: "free" | "reserved" | "occupied"
}

const DEFAULT_ROOMS: Room[] = [
  { id: "A-101", name: "Classroom A-101", capacity: 40, facilities: ["Projector"], status: "free" },
  { id: "B-207", name: "Lab B-207", capacity: 30, facilities: ["Computers", "WiFi"], status: "reserved" },
  { id: "H-101", name: "Seminar Hall A", capacity: 120, facilities: ["Projector", "Audio System"], status: "free" },
]

export async function GET() {
  try {
    let rooms = await prisma.room.findMany()
    if (rooms.length === 0) {
      // seed
      await prisma.room.createMany({
        data: DEFAULT_ROOMS.map((r) => ({
          id: r.id,
          name: r.name,
          capacity: r.capacity,
          facilities: r.facilities,
          status: r.status as any,
        })),
        skipDuplicates: true,
      })
      rooms = await prisma.room.findMany()
    }
    return NextResponse.json(rooms)
  } catch {
    let rooms = await readJson<Room[]>("rooms", [])
    if (rooms.length === 0) {
      rooms = DEFAULT_ROOMS
      await writeJson("rooms", rooms)
    }
    return NextResponse.json(rooms)
  }
}


