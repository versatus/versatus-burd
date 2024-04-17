'use client'
import React, { FC, useEffect, useState } from 'react'
import Navigation from '@/components/Navigation'
import useProgram from '@/hooks/useProgram'
import { BURD_PROGRAM_ADDRESS } from '@/lib/consts'
import { useLasrWallet } from '@/providers/LasrWalletProvider'
import LoadingSpinner from '@/components/LoadingSpinner'
import { useBurdAccount } from '@/providers/BurdAccountProvider'
import BurdTitle from '@/components/BurdTitle'
import TweetForm from '@/components/TweetForm'
import SignUpForm from '@/components/SignUpForm'
import BurdLayout from '@/components/BurdLayout'
import BurdFeed from '@/components/BurdFeed'
import { AnimatePresence, motion } from 'framer-motion'
import { useBurd } from '@/providers/BurdProvider'
import ButtonWithProcessing from '@/components/ButtonWithProcessing'
import WalletCheck from '@/components/WalletCheck'

const BurdCage: FC = () => {
  const { isConnecting } = useLasrWallet()
  const { data, isFetching, getProgram } = useProgram(BURD_PROGRAM_ADDRESS)
  const [account, setAccount] = useState<any | undefined>()
  const { address } = useLasrWallet()

  const { tweet, isTweeting, isLoading, isApproving, approve, isApproved } =
    useBurdAccount()
  const { feed, hasAllNeededEnvVars } = useBurd()

  useEffect(() => {
    if (data) {
      const foundUser = Object.entries(data).find(
        ([userAddress, user]) =>
          address.toLowerCase() === userAddress.toLowerCase()
      )?.[1]

      if (foundUser) {
        setAccount(JSON.parse(foundUser))
      }
    }
  }, [address, data])

  const handleNewTweet = async (tweetContent: string) => {
    await tweet(tweetContent)
  }

  return (
    <BurdLayout>
      <Navigation />
      {(isFetching || isLoading || isConnecting) && !address ? (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.8,
            }}
            className={'flex flex-col h-full items-center justify-center gap-4'}
          >
            <LoadingSpinner />
          </motion.div>
        </AnimatePresence>
      ) : !address ? (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.8,
            }}
            className={'flex flex-col h-full items-center justify-center gap-4'}
          >
            <WalletCheck />
          </motion.div>
        </AnimatePresence>
      ) : !hasAllNeededEnvVars ? (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 1,
            }}
            className={''}
          >
            <BurdTitle />
            <div
              className={
                'flex flex-col gap-4 w-full mt-12 items-center justify-center'
              }
            >
              <h1 className={'text-2xl text-gray-400 font-bold text-center'}>
                Missing Environment Variables
              </h1>
              <p className={'text-center text-gray-400 italic'}>
                You are missing some environment variables. Please check your
                .env file and make sure you have all the required variables.
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      ) : !account ? (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 1,
            }}
            className={''}
          >
            <SignUpForm getProgram={getProgram} />
          </motion.div>
        </AnimatePresence>
      ) : (
        <div className={'flex flex-col gap-2 w-full'}>
          <BurdTitle />
          <TweetForm tweet={handleNewTweet} isTweeting={isTweeting} />
          {!isApproved(BURD_PROGRAM_ADDRESS) && !isLoading ? (
            <ButtonWithProcessing
              isSending={isApproving}
              content={<span>APPROVE BURD TO GET STARTED</span>}
              isSendingContent={<span>APPROVING...</span>}
              onClick={approve}
              className={
                'border-yellow-500 h-[69px] w-full items-center text-center justify-center font-black border  flex flex-row gap-4 hover:opacity-50 px-10 text-white'
              }
            />
          ) : (
            <BurdFeed tweets={feed} />
          )}
        </div>
      )}
    </BurdLayout>
  )
}

export default BurdCage
