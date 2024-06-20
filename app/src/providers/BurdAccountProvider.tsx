import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from 'react'

import { BURD_PROGRAM_ADDRESS } from '@/lib/consts'
import useUserAccount from '@/hooks/useUserAccount'
import useProgram from '@/hooks/useProgram'
import { delay, getNewNonceForAccount } from '@/lib/utils'
import { useLasrWallet } from '@/providers/LasrWalletProvider'
import { toast } from 'react-hot-toast'
import { useBurd } from '@/providers/BurdProvider'
import { Token, ZERO_VALUE } from '@versatus/versatus-javascript'

const BurdAccountContext = createContext<any>(undefined)

export const BurdAccountProvider = ({ children }: { children: ReactNode }) => {
  const { address } = useLasrWallet()

  const { fetch, hasAllNeededEnvVars } = useBurd()

  const {
    account,
    refetchAccount,
    isFetching: isFetchingAccount,
  } = useUserAccount(hasAllNeededEnvVars && address)

  const {
    address: connectedUserAddress,
    accountInfo,
    call,
    requestAccount,
  } = useLasrWallet()

  const { data, isFetching: isFetchingProgram } = useProgram(
    hasAllNeededEnvVars ? BURD_PROGRAM_ADDRESS : undefined
  )

  const [accountBurd, setAccountBurd] = useState<Token | undefined>()
  const [profile, setProfile] = useState<any>(null)
  const [churps, setChurps] = useState<any>(null)
  const [likes, setLikes] = useState<any>(null)
  const [isChurping, setIsChurping] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isLiking, setIsLiking] = useState(false)
  const [isUnliking, setIsUnliking] = useState(false)
  const [isApproving, setIsApproving] = useState(false)

  useEffect(() => {
    if (data && address) {
      requestAccount()
      const foundUser = Object.entries(data).find(
        ([userAddress]) => address.toLowerCase() === userAddress.toLowerCase()
      )?.[1]
      if (foundUser) {
        setProfile(JSON.parse(foundUser))
      }
    }
  }, [address, data])

  useEffect(() => {
    if (account && account.programs[BURD_PROGRAM_ADDRESS]) {
      setAccountBurd(account.programs[BURD_PROGRAM_ADDRESS])
    }
  }, [account, isApproving])

  const isApproved = (addressToCheckApproval: string) =>
    !!accountBurd?.approvals[addressToCheckApproval]

  useEffect(() => {
    if (account && account.programs[BURD_PROGRAM_ADDRESS] && profile) {
      setChurps(
        Object.entries(account.programs[BURD_PROGRAM_ADDRESS].data)
          .filter(([key]) => key.slice(0, 6) === 'churp-')
          .map(([key, value]) => ({
            id: key,
            date: key.replace('churp-', ''),
            churp: value,
            ...profile,
            posterAddress: connectedUserAddress,
          }))
      )
      setLikes(
        Object.entries(account.programs[BURD_PROGRAM_ADDRESS].data)
          .filter(([key]) => key.slice(0, 5) === 'like-')
          .map(([key, value]) => ({
            id: key,
            ...profile,
            posterAddress: connectedUserAddress,
          }))
      )
    }
  }, [account, connectedUserAddress, profile])

  const isLiked = (id: string, posterAddress: any) => {
    return (
      likes?.find(
        (like: { id: string }) =>
          like.id.toLowerCase() ===
          `like-${id.replace('churp-', '')}-${address}`.toLowerCase()
      ) !== undefined
    )
  }

  const like = useCallback(
    async (churpId: string, posterAddress: string) => {
      if (!address || connectedUserAddress !== address) {
        toast.error('You are not connected to the correct account')
        return
      }

      if (!churpId || !posterAddress) {
        toast.error('Invalid churpId or posterAddress')
        return
      }

      try {
        setIsLiking(true)
        const nonce = getNewNonceForAccount(accountInfo)
        const payload = {
          from: address,
          op: 'like',
          programId: BURD_PROGRAM_ADDRESS,
          to: BURD_PROGRAM_ADDRESS,
          transactionInputs: JSON.stringify({ churpId, posterAddress }),
          transactionType: {
            call: nonce,
          },
          value: ZERO_VALUE,
        }

        await call(payload)
        await delay(1500)
        await refetchAccount()
        await fetch()
        toast.success('Like sent successfully')
      } catch (e) {
        if (e instanceof Error) {
          toast.error(e.message.replace('Custom error:', ''))
        }
      } finally {
        setIsLiking(false)
      }
    },
    [address, connectedUserAddress, accountInfo, call, refetchAccount]
  )

  const unlike = useCallback(
    async (churpId: string, posterAddress: string) => {
      if (!address || connectedUserAddress !== address) {
        toast.error('You are not connected to the correct account')
        return
      }

      if (!churpId || !posterAddress) {
        toast.error('Invalid churpId or posterAddress')
        return
      }

      try {
        setIsUnliking(true)
        const nonce = getNewNonceForAccount(accountInfo)
        const payload = {
          from: address,
          op: 'unlike',
          programId: BURD_PROGRAM_ADDRESS,
          to: BURD_PROGRAM_ADDRESS,
          transactionInputs: JSON.stringify({ churpId, posterAddress }),
          transactionType: {
            call: nonce,
          },
          value: ZERO_VALUE,
        }
        await call(payload)
        await delay(1500)
        await refetchAccount()
        await fetch()
        toast.success('unlike sent successfully')
      } catch (e) {
        if (e instanceof Error) {
          toast.error(e.message.replace('Custom error:', ''))
        }
      } finally {
        setIsUnliking(false)
      }
    },
    [address, connectedUserAddress, accountInfo, call, refetchAccount]
  )

  const deleteChurp = useCallback(
    async (churpId: string) => {
      if (!connectedUserAddress || connectedUserAddress !== address) {
        toast.error('You are not connected to the correct account')
        return
      }

      try {
        setIsDeleting(true)
        const nonce = getNewNonceForAccount(accountInfo)
        const payload = {
          from: address,
          op: 'deleteChurp',
          programId: BURD_PROGRAM_ADDRESS,
          to: BURD_PROGRAM_ADDRESS,
          transactionInputs: JSON.stringify({ churpId }),
          transactionType: {
            call: nonce,
          },
          value: ZERO_VALUE,
        }
        await call(payload)
        await delay(1500)
        await refetchAccount()
        await fetch()
        setChurps((currentChurps: any[]) =>
          currentChurps?.filter((churp: any) => churp.id !== churpId)
        )
        toast.success('Churp deleted successfully')
      } catch (e) {
        if (e instanceof Error) {
          toast.error(e.message.replace('Custom error:', ''))
        }
      } finally {
        setIsDeleting(false)
      }
    },
    [address, connectedUserAddress, accountInfo, call, refetchAccount]
  )

  const churp = useCallback(
    async (content: string) => {
      if (!address || connectedUserAddress !== address) {
        toast.error('You are not connected to the correct account')
        return
      }

      try {
        setIsChurping(true)
        const nonce = getNewNonceForAccount(accountInfo)
        const payload = {
          from: address,
          op: 'churp',
          programId: BURD_PROGRAM_ADDRESS,
          to: BURD_PROGRAM_ADDRESS,
          transactionInputs: JSON.stringify({ churp: content }),
          transactionType: {
            call: nonce,
          },
          value: ZERO_VALUE,
        }
        await call(payload)
        await delay(1500)
        await refetchAccount()
        await fetch()
        toast.success('Churp sent successfully')
      } catch (e) {
        if (e instanceof Error) {
          toast.error(e.message.replace('Custom error:', ''))
        }
      } finally {
        setIsChurping(false)
      }
    },
    [address, connectedUserAddress, accountInfo, call, refetchAccount, fetch]
  )

  const approve = useCallback(async () => {
    try {
      setIsApproving(true)
      const nonce = getNewNonceForAccount(accountInfo)
      const payload = {
        from: address.toLowerCase(),
        op: 'approve',
        programId: BURD_PROGRAM_ADDRESS,
        to: BURD_PROGRAM_ADDRESS,
        transactionInputs: `[["${BURD_PROGRAM_ADDRESS}",["${ZERO_VALUE}"]]]`,
        transactionType: {
          call: nonce,
        },
        value: ZERO_VALUE,
      }
      await call(payload)
      await delay(1500)
      await refetchAccount()
      await fetch()
      toast.success('Transaction sent successfully')
    } catch (e) {
      if (e instanceof Error) {
        toast.error(e.message.replace('Custom error:', ''))
      }
    } finally {
      setIsApproving(false)
    }
  }, [address, connectedUserAddress, accountInfo, call, refetchAccount])

  return (
    <BurdAccountContext.Provider
      value={{
        isLoading: isFetchingProgram || isFetchingAccount,
        profile,
        churps,
        churp,
        isChurping,
        deleteChurp,
        isDeleting,
        like,
        unlike,
        likes,
        isLiking,
        isUnliking,
        approve,
        isApproved,
        isApproving,
        isLiked,
      }}
    >
      {children}
    </BurdAccountContext.Provider>
  )
}

export const useBurdAccount = () => {
  const context = useContext(BurdAccountContext)
  if (context === undefined) {
    throw new Error(
      'useBurdAccountContext must be used within a BurdAccountProvider'
    )
  }
  return context
}
