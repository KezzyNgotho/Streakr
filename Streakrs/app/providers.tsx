"use client";

import { type ReactNode } from "react";
import { base } from "wagmi/chains";
import { MiniKitProvider } from "@coinbase/onchainkit/minikit";
import { StreakProvider } from "./context/StreakContext";
import { AvatarProvider } from "./context/AvatarContext";
import { WagmiProvider, createConfig, http } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const config = createConfig({
  chains: [base],
  transports: {
    [base.id]: http(),
  },
});

const queryClient = new QueryClient();

export function Providers(props: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <StreakProvider>
          <AvatarProvider>
            <MiniKitProvider
              apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
              chain={base}
              config={{
                appearance: {
                  mode: "auto",
                  theme: "mini-app-theme",
                  name: process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME,
                  logo: process.env.NEXT_PUBLIC_ICON_URL,
                },
              }}
            >
              {props.children}
            </MiniKitProvider>
          </AvatarProvider>
        </StreakProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
