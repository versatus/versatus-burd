import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'
import process from 'process'
import { LASR_RPC_URL } from '@/lib/consts'

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: { address: string }
  }
) {
  if (!LASR_RPC_URL) {
    return NextResponse.json({ error: 'lasr rpc url missing' }, { status: 404 })
  }

  const response = await axios.post(LASR_RPC_URL, {
    jsonrpc: '2.0',
    method: 'lasr_getAccount',
    params: [params.address],
    id: 1,
  })

  return NextResponse.json(JSON.parse(response.data.result))
}
