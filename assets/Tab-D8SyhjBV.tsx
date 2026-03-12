import { useEffect, useRef, useState } from "react";
import clsx from 'clsx'
import { useSize } from "ahooks";

const Tab = ({ type, className, verticle, tabs, value, onChange, ...props }: { type?: string, selectMode?: boolean, className?: string, verticle?: boolean; tabs: any[], value?: any, onChange?: any } | { [key: string]: any }) => {
    const [state, setstate] = useState(tabs?.[0]?.value);
    const containerRef = useRef<any>()
    const [w, setW] = useState(0)
    const [x, setX] = useState(0)

    useEffect(() => {
        if (value === undefined && state === undefined && tabs?.length) {
            setstate(tabs?.[0]?.value)
        }
    }, [value, state, tabs]);

    const handleClick = (item: any) => {
        if (!item.disabled) {
            if (item.link) {
                window.open(item.link, "_blank");
                return;
            }
            const activeIndex = tabs?.findIndex(i => i.value === item.value)
            onChange?.(item.value, item, activeIndex)
            if (value === undefined) {
                setstate(item.value)
            }
        }
        item?.callback?.()
    }

    const getSize = () => {
        const activeIndex = tabs?.findIndex(i => i.value === (value || state))
        const targetElement = containerRef?.current?.getElementsByClassName('tab')?.[activeIndex]
        if (targetElement) {
            const containerSize = containerRef?.current?.getBoundingClientRect()
            const size = targetElement?.getBoundingClientRect()

            const x = size?.x - containerSize?.x
            const w = size?.width

            const y = size?.y - containerSize?.y
            const h = size?.height

            if (verticle) {
                setX(y)
                setW(h)
                return
            }
            setX(x)
            setW(w)
        }
    }

    const size = useSize(document.body)

    useEffect(() => {
        if ((value || state) !== undefined) {
            getSize()
        }
    }, [value, state, verticle, size?.width, size?.height])
    if (type === 'switch') {
        return (<div className={clsx("relative flex flex-col gap-4 p-1.5 border rounded-md", verticle ? '!flex-row-reverse' : '', className)}>
            <div role="tablist" className={clsx("rounded-[inherit] relative z-1 tabs", verticle ? '!flex-col items-start' : 'h-full w-full flex items-center justify-center')} ref={containerRef}>
                {
                    tabs?.map((i: any, index:number) => {
                        return (<a role="tab" key={index} className={clsx("tab bg-[transparent] relative z-10 gap-1 w-full", {
                            'tab-active !opacity-100 font-[700] !text-white': i.value === (value || state)
                        })} onClick={() => handleClick(i)}>
                            {i?.icon || i?.prefix || null} <div className="flex flex-row items-center gap-[4px]"><span className={clsx("text-3.5 font-[700]", {'text-[--secGray-900]': i.value === (value || state)} )}>{i.text}</span>{i.suffix || null}</div>
                        </a>)
                    })
                }

                <div className="transition-all absolute z-auto top-0 left-0 h-full w-1/2 rounded-lg bg-[--base-200] pointer-events-none"
                style={{ transform: `translateX(${x}px)`, width: `${w}px` }}
                />
            </div>

        </div>)
    }

    return (<div className={clsx("flex flex-col gap-4", verticle ? '!flex-row-reverse' : '', className)}>

        <div role="tablist" className={clsx("relative tabs !flex !w-fit gap-6", verticle ? '!flex-col items-start' : '')} ref={containerRef}>
            {
                tabs.map(i => {
                    return (<a role="tab" className={clsx("tab leading-none !px-0 h-fit text-left w-fit text-4 leading-relaxed font-semibold gap-2.5 text-black opacity-20", {
                        'tab-active !opacity-100 font-[700]': i.value === (value || state)
                    })} onClick={() => handleClick(i)}>
                        {i?.icon || i?.prefix || null} <div className="flex flex-row items-center gap-[4px]"><span className="text-3.5 font-[700]">{i.text}</span>{i.suffix || null}</div>
                    </a>)
                })
            }


        </div>
        <div className={clsx(verticle ? 'w-[2px] h-auto' : 'h-[4px] w-full')}>
            <hr className={clsx("absolute b-0 transition-all  bg-[#FF9900] rounded-6 border-none", verticle ? 'l-4 w-[2px]' : 'h-[4px] t-4')} style={verticle ? { transform: `translateY(${x}px)`, height: `${w}px` } : { transform: `translateX(${x}px)`, width: `${w}px` }} />
        </div>

    </div>)
}

export default Tab