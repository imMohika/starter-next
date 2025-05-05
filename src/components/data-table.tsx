"use client";

import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
} from "@/components/ui/command";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
	type Column,
	type ColumnDef,
	type ColumnFiltersState,
	type Header,
	type Row,
	type RowData,
	type SortingState,
	type Table as TTable,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import {
	CheckIcon,
	ChevronDownIcon,
	ChevronLeftIcon,
	ChevronRightIcon,
	ChevronUpIcon,
	ChevronsLeftIcon,
	ChevronsRightIcon,
	ChevronsUpDownIcon,
	EyeOffIcon,
	GripVerticalIcon,
	PlusCircleIcon,
	Settings2Icon,
	X,
	XIcon,
} from "lucide-react";
import * as React from "react";
import {
	type ComponentProps,
	type Context,
	Fragment,
	type ReactNode,
	createContext,
	useCallback,
	useContext,
	useMemo,
	useState,
} from "react";
import { Badge } from "./ui/badge";

declare module "@tanstack/react-table" {
	interface ColumnMeta<TData extends RowData, TValue> {
		filter?: ColumnFilterOption;
	}
}

export type ColumnFilterOption =
	| {
			type: "text";
			placeholder: string;
	  }
	| {
			type: "select" | "multiselect";
			label?: string;
			options: Array<FacetOption>;
	  };

export interface FacetOption {
	label: string;
	value: string;
	icon?: ReactNode;
}

export type GetSubComponentFn<TData> = (row: Row<TData>) => ReactNode;

//=== Context
interface DataTableContextType<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	table: TTable<TData>;
	getSubComponent?: GetSubComponentFn<TData>;
}

// biome-ignore lint/suspicious/noExplicitAny:
const DataTableContext = createContext<DataTableContextType<any, any> | null>(
	null,
);

interface DataTableProviderProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	enableResizing?: boolean;
	getSubComponent?: GetSubComponentFn<TData>;
	pageSize?: number;
	children: ReactNode;
}

export function DataTableProvider<TData, TValue>({
	columns,
	data,
	pageSize = 10,
	getSubComponent,
	// TODO)) still WIP, has performance issues
	enableResizing = false,
	children,
}: DataTableProviderProps<TData, TValue>) {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize,
	});

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		onPaginationChange: setPagination,
		onSortingChange: setSorting,
		getSortedRowModel: getSortedRowModel(),
		onColumnFiltersChange: setColumnFilters,
		getFilteredRowModel: getFilteredRowModel(),
		enableColumnResizing: enableResizing,
		columnResizeMode: "onChange",
		defaultColumn: {
			enableSorting: false,
		},
		state: {
			sorting,
			columnFilters,
			pagination,
		},
	});

	return (
		<DataTableContext.Provider
			value={{ columns, data, table, getSubComponent }}
		>
			{children}
		</DataTableContext.Provider>
	);
}

export function useDataTable<TData, TValue>() {
	const context = useContext(
		DataTableContext as Context<DataTableContextType<TData, TValue> | null>,
	);

	if (!context) {
		throw new Error("useDataTable must be used within a DataTableProvider");
	}

	return context;
}

//=== Components
export function DataTable({ style, ...props }: ComponentProps<"table">) {
	const { table } = useDataTable();

	// biome-ignore lint/correctness/useExhaustiveDependencies: Based on document example: https://tanstack.com/table/v8/docs/framework/react/examples/column-resizing-performant
	const columnSizeVars = useMemo(() => {
		const headers = table.getFlatHeaders();
		const colSizes: { [key: string]: number } = {};
		for (const header of headers) {
			colSizes[`--header-${header.id}-size`] = header.getSize();
			colSizes[`--col-${header.column.id}-size`] = header.column.getSize();
		}
		return colSizes;
	}, [table.getState().columnSizingInfo, table.getState().columnSizing]);

	return (
		<Table
			style={{
				width: table.getTotalSize(),
				minWidth: "100%",
				...columnSizeVars,
				...style,
			}}
			{...props}
		>
			<TableHeader>
				{table.getHeaderGroups().map((headerGroup) => (
					<TableRow key={headerGroup.id}>
						{headerGroup.headers.map((header) => {
							return (
								<TableHead
									key={header.id}
									colSpan={header.colSpan}
									className="group/th relative"
									style={{
										width: `calc(var(--header-${header?.id}-size) * 1px)`,
									}}
								>
									{header.isPlaceholder
										? null
										: flexRender(
												header.column.columnDef.header,
												header.getContext(),
											)}

									<DataTableResizer header={header} />
								</TableHead>
							);
						})}
					</TableRow>
				))}
			</TableHeader>

			<DataTableBody />
		</Table>
	);
}

const DataTableBody = () => {
	const { table, columns, getSubComponent } = useDataTable();
	if (!table.getRowModel().rows?.length) {
		return (
			<TableBody>
				<TableRow>
					<TableCell colSpan={columns.length} className="h-24 text-center">
						No results.
					</TableCell>
				</TableRow>
			</TableBody>
		);
	}

	if (!getSubComponent) {
		return (
			<TableBody>
				{table.getRowModel().rows.map((row) => (
					<DataTableRow key={row.id} row={row} />
				))}
			</TableBody>
		);
	}

	return (
		<TableBody>
			{table.getRowModel().rows.map((row) => {
				const sub = getSubComponent ? getSubComponent(row) : null;
				return (
					<Fragment key={row.id}>
						<DataTableRow row={row} className="border-0" />
						{sub}
					</Fragment>
				);
			})}
		</TableBody>
	);
};

const DataTableRow = ({
	row,
	className,
}: { row: Row<unknown>; className?: string }) => {
	return (
		<TableRow
			data-state={row.getIsSelected() && "selected"}
			className={className}
		>
			{row.getVisibleCells().map((cell) => (
				<TableCell
					key={cell.id}
					style={{
						width: `calc(var(--col-${cell.column.id}-size) * 1px)`,
						minWidth: cell.column.columnDef.minSize,
					}}
				>
					{flexRender(cell.column.columnDef.cell, cell.getContext())}
				</TableCell>
			))}
		</TableRow>
	);
};

interface DataTableColumnHeaderProps<TData, TValue> {
	column: Column<TData, TValue>;
	title: string;
	className?: string;
	trigger?: ReactNode;
}

export function DataTableColumnHeader<TData, TValue>({
	column,
	title,
	className,
	trigger,
}: DataTableColumnHeaderProps<TData, TValue>) {
	if (!column.getCanSort()) {
		return <div className={cn(className)}>{title}</div>;
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger className={cn("", className)} asChild>
				{!trigger ? (
					<Button
						variant="ghost"
						size="sm"
						className="-ml-3 h-8 data-[state=open]:bg-accent"
					>
						<span>{title}</span>
						{column.getIsSorted() === "desc" ? (
							<ChevronDownIcon />
						) : column.getIsSorted() === "asc" ? (
							<ChevronUpIcon />
						) : (
							<ChevronsUpDownIcon />
						)}
					</Button>
				) : (
					trigger
				)}
			</DropdownMenuTrigger>
			<DropdownMenuContent align="start">
				<DropdownMenuCheckboxItem
					checked={column.getIsSorted() === "asc"}
					onClick={() => column.toggleSorting(false)}
				>
					<ChevronUpIcon className="text-muted-foreground/70" />
					Asc
				</DropdownMenuCheckboxItem>
				<DropdownMenuCheckboxItem
					checked={column.getIsSorted() === "desc"}
					onClick={() => column.toggleSorting(true)}
				>
					<ChevronDownIcon className="text-muted-foreground/70" />
					Desc
				</DropdownMenuCheckboxItem>
				{column.getIsSorted() && (
					<DropdownMenuItem onClick={() => column.clearSorting()}>
						<XIcon className="text-muted-foreground/70" />
						Reset
					</DropdownMenuItem>
				)}
				<DropdownMenuSeparator />
				{column.getCanHide() && (
					<DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
						<EyeOffIcon className="text-muted-foreground/70" />
						Hide
					</DropdownMenuItem>
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

export function DataTableSelectedCount({ className }: { className?: string }) {
	const { table } = useDataTable();
	return (
		<div className={cn("flex-1 text-muted-foreground text-sm", className)}>
			{table.getFilteredSelectedRowModel().rows.length} of{" "}
			{table.getFilteredRowModel().rows.length} row(s) selected.
		</div>
	);
}

export function DataTableSelectRowsPerPage({
	sizeOptions = [10, 20, 30, 40, 50],
	className,
}: {
	sizeOptions?: Array<number>;
	className?: string;
}) {
	const { table } = useDataTable();

	return (
		<Select
			value={`${table.getState().pagination.pageSize}`}
			onValueChange={(value) => {
				table.setPageSize(Number(value));
			}}
		>
			<SelectTrigger className={cn("h-8 w-[70px]", className)}>
				<SelectValue placeholder={table.getState().pagination.pageSize} />
			</SelectTrigger>
			<SelectContent side="top">
				{sizeOptions.map((pageSize) => (
					<SelectItem key={pageSize} value={`${pageSize}`}>
						{pageSize}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}

export function DataTableCurrentPage({ className }: { className?: string }) {
	const { table } = useDataTable();
	return (
		<div className={cn("font-medium text-sm", className)}>
			Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
		</div>
	);
}

type DataTablePaginationProps = {
	children?: ReactNode;
	goToFirstPage?: boolean;
	goToLastPage?: boolean;
};

export function DataTablePagination({
	children,
	goToFirstPage,
	goToLastPage,
}: DataTablePaginationProps) {
	const { table } = useDataTable();

	return (
		<div className="flex items-center gap-2">
			{goToFirstPage && (
				<Button
					variant="outline"
					size="icon"
					className="hidden md:flex"
					onClick={() => table.setPageIndex(0)}
					disabled={!table.getCanPreviousPage()}
				>
					<span className="sr-only">Go to first page</span>
					<ChevronsLeftIcon />
				</Button>
			)}

			<Button
				variant="outline"
				size="icon"
				onClick={() => table.previousPage()}
				disabled={!table.getCanPreviousPage()}
			>
				<span className="sr-only">Go to previous page</span>
				<ChevronLeftIcon />
			</Button>

			{children}

			<Button
				variant="outline"
				size="icon"
				onClick={() => table.nextPage()}
				disabled={!table.getCanNextPage()}
			>
				<span className="sr-only">Go to next page</span>
				<ChevronRightIcon />
			</Button>

			{goToLastPage && (
				<Button
					variant="outline"
					size="icon"
					className="hidden md:flex"
					onClick={() => table.setPageIndex(table.getPageCount() - 1)}
					disabled={!table.getCanNextPage()}
				>
					<span className="sr-only">Go to last page</span>
					<ChevronsRightIcon />
				</Button>
			)}
		</div>
	);
}

export function DataTableSelectPage({ className }: { className?: string }) {
	const { table } = useDataTable();

	return (
		<Select
			value={`${table.getState().pagination.pageIndex}`}
			onValueChange={(value) => {
				table.setPageIndex(Number(value));
			}}
		>
			<SelectTrigger className={cn("h-8 w-[70px]", className)}>
				<SelectValue placeholder={table.getState().pagination.pageIndex} />
			</SelectTrigger>
			<SelectContent side="top">
				{Array.from({ length: table.getPageCount() }, (_, i) => i).map(
					(page) => (
						<SelectItem key={page} value={`${page}`}>
							{page + 1}
						</SelectItem>
					),
				)}
			</SelectContent>
		</Select>
	);
}

export function DataTableViewOptions() {
	const { table } = useDataTable();
	const toggleableColumns = useMemo(
		() =>
			table
				.getAllColumns()
				.filter(
					(column) =>
						typeof column.accessorFn !== "undefined" && column.getCanHide(),
				),
		[table],
	);
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="outline"
					size="sm"
					className="ml-auto hidden h-8 md:flex"
				>
					<Settings2Icon />
					View
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-[150px]">
				<DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
				<DropdownMenuSeparator />
				{toggleableColumns.map((column) => {
					return (
						<DropdownMenuCheckboxItem
							key={column.id}
							className="capitalize"
							checked={column.getIsVisible()}
							onCheckedChange={(value) => column.toggleVisibility(value)}
						>
							{column.id}
						</DropdownMenuCheckboxItem>
					);
				})}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

function DataTableResizer({ header }: { header: Header<unknown, unknown> }) {
	if (!header.column.getCanResize()) return null;

	const isResizing = header.column.getIsResizing();
	return (
		<div
			onMouseDown={header.getResizeHandler()}
			onTouchStart={header.getResizeHandler()}
			onDoubleClick={() => header.column.resetSize()}
			className={cn(
				"absolute top-0 right-0 z-10 flex h-full w-4 cursor-col-resize touch-none select-none items-center justify-center opacity-0 group-hover/th:opacity-100",
				isResizing && "opacity-100",
			)}
			aria-hidden="true"
			data-resizing={isResizing ? "true" : undefined}
		>
			<div className="flex h-4/5 items-center justify-center">
				<Separator
					orientation="vertical"
					className={cn(
						"h-4/5 w-0.5 transition-colors duration-200",
						isResizing ? "bg-primary" : "bg-border",
					)}
				/>

				<GripVerticalIcon
					className={cn(
						"absolute size-4 text-muted-foreground/70",
						isResizing ? "text-primary" : "text-muted-foreground/70",
					)}
				/>
			</div>
		</div>
	);
}

export const DataTableToolbar = ({
	title,
	children,
}: { title?: string; children?: ReactNode }) => {
	return (
		<div className="flex w-full items-center gap-4">
			{title && <p className="font-medium">{title}</p>}

			<div className="flex flex-1 flex-wrap items-center gap-2 rounded-md border border-border px-3 py-1">
				<p className="font-medium text-sm">Filters</p>
				<DataTableTextInputFilters />
				<DataTableFacetedFilters />
				{children}

				<div className="flex-1" />
				<DataTableResetFilters />
			</div>

			<DataTableViewOptions />
		</div>
	);
};

export const DataTableResetFilters = ({
	className,
}: { className?: string }) => {
	const { table } = useDataTable();
	const filtered = table.getState().columnFilters.length > 0;
	const resetFilters = React.useCallback(() => {
		table.resetColumnFilters();
	}, [table]);

	if (!filtered) return null;

	return (
		<Button
			variant="outline"
			size="sm"
			className={cn("border-dashed", className)}
			onClick={resetFilters}
		>
			<X />
			Reset
		</Button>
	);
};

export const DataTableTextInputFilters = () => {
	const { table } = useDataTable();
	const columns = useMemo(
		() =>
			table
				.getAllColumns()
				.filter(
					(column) =>
						column.getCanFilter() &&
						column.columnDef.meta?.filter?.type === "text",
				),
		[table],
	);

	return (
		<div className="flex flex-wrap gap-4">
			{columns.map((column) => {
				const filterMeta = column.columnDef.meta?.filter;
				if (!filterMeta || filterMeta.type !== "text") return null;

				return (
					<Input
						key={column.id}
						placeholder={filterMeta.placeholder}
						value={(column.getFilterValue() as string) ?? ""}
						onChange={(event) => column.setFilterValue(event.target.value)}
						className="h-8 w-40"
					/>
				);
			})}
		</div>
	);
};

export const DataTableFacetedFilters = () => {
	const { table } = useDataTable();
	const columns = useMemo(
		() =>
			table
				.getAllColumns()
				.filter(
					(column) =>
						column.getCanFilter() &&
						(column.columnDef.meta?.filter?.type === "select" ||
							column.columnDef.meta?.filter?.type === "multiselect"),
				),
		[table],
	);

	return (
		<div className="flex flex-wrap gap-4">
			{columns.map((column) => {
				const filterMeta = column.columnDef?.meta?.filter;
				if (
					!filterMeta ||
					(filterMeta.type !== "select" && filterMeta.type !== "multiselect")
				)
					return null;

				return (
					<DataTableFacetedFilter
						key={column.id}
						column={column}
						label={filterMeta.label ?? column.id}
						options={filterMeta.options ?? []}
						multiple={filterMeta.type === "multiselect"}
					/>
				);
			})}
		</div>
	);
};

export interface DataTableFacetedFilterProps<TData, TValue> {
	column?: Column<TData, TValue>;
	label?: string;
	options: Array<FacetOption>;
	multiple?: boolean;
}

export function DataTableFacetedFilter<TData, TValue>({
	column,
	label,
	options,
	multiple,
}: DataTableFacetedFilterProps<TData, TValue>) {
	const [open, setOpen] = useState(false);

	const facets = column?.getFacetedUniqueValues();
	const columnFilterValue = column?.getFilterValue();
	const selectedValues = new Set(
		Array.isArray(columnFilterValue) ? columnFilterValue : [],
	);

	const onSelect = useCallback(
		(option: FacetOption, isSelected: boolean) => {
			if (!column) return;

			if (!multiple) {
				column.setFilterValue(isSelected ? undefined : [option.value]);
				setOpen(false);
				return;
			}

			const newSelectedValues = new Set(selectedValues);
			if (isSelected) {
				newSelectedValues.delete(option.value);
			} else {
				newSelectedValues.add(option.value);
			}
			const filterValues = Array.from(newSelectedValues);
			column.setFilterValue(filterValues.length ? filterValues : undefined);
		},
		[column, multiple, selectedValues],
	);

	const resetFilters = React.useCallback(() => {
		column?.setFilterValue(undefined);
	}, [column]);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button variant="outline" size="sm" className="h-8 border-dashed">
					<PlusCircleIcon />
					{label}
					{selectedValues?.size > 0 && (
						<>
							<Separator orientation="vertical" className="mx-2 h-4" />
							<Badge
								variant="secondary"
								className="rounded-sm px-1 font-normal lg:hidden"
							>
								{selectedValues.size}
							</Badge>
							<div className="hidden space-x-1 lg:flex">
								{selectedValues.size > 2 ? (
									<Badge
										variant="secondary"
										className="rounded-sm px-1 font-normal"
									>
										{selectedValues.size} selected
									</Badge>
								) : (
									options
										.filter((option) => selectedValues.has(option.value))
										.map((option) => (
											<Badge
												variant="secondary"
												key={option.value}
												className="rounded-sm px-1 font-normal"
											>
												{option.label}
											</Badge>
										))
								)}
							</div>
						</>
					)}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[200px] p-0" align="start">
				<Command>
					<CommandInput placeholder={label} />
					<CommandList>
						<CommandEmpty>No results found.</CommandEmpty>
						<CommandGroup>
							{options.map((option) => {
								const isSelected = selectedValues.has(option.value);
								return (
									<CommandItem
										key={option.value}
										onSelect={() => onSelect(option, isSelected)}
									>
										<div
											className={cn(
												"mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
												isSelected
													? "bg-primary text-primary-foreground"
													: "opacity-50 [&_svg]:invisible",
											)}
										>
											<CheckIcon />
										</div>
										{option.icon}
										<span>{option.label}</span>
										{facets?.get(option.value) && (
											<span className="ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs">
												{facets.get(option.value)}
											</span>
										)}
									</CommandItem>
								);
							})}
						</CommandGroup>
						{selectedValues.size > 0 && (
							<>
								<CommandSeparator />
								<CommandGroup>
									<CommandItem
										onSelect={() => resetFilters()}
										className="justify-center text-center"
									>
										Clear filters
									</CommandItem>
								</CommandGroup>
							</>
						)}
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
