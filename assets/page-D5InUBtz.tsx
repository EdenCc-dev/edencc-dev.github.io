import axios from "axios";
import { PT12Wrapper } from "@/components/Wrappers";
import { useRequest } from "ahooks";
import { useMemo, useState } from "react";
import { CysicTableColumn } from "@/components/Table";
import CysicTable from "@/routes/pages/Leaderboard/CysicTabe";
import GradientBorderCard from "@/components/GradientBorderCard";
import {
    Pagination,
    Input,
    cn,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    Button,
} from "@nextui-org/react"; // 加了 Input
import { BigNumber } from "bignumber.js";
import { resqUrl } from "@/config";
import { ChevronDown } from "lucide-react";
import Spinner from "@/components/spinner";

const apiKey = import.meta.env.VITE_APP_KAITO_API_KEY;

const apiClient = axios.create({
    // baseURL: "https://api.kaito.ai/api/v1",
    baseURL: resqUrl + "/api/v1",
    timeout: 30_000,
});

apiClient.interceptors.request.use(
    (config) => {
        // config.headers["x-api-key"] = apiKey;
        return config;
    },
    (error) => Promise.reject(error)
);

const ticker = "CYSIC";

export interface CommunityMindshareParams {
    ticker: string;
    start_date?: string;
    end_date?: string;
    user_type?: "creator" | "community";
    window?: "7d" | "30d" | "3m" | "6m" | "12m";
}

export interface Yappers {
    user_id: string;
    rank: string;
    mindshare: number;
    contribution: number;
    has_nft: boolean | null;
    language: string;
    user_level: string;
    username: string;
    displayname: string;
    tweet_counts: number;
    tweet_urls: string[];
    total_impressions: number;
    total_retweets: number;
    total_quote_tweets: number;
    total_likes: number;
    total_bookmarks: number;
    total_smart_engagements: number;
    total_community_engagements: number;
    peripheral_tweet_urls: string[];
}

export interface CommunityMindshareResponse {
    total_unique_yappers: number;
    total_unique_tweets: number;
    top_1000_yapper_impressions: number;
    top_1000_yapper_retweets: number;
    top_1000_yapper_quote_tweets: number;
    top_1000_yapper_likes: number;
    top_1000_yapper_bookmarks: number;
    top_1000_yapper_smart_engagements: number;
    top_1000_yapper_community_engagements: number;
    top_1000_yappers: Yappers[];
}

export const fetchCommunityMindshare = (params: CommunityMindshareParams) => {
    return apiClient.get("/community_midshare", { params });
};

export const LeaderboardPage = () => {
    const [topYapper, setTopYapper] = useState<Yappers[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [lngSortKey, setLngSortKey] = useState("");
    const [sortConfig, setSortConfig] = useState<{
        key?: keyof Yappers;
        direction: "asc" | "desc";
    }>({});
    const [search, setSearch] = useState("");

    const pageSize = 10;

    const { loading, run } = useRequest(
        (window?: string) => {
            let _window = "7d";
            if (window) {
                if (window.endsWith("m")) {
                    const monthValue = parseInt(window.replace("m", ""), 10);
                    _window = `${monthValue * 30}d`;
                } else {
                    _window = window
                }
            }
            return fetchCommunityMindshare({
                ticker,
                window: _window as any,
            });
        },
        {
            onSuccess(resp) {
                setTopYapper(resp?.data?.community_mindshare?.top_1000_yappers || []);
            },
        }
    );

    const taskListColumns: CysicTableColumn<Yappers>[] = [
        { key: "rank", label: "Rank", sortable: true },
        {
            key: "username",
            label: "User Name",
            renderCell: (row) => (
                <a
                    className="flex items-center !cursor-pointer hover:text-[#34f3e2]"
                    target="_blank"
                    href={`https://x.com/${row?.username}`}
                >
                    <span>@</span>
                    <span>{row?.username}</span>
                </a>
            ),
        },
        {
            key: "language",
            label: "Language",
            renderCell: (row) => row?.language?.toUpperCase() || "-",
        },
        {
            key: "mindshare",
            label: "Mindshare",
            sortable: true,
            renderCell: (row) => (
                <span className="">
                    {BigNumber(row?.mindshare * 100).toFixed(4, BigNumber.ROUND_DOWN) +
                        "%"}
                </span>
            ),
        },
        { key: "tweet_counts", label: "Tweets", sortable: true },
        { key: "total_impressions", label: "Impressions", sortable: true },
        { key: "total_likes", label: "Likes", sortable: true },
        {
            key: "total_community_engagements",
            label: "Engagements",
            sortable: true,
        },
    ];

    /** 搜索 + 排序 + 分页处理 */
    const processedData = useMemo(() => {
        let data = [...(topYapper || [])];

        // 搜索
        if (search.trim()) {
            const lower = search.trim().toLowerCase();
            data = data.filter(
                (y) =>
                    y.username?.toLowerCase().includes(lower) ||
                    y.displayname?.toLowerCase().includes(lower)
            );
        }
        if (lngSortKey) {
            console.log("lngSortKey", lngSortKey);
            if (lngSortKey != "OTHERS") {
                data = data.filter((i) => i.language?.toUpperCase() == lngSortKey);
            } else {
                data = data.filter(
                    (i) =>
                        !["EN", "ZH", "KO", "ID", "VI", "TR"].includes(
                            i.language?.toUpperCase()
                        )
                );
            }
        }

        // 排序
        if (sortConfig.key) {
            const { key, direction } = sortConfig;
            data.sort((a, b) => {
                const valueA = a[key!];
                const valueB = b[key!];
                return direction === "asc"
                    ? Number(valueA || 0) - Number(valueB || 0)
                    : Number(valueB || 0) - Number(valueA || 0);
            });
        }

        // 分页
        const start = (currentPage - 1) * pageSize;
        return data.slice(start, start + pageSize);
    }, [topYapper, search, currentPage, sortConfig, lngSortKey]);

    /** 点击列头进行排序 */
    const handleColumnClick = (col: CysicTableColumn<Yappers>) => {
        if (!col.sortable) return;

        setSortConfig((prev) => {
            let direction: "asc" | "desc" = "asc";
            if (prev.key === col.key && prev.direction === "asc") {
                direction = "desc";
            }
            return { key: col.key as keyof Yappers, direction };
        });
        setCurrentPage(1); // 排序后回第一页
    };

    const totalFiltered = useMemo(() => {
        let data = topYapper;
        if (search.trim()) {
            const lower = search.trim().toLowerCase();
            data = data.filter(
                (y) =>
                    y.username?.toLowerCase().includes(lower) ||
                    y.displayname?.toLowerCase().includes(lower)
            );
        }
        return data.length;
    }, [topYapper, search]);

    const totalPages = Math.ceil(totalFiltered / pageSize);

    const [selectedKeys, setSelectedKeys] = useState(new Set(["7d"]));

    const selectedValue = useMemo(
        () => Array.from(selectedKeys).join(", ").replace(/_/g, ""),
        [selectedKeys]
    );

    const handleSelect = (v) => {
        run(v.currentKey);
        setSelectedKeys(v);
    };

    const [lngKeys, setLngKeys] = useState(new Set(["All"]));
    const valueOfLngKey = Array.from(lngKeys).toString();

    const selectedLngValue = useMemo(() => {
        switch (valueOfLngKey) {
            case "EN":
                setLngSortKey("EN");
                return <img className="w-4" src="/leaderboard-assets/usa.png" />;
            case "ZH":
                setLngSortKey("ZH");
                return <img className="w-4" src="/leaderboard-assets/china.png" />;
            case "KO":
                setLngSortKey("KO");
                return (
                    <img className="w-4" src="/leaderboard-assets/south-korea.png" />
                );
            case "ID":
                setLngSortKey("ID");
                return <img className="w-4" src="/leaderboard-assets/indonesia.png" />;
            case "VI":
                setLngSortKey("VI");
                return <img className="w-4" src="/leaderboard-assets/vietnam.png" />;
            case "TR":
                setLngSortKey("TR");
                return <img className="w-4" src="/leaderboard-assets/turkey.png" />;
            case "OTHERS":
                setLngSortKey("OTHERS");
                return <img className="w-4" src="/leaderboard-assets/others.png" />;

            default:
                setLngSortKey("");
                return "All";
        }
    }, [valueOfLngKey]);
    const handleLngSelect = (v) => {
        setLngKeys(v);
    };

    return (
        <>
            <style>
                {`
            tbody tr[data-rank='1'] {
                background: linear-gradient(90deg, #8D8059 0%, #D8D0B8 16.35%, #CDB56D 34.62%, #D4C69A 65.38%, #7D6D3B 100%);
            }
            tbody tr[data-rank='1'] .t-cell, tbody tr[data-rank='2'] .t-cell{
                color: black;
            }
            tbody tr[data-rank='2'] {
                background: linear-gradient(90deg, #8A8A8A 0%, #D9D9D9 16.35%, #ACACAC 34.62%, #DEDEDE 65.38%, #939393 100%);
            }
            tbody tr[data-rank='3'] {
                background: linear-gradient(90deg, #6F5D4E 0%, #7F736C 16.35%, #6E625C 34.62%, #94877F 65.38%, #6E615C 100%);
            }
            tbody tr .t-cell{
                font-size: 14px;
                font-family: Teachers;
            }
            tbody tr td{
                padding-block: 0px!important;
                height: 32px;
                // margin-botton: 8px!important;
            }
            thead tr:nth-of-type(2){
                display: none;
            }
            `}
            </style>
            <PT12Wrapper className="w-full pb-12 px-3 md:px-[3rem]">
                <div className="unbounded-32-128-200 md:p-12 pb-12 text-center">
                    Leaderboard
                </div>
                <GradientBorderCard
                    borderRadius={8}
                    className="main-container px-6 py-4 md:mt-12"
                >
                    <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
                        <div className="unbounded-20-300">TOP CYSIC YAPPERS</div>
                        <div className="flex items-center gap-2 flex-1 w-full justify-end">
                            <Input
                                classNames={{
                                    base: "max-w-[260px]",
                                    inputWrapper: " min-h-12 h-12 rounded-[8px] border-[1px]",
                                }}
                                variant="bordered"
                                // isClearable
                                placeholder="Filter by username or display name"
                                value={search}
                                onValueChange={(val) => {
                                    setSearch(val);
                                    setCurrentPage(1); // 搜索时回第一页
                                }}
                                size="md"
                            />

                            <Dropdown
                                size="sm"
                                classNames={{
                                    content: "min-w-[120px]",
                                }}
                            >
                                <DropdownTrigger>
                                    <Button
                                        size="sm"
                                        className="uppercase h-12 border-[1px] text-white/50"
                                        variant="bordered"
                                    >
                                        {selectedLngValue}
                                        <ChevronDown className="size-3" />
                                    </Button>
                                </DropdownTrigger>
                                <DropdownMenu
                                    disallowEmptySelection
                                    aria-label="Dropdown Variants"
                                    selectedKeys={lngKeys}
                                    onSelectionChange={handleLngSelect}
                                    selectionMode="single"
                                    className="[&_img]:w-4"
                                >
                                    <DropdownItem
                                        className="uppercase [&_span]:text-xs"
                                        key="All"
                                    >
                                        All
                                    </DropdownItem>
                                    <DropdownItem className="uppercase [&_span]:text-xs" key="EN">
                                        <img src="/leaderboard-assets/usa.png" />
                                    </DropdownItem>
                                    <DropdownItem className="uppercase [&_span]:text-xs" key="ZH">
                                        <img src="/leaderboard-assets/china.png" />
                                    </DropdownItem>
                                    <DropdownItem className="uppercase [&_span]:text-xs" key="KO">
                                        <img src="/leaderboard-assets/south-korea.png" />
                                    </DropdownItem>
                                    <DropdownItem className="uppercase [&_span]:text-xs" key="ID">
                                        <img src="/leaderboard-assets/indonesia.png" />
                                    </DropdownItem>
                                    <DropdownItem className="uppercase [&_span]:text-xs" key="VI">
                                        <img src="/leaderboard-assets/vietnam.png" />
                                    </DropdownItem>
                                    <DropdownItem className="uppercase [&_span]:text-xs" key="TR">
                                        <img src="/leaderboard-assets/turkey.png" />
                                    </DropdownItem>
                                    <DropdownItem
                                        className="uppercase [&_span]:text-xs"
                                        key="OTHERS"
                                    >
                                        <img src="/leaderboard-assets/others.png" />
                                    </DropdownItem>
                                </DropdownMenu>
                            </Dropdown>

                            <Dropdown
                                size="sm"
                                classNames={{
                                    content: "min-w-[120px]",
                                }}
                            >
                                <DropdownTrigger>
                                    <Button
                                        size="sm"
                                        className="uppercase h-12 border-[1px] text-white/50"
                                        variant="bordered"
                                    >
                                        {selectedValue}
                                        <ChevronDown className="size-3" />
                                    </Button>
                                </DropdownTrigger>
                                <DropdownMenu
                                    disallowEmptySelection
                                    aria-label="Dropdown Variants"
                                    selectedKeys={selectedKeys}
                                    onSelectionChange={handleSelect}
                                    selectionMode="single"
                                >
                                    <DropdownItem className="uppercase [&_span]:text-xs" key="7d">
                                        7d
                                    </DropdownItem>
                                    <DropdownItem
                                        className="uppercase [&_span]:text-xs"
                                        key="30d"
                                    >
                                        30d
                                    </DropdownItem>
                                    <DropdownItem className="uppercase [&_span]:text-xs" key="3m">
                                        3m
                                    </DropdownItem>
                                    <DropdownItem className="uppercase [&_span]:text-xs" key="6m">
                                        6m
                                    </DropdownItem>
                                    <DropdownItem
                                        className="uppercase [&_span]:text-xs"
                                        key="12m"
                                    >
                                        12m
                                    </DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </div>
                    </div>
                    <CysicTable
                        sortable
                        data={processedData}
                        columns={taskListColumns}
                        className={cn(
                            "[&>div]:!pt-0",
                            "[&_table]:border-separate [&_table]:border-spacing-y-2 [&_table]:border-spacing-x-0 "
                        )}
                        // loading={loading}
                        onColumnClick={handleColumnClick}
                        sortKey={sortConfig?.key}
                        sortDirection={sortConfig?.direction}
                    />
                    {loading && (
                        <div className="flex items-center justify-center h-[300px] w-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                            <Spinner />
                        </div>
                    )}
                    {!loading && totalPages > 1 && (
                        <div className="flex justify-center mt-4">
                            <Pagination
                                total={totalPages}
                                page={currentPage}
                                onChange={setCurrentPage}
                                color="primary"
                                size="sm"
                            />
                        </div>
                    )}
                </GradientBorderCard>
            </PT12Wrapper>
        </>
    );
};
