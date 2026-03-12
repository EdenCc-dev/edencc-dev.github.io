import GradientBorderCard from "@/components/GradientBorderCard";
import { ecosystemCategories, ecosystemProjects, ecosystemSubLabelsTagColor, IEcosystemProject } from "@/routes/pages/Ecosystem/config";
import { cn, Tab, Tabs } from "@nextui-org/react";
import { useState } from "react";


export const EcosystemCard = ({ project }: { project: IEcosystemProject }) => {
    return (
        <GradientBorderCard className="flex flex-col gap-4 p-4 w-full lg:w-[calc(calc(100%-3rem)/4)] !rounded-lg">
            <div className="flex flex-col gap-4">
                <div className="flex flex-row justify-between gap-2">
                    <div className="flex gap-4">
                        {
                            project?.img ? (
                                <img src={project?.img} alt={project?.projectName} className={cn("bg-white w-10 h-10 rounded-full", project?.className)} />
                            ) : <div className="bg-white w-10 h-10 rounded-full flex items-center justify-center">
                                <span className="text-sm text-black">{project?.projectName.slice(0, 2)}</span>
                            </div>
                        }
                        <div className="flex flex-col gap-1 flex-1">
                            <div className="break-words unbounded-16-300">{project?.projectName}</div>
                            <div className="flex flex-wrap gap-1">
                            {
                                project?.subLabel?.map((subLabel) => (
                                    <div key={subLabel} className={cn("text-xs text-white w-fit px-2 rounded", ecosystemSubLabelsTagColor[subLabel as keyof typeof ecosystemSubLabelsTagColor])}>{subLabel}</div>
                                ))
                            }
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-row gap-2">
                        <a href={project?.twitterLink ? project?.twitterLink : ""} target="_blank" className={cn("w-6 h-6 flex items-center justify-center rounded-full bg-white", !project?.twitterLink && "opacity-50")}>
                            <svg width="12" height="13" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M6.99893 5.39876L10.9078 0H9.98151L6.58745 4.68766L3.87662 0H0.75L4.84931 7.08858L0.75 12.75H1.67633L5.26055 7.79967L8.12338 12.75H11.25L6.9987 5.39876H6.99893ZM5.73019 7.15103L5.31485 6.44517L2.0101 0.828546H3.43288L6.09985 5.36134L6.5152 6.0672L9.98195 11.9591H8.55917L5.73019 7.1513V7.15103Z" fill="#090A09" />
                            </svg>
                        </a>
                        <a href={project?.websiteLink ? project?.websiteLink : ""} target="_blank" className={cn("w-6 h-6 flex items-center justify-center rounded-full bg-white", !project?.websiteLink && "opacity-50")}>
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clipRule="evenodd" d="M4.89516 1.09574C5.14669 1.01106 5.40236 0.943831 5.66045 0.894057C5.07611 1.57339 4.58996 2.33748 4.2188 3.16335C4.19714 3.21156 4.17588 3.25993 4.15504 3.30847H1.92261C2.66224 2.2716 3.70179 1.49751 4.89516 1.09574ZM1.44547 4.09611C1.05187 4.87114 0.823827 5.72512 0.779086 6.60104L3.39735 6.56822C3.441 5.72589 3.59606 4.89434 3.8576 4.09611H1.44547ZM1.59632 10.0244C1.13486 9.2209 0.858113 8.31944 0.788418 7.38863L3.38914 7.35603C3.41538 8.41229 3.55838 9.28902 3.77936 10.0244H1.59632ZM4.59041 10.0244C4.3519 9.32442 4.18837 8.4516 4.16007 7.34636L6.38867 7.31843V10.0244H4.59041ZM7.1596 10.0244V7.30876L9.39578 7.28074C9.39423 7.38936 9.39065 7.49797 9.38505 7.6065L10.1549 7.64799C10.1614 7.52241 10.1654 7.39675 10.1669 7.27107L12.7582 7.23859C12.7288 7.63356 12.6751 8.02636 12.5971 8.41461L13.3523 8.57287C13.4607 8.03293 13.526 7.48488 13.5475 6.93414L13.5478 6.92623L13.5478 6.91832C13.5473 5.4538 13.0921 4.0272 12.2476 2.84377C11.4032 1.66035 10.2131 0.781114 8.84853 0.332577C7.48397 -0.11596 6.01532 -0.110675 4.65388 0.347671C3.29245 0.806017 2.10843 1.6938 1.27218 2.88327C0.435925 4.07274 -0.00944357 5.50258 0.000151855 6.96707C0.00974731 8.43155 0.473813 9.85518 1.32558 11.0331C2.17734 12.211 3.37289 13.0825 4.7402 13.5222C6.10752 13.9619 7.57611 13.9471 8.93467 13.4799L8.68875 12.7334C8.39994 12.8328 8.10552 12.909 7.80808 12.9621C8.073 12.7044 8.32682 12.4347 8.56875 12.1539L7.99005 11.6335C7.72775 11.938 7.45056 12.2285 7.1596 12.5039V10.8121H8.06944V10.0244H7.1596ZM7.1596 6.52106L9.37149 6.49334C9.36885 6.45862 9.366 6.42391 9.36294 6.38921L9.36276 6.38718L9.3626 6.38515C9.30109 5.59582 9.1335 4.82626 8.86952 4.09611H7.1596V6.52106ZM12.7592 6.45087L10.1439 6.48366C10.14 6.42928 10.1357 6.37493 10.1309 6.32062C10.0713 5.55719 9.92076 4.81073 9.68669 4.09611H12.1023C12.4733 4.82653 12.6973 5.62733 12.7592 6.45087ZM4.17001 6.55854L6.38867 6.53073V4.09611H4.67482C4.38884 4.88665 4.21862 5.71643 4.17001 6.55854ZM4.06659 10.8121H2.13396C2.87219 11.7309 3.85759 12.4127 4.97166 12.7709C5.18012 12.838 5.39125 12.8931 5.60408 12.9363C5.24001 12.6086 4.86099 12.2017 4.52345 11.6729C4.35856 11.4146 4.20464 11.1293 4.06659 10.8121ZM4.92239 10.8121H6.38867V12.5799C5.97458 12.2426 5.544 11.8298 5.16918 11.2427C5.08403 11.1093 5.00136 10.9661 4.92239 10.8121ZM8.54008 3.30847H7.1596V1.2471C7.7185 1.86456 8.18263 2.55974 8.54008 3.30847ZM5.00449 3.30847C5.36501 2.55402 5.83169 1.85903 6.38867 1.24521V3.30847H5.00449ZM9.38941 3.30847H11.6252L11.6247 3.30777C10.8763 2.25903 9.82167 1.47986 8.61241 1.08237C8.37325 1.00375 8.13047 0.94087 7.88554 0.893712C8.50737 1.61773 9.01369 2.43285 9.38941 3.30847ZM8.68567 7.90304C8.60703 7.88667 8.52565 7.89048 8.44881 7.91409C8.37196 7.93771 8.30204 7.98042 8.24529 8.03839C8.18855 8.09636 8.14675 8.1678 8.12363 8.24632C8.1005 8.32485 8.09678 8.40799 8.1128 8.48833L8.96649 12.5814L8.96661 12.582C8.98655 12.6781 9.03398 12.766 9.10291 12.8346C9.17196 12.9033 9.25947 12.9495 9.35427 12.9672C9.44909 12.9849 9.54692 12.9734 9.63532 12.9342C9.72371 12.8949 9.7987 12.8297 9.8507 12.7468L10.3299 11.9696L12.3172 14L14.0001 12.2767L12.011 10.2445L12.7729 9.74673C12.8534 9.69592 12.9176 9.62201 12.9574 9.53414C12.9986 9.44337 13.0118 9.34196 12.9952 9.24335C12.9787 9.14475 12.9332 9.05361 12.8648 8.98202C12.7986 8.91274 12.714 8.86492 12.6216 8.84441L8.69115 7.90418L8.68567 7.90304ZM11.7895 9.45431L8.96141 8.77778L9.57446 11.7171L10.1923 10.7151L12.3166 12.8855L12.9105 12.2773L10.7879 10.1088L11.7895 9.45431Z" fill="black" />
                            </svg>

                        </a>
                    </div>
                </div>
                <div className="teachers-16-400 normal-case">{project?.blurb}</div>

            </div>
        </GradientBorderCard>
    )
}

const EcosystemPage = () => {

    const [selectedCategory, setSelectedCategory] = useState("ALL");
    const filteredProjects = ecosystemProjects.filter((project) => selectedCategory === "ALL" ? true : project.category === selectedCategory);

    return (
        <>
            {/* 主标题 */}
            <div className="pt-12 flex flex-col items-center gap-6 relative z-[2]">
                <div className="flex flex-col items-center">
                    <span className={cn("unbounded-32-64-200 text-white text-center")}>ECOSYSTEM</span>
                </div>
            </div>

            {/* 主要内容部分 */}
            <div className="w-full mx-auto mt-8 relative z-[2] mb-auto">
                <Tabs
                    selectedKey={selectedCategory}
                    onSelectionChange={(key) => setSelectedCategory(key as string)}
                    variant="underlined"
                    classNames={{
                        tabList: "flex-wrap gap-0 justify-start",
                        tab: "w-fit border-b border-[#FFFFFF80] text-base py-4 box-content px-6 lg:min-w-[9.375rem]",
                        cursor: "box-content px-3"
                    }}>
                    {ecosystemCategories.map((category) => (
                        <Tab key={category} title={category}>
                            <div className="flex gap-4 flex-col lg:flex-row flex-wrap mt-4 justify-start">
                                {
                                    filteredProjects.map((project) => (
                                        <EcosystemCard key={project.projectName} project={project} />
                                    ))
                                }
                            </div>
                        </Tab>
                    ))}
                </Tabs>

            </div>
        </>
    )
}

export default EcosystemPage;