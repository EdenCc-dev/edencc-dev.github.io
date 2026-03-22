import { cosmos_cysic_devnet, cosmos_cysic_testnet } from "@/config/cosmos/cysicTestnet";
import { generateQueryString, getImageUrl } from "@/utils/tools";
import { coins } from "@cosmjs/proto-signing";

// @ts-ignore
export const isNewYear = window?.document.querySelector('html').classList.contains('new-year')

export const BIND_CHECK_PATHS = ["/zk", "/ai", "/m/zk", "/m/ai"];
export const NO_BIND_CHECK_PATHS = ['/leaderboard', '/contact-us', '/contactus', '/media-kit', "/mediakit", "/userPortal", "/zk/userPortal", "/zk/userPortal/serviceHub", "/userPortal/serviceHub", 
                                  '/m/contact-us', '/m/contactus', '/m/media-kit', "/m/mediakit", "/m/userPortal", "/m/zk/userPortal", "/m/zk/userPortal/serviceHub", "/m/userPortal/serviceHub"];
export const NO_CONTAINER_PATHS = ['/leaderboard', '/404', '/contact-us', '/contactus', '/media-kit', '/mediakit', '/hardware', '/zk', '/userPortal', '/zk/userPortal', '/zk/userPortal/serviceHub', '/userPortal/serviceHub',
                                 '/m/contact-us', '/m/contactus', '/m/media-kit', '/m/mediakit', '/m/hardware', '/m/zk', '/m/userPortal', '/m/zk/userPortal', '/m/zk/userPortal/serviceHub', '/m/userPortal/serviceHub']

export const baseStatus: any = {
  "0": "Pending",
  "1": "Online",
  "2": "Offline",
};

export const rewardStatus: any = {
  "0": "Pending",
  "1": "Claimed",
  "2": "No Reward",
};

export const proverStatus = baseStatus;

export const projectStatus = baseStatus;

export const verifierStatus = baseStatus;

export const verifierTaskStatus: any = {
  "0": "Pending",
  "1": "Accepted",
  "2": "Rejected",
};

export const taskStatus: any = {
  TaskStatusWaitSchedule: "Wait For Assign",
  TaskStatusWaitVerifier: "Wait For Verifier",
  TaskStatusFinishSuccess: "Finished",
  TaskStatusWaitProof: "Wait For Proof",
  TaskStatusMatchProviderFailed: "Failed",
  TaskStatusPublished: "Wait For Proof",
  TaskStatusFinishFailed: "Failed",
  TaskStatusInvalid: "Failed",
  TaskStatusMatchVerifierFailed: "Failed",
};

export const TaskStatus: any = {
  "0": taskStatus["TaskStatusPublished"],
  "1": taskStatus["TaskStatusWaitSchedule"],
  "2": taskStatus["TaskStatusWaitProof"],
  "3": taskStatus["TaskStatusWaitVerifier"],
  "100": taskStatus["TaskStatusFinishSuccess"],
  "200": taskStatus["TaskStatusFinishFailed"],
  "400": taskStatus["TaskStatusInvalid"],
  "40": taskStatus["TaskStatusMatchProviderFailed"],
  "401": taskStatus["TaskStatusMatchVerifierFailed"],
};

export const StatusColor: any = {
  "0": "#F0AE52",
  "1": "#75FF52",
  "2": "#FF5953",
}

export const TaskStatusColor: any = {
  "0": "#F0AE52",
  "1": "#F0AE52",
  "2": "#F0AE52",
  "3": "#F0AE52",
  
  "100": "#75FF52",

  "200": "#FF5953",
  "400": "#FF5953",
  "40": "#FF5953",
  "401": "#FF5953",
};

export const isQa = import.meta.env.VITE_APP_ENV == "qa";
export const isProd = import.meta.env.VITE_APP_ENV == "prod";

export const homeUrl = isProd ? 'https://cysic.xyz' : 'https://qa.prover.xyz'
export const appUrl = isProd ? 'https://app.cysic.xyz' : 'https://qa-app.prover.xyz'
export const resqUrl = isProd ? 'https://api.prover.xyz' : 'https://api-dev.prover.xyz'

export const enableSocialTask = true
export const enableBridge = false && isQa

export const cosmosCysicTestnet = isProd ? cosmos_cysic_testnet : cosmos_cysic_devnet;

export const mainUrl = import.meta.env.VITE_APP_BASE_URL;

export const baseHref = "";

export const defaultRewardAmount = 100;

export const commonPageSize = 10;

export const cosmosReservedValue = "0.1";

export const cysicBaseCoin = "CYS";
export const cysicStCoin = "CGT";

export const supTokens: any = {
  [cysicBaseCoin]: {
    name: cysicBaseCoin,
    icon: getImageUrl("@/assets/images/tokens/cysic.svg"),
  },
  [cysicStCoin]: {
    name: cysicStCoin,
    icon: getImageUrl("@/assets/images/tokens/cysic-light.svg"),
  },
};

export const cosmosFee = {
  amount: [
    {
      denom: cysicBaseCoin,
      amount: "200000",
    },
  ],
  gas: "2000000", // gas amount
};

export const cosmosFee_lower = {
  amount: coins(200000 / 2, cysicBaseCoin), // 5000 uatom
  gas: 2000000 / 2, // 200000 gas
};

export const keplrDownloadLink =
  "https://chromewebstore.google.com/detail/keplr/dmkamcknogkgcdfhhbddcghachkejeap";

export const blockTime = {
  short: 5_000,
  average: 10_000,
  long: 15_000,
};

export const twitterLink = `https://twitter.com/intent/tweet?${generateQueryString(
  {
    text: "Earn Cysic tokens as rewards while verifying and computing ZK proofs for top projects like @Scroll_ZKP and @AleoHQ, exclusively on @cysic_xyz. #cysictestnet \n\r ",
  }
)}`;

export const mediasLink = {
  gitbook: "https://docs.cysic.xyz/",
  whitePaper: "https://hackmd.io/@Cysic/H1XlGr0jle",
  discord: "https://t.co/V7D83oIVWE",
  twitter: "https://x.com/cysic_xyz",
  twitterKR: "https://x.com/cysic_kr",
  medium: "https://medium.com/@cysic",
  twitterWhitePaper: "https://x.com/cysic_xyz/status/1846960627878866984",
  telegram: "https://t.me/CysicHQ",
  telegramKR: "https://t.me/Cysic_Korea_Official",
  github: "https://github.com/cysic-labs",
  doc: "https://docs.cysic.xyz/",
  cosmosExplorer: "https://explorer.cysic.xyz/",
  evmExplorer: "https://explorer-evm.cysic.xyz/",
  contactUs: "https://cysic.xyz/contact-us"
};

export const downloadLink = {
  andorid: "https://statics.prover.xyz/app-release.apk",
  googlePlay: "https://play.google.com/store/apps/details?id=com.cysic.plus",
};


export const loginSignContent = "Welcome to Cysic！";
export const responseSuccessCode = 0;

export const classes = {
  subTitle: 'teachers-16-24-400 tracking-widest',
}


export const easterEggVisible = {
  ['2025_06_02']: false
}

export * from './evm'
export * from './abi/faucet'
export * from './abi/purchase'
export * from './abi/bridge'

export const useLocalBlog = true;