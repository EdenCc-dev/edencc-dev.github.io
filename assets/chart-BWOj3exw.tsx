import GradientBorderCard from "@/components/GradientBorderCard";
import dayjs from "dayjs";
import { SquareKanban } from "lucide-react";
import { useMemo } from "react";
import { isMobile } from "react-device-detect";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Bar,
  Line,
  ComposedChart,
  Legend,
} from "recharts";

const scaleDomains = (
  left: [number, number],
  right: [number, number]
): [[number, number], [number, number]] => {
  const leftNegativeRatio = Math.abs(left[0]) / (left[1] - left[0]);
  const leftPositiveRatio = left[1] / (left[1] - left[0]);
  const rightNegativeRatio = Math.abs(right[0]) / (right[1] - right[0]);
  const rightPositiveRatio = right[1] / (right[1] - right[0]);

  const fixedLeft: [number, number] = [left[0], left[1]];
  const fixedRight: [number, number] = [right[0], right[1]];

  if (leftNegativeRatio > rightNegativeRatio) {
    if (rightNegativeRatio === 0) {
      fixedRight[0] = -1 * fixedRight[1] * leftNegativeRatio;
    } else {
      fixedRight[0] = (fixedRight[0] * leftNegativeRatio) / rightNegativeRatio;
    }
  } else {
    if (leftNegativeRatio === 0) {
      fixedLeft[0] = -1 * fixedLeft[1] * rightNegativeRatio;
    } else {
      fixedLeft[0] = (fixedLeft[0] * rightNegativeRatio) / leftNegativeRatio;
    }
  }
  if (leftPositiveRatio > rightPositiveRatio) {
    if (rightPositiveRatio === 0) {
      fixedRight[1] = -1 * fixedRight[0] * leftPositiveRatio;
    } else {
      fixedRight[1] = (fixedRight[1] * leftPositiveRatio) / rightPositiveRatio;
    }
  } else {
    if (leftPositiveRatio === 0) {
      fixedLeft[1] = -1 * fixedLeft[0] * rightPositiveRatio;
    } else {
      fixedLeft[1] = (fixedLeft[1] * rightPositiveRatio) / leftPositiveRatio;
    }
  }

  return [fixedLeft, fixedRight];
};

const generateTicks = (
  domain: [number, number],
  count: number = 5
): number[] => {
  const ticks: number[] = [];
  let step = (domain[1] - domain[0]) / count;
  let start = domain[0];

  let fractionalDigits = 0;
  if (step > 0 && step < 1) {
    fractionalDigits = 1;
    for (let c of Array.from(step.toString().split(".")[1])) {
      if (c === "0") {
        fractionalDigits++;
      } else {
        break;
      }
    }

    step = Math.round(step * Math.pow(10, fractionalDigits));
    if (Math.abs(step - 1) < Math.abs(step - 5)) {
      step = 1;
    } else {
      step = 5;
    }

    step = step / Math.pow(10, fractionalDigits);
    start = Math.round(start / step) * step;
  } else {
    step = Math.round(step);

    const baseStep = Math.pow(10, step.toString().length - 1);
    const steps = [
      baseStep,
      baseStep * Math.round(step / baseStep),
      baseStep * 5,
      baseStep * 10,
      baseStep * 10 * Math.round(step / (baseStep * 10)),
    ];

    const minDiff = Math.min(...steps.map((s) => Math.abs(step - s)));
    for (let s of steps) {
      if (Math.abs(step - s) === minDiff) {
        step = s;
        break;
      }
    }

    start -= start % step;
  }

  if (step === 0) {
    return ticks;
  }

  while (start < domain[1]) {
    ticks.push(start);
    start += step;
    if (fractionalDigits > 0) {
      start =
        Math.round(start * Math.pow(10, fractionalDigits)) /
        Math.pow(10, fractionalDigits);
    }
  }

  return ticks;
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const time = payload[0]?.payload?.time;
    const value = payload[0]?.payload?.finishTaskCnt;
    const newTaskCnt = payload[0]?.payload?.newTaskCnt;

    return (
      <GradientBorderCard
        className="py-4 px-6 flex flex-col gap-1 "
        borderRadius={8}
      >
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1">
            <div className="size-3 rounded-full bg-[#21E9FA]" />
            <div className="text-[#A1A1AA] teacher font-medium text-sm">
              Task Count:
            </div>
          </div>
          <span className="font-medium teacher text-sm pl-4">{newTaskCnt}</span>
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1">
            <div className="size-3 rounded-full bg-[#9747FF]" />
            <div className="text-[#A1A1AA] teacher font-medium text-sm">
              Finish Task Count:
            </div>
          </div>
          <span className="font-medium teacher text-sm pl-4">{value}</span>
        </div>
      </GradientBorderCard>
    );
  }

  return null;
};

const Chart = ({ row = [], hasData }: any) => {
  const [leftDomain, rightDomain] = useMemo(
    () =>
      scaleDomains(
        [
          Math.min(...row?.map((d) => d.finishTaskCnt)),
          Math.max(...row?.map((d) => d?.finishTaskCnt)),
        ],
        [
          Math.min(...row?.map((d) => d.newTaskCnt)),
          Math.max(...row?.map((d) => d?.newTaskCnt)),
        ]
      ),
    [row]
  );

  return (
    <>

    <style>

    {`
        
    .recharts-legend-wrapper{
        top: ${isMobile ? '0' : '-20px!important'};
    }
    `}

    </style>
    <div className="size-full relative">
      <div className="flex items-center gap-2">
        <SquareKanban className="size-6" />
        <span className="unbounded text-base font-light ">Analytics</span>
      </div>

      {hasData ? null : (
        <div className="flex items-center justify-center size-full z-[1] p-2 rounded-[12px] absolute top-0 left-0 right-0 bottom-0 bg-[rgba(0,0,0,0.01)] backdrop-blur-[4px]">
          <div className="font-bold">Data Collecting</div>
        </div>
      )}
      <div className={`size-full ${hasData ? "" : "opacity-60"}`}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={row?.map(
              (i: {
                date: string | number | dayjs.Dayjs | Date | null | undefined;
                finishTaskCnt: string | number;
              }) => {
                return {
                  ...i,
                  time: dayjs(i?.date).toDate(),
                  value: +i?.finishTaskCnt,
                };
              }
            )}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--base-200)" />
            <XAxis dataKey="date" />
            <YAxis
              hide
              orientation="left"
              yAxisId="left"
              dataKey="finishTaskCnt"
              stroke="#387908"
              domain={leftDomain}
              ticks={generateTicks(leftDomain)}
            />
            <YAxis
              hide
              orientation="right"
              yAxisId="right"
              dataKey="newTaskCnt"
              stroke="#38abc8"
              domain={rightDomain}
              ticks={generateTicks(rightDomain)}
            />

            <Tooltip content={<CustomTooltip />} />

            <defs>
              <linearGradient id="splitColor" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset={0}
                  stopColor="var(--accentGreen)"
                  stopOpacity={0.5}
                />
                <stop
                  offset={"100%"}
                  stopColor="var(--accentGreen)"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <defs>
              <linearGradient id="splitColor2" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset={0}
                  stopColor="var(--accentPurpe)"
                  stopOpacity={0.5}
                />
                <stop
                  offset={"100%"}
                  stopColor="var(--accentPurpe)"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset={0} stopColor="#99F9FF" stopOpacity={1} />
                <stop offset={"100%"} stopColor="#99F9FF" stopOpacity={0} />
              </linearGradient>
            </defs>

            <Bar
              yAxisId="right"
              type="monotone"
              dataKey="newTaskCnt"
              barSize={20}
              fill="url(#barGradient)"
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="finishTaskCnt"
              stroke="#9747FF"
              strokeWidth={3}
            />

            <Legend
              verticalAlign="top"
              align={
                isMobile ? "left" : "right"
              }
              formatter={(str) => {
                switch (str) {
                  case "newTaskCnt":
                    return "Task Count";
                  case "finishTaskCnt":
                    return "Finish Task Count";
                }
              }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
    </>
  );
};

export default Chart;
