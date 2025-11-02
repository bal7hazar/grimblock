import { useAccount } from "@starknet-react/core";
import { useCallback } from "react";
import { shortString } from "starknet";
import { getGameAddress } from "@/config";
import useChain from "@/hooks/chain";
import { useExecuteCall } from "./useExecuteCall";

export const useRename = () => {
  const { account } = useAccount();
  const { chain } = useChain();
  const { execute } = useExecuteCall();

  const rename = useCallback(
    async (playerName: string) => {
      if (!account?.address || !playerName) return false;

      const gameAddress = getGameAddress(chain.id);

      const { success } = await execute([
        {
          contractAddress: gameAddress,
          entrypoint: "rename",
          calldata: [shortString.encodeShortString(playerName)],
        },
      ]);

      return success;
    },
    [account, chain, execute],
  );

  return {
    rename,
  };
};

