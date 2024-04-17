import React from "react";
import { Tweet } from "@/components/Tweet";

const BurdFeed = ({ tweets }: { tweets: object }) => {
  return (
    <div className="w-full flex flex-col items-center">
      {tweets &&
        Object.values(tweets)
          ?.sort(
            (
              a: { date: string | number | Date },
              b: { date: string | number | Date },
            ) => new Date(b.date).getTime() - new Date(a.date).getTime(),
          )
          .map(
            (tweet: {
              id: string;
              date: string;
              address: string;
              tweet: string;
              username: string;
              handle: string;
              imgUrl: string;
              likes: any[];
            }) => (
              <Tweet
                key={tweet.date}
                posterAddress={tweet.address}
                content={tweet.tweet}
                dateTime={tweet.date}
                id={tweet.id}
                profileImageUrl={tweet.imgUrl}
                username={tweet.username}
                displayName={tweet.handle}
                likes={tweet.likes}
              />
            ),
          )}
    </div>
  );
};

export default BurdFeed;
