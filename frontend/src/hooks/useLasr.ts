import axios from "axios";
import { useEffect, useState } from "react";
import { useEthWallet } from "@/hooks/useEthWallet";
import { useExecutableOracle } from "@/hooks/useExecutableOracle";
import { FAUCET_PROGRAM_ADDRESS } from "@/consts/public";
import { delay } from "@/utils";

export function useLasr(address?: string) {
  const { ethSigner } = useEthWallet(address);
  const [isFauceting, setIsFauceting] = useState(false);
  const [transactionInputs, setTransactionInputs] = useState(
    '{"name":"HelloToken","symbol":"HLLO","totalSupply":"0x0000000000000000000000000000000000000000000000000000000000000001"}',
  );
  const [transactionError, setTransactionError] = useState("");
  const { contractAddress: eoContractAddress } = useExecutableOracle(
    address,
    ethSigner,
  );

  useEffect(() => {
    if (transactionError) {
      delay(5000).then(() => setTransactionError(""));
    }
  }, [transactionError]);

  const sendTransaction = async () => {
    setIsFauceting(true);
    setTransactionError("");
    return await axios
      .post(`/api/wallet/call`, {
        to: eoContractAddress,
        op: "createAndDistribute",
        programAddress: FAUCET_PROGRAM_ADDRESS,
        transactionInputs,
      })
      .catch((e) => {
        setTransactionError(e.message);
      })
      .finally(() => setIsFauceting(false));
  };

  return { sendTransaction, isFauceting, transactionError };
}
