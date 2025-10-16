import { promises as fs } from "fs"
import path from "path"

const DATA_DIR = path.join(process.cwd(), ".data")

async function ensureDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true })
  } catch {}
}

function filePath(name: string) {
  return path.join(DATA_DIR, `${name}.json`)
}

export async function readJson<T>(name: string, fallback: T): Promise<T> {
  await ensureDir()
  try {
    const raw = await fs.readFile(filePath(name), "utf8")
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export async function writeJson<T>(name: string, data: T): Promise<void> {
  await ensureDir()
  const tmp = JSON.stringify(data, null, 2)
  await fs.writeFile(filePath(name), tmp, "utf8")
}

export async function appendJsonArray<T extends object>(name: string, item: T): Promise<T[]> {
  const list = await readJson<T[]>(name, [])
  const next = [item, ...list]
  await writeJson(name, next)
  return next
}

export async function updateJsonArray<T extends { id: string | number }>(
  name: string,
  id: string | number,
  updater: (item: T) => T,
): Promise<T[]> {
  const list = await readJson<T[]>(name, [])
  const next = list.map((x) => (x.id === id ? updater(x) : x))
  await writeJson(name, next)
  return next
}

export async function removeFromJsonArray<T extends { id: string | number }>(
  name: string,
  id: string | number,
): Promise<T[]> {
  const list = await readJson<T[]>(name, [])
  const next = list.filter((x) => x.id !== id)
  await writeJson(name, next)
  return next
}


