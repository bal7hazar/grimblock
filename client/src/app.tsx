import ControllerConnector from "@cartridge/connector/controller";
import type { ControllerOptions, SessionPolicies } from "@cartridge/controller";
import { type Chain, mainnet, sepolia } from "@starknet-react/chains";
import {
  type Connector,
  jsonRpcProvider,
  StarknetConfig,
  voyager,
} from "@starknet-react/core";
import { QueryClientProvider } from "@tanstack/react-query";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import {
  chains,
  DEFAULT_CHAIN_ID,
  getContractAddress,
} from "@/config";
import { Game } from "@/pages/game";
import { Home } from "@/pages/home";
import { queryClient } from "@/queries";
import { DojoSdkProviderInitialized } from "@/contexts/dojo";
import { EntitiesProvider } from "@/contexts/entities";
import { NAMESPACE } from "@/constants";

const provider = jsonRpcProvider({
  rpc: (chain: Chain) => {
    switch (chain) {
      case mainnet:
        return { nodeUrl: chain.rpcUrls.cartridge.http[0] };
      case sepolia:
        return { nodeUrl: chain.rpcUrls.cartridge.http[0] };
      default:
        throw new Error(`Unsupported chain: ${chain.network}`);
    }
  },
});

const buildPolicies = () => {
  const chain = chains[DEFAULT_CHAIN_ID];

  const gameAddress = getContractAddress(chain.id, NAMESPACE, "Play");

  const policies: SessionPolicies = {
    contracts: {
      [gameAddress]: {
        methods: [
          { entrypoint: "start" },
          { entrypoint: "set" },
          { entrypoint: "apply" },
        ],
      },
    },
  };

  return policies;
};

const buildChains = () => {
  const chain = chains[DEFAULT_CHAIN_ID];
  switch (chain) {
    case mainnet:
      return [{ rpcUrl: chain.rpcUrls.cartridge.http[0] }];
    case sepolia:
      return [{ rpcUrl: chain.rpcUrls.cartridge.http[0] }];
    default:
      throw new Error(`Unsupported chain: ${chain.network}`);
  }
};

const options: ControllerOptions = {
  defaultChainId: DEFAULT_CHAIN_ID,
  chains: buildChains(),
  policies: buildPolicies(),
  preset: "grim-block",
  namespace: "GRIMBLOCK",
  slot: "grimblock",
};

const connectors = [new ControllerConnector(options) as never as Connector];

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <StarknetConfig
          autoConnect
          chains={[chains[DEFAULT_CHAIN_ID]]}
          connectors={connectors}
          explorer={voyager}
          provider={provider}
        >
          <DojoSdkProviderInitialized>
            <EntitiesProvider>
              <Router>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/:gameId" element={<Game />} />
                  {/* <Route path="/selection" element={<Selection />} />
                  <Route path="/factories" element={<Factories />} /> */}
                </Routes>
              </Router>
            </EntitiesProvider>
          </DojoSdkProviderInitialized>
        </StarknetConfig>
      </QueryClientProvider>
      <Toaster position="top-right" richColors />
    </>
  );
}

export default App;
