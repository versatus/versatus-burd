"use client";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { delay, useLocalStorage } from "@/lib/utils";
import { InitTransaction } from "@versatus/versatus-javascript";
import { LasrWalletContextType, ParsedProgram } from "@/lib/types";
import { parseProgramDetailsToArray } from "@/lib/helpers";

const LasrWalletContext = createContext<LasrWalletContextType | undefined>({
  address: "",
  isConnecting: false,
  isRequestingAccount: false,
  isSigning: false,
  isSending: false,
  isCalling: false,
  isDecrypting: false,
  isEncrypting: false,
  accountInfo: undefined,
  accountPrograms: undefined,
  programs: [],
  verseBalance: "",
  ethBalance: "",
  provider: null,
  requestAccount: async () => {},
  loaded: false,
  connect: async () => {},
  disconnect: () => {},
  decryptMessage: async (message: string) => {},
  encryptMessage: async (message: string, encryptionPublicKey: string) => {},
  signMessage: async () => {},
  call: async () => {},
  send: async () => {},
});

export const useLasrWallet = () => {
  const context = useContext(LasrWalletContext);
  if (context === undefined) {
    throw new Error("useBRC20Context must be used within a LasrWalletProvider");
  }
  return context;
};

export function LasrWalletProvider({ children }: { children: ReactNode }) {
  const [hasConnected, setHasConnected] = useLocalStorage(
    "hasConnected",
    false,
  );
  const [provider, setProvider] = useState<any>(null);
  const [address, setAddress] = useState("");
  const [isCreatingWallet, setIsCreatingWallet] = useState(false);
  const [isAskingForApprovalInWallet, setIsAskingForApprovalInWallet] =
    useState(true);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isRequestingAccount, setIsRequestingAccount] = useState(false);
  const [isSigning, setIsSigning] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isCalling, setIsCalling] = useState(false);
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [accountInfo, setAccountInfo] = useState<any>(null);
  const [accountPrograms, setAccountPrograms] = useState<any>(null);
  const [verseBalance, setVerseBalance] = useState("");
  const [ethBalance, setEthBalance] = useState("");
  const [programs, setPrograms] = useState<ParsedProgram[]>([]);

  useEffect(() => {
    // @ts-ignore
    if (window?.lasr) {
      setTimeout(async () => {
        // @ts-ignore
        setProvider(window?.lasr);
      }, 500);
    } else {
      setIsConnecting(false);
    }
  }, []);

  useEffect(() => {
    //@ts-ignore
    if (provider && hasConnected) {
      setTimeout(async () => {
        await connect();
      }, 1000);
    }
  }, [provider, hasConnected]);

  const requestAccount = async () => {
    setIsRequestingAccount(true);
    if (!provider) console.error("Provider not available");
    try {
      // @ts-ignore
      const accountResponse = await provider?.requestAccount();
      setAccountInfo(accountResponse);
      setAccountPrograms(accountResponse?.data?.programs);
      const progs = parseProgramDetailsToArray(accountResponse?.data?.programs);
      setPrograms(progs);

      return accountResponse;
    } catch (e) {
      // console.error(e);
      throw e;
    } finally {
      setIsRequestingAccount(false);
    }
  };

  const call = async (initTx: InitTransaction) => {
    if (provider) {
      try {
        setIsCalling(true);
        const response = await provider.call(initTx);
        await delay(1500);
        setIsCalling(false);
        await requestAccount();

        return response;
      } catch (e) {
        console.error(e);
        setIsCalling(false);
        // @ts-ignore
        throw new Error(e.message);
      }
    } else {
      alert("Please install LASR Chrome Extension");
    }
  };

  const connect = async () => {
    setIsConnecting(true);
    if (provider) {
      try {
        const response = await requestAccount();
        setAddress(response?.address);
        setHasConnected(true);
      } catch (e) {
        console.error(e);
        setAddress("");
        setIsConnecting(false);
      } finally {
        setIsConnecting(false);
      }
    } else {
      setIsConnecting(false);
      alert("Please install LASR Chrome Extension");
    }
  };

  const decryptMessage = async (message: string) => {
    if (provider) {
      try {
        setIsDecrypting(true);
        const response = await provider.decryptMessage(message);
        setIsDecrypting(false);
        return response;
      } catch (e) {
        console.error(e);
        setIsDecrypting(false);
        // @ts-ignore
        throw new Error(e.message);
      }
    } else {
      alert("Please install LASR Chrome Extension");
    }
  };

  const encryptMessage = async (
    message: string,
    encryptionPublicKey: string,
  ) => {
    if (provider) {
      try {
        setIsEncrypting(true);
        const response = await provider.encryptMessage(
          message,
          encryptionPublicKey,
        );
        setIsEncrypting(false);
        return response;
      } catch (e) {
        console.error(e);
        setIsEncrypting(false);
        // @ts-ignore
        throw new Error(e.message);
      }
    } else {
      alert("Please install LASR Chrome Extension");
    }
  };

  const signMessage = async (message: string) => {
    if (provider) {
      try {
        setIsSigning(true);
        const response = await provider.signMessage(message);
        setIsSigning(false);
        return response;
      } catch (e) {
        console.error(e);
        setIsSigning(false);
      }
    } else {
      alert("Please install LASR Chrome Extension");
    }
  };

  const send = async (initTx: InitTransaction) => {
    if (provider) {
      try {
        setIsSending(true);
        const response = await provider.send(initTx);
        await delay(1500);
        setIsSending(false);
        await requestAccount();

        return response;
      } catch (e) {
        console.error(e);
        setIsSending(false);
        // @ts-ignore
        throw new Error(e.message);
      }
    } else {
      alert("Please install LASR Chrome Extension");
    }
  };

  const disconnect = () => {
    setAddress("");
    setHasConnected(false);
  };

  return (
    <LasrWalletContext.Provider
      value={{
        address,
        isConnecting,
        isRequestingAccount,
        isSigning,
        isSending,
        isCalling,
        isDecrypting,
        isEncrypting,
        accountInfo,
        accountPrograms,
        programs,
        verseBalance,
        ethBalance,
        provider,
        requestAccount,
        loaded,
        connect,
        disconnect,
        decryptMessage,
        encryptMessage,
        signMessage,
        call,
        send,
      }}
    >
      {children}
    </LasrWalletContext.Provider>
  );
}
