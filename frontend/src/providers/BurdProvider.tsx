'use client'
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react'
import { BURD_OWNER_ADDRESS, BURD_PROGRAM_ADDRESS } from '@/lib/consts'
import useProgram from '@/hooks/useProgram'
import {
  fetchAccount,
  parseLikesFromAccount,
  parseChurpsFromAccount,
} from '@/lib/helpers'

const BurdContext = createContext<any>(undefined)

export const BurdProvider = ({ children }: { children: ReactNode }) => {
  const { data, isFetching, getProgram } = useProgram(BURD_PROGRAM_ADDRESS)
  const [feed, setFeed] = useState<object | undefined>()
  const [users, setUsers] = useState<any[] | undefined>()
  const [hasAllNeededEnvVars, setHasAllNeededEnvVars] = useState<boolean>(false)

  useEffect(() => {
    if (BURD_PROGRAM_ADDRESS || BURD_OWNER_ADDRESS) {
      setHasAllNeededEnvVars(true)
    }
  }, [BURD_PROGRAM_ADDRESS, BURD_OWNER_ADDRESS])

  useEffect(() => {
    if (data) {
      setUsers(
        Object.entries(data).map(([key, value]) => {
          return { address: key, ...JSON.parse(value) }
        })
      )
    }
  }, [data])

  useEffect(() => {
    if (users && data && hasAllNeededEnvVars) {
      users.forEach((user) => {
        if (!user.address) return
        fetchAccount(user.address).then((accountData) => {
          const churps = parseChurpsFromAccount(accountData)
          churps.forEach((churp) => {
            const likes = parseLikesFromAccount(
              accountData,
              churp.id,
              user.address
            )
            setFeed((prevFeed) => ({
              //@ts-ignore
              ...prevFeed,
              [`${churp.id}-${user.address}`]: {
                ...churp,
                ...user,
                likes,
              },
            }))
          })
        })
      })
    }
  }, [users, data, hasAllNeededEnvVars])

  useEffect(() => {
    const interval = setInterval(() => {
      getProgram()
    }, 10000)
    return () => clearInterval(interval)
  }, [])

  return (
    <BurdContext.Provider
      value={{
        users,
        isLoading: isFetching,
        feed,
        fetch: getProgram,
        hasAllNeededEnvVars,
      }}
    >
      {children}
    </BurdContext.Provider>
  )
}

// Custom hook to use the context
export const useBurd = () => {
  const context = useContext(BurdContext)
  if (context === undefined) {
    throw new Error('useBurd must be used within a BurdProvider')
  }
  return context
}
