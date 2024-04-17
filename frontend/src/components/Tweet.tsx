import React, { FC, useEffect, useState } from "react";
import { FaHeart, FaTrash } from "react-icons/fa6";
import { Tweet as ITweet, Comment } from "@/lib/types";
import clsx from "clsx";
import { useLasrWallet } from "@/providers/LasrWalletProvider";
import { useBurdAccount } from "@/providers/BurdAccountProvider";
import { useBurd } from "@/providers/BurdProvider";

export const Tweet: FC<ITweet> = ({
  id,
  content,
  posterAddress,
  profileImageUrl = "https://pbs.twimg.com/profile_images/1734927237604904960/VP1HHTgn_400x400.jpg",
  username = "hathbanger",
  displayName = "hath",
  dateTime = "",
  comments = [],
  likes = [],
}) => {
  const { fetch } = useBurd();
  const { address } = useLasrWallet();
  const { deleteTweet, like, unlike, isLiking, isUnliking } = useBurdAccount();
  const [isDeletingThis, setIsDeletingThis] = useState<boolean>(false);
  const [tweetComments, setTweetComments] = useState<Comment[]>(comments);

  const deleteThis = async (id: string) => {
    try {
      setIsDeletingThis(true);
      console.log(id);
      await deleteTweet(id);
      await fetch();
      setIsDeletingThis(false);
    } catch (e) {
      console.log(e);
    }
  };

  const handleNewComment = (commentContent: string) => {
    const newComment = {
      id: tweetComments.length + 1,
      username: "hathbanger",
      displayName: "hath",
      content: commentContent,
      profileImageUrl: profileImageUrl,
    };
    setTweetComments([...tweetComments, newComment]);
  };

  const date = new Date(dateTime);
  const formatter = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const formattedTime = formatter?.format(date);

  const isLiked = !!likes.find((like) => {
    return like.liker.toLowerCase() === address.toLowerCase();
  });

  return (
    <div
      className={clsx(
        "bg-gray-900 p-4 rounded-lg text-left shadow mb-4 w-full max-w-3xl flex overflow-hidden",
        isDeletingThis ? "animate-pulse" : "",
      )}
    >
      <img
        src={profileImageUrl}
        alt="Profile"
        className="h-10 w-10 rounded-full mr-4"
      />
      <div className={"w-full"}>
        <div className="flex justify-between items-center gap-2">
          <h5 className="font-bold">{displayName}</h5>
          <h5 className="font-medium text-gray-500 text-sm">@{username}</h5>
          <span className="text-gray-600 text-sm">{formattedTime}</span>
          <div className={"grow"} />
          {address === posterAddress && (
            <button onClick={() => deleteThis(id)} disabled={isDeletingThis}>
              <FaTrash
                className={clsx(
                  "text-xl transition-all hover:text-red-600 text-gray-600",
                )}
              />
            </button>
          )}
        </div>
        <p className="my-2">{content}</p>
        <div className="flex justify-start space-x-4 text-gray-600">
          <button
            className={clsx(
              `flex items-center hover:opacity-50 ${
                isLiked ? "text-red-500" : ""
              }`,
              isLiking || isUnliking ? "animate-pulse" : "",
            )}
            onClick={() =>
              isLiked ? unlike(id, posterAddress) : like(id, posterAddress)
            }
          >
            <FaHeart />
            <span className="ml-2">{likes.length}</span>
          </button>
          {/*<button className="flex items-center hover:opacity-50">*/}
          {/*  <FaRetweet />*/}
          {/*  <span className="ml-2">Repost</span>*/}
          {/*</button>*/}
          {/*<button className="flex items-center">*/}
          {/*  <FaComment />*/}
          {/*  <span className="ml-2">Comment</span>*/}
          {/*</button>*/}
        </div>
        {/*<div className="mt-4">*/}
        {/*  {tweetComments.map((comment) => (*/}
        {/*    <div*/}
        {/*      key={comment.id}*/}
        {/*      className="flex items-start space-x-2 bg-gray-800 p-2 rounded-lg text-white mt-2"*/}
        {/*    >*/}
        {/*      <img*/}
        {/*        src={comment.profileImageUrl}*/}
        {/*        alt="Profile"*/}
        {/*        className="h-8 w-8 rounded-full" // Adjust size as needed*/}
        {/*      />*/}
        {/*      <div>*/}
        {/*        <div className={'flex flex-row items-center gap-1'}>*/}
        {/*          <div className="font-bold">{comment.displayName}</div>*/}
        {/*          <div className="font-xs text-gray-500 text-sm">*/}
        {/*            @{comment.username}*/}
        {/*          </div>*/}
        {/*        </div>*/}
        {/*        <div>{comment.content}</div>*/}
        {/*      </div>*/}
        {/*    </div>*/}
        {/*  ))}*/}
        {/*  <CommentForm onComment={handleNewComment} />*/}
        {/*</div>*/}
      </div>
    </div>
  );
};
