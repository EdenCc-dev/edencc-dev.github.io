import { ArrowRight } from "lucide-react"

const brandColors = [
    {
        title: 'Cysic Deep Matter',
        subTitle: '#090A09',
        desc: 'Cysic\'s signature background tone — this isn\'t just black, it\'s architectural void, the silence between light pulses, the foundation where all logic is built. Stable. Infinite. Weightless.',
        className: 'bg-black border'
    },
    {
        title: 'Graphite Logic',
        subTitle: '#333333',
        desc: 'It\'s the metallic silence beneath your pulses of light, the floor of the architecture - functional, grounded, and unyielding.',
        className: 'bg-[#333333]'
    },
    {
        title: 'Singularity White',
        subTitle: '#FFFFFF',
        desc: 'The perfect neutral — the light of clarity, the moment of verification, the end-state where everything collapses into truth. A clean field for interaction, composition, and space.',
        className: 'bg-white text-black'
    },
    {
        title: 'Quantum Violet',
        subTitle: '#6B2CE1',
        desc: 'A rich electric violet, this evokes the shimmer of ZK proofs firing in parallel, the mystic light inside the Prover Core, or the rare energy pulsing through a zero-knowledge gate.',
        className: 'bg-[#6B2CE1] '
    },
    {
        title: 'Neon Flow',
        subTitle: '#00FFCD',
        desc: 'This color pulses like high-frequency data, the lifeblood of proving acceleration. It’s fluid yet sharp — the exact moment when light turns into information. It evokes real-time action, connectivity, and a luminous kind of intelligence.',
        className: 'bg-[#00FFCD] text-black'
    },
]

const symbolLogos = [
    {
        title: 'Symbol White',
        img: '/mediakits/symbol_white.svg',
        className: "w-[6.9375rem] lg:w-[9.25rem]"
    },
    {
        title: 'Symbol Black',
        img: '/mediakits/symbol_black.svg',
        className: "w-[6.9375rem] lg:w-[9.25rem]"
    },
    {
        title: 'Symbol Gradient',
        img: '/mediakits/symbol_gradient.svg',
        className: "w-[6.9375rem] lg:w-[9.25rem]"
    },
]

const horizontalLogos = [
    {
        title: 'Horizontal White',
        img: '/mediakits/horizontal_white.svg',
        className: "w-[13.875rem] lg:w-[18.5rem]"
    },
    {
        title: 'Horizontal Black',
        img: '/mediakits/horizontal_black.svg',
        className: "w-[13.875rem] lg:w-[18.5rem]"
    },
    {
        title: 'Horizontal Gradient',
        img: '/mediakits/horizontal_gradient.svg',
        className: "w-[13.875rem] lg:w-[18.5rem]"
    },
]

const verticalLogos = [
    {
        title: 'Vertical White',
        img: '/mediakits/vertical_white.svg',
        className: "w-[6.9375rem] lg:w-[9.25rem]"
    },
    {
        title: 'Vertical Black',
        img: '/mediakits/vertical_black.svg',
        className: "w-[6.9375rem] lg:w-[9.25rem]"
    },
    {
        title: 'Vertical Gradient',
        img: '/mediakits/vertical_gradient.svg',
        className: "w-[6.9375rem] lg:w-[9.25rem]"
    },
]

const IconDiplayAndDownload = ({ item }: { item: any }) => {

    const handleDownload = (type: string) => {
        const currentPath = item.img;
        const basePath = currentPath.substring(0, currentPath.lastIndexOf('.'));
        
        const newPath = `${basePath}.${type.toLowerCase()}`;
        
        const link = document.createElement('a');
        link.href = newPath;
        link.download = `${item.title}.${type.toLowerCase()}`;
        link.click();
    }

    return (<>
        <div className="flex-1 flex flex-col gap-6 items-center justify-center w-[26rem]">
            <div className="flex flex-col gap-4 items-center justify-center">
                <img src={item.img} alt={item.title} className={item.className} />
                <span className="text-center tracking-widest teachers-16-24-400">{item.title}</span>
                <div className="flex items-center gap-6">
                    <p className="flex items-center gap-2 cursor-pointer" onClick={() => handleDownload('jpg')}>
                        <span className="teachers-14-16-400">JPG</span>
                        <ArrowRight className="size-4" />
                    </p>
                    <p className="flex items-center gap-2 cursor-pointer" onClick={() => handleDownload('png')}>
                        <span className="teachers-14-16-400">PNG</span>
                        <ArrowRight className="size-4" />
                    </p>
                    <p className="flex items-center gap-2 cursor-pointer" onClick={() => handleDownload('svg')}>
                        <span className="teachers-14-16-400">SVG</span>
                        <ArrowRight className="size-4" />
                    </p>
                </div>
            </div>
        </div>
    </>)
}

const Mediakit = () => {
    return (
        <>
            <div className="py-12 lg:py-0 min-h-[calc(100vh-5.625rem)] lg:min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center gap-4">
                <div className="unbounded-36-180-200">media kit</div>
                <span className="teachers-14-24-400 tracking-widest">brand assets</span>
            </div>

            <div className="w-full bg-gradient-to-r from-[#6B2CE1] to-[#3A187B] p-4 lg:px-0 lg:py-14 flex flex-col gap-2 items-center text-center">
                <span className="!normal-case teachers-16-400 ">Cysic is leading the future of ComputeFi and is </span>
                <div className="unbounded-16-32-500 flex text-center">THE FIRST FULL-STACK NETWORK</div>
                <span className="!normal-case teachers-16-400 ">Our goal is to address the computational inefficiencies in ZK proofs and enable real-time ZK proof generation.to offer an open marketplace connecting compute demand and supply.</span>
            </div>

            <div className="py-14 flex flex-col gap-12 items-center">
                <div className="unbounded-24-64-300 text-center">
                    CYSIC LOGOS
                </div>

                <div className="flex flex-col gap-6 flex-wrap w-full lg:w-auto">

                    <div className="flex gap-6 w-full flex-col lg:flex-row items-center lg:items-start justify-center">
                        {symbolLogos.map(i => (
                            <IconDiplayAndDownload key={i.title} item={i} />
                        ))}
                    </div>

                    <div className="flex gap-6 w-full flex-col lg:flex-row items-center lg:items-start justify-center">
                        {horizontalLogos.map(i => (
                            <IconDiplayAndDownload key={i.title} item={i} />
                        ))}
                    </div>

                    <div className="flex gap-6 w-full flex-col lg:flex-row items-center lg:items-start justify-center">
                        {verticalLogos.map(i => (
                            <IconDiplayAndDownload key={i.title} item={i} />
                        ))}
                    </div>


                </div>


            </div>



            <div className="py-14 flex flex-col gap-12 items-center">
                <div className="unbounded-24-64-300 text-center">
                    Brand Colors
                </div>
                <div className="flex flex-wrap gap-6 justify-center">
                    {brandColors.map(i => (
                        <div key={i.title} className={`max-w-[15.625rem] flex flex-col gap-4 p-6 rounded-md ${i.className}`}>
                            <span className="tracking-widest teachers-24-400">{i.title}</span>
                            <span className="tracking-widest teachers-16-400">{i.subTitle}</span>
                            <p className="!normal-case teachers-16-400 leading-[1.3]">{i.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}

export default Mediakit