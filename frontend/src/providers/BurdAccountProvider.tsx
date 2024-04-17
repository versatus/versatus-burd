import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from "react";

import { BURD_PROGRAM_ADDRESS } from "@/lib/consts";
import useUserAccount from "@/hooks/useUserAccount";
import useProgram from "@/hooks/useProgram";
import { delay, getNewNonceForAccount } from "@/lib/utils";
import { useLasrWallet } from "@/providers/LasrWalletProvider";
import { toast } from "react-hot-toast";
import { useBurd } from "@/providers/BurdProvider";
import { Token, ZERO_VALUE } from "@versatus/versatus-javascript";

const BurdAccountContext = createContext<any>(undefined);

export const BurdAccountProvider = ({ children }: { children: ReactNode }) => {
  const { address } = useLasrWallet();

  const { fetch, hasAllNeededEnvVars } = useBurd();

  const {
    account,
    refetchAccount,
    isFetching: isFetchingAccount,
  } = useUserAccount(hasAllNeededEnvVars && address);

  const {
    address: connectedUserAddress,
    accountInfo,
    call,
    requestAccount,
  } = useLasrWallet();

  const { data, isFetching: isFetchingProgram } = useProgram(
    hasAllNeededEnvVars ? BURD_PROGRAM_ADDRESS : undefined,
  );

  const [accountBurd, setAccountBurd] = useState<Token | undefined>();
  const [profile, setProfile] = useState<any>(null);
  const [tweets, setTweets] = useState<any>(null);
  const [likes, setLikes] = useState<any>(null);
  const [isTweeting, setIsTweeting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [isUnliking, setIsUnliking] = useState(false);
  const [isApproving, setIsApproving] = useState(false);

  useEffect(() => {
    if (data && address) {
      requestAccount();
      const foundUser = Object.entries(data).find(
        ([userAddress]) => address.toLowerCase() === userAddress.toLowerCase(),
      )?.[1];
      if (foundUser) {
        setProfile(JSON.parse(foundUser));
      }
    }
  }, [address, data]);

  useEffect(() => {
    if (account && account.programs[BURD_PROGRAM_ADDRESS]) {
      setAccountBurd(account.programs[BURD_PROGRAM_ADDRESS]);
    }
  }, [account, isApproving]);

  const isApproved = (addressToCheckApproval: string) =>
    !!accountBurd?.approvals[addressToCheckApproval];

  useEffect(() => {
    if (account && account.programs[BURD_PROGRAM_ADDRESS] && profile) {
      setTweets(
        Object.entries(account.programs[BURD_PROGRAM_ADDRESS].data)
          .filter(([key]) => key.slice(0, 6) === "tweet-")
          .map(([key, value]) => ({
            id: key,
            date: key.replace("tweet-", ""),
            tweet: value,
            ...profile,
            posterAddress: connectedUserAddress,
          })),
      );
      setLikes(
        Object.entries(account.programs[BURD_PROGRAM_ADDRESS].data)
          .filter(([key]) => key.slice(0, 5) === "like-")
          .map(([key, value]) => ({
            id: key,
            ...profile,
            posterAddress: connectedUserAddress,
          })),
      );
    }
  }, [account, connectedUserAddress, profile]);

  const isLiked = (id: string, posterAddress: any) => {
    return (
      likes?.find(
        (like: { id: string }) =>
          like.id.toLowerCase() ===
          `like-${id.replace("tweet-", "")}-${address}`.toLowerCase(),
      ) !== undefined
    );
  };

  const like = useCallback(
    async (tweetId: string, posterAddress: string) => {
      if (!address || connectedUserAddress !== address) {
        toast.error("You are not connected to the correct account");
        return;
      }

      if (!tweetId || !posterAddress) {
        toast.error("Invalid tweetId or posterAddress");
        return;
      }

      try {
        setIsLiking(true);
        const nonce = getNewNonceForAccount(accountInfo);
        const payload = {
          from: address,
          op: "like",
          programId: BURD_PROGRAM_ADDRESS,
          to: BURD_PROGRAM_ADDRESS,
          transactionInputs: JSON.stringify({ tweetId, posterAddress }),
          transactionType: {
            call: nonce,
          },
          value: ZERO_VALUE,
        };

        await call(payload);
        await delay(1500);
        await refetchAccount();
        await fetch();
        toast.success("Like sent successfully");
      } catch (e) {
        if (e instanceof Error) {
          toast.error(e.message.replace("Custom error:", ""));
        }
      } finally {
        setIsLiking(false);
      }
    },
    [address, connectedUserAddress, accountInfo, call, refetchAccount],
  );

  const unlike = useCallback(
    async (tweetId: string, posterAddress: string) => {
      if (!address || connectedUserAddress !== address) {
        toast.error("You are not connected to the correct account");
        return;
      }

      if (!tweetId || !posterAddress) {
        toast.error("Invalid tweetId or posterAddress");
        return;
      }

      try {
        setIsUnliking(true);
        const nonce = getNewNonceForAccount(accountInfo);
        const payload = {
          from: address,
          op: "unlike",
          programId: BURD_PROGRAM_ADDRESS,
          to: BURD_PROGRAM_ADDRESS,
          transactionInputs: JSON.stringify({ tweetId, posterAddress }),
          transactionType: {
            call: nonce,
          },
          value: ZERO_VALUE,
        };
        await call(payload);
        await delay(1500);
        await refetchAccount();
        await fetch();
        toast.success("unlike sent successfully");
      } catch (e) {
        if (e instanceof Error) {
          toast.error(e.message.replace("Custom error:", ""));
        }
      } finally {
        setIsUnliking(false);
      }
    },
    [address, connectedUserAddress, accountInfo, call, refetchAccount],
  );

  const deleteTweet = useCallback(
    async (tweetId: string) => {
      if (!connectedUserAddress || connectedUserAddress !== address) {
        toast.error("You are not connected to the correct account");
        return;
      }

      try {
        setIsDeleting(true);
        const nonce = getNewNonceForAccount(accountInfo);
        const payload = {
          from: address,
          op: "deleteTweet",
          programId: BURD_PROGRAM_ADDRESS,
          to: BURD_PROGRAM_ADDRESS,
          transactionInputs: JSON.stringify({ tweetId }),
          transactionType: {
            call: nonce,
          },
          value: ZERO_VALUE,
        };
        await call(payload);
        await delay(1500);
        await refetchAccount();
        await fetch();
        setTweets(
          (currentTweets: any[]) =>
            currentTweets?.filter((tweet: any) => tweet.id !== tweetId),
        );
        toast.success("Tweet deleted successfully");
      } catch (e) {
        if (e instanceof Error) {
          toast.error(e.message.replace("Custom error:", ""));
        }
      } finally {
        setIsDeleting(false);
      }
    },
    [address, connectedUserAddress, accountInfo, call, refetchAccount],
  );

  const tweet = useCallback(
    async (content: string) => {
      if (!address || connectedUserAddress !== address) {
        toast.error("You are not connected to the correct account");
        return;
      }

      try {
        setIsTweeting(true);
        const nonce = getNewNonceForAccount(accountInfo);
        const payload = {
          from: address,
          op: "tweet",
          programId: BURD_PROGRAM_ADDRESS,
          to: BURD_PROGRAM_ADDRESS,
          transactionInputs: JSON.stringify({ tweet: content }),
          transactionType: {
            call: nonce,
          },
          value: ZERO_VALUE,
        };
        await call(payload);
        await delay(1500);
        await refetchAccount();
        await fetch();
        toast.success("Tweet sent successfully");
      } catch (e) {
        if (e instanceof Error) {
          toast.error(e.message.replace("Custom error:", ""));
        }
      } finally {
        setIsTweeting(false);
      }
    },
    [address, connectedUserAddress, accountInfo, call, refetchAccount, fetch],
  );

  const approve = useCallback(async () => {
    try {
      setIsApproving(true);
      const nonce = getNewNonceForAccount(accountInfo);
      const payload = {
        from: address.toLowerCase(),
        op: "approve",
        programId: BURD_PROGRAM_ADDRESS,
        to: BURD_PROGRAM_ADDRESS,
        transactionInputs: `[["${BURD_PROGRAM_ADDRESS}",["${ZERO_VALUE}"]]]`,
        transactionType: {
          call: nonce,
        },
        value: ZERO_VALUE,
      };
      await call(payload);
      await delay(1500);
      await refetchAccount();
      await fetch();
      toast.success("Transaction sent successfully");
    } catch (e) {
      if (e instanceof Error) {
        toast.error(e.message.replace("Custom error:", ""));
      }
    } finally {
      setIsApproving(false);
    }
  }, [address, connectedUserAddress, accountInfo, call, refetchAccount]);

  return (
    <BurdAccountContext.Provider
      value={{
        isLoading: isFetchingProgram || isFetchingAccount,
        profile,
        tweets,
        tweet,
        isTweeting,
        deleteTweet,
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
  );
};

export const useBurdAccount = () => {
  const context = useContext(BurdAccountContext);
  if (context === undefined) {
    throw new Error(
      "useBurdAccountContext must be used within a BurdAccountProvider",
    );
  }
  return context;
};
