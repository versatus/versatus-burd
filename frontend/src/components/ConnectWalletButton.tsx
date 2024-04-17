import { useLasrWallet } from '@/providers/LasrWalletProvider'
import { AnimatePresence, motion } from 'framer-motion'
import { GiLaserPrecision } from 'react-icons/gi'
import DownloadWalletButton from '@/components/DownloadWalletButton'
import clsx from 'clsx'
import LoadingSpinner from '@/components/LoadingSpinner'

const ConnectWalletButton = () => {
  const {
    connect,
    isConnecting,
    requestAccount,
    isRequestingAccount,
    provider,
  } = useLasrWallet()

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{
          duration: 0.8,
        }}
        className={'flex flex-col gap-4'}
      >
        {!provider ? (
          <DownloadWalletButton />
        ) : (
          <button
            className={clsx(
              isConnecting || isRequestingAccount ? 'animate-pulse' : '',
              'border-pink-500 border font-black text-pink-500 text-center justify-center items-center hover:opacity-50 rounded-full flex flex-row gap-2 px-10 p-4  disabled:opacity-50'
            )}
            onClick={
              !isConnecting && !isRequestingAccount
                ? () => connect()
                : isRequestingAccount
                ? () => requestAccount
                : () => null
            }
          >
            {isRequestingAccount ? (
              <LoadingSpinner />
            ) : (
              <GiLaserPrecision className={'text-4xl'} />
            )}
            {isRequestingAccount
              ? 'REQUESTING ACCOUNT'
              : isConnecting
              ? 'CONNECTING TO WALLET..'
              : 'CONNECT LASR WALLET'}
          </button>
        )}
      </motion.div>
    </AnimatePresence>
  )
}

export default ConnectWalletButton
