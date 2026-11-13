import { createStore } from '@/lib/store/create-store'

export const readStore = createStore<Record<string, string[]>>('periksa:notif-read', () => ({}))
