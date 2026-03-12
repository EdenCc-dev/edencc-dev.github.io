import Image from "@/components/Image";
import Spinner from "@/components/spinner";
import { mediasLink } from "@/config";
import GradientContainer from "@/routes/components/GradientContainer";
import { getImageUrl, shortStr } from "@/utils/tools";
import { Input } from "@nextui-org/input";
import { useDebounce, useDebounceEffect } from "ahooks";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { toastConfig } from 'react-simple-toasts';
import 'react-simple-toasts/dist/theme/dark.css';

const formatArray = (v: any) => {
    return Array.isArray(v) ? v : [v]
}

toastConfig({
    className: 'w-fit px-4 py-2 rounded-none scale-90', theme: 'dark', position: 'top-center'
});

const CloseIcon = (props: any) => {
    return <svg width="512" height="512" stroke="currentColor" fill="rgba(255,0,0)" strokeWidth="0" viewBox="0 0 512 512" height="200px" width="200px" xmlns="http://www.w3.org/2000/svg" {...props}><path d="M256 90c44.3 0 86 17.3 117.4 48.6C404.7 170 422 211.7 422 256s-17.3 86-48.6 117.4C342 404.7 300.3 422 256 422s-86-17.3-117.4-48.6C107.3 342 90 300.3 90 256s17.3-86 48.6-117.4C170 107.3 211.7 90 256 90m0-42C141.1 48 48 141.1 48 256s93.1 208 208 208 208-93.1 208-208S370.9 48 256 48z"></path><path d="M360 330.9L330.9 360 256 285.1 181.1 360 152 330.9l74.9-74.9-74.9-74.9 29.1-29.1 74.9 74.9 74.9-74.9 29.1 29.1-74.9 74.9z"></path></svg>
}

export const SearchIcon = (props: any) => (
    <svg
        aria-hidden="true"
        fill="none"
        focusable="false"
        height="1em"
        role="presentation"
        viewBox="0 0 24 24"
        width="1em"
        {...props}
    >
        <path
            d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
        />
        <path
            d="M22 22L20 20"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
        />
    </svg>
);

const Search = () => {
    const [searchContainerVisible_, setSearchContainerVisible] = useState(false)
    const [searchInfo, setSearchInfo] = useState<any>({})
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [addr, setAddr] = useState<string>('')
    const handleKeyUp = (e: any) => {
        const isEnter = e?.keyCode == 13
        if (isEnter) {
            handleSearch()
        }
    }
    const handleSearch = async () => {
        if (!addr || loading) return;
        try {
            setLoading(true)
            const res = await axios(`/api/v1/dashboard/queryByReward/${addr}`)
            console.log('res', res?.data)
            const data = res?.data;

            const project = formatArray(data?.project)?.filter(i => i?.ID)
            const provider = formatArray(data?.provider)?.filter(i => i?.ID)
            const verifier = formatArray(data?.verifier)?.filter(i => i?.ID)

            const registered = project?.find(i => i.ID != 0) || provider?.find(i => i.ID != 0) || verifier?.find(i => i.ID != 0)

            const needRegister = !registered
            const notInWhitelist = !data?.inWhitelist

            setSearchInfo({
                notInWhitelist,
                project,
                provider,
                verifier,
                needRegister
            })

            // const id = res?.data?.ID
            // if(id){
            //     navigate(`/dashboard/verifier/${id}`)
            // }
        } catch (e: any) {
            console.log('error', e)
            toast(
                <div className="flex items-center gap-1">
                    <CloseIcon className="size-4" />
                    <span>{e?.msg || e?.message}</span>
                </div>
            )
        } finally {
            setLoading(false)
        }

    };

    const searchContainerVisible = useDebounce(searchContainerVisible_, {
        wait: 300
    })
    const debouncedAddr = useDebounce(addr, {
        wait: 300
    })
    useEffect(() => {
        if (debouncedAddr) {
            handleSearch()
        }
    }, [debouncedAddr])

    return (
        <>
            {
                searchContainerVisible ? (<div className="z-[1] w-full h-screen fixed top-0 left-0 bottom-0 right-0 bg-[#0000005a]" />) : null
            }
            <div className="max-w-[32rem] w-[20.75rem] flex-1 relative z-[2]">
                <Input
                    onFocus={() => setSearchContainerVisible(true)}
                    onBlur={() => setSearchContainerVisible(false)}
                    value={addr}
                    onValueChange={setAddr}
                    onKeyUp={handleKeyUp}
                    radius="sm"
                    classNames={{
                        input: [
                            "bg-transparent",
                            "text-black/90 dark:text-white/90",
                            "placeholder:text-default-700/50 dark:placeholder:text-white/60",
                        ],
                        innerWrapper: "bg-transparent",
                        inputWrapper: [
                            "gradient-border rounded-full",
                            "border border-[#FFFFFF33]",
                            "bg-[#FFFFFF0D]",
                            "dark:bg-[#FFFFFF0D]",
                            "backdrop-blur-xl",
                            "backdrop-saturate-200",
                            "hover:bg-default-200/70",
                            "dark:hover:bg-default/70",
                            "group-data-[focus=true]:border-[#00F0FF]",
                            "dark:group-data-[focus=true]:border-[#00F0FF]",
                            "!cursor-text",
                        ],
                    }}
                    placeholder="Search Verifier By Reward Address"
                    startContent={
                        loading ? (<Spinner />) : (<div className="cursor-pointer" onClick={handleSearch}>
                            <SearchIcon className="text-[#FFFFFF73] mb-0.5 dark:text-white/90 text-slate-400 pointer-events-none flex-shrink-0" />
                        </div>)

                    }
                />
                {
                    searchContainerVisible ? <div className="overflow-auto p-4 absolute top-10 w-full h-[50vh] bg-[#10141A] rounded-b-[8px] flex flex-col gap-4">
                        <div className="flex flex-col gap-3">
                            {
                                (addr && (searchInfo?.needRegister || searchInfo?.notInWhitelist)) ? (<div className="text-xs flex items-center justify-between">
                                    <div className="flex flex-col ">
                                        <span className="">{shortStr(addr, 12)}</span>
                                        <div className="flex items-center gap-1">
                                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <mask id="mask0_1042_15638" maskUnits="userSpaceOnUse" x="0" y="0" width="12" height="12">
                                                    <rect width="12" height="12" fill="white" />
                                                </mask>
                                                <g mask="url(#mask0_1042_15638)">
                                                    <path fillRule="evenodd" clipRule="evenodd" d="M10.0608 9.35526L6 2.64474L1.9392 9.35526H10.0608ZM6.81216 2.19737C6.4512 1.60088 5.5488 1.60088 5.18784 2.19737L1.12704 8.90789C0.766081 9.50439 1.21728 10.25 1.9392 10.25H10.0608C10.7827 10.25 11.2339 9.50439 10.873 8.90789L6.81216 2.19737Z" fill="#FF401A" />
                                                    <path d="M5.68788 7.25L5.5303 5.50866L5.5 4.75H6.5L6.4697 5.50866L6.31212 7.25H5.68788Z" fill="#FF401A" />
                                                    <path d="M5.5 8.24718C5.5 8.54096 5.70904 8.75 6.00282 8.75C6.28531 8.75 6.5 8.54096 6.5 8.24718C6.5 7.95339 6.28531 7.75 6.00282 7.75C5.71469 7.75 5.5 7.95339 5.5 8.24718Z" fill="#FF401A" />
                                                </g>
                                            </svg>

                                            <span className="text-[#FF401A] origin-left">{searchInfo?.needRegister ? 'Not Registered' : searchInfo?.notInWhitelist ? 'Not White List' : ''}</span>
                                        </div>
                                    </div>
                                    <GradientContainer onClick={() => searchInfo?.needRegister ? navigate('/register') : searchInfo?.notInWhitelist ? window.open(mediasLink.discord, '_blank') : ''} className="origin-right cursor-pointer basic-bg-gradient rounded-[6px] px-1 py-1">
                                        <div className="relative z-[3] flex items-center gap-1">
                                            <span className="">{searchInfo?.needRegister ? 'Register Now' : searchInfo?.notInWhitelist ? 'Join Discord' : ''}</span>
                                            <svg className="size-[14px]" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path fillRule="evenodd" clipRule="evenodd" d="M14.449 14.8842C14.7942 14.8842 15.074 14.6044 15.074 14.2592L15.0737 6.00941C15.0737 5.66669 14.7977 5.3879 14.455 5.38447L6.12191 5.3009C5.77675 5.29744 5.49413 5.57444 5.49067 5.9196C5.48721 6.26476 5.76421 6.54738 6.10937 6.55084L12.9548 6.61948L5.16798 14.4063C4.9239 14.6504 4.9239 15.0461 5.16798 15.2902C5.41205 15.5343 5.80778 15.5343 6.05186 15.2902L13.8238 7.51827L13.824 14.2592C13.824 14.6044 14.1038 14.8842 14.449 14.8842Z" fill="currentColor" />
                                            </svg>
                                        </div>
                                    </GradientContainer>

                                </div>) : null
                            }


                            <div className="text-xs text-white">Prover</div>
                            <div>{searchInfo?.provider?.length ? (<div>
                                {searchInfo?.provider?.map((i: any, index: number) => {
                                    return <div className="flex items-center justify-between cursor-pointer" key={index} onClick={() => {
                                        navigate(`/dashboard/prover/${i?.ID}`)
                                        setAddr('')
                                    }}>
                                        <div className="flex items-center gap-2" >
                                            <Image
                                                className="size-5 rounded-full"
                                                src={i?.logo}
                                            />
                                            <div className="flex flex-col gap-1">
                                                <div className="text-sm">{i?.name}</div>
                                                <div className="text-xs">{i?.prover}</div>
                                            </div>
                                        </div>
                                        <Image
                                            className="size-3"
                                            src={getImageUrl("@/assets/images/dashboard/share_c.svg")}
                                        />
                                    </div>
                                })}
                            </div>) : (<span className="text-sm text-[#A3A3A3]">No Data</span>)}</div>
                        </div>
                        <div className="flex flex-col gap-3">
                            <div className="text-xs text-white">Verifier</div>
                            <div>{searchInfo?.verifier?.length ? (<div>
                                {searchInfo?.verifier?.map((i: any, index: number) => {
                                    return <div className="flex items-center justify-between cursor-pointer" key={index} onClick={() => {
                                        navigate(`/dashboard/verifier/${i?.ID}`)
                                        setAddr('')
                                    }}>
                                        <div className="flex items-center gap-2" >
                                            <Image
                                                className="size-5 rounded-full"
                                                src={i?.logo}
                                            />
                                            <div className="flex flex-col gap-1">
                                                <div className="text-sm">{i?.name}</div>
                                                <div className="text-xs">{i?.verifier}</div>
                                            </div>
                                        </div>
                                        <Image
                                            className="size-3"
                                            src={getImageUrl("@/assets/images/dashboard/share_c.svg")}
                                        />
                                    </div>
                                })}
                            </div>) : (<span className="text-sm text-[#A3A3A3]">No Data</span>)}</div>
                        </div>
                    </div> : null
                }
            </div>
        </>
    );
};

export default Search;
