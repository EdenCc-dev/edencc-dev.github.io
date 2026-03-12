import { baseHref, enableBridge } from "@/config";
// 生态系统项目数据
export interface IEcosystemProject {
  projectName: string;
  category: string;     // 主要类别
  subLabel?: string[];    // 子标签
  blurb: string;
  websiteLink: string;
  twitterLink?: string;
  img?: string;
  className?: string;
}

export const ecosystemProjects: IEcosystemProject[] = [
  {
    projectName: "Aleo",
    category: "ZK Ecosystem",
    subLabel: ["L1"],
    blurb: "A Layer 1 blockchain focused on privacy using Zero-Knowledge proofs.",
    websiteLink: "https://aleo.org",
    twitterLink: "https://twitter.com/AleoHQ",
    img: 'https://aleo.org/favicon.ico'
  },
  {
    projectName: "Scroll",
    category: "ZK Ecosystem",
    subLabel: ["zkEVM", "L2"],
    blurb: "zkEVM-based Ethereum scaling solution offering high throughput.",
    websiteLink: "https://scroll.io",
    twitterLink: "https://twitter.com/Scroll_ZKP",
    img: `${baseHref}/ecosystems/scroll.png`
  },
  {
    projectName: "Herodotus",
    category: "ZK Ecosystem",
    subLabel: ["Coprocessor"],
    blurb: "A zk-based coprocessor to accelerate computation for privacy-preserving applications.",
    websiteLink: "https://herodotus.dev/",
    twitterLink: "https://x.com/HerodotusDev",
    img: 'https://framerusercontent.com/images/OIX9nWGXOspHKc1iMdyOfDLack.jpg'
  },
  {
    projectName: "zkSync",
    category: "ZK Ecosystem",
    subLabel: ["zkEVM", "L2"],
    blurb: "zkEVM Ethereum scaling solution for low-cost, high-speed transactions.",
    websiteLink: "https://zksync.io",
    twitterLink: "https://twitter.com/zksync",
    img: "https://zksync.io/favicon.ico"
  },
  {
    projectName: "Nil",
    category: "ZK Ecosystem",
    subLabel: ["zkEVM"],
    blurb: "zkEVM Ethereum-compatible scaling solution using ZK technology.",
    websiteLink: "https://nil.foundation",
    twitterLink: "https://x.com/nil_foundation",
    img: "https://nil.foundation/favicon.ico"
  },
  {
    projectName: "Kakarot",
    category: "ZK Ecosystem",
    subLabel: ["zkEVM"],
    blurb: "zkEVM solution for Ethereum scalability and privacy.",
    websiteLink: "https://www.kakarot.org/",
    twitterLink: "https://x.com/KakarotZkEvm",
    img: "https://www.kakarot.org/favicon.ico"
  },
  {
    projectName: "Axiom",
    category: "ZK Ecosystem",
    subLabel: ["Coprocessor", "Infrastructure"],
    blurb: "A Zero-Knowledge Virtual Machine (zkVM) focused on optimized computation.",
    websiteLink: "https://www.axiom.xyz/",
    twitterLink: "https://x.com/axiom_xyz",
    img: "https://www.axiom.xyz/favicon.ico"
  },
  {
    projectName: "Talus",
    category: "AI Ecosystem",
    subLabel: ["L1"],
    blurb: "AI-driven layer 1 blockchain with decentralized learning protocols.",
    websiteLink: "https://talus.network/",
    twitterLink: "https://x.com/TalusNetwork",
    img: "https://talus.network/favicon.ico"
  },
  {
    projectName: "Risc0",
    category: "ZK Ecosystem",
    subLabel: ["zkVM", "Prover Network"],
    blurb: "zkVM and prover network for scalable privacy-preserving applications.",
    websiteLink: "https://risczero.com/",
    twitterLink: "https://x.com/RiscZero",
    img: "https://risczero.com/favicon.ico"
  },
  {
    projectName: "Modulus Labs",
    category: "AI Ecosystem",
    subLabel: [],
    blurb: "AI-powered research platform designed to simplify complex analytics.",
    websiteLink: "https://www.accountablemagic.com/",
    twitterLink: "https://x.com/CountableMagic",
    img: "https://cdn.prod.website-files.com/65267f6e8ea365a401a494af/6526842bb9b4730c56d41859_ModulusFav.svg"
  },
  {
    projectName: "Swaps.io",
    category: "ZK Ecosystem",
    subLabel: ["DEX"],
    blurb: "A decentralized exchange (DEX) using Zero-Knowledge technology.",
    websiteLink: "https://swaps.io/",
    twitterLink: "https://x.com/swaps_io",
    img: "https://swaps.io/favicon.svg"
  },
  {
    projectName: "Human.tech",
    category: "ZK Ecosystem",
    subLabel: ["Identity", "Infrastructure"],
    blurb: "ZK-powered identity solutions aimed at privacy and security.",
    websiteLink: "https://human.tech/",
    twitterLink: "https://x.com/0xHolonym",
    img: "https://framerusercontent.com/images/MfzJt36W3AKemHuoLGmSu4pbmDY.svg"
  },
  {
    projectName: "Nexus",
    category: "ZK Ecosystem",
    subLabel: ["zkVM", "Prover Network"],
    blurb: "A privacy-focused prover network using zkVM technology.",
    websiteLink: "https://nexus.xyz/",
    twitterLink: "https://x.com/NexusLabs",
    img: "https://framerusercontent.com/images/OBaE9BakVA3OGSSdA26WHkSl9Y.png"
  },
  {
    projectName: "Manta",
    category: "ZK Ecosystem",
    subLabel: ["L2"],
    blurb: "Modular Layer 2 solutions built on ZK technology.",
    websiteLink: "https://manta.network",
    twitterLink: "https://x.com/MantaNetwork",
    img: "https://manta.network/assets/img/favicon.ico"
  },
  {
    projectName: "Succinct",
    category: "ZK Ecosystem",
    subLabel: ["Infrastructure"],
    blurb: "Potential ZK solution for infrastructure scaling.",
    websiteLink: "https://www.succinct.xyz/",
    twitterLink: "https://x.com/SuccinctLabs",
    img: "https://cdn.prod.website-files.com/670670901c57408478ad4a9f/67126e983a9ade57424cef02_favicon.svg"
  },
  {
    projectName: "zkCloud",
    category: "ZK Ecosystem",
    subLabel: ["Infrastructure"],
    blurb: "ZK-powered cloud computing infrastructure for privacy and scalability.",
    websiteLink: "https://zkcloud.com/",
    twitterLink: "https://x.com/thezkcloud",
    img: "https://zkcloud.com/favicon.svg"
  },
  {
    projectName: "ZKM",
    category: "ZK Ecosystem",
    subLabel: ["Infrastructure"],
    blurb: "Privacy-focused infrastructure powered by ZK technology.",
    websiteLink: "https://www.zkm.io/",
    twitterLink: "https://x.com/ProjectZKM",
    img: "https://cdn.prod.website-files.com/649f0dfbf8603574bb225beb/649f4b5be8a782359402220f_favicon.png"
  },
  {
    projectName: "zkPass",
    category: "ZK Ecosystem",
    subLabel: ["Identity"],
    blurb: "Privacy-focused identity solutions based on Zero-Knowledge proofs.",
    websiteLink: "https://zkpass.org",
    twitterLink: "https://x.com/zkPass",
    img: "https://zkpass.org/favicon.ico"
  },
  {
    projectName: "Blocksense",
    category: "ZK Ecosystem",
    subLabel: ["Oracle"],
    blurb: "Decentralized oracles using Zero-Knowledge proofs for enhanced privacy.",
    websiteLink: "https://blocksense.network/",
    twitterLink: "https://x.com/blocksense_",
    img: "https://framerusercontent.com/images/tsPdD3XPNgRUriSWHRBSnYkdSM.png"
  },
  {
    projectName: "zPrize",
    category: "ZK Ecosystem",
    subLabel: ["Prize Competition"],
    blurb: "A competition promoting innovation in Zero-Knowledge Proofs.",
    websiteLink: "https://www.zprize.io/",
    twitterLink: "https://x.com/z_prize",
    img: "https://cdn.prod.website-files.com/621ce49c2450667f776c49d8/621d32da167b3f3c45157f59_ZPrize%20Favicon.png"
  },
  {
    projectName: "ETHProofs",
    category: "ZK Ecosystem",
    subLabel: ["Infrastructure"],
    blurb: "Ethereum-based Zero-Knowledge Proof technology for",
    websiteLink: "https://ethproofs.org/",
    twitterLink: "https://x.com/eth_proofs",
    img: "https://ethproofs.org/favicon.ico"
  },
  {
    projectName: "Polyhedra",
    category: "ZK Ecosystem",
    subLabel: ["Bridge", "Infrastructure"],
    blurb: "A cross-chain solution leveraging ZK proofs for secure interoperability.",
    websiteLink: "https://www.polyhedra.network/",
    twitterLink: "https://x.com/PolyhedraZK",
    img: "https://visual-asset.polyhedra.network/Logo/Polyhedra/Polyhedra-Symbol-Favicon.svg"
  },
  {
    projectName: "Brevis",
    category: "ZK Ecosystem",
    subLabel: ["Oracle", "Infrastructure"],
    blurb: "A decentralized oracle infrastructure powered by Zero-Knowledge proofs.",
    websiteLink: "https://brevis.network/",
    twitterLink: "https://x.com/brevis_zk",
    img: "https://brevis.network/logo.svg",
    className: "bg-[transparent]"
  },
  {
    projectName: "Metamask",
    category: "Wallet",
    subLabel: [],
    blurb: "A popular cryptocurrency wallet for managing digital assets and DeFi activities.",
    websiteLink: "https://metamask.io",
    twitterLink: "https://x.com/MetaMask",
    img: "https://metamask.io/favicon.ico"
  },
  {
    projectName: "Keplr",
    category: "Wallet",
    subLabel: [],
    blurb: "A wallet for Cosmos-based blockchains, providing decentralized access.",
    websiteLink: "https://keplr.app",
    twitterLink: "https://x.com/keplrwallet",
    img: "https://cdn.prod.website-files.com/667dc891bc7b863b5397495b/6721178f6104dd9d32bfcf3e_32.png"
  },
  {
    projectName: "OKX Wallet",
    category: "Wallet",
    subLabel: [],
    blurb: "OKX's official wallet for storing and trading crypto assets.",
    websiteLink: "https://www.okx.com",
    twitterLink: "https://x.com/okx",
    img: "https://www.okx.com/cdn/assets/imgs/253/59830BB78B18A776.png"
  },
  {
    projectName: "Fox Wallet",
    category: "Wallet",
    subLabel: [],
    blurb: "A crypto wallet (uncertain if active or official).",
    websiteLink: "https://foxwallet.com/",
    twitterLink: "https://x.com/FoxWallet",
    img: "https://foxwallet.com/favicon.ico"
  },
  {
    projectName: "Cysic Bridge",
    category: "Bridge",
    subLabel: [],
    blurb: "The bridge solution developed by Cysic Network.",
    websiteLink: enableBridge ? "https://cysic.xyz/bridge" : "",
    twitterLink: "",
    img: "https://cysic.xyz/assets/logo.svg",
    className: "bg-[transparent]"
  },
  {
    projectName: "BlockScout",
    category: "Infrastructure",
    subLabel: ["Tooling"],
    blurb: "Open-source block explorer for Ethereum and Ethereum-compatible networks.",
    websiteLink: "https://www.blockscout.com/",
    twitterLink: "https://x.com/blockscout",
    img: "https://cdn.prod.website-files.com/637232ff20f97141fc60d89c/63748f26b22bb3e3ab1fed5d_favicon_256.png"
  },
  {
    projectName: "Privy",
    category: "Infrastructure",
    subLabel: ["Tooling"],
    blurb: "Privacy-preserving tooling for blockchain developers.",
    websiteLink: "https://www.privy.io/",
    twitterLink: "https://x.com/privy_io",
    img: "https://framerusercontent.com/images/oPqxoNxeHrQ9qgbjTUGuANdXdQ.png"
  },
  {
    projectName: "Cosmos SDK",
    category: "Infrastructure",
    subLabel: ["Tooling"],
    blurb: "Framework for building application-specific blockchains.",
    websiteLink: "https://docs.cosmos.network/",
    twitterLink: "https://x.com/cosmos_sdk",
    img: "https://docs.cosmos.network/img/favicon.svg",
    className: "bg-[transparent]"
  },
  {
    projectName: "Cysic AMM",
    category: "Infrastructure",
    subLabel: ["DEX"],
    blurb: "Cysic's decentralized automated market maker.",
    websiteLink: "",
    twitterLink: "",
    img: "https://cysic.xyz/assets/logo.svg",
    className: "bg-[transparent]"
  },
  {
    projectName: "AntEX",
    category: "Infrastructure",
    subLabel: ["DEX"],
    blurb: "Decentralized exchange",
    websiteLink: "",
    twitterLink: "",
    img: ""
  },
  {
    projectName: "Ankr",
    category: "Infrastructure",
    subLabel: [],
    blurb: "Decentralized cloud infrastructure provider.",
    websiteLink: "https://www.ankr.com",
    twitterLink: "https://x.com/ankr",
    img: "https://www.ankr.com/static/favicon/apple-touch-icon.png"
  },
  {
    projectName: "Chainlink",
    category: "Infrastructure",
    subLabel: ["Oracle"],
    blurb: "Decentralized oracle network for smart contracts.",
    websiteLink: "https://chain.link",
    twitterLink: "https://x.com/chainlink",
    img: "https://cdn.prod.website-files.com/5f6b7190899f41fb70882d08/66570856a4d306e3381b870f_webclip.png"
  },
  {
    projectName: "Alchemy",
    category: "Infrastructure",
    subLabel: [],
    blurb: "Blockchain development platform offering tools and infrastructure.",
    websiteLink: "https://www.alchemy.com",
    twitterLink: "https://x.com/Alchemy",
    img: "https://www.alchemy.com/favicon.ico"
  },
  {
    projectName: "OpenSea",
    category: "Infrastructure",
    subLabel: ["NFT"],
    blurb: "The largest NFT marketplace for buying and selling digital art.",
    websiteLink: "https://opensea.io",
    twitterLink: "https://x.com/opensea",
    img: "https://opensea.io/favicon.ico"
  },
  {
    projectName: "OKX NFT Marketplace",
    category: "Infrastructure",
    subLabel: ["NFT"],
    blurb: "OKX's NFT marketplace offering digital art and collectibles.",
    websiteLink: "https://www.okx.com",
    twitterLink: "https://x.com/okx",
    img: "https://www.okx.com/cdn/assets/imgs/253/59830BB78B18A776.png"
  },
  {
    projectName: "Tornado Cash",
    category: "Infrastructure",
    subLabel: ["Privacy"],
    blurb: "Privacy-enhancing tool for Ethereum transactions.",
    websiteLink: "https://tornadocash-eth.ipns.dweb.link/",
    twitterLink: "https://x.com/TornadoCash",
    img: "https://pbs.twimg.com/profile_images/1154798570047967233/ZINt8NSB_400x400.jpg"
  },
  {
    projectName: "Cysic Intelligence",
    category: "AI Ecosystem",
    subLabel: [],
    blurb: "AI-powered solutions integrated with blockchain technologies.",
    websiteLink: "",
    twitterLink: "",
    img: "https://cysic.xyz/assets/logo.svg",
    className: "bg-[transparent]"
  },
  {
    projectName: "Aspecta",
    category: "AI Ecosystem",
    subLabel: ["Identity"],
    blurb: "AI-driven identity solution for decentralized systems.",
    websiteLink: "https://aspecta.ai/",
    twitterLink: "https://x.com/aspecta_ai",
    img: "https://aspecta.ai/favicon.ico"
  },
  {
    projectName: "Inference Labs",
    category: "AI Ecosystem",
    subLabel: [],
    blurb: "AI-focused research lab for future technologies.",
    websiteLink: "https://inferencelabs.com/",
    twitterLink: "https://x.com/inference_labs",
    img: "https://cdn.prod.website-files.com/666760929427ffac7da1f179/6686c3e974048ab40a6d012a_icon.png"
  },
  {
    projectName: "Eternis AI",
    category: "AI Ecosystem",
    subLabel: [],
    blurb: "AI platform for decentralized applications.",
    websiteLink: "https://www.eternis.ai/",
    twitterLink: "https://x.com/eternisai",
    img: "https://www.eternis.ai/favicon.svg"
  },
  {
    projectName: "Gensyn",
    category: "AI Ecosystem",
    subLabel: [],
    blurb: "AI infrastructure with scalability for blockchain projects.",
    websiteLink: "https://www.gensyn.ai/",
    twitterLink: "https://x.com/gensynai",
    img: "https://cdn.prod.website-files.com/666760929427ffac7da1f179/6686c3e974048ab40a6d012a_icon.png"
  },
  {
    projectName: "P2P",
    category: "Infrastructure",
    subLabel: ["Operator"],
    blurb: "Peer-to-peer validator network for decentralized applications.",
    websiteLink: "https://www.p2p.org/staking-as-a-business",
    twitterLink: "https://x.com/P2Pvalidator",
    img: "https://cdn.prod.website-files.com/661ce38fc2cbb4e39a655100/6790f5b6deab899da633b710_p2p-webclip.svg"
  },
  {
    projectName: "OKX",
    category: "Infrastructure",
    subLabel: ["Operator", "CEX"],
    blurb: "Centralized exchange offering validator services.",
    websiteLink: "https://www.okx.com",
    twitterLink: "https://x.com/okx",
    img: "https://www.okx.com/cdn/assets/imgs/253/59830BB78B18A776.png"
  },
  {
    projectName: "Noble",
    category: "Infrastructure",
    subLabel: ["Stablecoin"],
    blurb: "Stablecoin project focused on the Cosmos ecosystem.",
    websiteLink: "https://www.noble.xyz/",
    twitterLink: "https://x.com/noble_xyz",
    img: "https://framerusercontent.com/images/XdcD0abLVZF0aVw8YeT8rU7N9TE.png"
  },
  {
    projectName: "Mina",
    category: "ZK Ecosystem",
    subLabel: ["L1"],
    blurb: "Mina is a zero knowledge (ZK) blockchain for proving anything. Building towards the private, provable web.",
    websiteLink: "https://minaprotocol.com/",
    twitterLink: "https://x.com/MinaProtocol",
    img: "https://minaprotocol.com/wp-content/uploads/Favicon-4x.png",
    className: "bg-[transparent]"
  },
  {
    projectName: "Nexus",
    category: "AI Ecosystem",
    subLabel: ["L1"],
    blurb: "The Layer 1 Supercomputer built for mass adoption.",
    websiteLink: "https://nexus.xyz/",
    twitterLink: "https://x.com/NexusLabs",
    img: "https://framerusercontent.com/images/AeDwlPlZaXChRFVGExpfgFn1crs.png",
    className: "bg-[transparent]"
  },
  {
    projectName: "Ora",
    category: "AI Ecosystem",
    subLabel: [],
    blurb: "World Intelligence",
    websiteLink: "https://www.ora.io/",
    twitterLink: "https://x.com/OraProtocol",
    img: "https://www.ora.io/favicon.jpg"
  },
  {
    projectName: "Electron Labs",
    category: "ZK Ecosystem",
    subLabel: [],
    blurb: "Reducing TEE and ZK verification costs by 95%.",
    websiteLink: "https://electron.dev/",
    twitterLink: "https://x.com/ElectronZK",
    img: "https://framerusercontent.com/images/rFGqDZnzrdEQTybRfPzhIgI4g.png"
  },
  {
    projectName: "zkLink Nova",
    category: "ZK Ecosystem",
    subLabel: [],
    blurb: "Nova, the multi-rollup Aggregated Layer 3 zkEVM network with liquidity from any L2s.",
    websiteLink: "https://zklink.io/",
    twitterLink: "https://x.com/zkLink_Official",
    img: "https://zklink.io/favicon.ico"
  },
  {
    projectName: "ChainUp",
    category: "Infrastructure",
    subLabel: [],
    blurb: "Secure, Compliant, Innovative B2B Digital Asset Solutions CEX/DEX SaaS, Liquidity, Custody, MPC Wallet, KYT, Tokenization & more",
    websiteLink: "https://www.chainup.com/",
    twitterLink: "https://x.com/ChainUpOfficial",
    img: "https://www.chainup.com/images/home/header/logo_white.svg",
    className: "bg-[transparent]"
  },
  {
    projectName: "Intmax",
    category: "ZK Ecosystem",
    subLabel: ["L2"],
    blurb: "A zkRollup with a stateless architecture. Achieving hyper-scaling and privacy at the same time.",
    websiteLink: "https://www.intmax.io/",
    twitterLink: "https://x.com/intmaxIO",
    img: "https://www.intmax.io/favicon.ico"
  },
  {
    projectName: "6block",
    category: "Infrastructure",
    subLabel: [],
    blurb: "Crypto mining and staking solution provider",
    websiteLink: "https://6block.com/",
    twitterLink: "https://x.com/6block_official",
    img: "https://6block.com/favicon.ico"
  },
  {
    projectName: "DBunker",
    category: "Infrastructure",
    subLabel: [],
    blurb: "Liquid & Aggregated Mining for DePIN & AI",
    websiteLink: "https://www.dbunker.xyz/",
    twitterLink: "https://x.com/Dbunker_Network",
    img: "https://www.dbunker.xyz/favicon.ico"
  },
  {
    projectName: "Nubit",
    category: "Infrastructure",
    subLabel: [],
    blurb: "A Bitcoin-native infrastructure layer",
    websiteLink: "https://www.nubit.org",
    twitterLink: "https://x.com/Nubit_org",
    img: "https://www.nubit.org/favicon.ico"
  }
];

// 提取所有类别和子标签
const uniqueCategories = Array.from(new Set(ecosystemProjects.map(p => p.category)));
export const ecosystemCategories = ['ALL', ...uniqueCategories];

// 按类别分组项目
export const ecosystemProjectsMap = ecosystemProjects.reduce((acc, project) => {
  acc[project.category] = [...(acc[project.category] || []), project];
  return acc;
}, {} as Record<string, IEcosystemProject[]>);

// 提取所有子标签
const allSubLabels = ecosystemProjects
  .map(p => p.subLabel || "")
  .filter(Boolean)
  .filter((value, index, self) => self.indexOf(value) === index)
  .sort();

export const ecosystemSubLabels = ['ALL', ...allSubLabels];

// 更新标签颜色配置
export const ecosystemCategoriesTagColor: Record<string, string> = {
  "ALL": "bg-purple-500/30 border border-purple-500/60",
  "ZK Ecosystem": "bg-pink-500/30 border border-pink-500/60",
  "AI Ecosystem": "bg-cyan-600/30 border border-cyan-600/60",
  "Infrastructure": "bg-blue-600/30 border border-blue-600/60",
  "Wallet": "bg-emerald-400/30 border border-emerald-400/60",
  "Bridge": "bg-blue-500/30 border border-blue-500/60",
  "Social": "bg-emerald-600/30 border border-emerald-600/60"
};

// 子标签颜色
export const ecosystemSubLabelsTagColor: Record<string, string> = {
  "ALL": "bg-purple-500/30 border border-purple-500/60",
  "L1": "bg-pink-600/30 border border-pink-600/60",
  "L2": "bg-rose-600/30 border border-rose-600/60",
  "zkEVM": "bg-pink-500/30 border border-pink-500/60",
  "Coprocessor": "bg-cyan-600/30 border border-cyan-600/60",
  "Infrastructure": "bg-blue-600/30 border border-blue-600/60",
  "Identity": "bg-purple-700/30 border border-purple-700/60",
  "zkVM": "bg-rose-500/30 border border-rose-500/60",
  "Prover Network": "bg-rose-500/30 border border-rose-500/60",
  "DEX": "bg-[#19FFE0]/30 border border-[#19FFE0]/60",
  "Oracle": "bg-teal-500/30 border border-teal-500/60",
  "Prize Competition": "bg-amber-500/30 border border-amber-500/60",
  "Bridge": "bg-blue-500/30 border border-blue-500/60",
  "Tooling": "bg-cyan-500/30 border border-cyan-500/60",
  "Lending": "bg-yellow-500/30 border border-yellow-500/60",
  "NFT": "bg-orange-400/30 border border-orange-400/60",
  "Privacy": "bg-violet-700/30 border border-violet-700/60",
  "Operator": "bg-red-500/30 border border-red-500/60",
  "CEX": "bg-red-500/30 border border-red-500/60",
  "Stablecoin": "bg-purple-600/30 border border-purple-600/60",
  "Data Availability": "bg-orange-500/30 border border-orange-500/60"
};

// 确保所有类别都有颜色
ecosystemCategories.forEach(category => {
  if (!ecosystemCategoriesTagColor[category]) {
    // 如果某个类别没有预定义颜色，则分配默认颜色
    ecosystemCategoriesTagColor[category] = "bg-gray-500/30 border border-gray-500/60";
    console.warn(`Category without predefined color: ${category}`);
  }
});

// 确保所有子标签都有颜色
ecosystemSubLabels.forEach(subLabel => {
  if (!ecosystemSubLabelsTagColor[subLabel]) {
    // 如果某个子标签没有预定义颜色，则分配默认颜色
    ecosystemSubLabelsTagColor[subLabel] = "bg-gray-500/30 border border-gray-500/60";
    console.warn(`SubLabel without predefined color: ${subLabel}`);
  }
});


export const ecosystemProjectsShowInHome = ecosystemProjects?.slice(0, 8)
