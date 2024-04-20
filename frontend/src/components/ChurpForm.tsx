import React, { useState } from 'react'
import clsx from 'clsx'
import { useBurdAccount } from '@/providers/BurdAccountProvider'

interface ChurpFormProps {
  churp: (content: string) => Promise<void>
  isChurping: boolean
}

const ChurpForm: React.FC<ChurpFormProps> = ({ churp }) => {
  const { isChurping, profile } = useBurdAccount()
  const [content, setContent] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await churp(content)
    setContent('')
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl mb-12">
      <div className={'flex flex-row gap-2'}>
        <img
          src={profile?.imgUrl}
          alt="Profile"
          className="h-24 w-24 rounded-md"
        />
        <textarea
          className={clsx(
            'w-full p-2 border border-gray-600 focus:outline-none bg-gray-600 text-white rounded-lg',
            isChurping ? 'animate-pulse' : ''
          )}
          disabled={isChurping}
          placeholder="What's happening?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>
      <button
        disabled={isChurping || !content}
        type="submit"
        className="mt-2 px-4 py-2 bg-blue-500 disabled:opacity-50 text-white rounded-lg hover:bg-blue-600"
      >
        {isChurping ? 'Churping...' : 'Churp'}
      </button>
    </form>
  )
}

export default ChurpForm
