import { useEffect, useState } from "react";
import { fetchAddressDetails } from "@/lib/helpers";

export default function useUserAccount(address?: string | undefined) {
  const [account, setAccount] = useState<any>(null);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    if (address && address !== "undefined") {
      fetch();
    }
  }, [address]);

  const fetch = async () => {
    if (!address) return;
    setIsFetching(true);
    fetchAddressDetails({ address })
      .then((accountData) => {
        setAccount(accountData);
      })
      .finally(() => setIsFetching(false));
  };

  return { account, address, refetchAccount: fetch, isFetching };
}
