import { useState, useEffect, useCallback } from "react";
import { fetchProgramDetails } from "@/lib/helpers";
import { Account } from "@versatus/versatus-javascript";

function useProgram(programAddress: string | undefined) {
  const [ownerAddress, setOwnerAddressAddress] = useState("");
  const [programAccount, setProgramAccountAccount] = useState<Account | null>(
    null,
  );
  const [programAccountMetadata, setProgramAccountMetadata] = useState<
    Record<string, string> | undefined
  >();
  const [programAccountData, setProgramAccountData] = useState<
    Record<string, string> | undefined
  >();
  const [balance, setBalance] = useState<string>("");
  const [tokenIds, setTokenIds] = useState<string[]>([]);
  const [metadata, setMetadata] = useState<Record<string, string> | null>(null);
  const [data, setData] = useState<Record<string, string>>();
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const [fetchError, setFetchError] = useState("");
  const [programType, setProgramType] = useState<string | undefined>();
  const [programs, setPrograms] = useState<any | undefined>();

  const getProgram = useCallback(async () => {
    setIsFetching(true);
    setFetchError("");
    if (!programAddress || programAddress === "undefined") {
      setIsFetching(false);
      return;
    }
    return await fetchProgramDetails({ programAddress })
      .then((response: Account) => {
        setProgramAccountAccount(response);
        setOwnerAddressAddress(String(response.ownerAddress));
        setProgramAccountMetadata(response.programAccountMetadata);
        setProgramAccountData(response.programAccountData);
        setProgramType(response.programAccountData?.type);

        const programPrograms = response.programs;
        setPrograms(programPrograms);
        const currentProgram = programPrograms[programAddress];
        if (currentProgram) {
          setMetadata(currentProgram.metadata);
          setBalance(currentProgram.balance);
          if (currentProgram?.tokenIds) {
            setTokenIds(currentProgram?.tokenIds);
          }
          setData(currentProgram.data);
        }
      })
      .catch((error: any) => {
        setFetchError("couldn't fetch program details...");
      })
      .finally(() => {
        setIsFetching(false);
      });
  }, [programAddress]);

  useEffect(() => {
    if (programAddress) {
      getProgram();
    } else {
      setIsFetching(false);
    }
  }, [getProgram, programAddress]);

  return {
    ownerAddress,
    programAccount,
    programAccountMetadata,
    programAccountData,
    programs,
    metadata,
    data,
    balance,
    tokenIds,
    programType,
    isFetching,
    getProgram,
    fetchError,
  };
}

export default useProgram;
