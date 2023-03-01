/* eslint-disable sort-keys-fix/sort-keys-fix */
import { InjectedConnector } from 'wagmi/connectors/injected';
import { Chain } from '../../../components/RainbowKitProvider/RainbowKitChainContext';
import { Wallet } from '../../Wallet';

export interface FrontierWalletOptions {
  chains: Chain[];
}

export const frontierWallet = ({ chains }: FrontierWalletOptions): Wallet => {
  // `isFrontier` needs to be added to the wagmi `Ethereum` object
  const installed =
    typeof window !== 'undefined' &&
    // @ts-expect-error
    typeof window?.frontier !== 'undefined' &&
    // @ts-expect-error
    (window.frontier?.ethereum as any).isFrontier === true;

  return {
    id: 'frontier',
    name: 'Frontier Wallet',
    installed: installed,
    iconUrl: async () => (await import('./frontierWallet.svg')).default,
    iconBackground: '#CC703C',
    downloadUrls: {
      browserExtension:
        'https://chrome.google.com/webstore/detail/frontier-wallet/kppfdiipphfccemcignhifpjkapfbihd',
      android:
        'https://play.google.com/store/apps/details?id=com.frontierwallet',
      ios: 'https://apps.apple.com/us/app/frontier-crypto-defi-wallet/id1482380988',
      qrCode: 'https://www.frontier.xyz/download',
    },
    createConnector: () => ({
      connector: new InjectedConnector({
        chains,
        options: {
          getProvider: () =>
            //@ts-ignore
            installed ? (window.frontier?.ethereum as any) : undefined,
        },
      }),
    }),
  };
};
