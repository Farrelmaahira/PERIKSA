import { createStore } from '@/lib/store/create-store'
import type { Db } from '@/interfaces/db'
import { seedDb } from '@/lib/db/seed-db'

export const db = createStore<Db>('periksa:db-v1', seedDb)
