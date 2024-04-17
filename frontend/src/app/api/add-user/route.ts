import { NextRequest, NextResponse } from 'next/server'
import * as process from 'process'
import { broadcast } from '@versatus/versatus-javascript'
import { formatAmountToHex } from '@versatus/versatus-javascript'
import { BURD_PROGRAM_ADDRESS, BURD_OWNER_ADDRESS } from '@/consts/public'

export async function POST(req: NextRequest) {
  const { address, handle, username, imgUrl } = await req.json()

  if (!address) {
    return NextResponse.json({ error: 'address is required' }, { status: 400 })
  }

  if (!handle) {
    return NextResponse.json({ error: 'handle is required' }, { status: 400 })
  }

  if (!username) {
    return NextResponse.json({ error: 'handle is required' }, { status: 400 })
  }

  if (!imgUrl) {
    return NextResponse.json({ error: 'handle is required' }, { status: 400 })
  }

  try {
    const txResponse = await sendBurdAddUserCall(
      address,
      handle,
      username,
      imgUrl
    )

    await approveUser(address)

    return NextResponse.json(txResponse)
  } catch (e) {
    console.log(e)
    return NextResponse.json('There was an error..', { status: 401 })
  }
}

const sendBurdAddUserCall = async (
  address: string,
  handle: string,
  username: string,
  imgUrl: string
) => {
  const BURD_OWNER_PRIVATE_KEY = process.env['BURD_OWNER_PRIVATE_KEY']
  if (!BURD_OWNER_PRIVATE_KEY) {
    throw { error: 'Faucet private key not found' }
  }

  if (!BURD_PROGRAM_ADDRESS) {
    throw { error: 'Faucet address not found' }
  }

  try {
    return await broadcast(
      {
        from: BURD_OWNER_ADDRESS,
        op: 'addUser',
        programId: BURD_PROGRAM_ADDRESS,
        to: String(BURD_PROGRAM_ADDRESS),
        transactionInputs: JSON.stringify({
          address,
          handle,
          username,
          imgUrl,
        }),
        value: formatAmountToHex('0'),
      },
      BURD_OWNER_PRIVATE_KEY
    )
  } catch (e) {
    throw e
  }
}

const approveUser = async (userAddress: string) => {
  const BURD_OWNER_PRIVATE_KEY = process.env['BURD_OWNER_PRIVATE_KEY']
  if (!BURD_OWNER_PRIVATE_KEY) {
    throw { error: 'Faucet private key not found' }
  }

  try {
    return await broadcast(
      {
        from: BURD_OWNER_ADDRESS,
        op: 'approve',
        programId: BURD_PROGRAM_ADDRESS,
        to: String(BURD_PROGRAM_ADDRESS),
        transactionInputs: `[["${userAddress}",["0x0000000000000000000000000000000000000000000000000000000000000000"]]]`,
        value: formatAmountToHex('0'),
      },
      BURD_OWNER_PRIVATE_KEY
    )
  } catch (e) {
    throw e
  }
}
