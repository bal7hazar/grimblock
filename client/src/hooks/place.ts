import { useAccount } from "@starknet-react/core";
import { useCallback } from "react";
import { getGameAddress } from "@/config";
import useChain from "@/hooks/chain";
import { useExecuteCall } from "./useExecuteCall";

export const usePlace = () => {
  const { account } = useAccount();
  const { chain } = useChain();
  const { execute } = useExecuteCall();

  const place = useCallback(
    async (gameId: number, pieceIndex: number, gridIndex: number) => {
      if (!account?.address) return false;

      const gameAddress = getGameAddress(chain.id);

      const { success } = await execute([
        {
          contractAddress: gameAddress,
          entrypoint: "place",
          calldata: [gameId, pieceIndex, gridIndex],
        },
      ]);

      return success;
    },
    [account, chain, execute],
  );

  return {
    place,
  };
};

