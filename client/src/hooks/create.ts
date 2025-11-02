import { useAccount } from "@starknet-react/core";
import { useCallback } from "react";
import { getGameAddress } from "@/config";
import useChain from "@/hooks/chain";
import { useExecuteCall } from "./useExecuteCall";

export const useCreate = () => {
  const { account } = useAccount();
  const { chain } = useChain();
  const { execute } = useExecuteCall();

  const create = useCallback(async () => {
    if (!account?.address) return false;

    const gameAddress = getGameAddress(chain.id);

    const { success } = await execute([
      {
        contractAddress: gameAddress,
        entrypoint: "create",
        calldata: [],
      },
    ]);

    return success;
  }, [account, chain, execute]);

  return {
    create,
  };
};

