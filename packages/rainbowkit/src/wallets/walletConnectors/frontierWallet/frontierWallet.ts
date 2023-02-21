/* eslint-disable sort-keys-fix/sort-keys-fix */
import { InjectedConnector } from 'wagmi/connectors/injected';
import { Chain } from '../../../components/RainbowKitProvider/RainbowKitChainContext';
import { Wallet } from '../../Wallet';
import { getWalletConnectConnector } from '../../getWalletConnectConnector';

export interface FrontierWalletOptions {
  chains: Chain[];
}

export const frontierWallet = ({ chains }: FrontierWalletOptions): Wallet => {
  // `isFrontier` needs to be added to the wagmi `Ethereum` object
  const isFrontierInjected =
    typeof window !== 'undefined' &&
    // @ts-expect-error
    typeof window.frontier !== 'undefined' &&
    // @ts-expect-error
    typeof window.frontier.ethereum !== 'undefined';

  const shouldUseWalletConnect = !isFrontierInjected;
  return {
    id: 'frontier',
    name: 'Frontier Wallet',
    iconUrl: async () => (await import('./frontierWallet.svg')).default,
    iconAccent: '#CC703C',
    iconBackground: '#CC703C',
    installed: !shouldUseWalletConnect ? isFrontierInjected : undefined,
    downloadUrls: {
      browserExtension:
        'https://chrome.google.com/webstore/detail/frontier-wallet/kppfdiipphfccemcignhifpjkapfbihd',
      android:
        'https://play.google.com/store/apps/details?id=com.frontierwallet&hl=en_IN&gl=US&pli=1',
      ios: 'https://testflight.apple.com/join/y14q4dPW',
      qrCode: 'https://www.frontier.xyz/download',
    },
    createConnector: () => {
      const connector = shouldUseWalletConnect
        ? getWalletConnectConnector({ chains })
        : new InjectedConnector({
            chains,
            options: {
              // @ts-expect-error
              getProvider: () => window.frontier.ethereum,
            },
          });
      const getUri = async () => (await connector.getProvider())?.connector.uri;
      return {
        connector,
        mobile: {
          getUri: shouldUseWalletConnect ? getUri : undefined,
        },
        qrCode: shouldUseWalletConnect
          ? {
              getUri,
              instructions: {
                learnMoreUrl: 'https://www.frontier.xyz/',
                steps: [
                  {
                    description:
                      'We recommend putting Frontier Wallet on your home screen for quicker access.',
                    step: 'install',
                    title: 'Open the Frontier Wallet app',
                  },
                  {
                    description:
                      'Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone.',
                    step: 'create',
                    title: 'Create or Import a Wallet',
                  },
                  {
                    description:
                      'After you scan, a connection prompt will appear for you to connect your wallet.',
                    step: 'scan',
                    title: 'Tap the scan button',
                  },
                ],
              },
            }
          : undefined,
        extension: {
          learnMoreUrl: 'https://www.frontier.xyz/',
          instructions: {
            steps: [
              {
                description:
                  'We recommend pinning Frontier Wallet to your taskbar for quicker access to your wallet.',
                step: 'install',
                title: 'Install the Frontier Wallet extension',
              },
              {
                description:
                  'Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone.',
                step: 'create',
                title: 'Create or Import a Wallet',
              },
              {
                description:
                  'Once you set up your wallet, click below to refresh the browser and load up the extension.',
                step: 'refresh',
                title: 'Refresh your browser',
              },
            ],
          },
        },
      };
    },
  };
};
