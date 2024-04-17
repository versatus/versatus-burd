import { useLasrWallet } from '@/providers/LasrWalletProvider'
import DownloadWalletButton from '@/components/DownloadWalletButton'
import ConnectWalletButton from '@/components/ConnectWalletButton'
import BirdTitle from '@/components/BurdTitle'

const WalletCheck = () => {
  const { isConnecting, isRequestingAccount, provider } = useLasrWallet()

  return (
    <div className={'flex flex-col w-full justify-center gap-1'}>
      <div
        className={
          'w-full flex flex-col min-w-[110px] gap-1 md:gap-1 items-center justify-center'
        }
      >
        <BirdTitle />
        {!provider ? (
          <span className={'flex flex-col gap-2'}>
            <span className={'text-xl text-gray-500'}>
              Install the LASR wallet to get started
            </span>
            <DownloadWalletButton />
          </span>
        ) : isConnecting && !isRequestingAccount ? (
          <button className="border border-pink-600 rounded-full p-4 gap-4 height-[69px] flex flex-row justify-center items-center text-pink-600 disabled:opacity-50 ">
            CONNECTING...
          </button>
        ) : (
          <div className={'flex flex-col gap-2'}>
            {provider ? <ConnectWalletButton /> : <DownloadWalletButton />}
          </div>
        )}
      </div>
    </div>
  )
}

export default WalletCheck
