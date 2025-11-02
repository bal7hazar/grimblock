import type ControllerConnector from "@cartridge/connector/controller";
import { useAccount } from "@starknet-react/core";
import { useCallback, useEffect, useState } from "react";
import { shortString } from "starknet";
import { getGameAddress } from "@/config";
import useChain from "@/hooks/chain";
import { useExecuteCall } from "./useExecuteCall";

export const useSpawn = () => {
  const { account, connector } = useAccount();
  const { chain } = useChain();
  const { execute } = useExecuteCall();

  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const c = connector as never as ControllerConnector;
    if (!c || !c.username || username) return;
    c.username()?.then((username) => {
      setUsername(username);
    });
  }, [connector]);

  const spawn = useCallback(
    async (playerName?: string) => {
      if (!account?.address) return false;

      const name = playerName || username;
      if (!name) return false;

      const gameAddress = getGameAddress(chain.id);

      const { success } = await execute([
        {
          contractAddress: gameAddress,
          entrypoint: "spawn",
          calldata: [shortString.encodeShortString(name)],
        },
      ]);

      return success;
    },
    [account, username, chain, execute],
  );

  return {
    spawn,
  };
};

