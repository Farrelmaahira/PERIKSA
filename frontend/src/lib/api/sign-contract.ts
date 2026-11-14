import type { ApiResult } from '@/interfaces/api'
import { apiRequest } from '@/lib/api/api-request'
import type { SignContractResponse } from '@/lib/api/contracts'

type SignContractPayload = { metode?: string; referensi?: string } | FormData

/* POST /contracts/{id}/sign. Failures keep the server's own message (wrong state, not your turn, ...). */
export const signContract = (id: number | string, payload: SignContractPayload): Promise<ApiResult<SignContractResponse>> =>
  apiRequest<SignContractResponse>(`/contracts/${id}/sign`, { method: 'POST', body: payload })
