import Button from "@/components/Button";
import { Card, CardBody, CardFooter, cn, Divider, Input, Tooltip } from "@nextui-org/react";
import { PT12Wrapper } from "@/components/Wrappers";
import { Select, SelectItem } from "@nextui-org/react";
import { Airplay, Calendar, ChevronRight, Clock, Rss, Search } from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import duration from "dayjs/plugin/duration";
dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(duration);

const fakeJobs = [
    {
        avatar: "/mediakits/symbol_gradient.svg",
        title: "Those who discover this are the computefi maxis",
        publisher: "Cysic",
        location: "Remote",
        time: "2025-06-02T00:00:00.000Z",
        publisherAvatar: "/mediakits/symbol_white.svg",
    },
];

const JobCard = ({ className, job }: { className: string; job: typeof fakeJobs[0] }) => {
    return (
        <Card className={cn("flex flex-col gap-2", className)}>
            <CardBody>
                <div className="flex items-center gap-4 justify-between">
                    <div className="flex items-center gap-3">
                        <img
                            src={job.avatar}
                            alt={job.title}
                            className="self-start w-12 h-12 rounded-lg"
                        />

                        <div className="flex flex-col gap-3">
                            <div className="unbounded-18-400 leading-[1.3] max-w-[300px]">{job.title}</div>
                            <div className="flex items-center gap-1">
                                <img src={job.publisherAvatar} alt={job.publisher} className="w-4 h-4 rounded-full" />
                                <div className="teachers-14-400 text-white">{job.publisher}</div>
                            </div>

                            <div className="teachers-14-400 text-sub">{job.location}</div>
                        </div>
                    </div>
                </div>
            </CardBody>
            <Divider />
            <CardFooter>
                <div className="flex items-center gap-4 justify-between w-full">
                    <div className="flex items-center gap-3 text-sub">
                        <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <Tooltip content={dayjs(job.time).format("DD/MM/YYYY")}>
                                <div className="teachers-14-400 text-sub">{dayjs(job.time).fromNow()}</div>
                            </Tooltip>
                        </div>
                        <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <Tooltip content={dayjs(job.time).format("DD/MM/YYYY")}>
                                <div className="teachers-14-400 text-sub">{dayjs(job.time).fromNow()}</div>
                            </Tooltip>
                        </div>
                    </div>
                    <Button className="flex items-center gap-2 group">
                        Read more <ChevronRight className="group-hover:translate-x-1 transition-all duration-300 w-4 h-4" />
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
};

const CareersPage = () => {
    return (
        <PT12Wrapper className="w-full">
            <>
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-4">
                        <Input
                            startContent={<Search className="w-4 h-4" />}
                            placeholder="Job title, company or keywords"
                            isDisabled
                        />
                        <Select
                            startContent={<Rss className="w-4 h-4" />}
                            placeholder="On-site & Remote"
                            isDisabled
                        >
                            <SelectItem value="on-site">On-site</SelectItem>
                            <SelectItem value="remote">Remote</SelectItem>
                        </Select>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 w-[calc(50%-8px)]">
                            <Select isDisabled placeholder="Job function">
                                <SelectItem value="all">All</SelectItem>
                                <SelectItem value="full-time">Full-time</SelectItem>
                                <SelectItem value="part-time">Part-time</SelectItem>
                                <SelectItem value="contract">Contract</SelectItem>
                            </Select>

                            {/* Seniority */}
                            <Select isDisabled placeholder="Seniority">
                                <SelectItem value="all">All</SelectItem>
                                <SelectItem value="junior">Junior</SelectItem>
                                <SelectItem value="mid-senior">Mid-Senior</SelectItem>
                                <SelectItem value="director">Director</SelectItem>
                                <SelectItem value="executive">Executive</SelectItem>
                            </Select>

                            {/* Salary */}
                            <Select isDisabled placeholder="Salary">
                                <SelectItem value="all">8000-10000</SelectItem>
                                <SelectItem value="all">10000-12000</SelectItem>
                                <SelectItem value="all">12000-14000</SelectItem>
                                <SelectItem value="all">14000-16000</SelectItem>
                                <SelectItem value="all">16000-18000</SelectItem>
                                <SelectItem value="all">18000-20000</SelectItem>
                            </Select>
                        </div>
                        <Button className="flex items-center gap-2">
                            <Airplay className="w-4 h-4" />
                            Create Job Alert
                        </Button>
                    </div>
                </div>

                <Divider className="my-8" />

                <div className="flex flex-col gap-2">
                    <div>Showing {fakeJobs.length} jobs</div>

                    <div className="flex mt-4 gap-4 flex-wrap">
                        {fakeJobs.map((job) => (
                            <JobCard className="w-[calc(50%-16px)]" key={job.title} job={job} />
                        ))}
                    </div>
                </div>
            </>
        </PT12Wrapper>
    );
};

export default CareersPage;
