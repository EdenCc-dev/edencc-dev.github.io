import { useLocalBlog } from "@/config"
import { getImageUrl } from "@/utils/tools"

export const academyConfig = [
    {
        title: "Hypercube IR",
        subTitle: "The Foundation of Zero-Knowledge Proof System",
        href: useLocalBlog ? "/blog/ByY3L5hkl".toLowerCase() : "https://hackmd.io/@Cysic/ByY3_L5hkl",
    },
    {
        title: "How Fast We Can Go",
        subTitle: "Proving Million Keccak Function Per Second",
        href: useLocalBlog ? "/blog/r1LoS0MmJg".toLowerCase() : "https://hackmd.io/@Cysic/r1LoS0MmJg",
    },
    // {
    //     title: "Cysic Network Whitepaper",
    //     href: "https://hackmd.io/@Cysic/By8qPIiy1g"
    // },
    {
        title: "Cysic Network Litepaper",
        href: useLocalBlog ? "/blog/r1BTsjB4R".toLowerCase() : "https://hackmd.io/@Cysic/r1BTsjB4R"
    },
    {
        title: "ZK Hardware Acceleration",
        subTitle: "The Past, the Present and the Future",
        href: useLocalBlog ? "/blog/BJQcpVbXn".toLowerCase() : "https://hackmd.io/@Cysic/BJQcpVbXn"
    },
    {
        title: "Analyzing the Hyperplonk Proof System, a Hardware Perspective",
        href: useLocalBlog ? "/blog/ryCUjWcdj".toLowerCase() : "https://hackmd.io/@Cysic/ryCUjWcdj"
    }
]
export const hardwareAcademyConfig = [
    {
        title: "Hypercube IR",
        subTitle: "The Foundation of Zero-Knowledge Proof System",
        href: useLocalBlog ? "/blog/ByY3L5hkl".toLowerCase() : "https://hackmd.io/@Cysic/ByY3_L5hkl",
    },
    {
        title: "How Fast We Can Go",
        subTitle: "Proving Million Keccak Function Per Second",
        href: useLocalBlog ? "/blog/r1LoS0MmJg".toLowerCase() : "https://hackmd.io/@Cysic/r1LoS0MmJg",
    },
    {
        title: "ZK Hardware Acceleration",
        subTitle: "The Past, the Present and the Future",
        href: useLocalBlog ? "/blog/BJQcpVbXn".toLowerCase() : "https://hackmd.io/@Cysic/BJQcpVbXn"
    },
    {
        title: "Analyzing the Hyperplonk Proof System, a Hardware Perspective",
        href: useLocalBlog ? "/blog/ryCUjWcdj".toLowerCase() : "https://hackmd.io/@Cysic/ryCUjWcdj"
    }
]

export const academyConfigShowInHome = academyConfig?.slice(0, 3)

export const otherArticleShowInHome = [
    {
        title: "Zero-Knowledge (ZK) Hardware Definition | CoinMarketCap",
        subTitle: "| CoinMarketCap",
        href: "https://coinmarketcap.com/academy/glossary/zero-knowledge-zk-hardware",
        media: {
            name: 'CoinMarketCap',
            img: getImageUrl("@/assets/images/investors/cmc.svg"),
        }
    },
    {
        title: "The future of Ethereum scaling lies in hardware, not software",
        subTitle: "| Cointelegraph",
        href: "https://cointelegraph.com/news/the-future-of-ethereum-scaling",
        media: {
            name: 'Cointelegraph',
            img: getImageUrl("@/assets/images/investors/cointelegraph.svg"),
        },
    },
    {
        title: "A brief history of Ethereum's relationship with ZK",
        subTitle: "| Blockworks",
        href: "https://blockworks.co/news/brief-history-zk-tech",
        media: {
            name: 'Blockworks',
            img: getImageUrl("@/assets/images/investors/blockworks.svg"),
        }
    },

    {
        title: "ZK-proofs are more affordable than legacy ID systems — Cysic founder",
        subTitle: "| Cointelegraph",
        href: "https://cointelegraph.com/news/zk-proofs-more-affordable-legacy-id-systems-cysic-co-founder",
        media: {
            name: 'Cointelegraph',
            img: getImageUrl("@/assets/images/investors/cointelegraph.svg"),
        }
    },
    {
        title: "Protocol Village: Team Behind Mento, EVM for Stable Assets on Celo, Raises $10M, Publishes Roadmap",
        subTitle: "| CoinDesk",
        href: "https://www.coindesk.com/tech/2024/10/09/protocol-village",
        media: {
            name: 'CoinDesk',
            img: getImageUrl("@/assets/images/investors/coindesk.png"),
        },
    },
    {
        title: "Cysic enhances Scroll’s ZK rollup efficiency with advanced hardware integration",
        subTitle: "| The Block",
        href: "https://www.theblock.co/post/320976/cysic-enhances-scrolls-zk-rollup-efficiency-with-advanced-hardware-integration",
        media: {
            name: 'The Block',
            img: getImageUrl("@/assets/images/investors/the_block.png"),
        }
    },
]