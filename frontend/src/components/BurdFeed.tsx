import React from 'react'
import { Churp } from '@/components/Churp'

const BurdFeed = ({ churps }: { churps: object }) => {
  return (
    <div className="w-full flex flex-col items-center">
      {churps &&
        Object.values(churps)
          ?.sort(
            (
              a: { date: string | number | Date },
              b: { date: string | number | Date }
            ) => new Date(b.date).getTime() - new Date(a.date).getTime()
          )
          .map(
            (churp: {
              id: string
              date: string
              address: string
              churp: string
              username: string
              handle: string
              imgUrl: string
              likes: any[]
            }) => (
              <Churp
                key={churp.date}
                posterAddress={churp.address}
                content={churp.churp}
                dateTime={churp.date}
                id={churp.id}
                profileImageUrl={churp.imgUrl}
                username={churp.username}
                displayName={churp.handle}
                likes={churp.likes}
              />
            )
          )}
    </div>
  )
}

export default BurdFeed
