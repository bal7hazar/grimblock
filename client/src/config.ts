import { createDojoConfig } from "@dojoengine/core";
import { mainnet, sepolia } from "@starknet-react/chains";
import { shortString } from "starknet";
import manifestMainnet from "../../manifest_mainnet.json"; // todo: update when deployed
import manifestSepolia from "../../manifest_sepolia.json";
import { NAMESPACE } from "@/constants";

export const DEFAULT_CHAIN = import.meta.env.VITE_DEFAULT_CHAIN;
export const DEFAULT_CHAIN_ID = shortString.encodeShortString(
  import.meta.env.VITE_DEFAULT_CHAIN,
);

export const SEPOLIA_CHAIN_ID = shortString.encodeShortString("SN_SEPOLIA");
export const MAINNET_CHAIN_ID = shortString.encodeShortString("SN_MAIN");

export const chainName = {
  [SEPOLIA_CHAIN_ID]: "Starknet Sepolia",
  [MAINNET_CHAIN_ID]: "Starknet Mainnet",
};

export const manifests = {
  [SEPOLIA_CHAIN_ID]: manifestSepolia,
  [MAINNET_CHAIN_ID]: manifestMainnet,
};

export const chains = {
  [SEPOLIA_CHAIN_ID]: sepolia,
  [MAINNET_CHAIN_ID]: mainnet,
};

const dojoConfigSepolia = createDojoConfig({
  rpcUrl: import.meta.env.VITE_SEPOLIA_RPC_URL,
  toriiUrl: import.meta.env.VITE_SEPOLIA_TORII_URL,
  manifest: manifestSepolia,
});

const dojoConfigMainnet = createDojoConfig({
  rpcUrl: import.meta.env.VITE_MAINNET_RPC_URL,
  toriiUrl: import.meta.env.VITE_MAINNET_TORII_URL,
  manifest: manifestMainnet,
});

export const dojoConfigs = {
  [SEPOLIA_CHAIN_ID]: dojoConfigSepolia,
  [MAINNET_CHAIN_ID]: dojoConfigMainnet,
};

export const getContractAddress = (
  chainId: bigint,
  namespace: string,
  contractName: string,
) => {
  const chainIdHex = `0x${chainId.toString(16)}`;

  const manifest = manifests[chainIdHex];
  const contract = manifest.contracts.find(
    (i: { tag: string }) => i.tag === `${namespace}-${contractName}`,
  );
  return contract!.address;
};

export const getGameAddress = (chainId: bigint) => {
  return getContractAddress(chainId, NAMESPACE, "Play");
};
