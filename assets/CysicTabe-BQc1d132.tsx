import React, { ReactNode } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, SortDescriptor, cn } from "@nextui-org/react";
import Spinner from "@/components/spinner";

const SortIcon = ({className}: {className: string}) => <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path
    d="M8.76276 2.34659C8.39386 1.81373 7.60617 1.81373 7.23727 2.34659L4.83322 5.81911C4.40726 6.43438 4.84763 7.27485 5.59596 7.27485H10.4041C11.1524 7.27485 11.5928 6.43438 11.1668 5.8191L8.76276 2.34659Z"
    fill="currentColor" />
  <path
    d="M8.76276 13.6529C8.39386 14.1857 7.60617 14.1857 7.23727 13.6529L4.83322 10.1804C4.40726 9.56508 4.84763 8.72461 5.59596 8.72461H10.4041C11.1524 8.72461 11.5928 9.56508 11.1668 10.1804L8.76276 13.6529Z"
    fill="currentColor" />
</svg>
export interface CysicTableColumn<T> {
  key: string;
  label: ReactNode;
  width?: string | number;
  sortable?: boolean;
  renderCell?: (item: T) => ReactNode;
}

interface CysicTableProps<T> {
  sortKey?: string,
  sortDirection?: string,
  data: T[];
  columns: CysicTableColumn<T>[];
  className?: string;
  sortable?: boolean;
  initialSorting?: SortDescriptor;
  onSortChange?: (descriptor: SortDescriptor) => void;
  emptyContent?: ReactNode;
  onRowClick?: (item: T) => void;
  onColumnClick?: (item: CysicTableColumn<T>) => void;
  keyExtractor?: (item: T) => string | number;
  loading?: boolean;
}

const CysicTable = <T extends object>({
  sortKey,
  sortDirection,
  loading,
  data,
  columns,
  className = "",
  sortable = false,
  initialSorting,
  onSortChange,
  emptyContent = "No data to display",
  onRowClick,
  onColumnClick,
  keyExtractor = (item: any) => item.id || Math.random().toString(),
}: CysicTableProps<T>) => {
  return (
    <Table
      shadow="none"
      aria-label="Cysic custom table"
      className={`${className} [&>div]:p-0 `}
      isHeaderSticky
      isStriped={false}
      sortDescriptor={initialSorting}
      onSortChange={onSortChange}
      selectionMode="none"
      classNames={{
        wrapper: 'px-0 !bg-[transparent]',
        th: '!bg-[#151515] !font-light [&:last-of-type]:!text-right',
        td: '[&:last-of-type]:!text-right',
      }}
    >
      <TableHeader>
        {columns.map((column) => (
          <TableColumn
            key={column.key}
            // allowsSorting={sortable && column.sortable}
            className="bg-black/50 text-sub  text-sm py-2"
            onClick={onColumnClick ? () => onColumnClick(column) : undefined}
          >
            <div className={cn("flex items-center gap-1", sortable && column?.sortable && "cursor-pointer")}>
              <span>{column.label}</span> {sortable && column?.sortable && <SortIcon className={cn(
                'text-[rgba(255,255,255,0.6)] size-3',
                sortKey == column.key && sortDirection == 'asc' && '[&>path:first-of-type]:text-[#34f3e2]',
                sortKey == column.key && sortDirection == 'desc' && '[&>path:last-of-type]:text-[#34f3e2]',
              )} />}
            </div>
          </TableColumn>
        ))}
      </TableHeader>
      <TableBody isLoading={loading} loadingContent={<div className="size-full flex items-center justify-center bg-black/20 backdrop-blur-[2px]"><Spinner /></div>} items={data} emptyContent={emptyContent}>
        {(item: any) => (
          <TableRow
            data-rank={item?.rank || ''}
            key={keyExtractor(item)}
            className="border-b border-white/5 last:border-b-0"
            onClick={onRowClick ? () => onRowClick(item) : undefined}
          >
            {(columnKey) => {
              const column = columns.find(col => col.key === columnKey);
              return (
                <TableCell className="text-white py-4 teacher text-sm !normal-case t-cell">
                  {column?.renderCell ? column.renderCell(item) : (item as any)[columnKey]}
                </TableCell>
              );
            }}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default CysicTable;