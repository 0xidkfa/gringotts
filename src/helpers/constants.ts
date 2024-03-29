import { providers } from 'ethers';
import { bn } from './utils';

export const DEGENBOX_ADDRESS = '0xd96f48665a1410C0cd669A88898ecA36B9Fc2cce';
export const MIM_CONTRACT_ADDR = '0x99D8a9C45b2ecA8864373A26D1459e3Dff1e17F3';
export const REPAY_HELPER_ADDR = '0x8f7405d5738468863A516B3Cb6C8984845983D9e';
export const MIM_TREASURY_ADDR = '0xDF2C270f610Dc35d8fFDA5B453E74db5471E126B';
export const SPELL_REWARD_DISTRIBUTOR_ADDR = '0x953dab0e64828972853e7faa45634620a40fa479';

export const CRV_CAULDRONS = [
  '0x207763511da879a900973A5E092382117C3c1588',
  '0x7d8dF3E4D06B0e19960c19Ee673c0823BEB90815',
];

export const CRV_LENS_ADDR = '0xC93E1daFf233Df6cc7F811C9dca7721709804016';
export const MARKET_LENS_ADDR = '0x1d17009dde57caea3dc614962a6c01420776523f';
export const MAX_REFUND_RATE = bn(700); // 18% - 11%
export const BPS = bn(10000);
export const WEEKS_IN_YEAR = 52;

export const ALCHEMY_PROVIDER = new providers.AlchemyProvider('mainnet', process.env.ALCHEMY_KEY);

export const GITHUB_ICON =
  'M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z';
