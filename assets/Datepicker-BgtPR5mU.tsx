import { DatePicker as NextUIDatePicker, DateRangePicker as NextUIDateRangePicker } from '@nextui-org/date-picker';
import { toZoned, fromDate, now, getLocalTimeZone } from '@internationalized/date';

interface CustomDatePickerProps {
    label?: string;
    value?: number; // UTC timestamp in seconds
    onChange?: (timestamp: number) => void; // UTC timestamp in seconds
    granularity?: 'day' | 'hour' | 'minute' | 'second';
    isDisabled?: boolean;
    className?: string;
    timeZone?: string; // Default to Asia/Shanghai (UTC+8)
    defaultTime?: 'startOfDay' | 'endOfDay'; // Default time when no value provided
}

export const CustomDatePicker = ({
    label,
    value,
    onChange,
    granularity = 'minute',
    isDisabled = false,
    className = '',
    timeZone = 'Asia/Shanghai',
    defaultTime = 'startOfDay'
}: CustomDatePickerProps) => {
    // Get default value based on defaultTime
    const getDefaultValue = () => {
        const today = now(getLocalTimeZone());
        const todayInTimeZone = toZoned(today, timeZone);
        
        // 手动设置时间：startOfDay = 00:00, endOfDay = 23:59
        const todayDate = todayInTimeZone.toDate();
        const year = todayDate.getFullYear();
        const month = todayDate.getMonth();
        const date = todayDate.getDate();
        
        let defaultDate;
        if (defaultTime === 'startOfDay') {
            // 00:00:00
            defaultDate = new Date(year, month, date, 0, 0, 0);
        } else {
            // 23:59:59
            defaultDate = new Date(year, month, date, 23, 59, 59);
        }
        
        // 转换为指定时区的ZonedDateTime
        const defaultDateTime = toZoned(fromDate(defaultDate, timeZone), timeZone);
        return Math.floor(defaultDateTime.toDate().getTime() / 1000);
    };

    // Use provided value or default value
    const currentValue = value || getDefaultValue();

    // Convert UTC timestamp to ZonedDateTime for display
    const timestampToZonedDateTime = (timestamp: number) => {
        if (!timestamp) return null;
        const date = new Date(timestamp * 1000);
        // 使用fromDate将Date对象转换为ZonedDateTime
        return toZoned(fromDate(date, timeZone), timeZone);
    };

    // Convert ZonedDateTime to UTC timestamp
    const zonedDateTimeToTimestamp = (dateValue: { toDate: (timeZone: string) => Date } | null) => {
        if (!dateValue) return 0;
        // 使用toDate方法获取Date对象，然后转换为时间戳
        const date = dateValue.toDate(timeZone);
        return Math.floor(date.getTime() / 1000);
    };

    return (
        <NextUIDatePicker
            label={label}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            value={timestampToZonedDateTime(currentValue) as any}
            onChange={(date) => {
                if (!date) return;
                
                // date.toString() 会返回类似 '2021-11-07T00:45-07:00[America/Los_Angeles]' 的格式
                const timestamp = zonedDateTimeToTimestamp(date);
                onChange?.(timestamp);
            }}
            granularity={granularity}
            isDisabled={isDisabled}
            className={className}
        />
    );
};

interface CustomDateRangePickerProps {
    label?: string;
    from?: number; // UTC timestamp in seconds
    to?: number;   // UTC timestamp in seconds
    onChange?: (from: number, to: number) => void; // UTC timestamp in seconds
    granularity?: 'day' | 'hour' | 'minute' | 'second';
    isDisabled?: boolean;
    className?: string;
    timeZone?: string; // Default to Asia/Shanghai (UTC+8)
}

export const CustomDateRangePicker = ({
    label,
    from,
    to,
    onChange,
    granularity = 'minute',
    isDisabled = false,
    className = '',
    timeZone = 'Asia/Shanghai',
}: CustomDateRangePickerProps) => {
    // Convert UTC timestamp to ZonedDateTime for display
    const timestampToZonedDateTime = (timestamp: number | undefined) => {
        if (!timestamp) return null;
        const date = new Date(timestamp * 1000);
        return toZoned(fromDate(date, timeZone), timeZone);
    };

    // Convert ZonedDateTime to UTC timestamp
    const zonedDateTimeToTimestamp = (dateValue: { toDate: (timeZone: string) => Date } | null) => {
        if (!dateValue) return 0;
        const date = dateValue.toDate(timeZone);
        return Math.floor(date.getTime() / 1000);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const valueProp: any = (from && to)
        ? {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            start: timestampToZonedDateTime(from) as any,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            end: timestampToZonedDateTime(to) as any,
        }
        : undefined;

    return (
        <NextUIDateRangePicker
            label={label}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            value={valueProp}
            onChange={(range) => {
                // range: {start, end}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const r: any = range;
                if (!r?.start || !r?.end) return;
                const fromTs = zonedDateTimeToTimestamp(r.start);
                const toTs = zonedDateTimeToTimestamp(r.end);
                onChange?.(fromTs, toTs);
            }}
            granularity={granularity}
            isDisabled={isDisabled}
            className={className}
        />
    );
};
