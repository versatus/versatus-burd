"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { BURD_OWNER_ADDRESS, BURD_PROGRAM_ADDRESS } from "@/lib/consts";
import useProgram from "@/hooks/useProgram";
import {
  fetchAccount,
  parseLikesFromAccount,
  parseTweetsFromAccount,
} from "@/lib/helpers";

const BurdContext = createContext<any>(undefined);

export const BurdProvider = ({ children }: { children: ReactNode }) => {
  const { data, isFetching, getProgram } = useProgram(BURD_PROGRAM_ADDRESS);
  const [feed, setFeed] = useState<object | undefined>();
  const [users, setUsers] = useState<any[] | undefined>();
  const [hasAllNeededEnvVars, setHasAllNeededEnvVars] =
    useState<boolean>(false);

  useEffect(() => {
    if (
      BURD_PROGRAM_ADDRESS !== "undefined" &&
      BURD_OWNER_ADDRESS !== "undefined"
    ) {
      setHasAllNeededEnvVars(true);
    }
  }, []);

  useEffect(() => {
    if (data) {
      setUsers(
        Object.entries(data).map(([key, value]) => {
          return { address: key, ...JSON.parse(value) };
        }),
      );
    }
  }, [data]);

  useEffect(() => {
    if (users && data && hasAllNeededEnvVars) {
      users.forEach((user) => {
        fetchAccount(user.address).then((accountData) => {
          const tweets = parseTweetsFromAccount(accountData);
          tweets.forEach((tweet) => {
            const likes = parseLikesFromAccount(
              accountData,
              tweet.id,
              user.address,
            );
            setFeed((prevFeed) => ({
              //@ts-ignore
              ...prevFeed,
              [`${tweet.id}-${user.address}`]: {
                ...tweet,
                ...user,
                likes,
              },
            }));
          });
        });
      });
    }
  }, [users, data, hasAllNeededEnvVars]);

  useEffect(() => {
    const interval = setInterval(() => {
      getProgram();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

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
  );
};

// Custom hook to use the context
export const useBurd = () => {
  const context = useContext(BurdContext);
  if (context === undefined) {
    throw new Error("useBurdContext must be used within a BurdProvider");
  }
  return context;
};
