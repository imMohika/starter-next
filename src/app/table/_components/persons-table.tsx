"use client";

import type { Person } from "@/app/table/_utils/person";
import {
	DataTable,
	DataTableColumnHeader,
	DataTableCurrentPage,
	DataTablePagination,
	DataTableProvider,
	DataTableSelectPage,
	DataTableSelectRowsPerPage,
	DataTableSelectedCount,
	DataTableToolbar,
} from "@/components/data-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	Tooltip,
	TooltipContent, TooltipPortal,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import type { ColumnDef } from "@tanstack/react-table";
import { differenceInYears, format } from "date-fns";
import { InfoIcon } from "lucide-react";

const columns: Array<ColumnDef<Person>> = [
	{
		accessorKey: "avatar",
		header: () => null,
		cell: ({ row }) => {
			return (
				<Avatar>
					<AvatarImage src={row.getValue("avatar")} />
					<AvatarFallback>
						{String(row.getValue("firstName"))[0]}
						{String(row.getValue("lastName"))[0]}
					</AvatarFallback>
				</Avatar>
			);
		},
		size: 32,
		maxSize: 32,
		enableResizing: false,
	},
	{
		accessorKey: "firstName",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="First Name" />
		),
	},
	{
		accessorKey: "lastName",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Last Name" />
		),
	},
	{
		accessorKey: "sex",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Sex" />
		),
		cell: ({ getValue }) => (
			<span className="capitalize">{getValue<string>()}</span>
		),
		meta: {
			filter: {
				type: "select",
				label: "Sex",
				options: [
					{ label: "Male", value: "male" },
					{ label: "Female", value: "female" },
				],
			},
		},
	},
	{
		accessorKey: "email",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Email" />
		),
		meta: {
			filter: {
				type: "text",
				placeholder: "Filter by email...",
			},
		},
	},
	{
		accessorKey: "phoneNumber",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Phone" />
		),
	},
	{
		accessorKey: "birthDate",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Age" />
		),
		cell: ({ row }) => {
			const birthDate = new Date(row.getValue("birthDate"));
			const age = differenceInYears(Date.now(), birthDate);
			const formatted = format(birthDate, "dd/MM/yyyy");
			return (
				<div className="flex gap-0.5">
					{age}
					<Tooltip>
						<TooltipProvider>
							<TooltipTrigger asChild>
								<InfoIcon className="size-3" />
							</TooltipTrigger>
							<TooltipPortal>
								<TooltipContent>{formatted}</TooltipContent>
							</TooltipPortal>
						</TooltipProvider>
					</Tooltip>
				</div>
			);
		},
		enableSorting: true,
	},
	{
		accessorKey: "createdAt",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Joined At" />
		),
		cell: ({ row }) => {
			const date = new Date(row.getValue("createdAt"));
			const formatted = format(date, "MMM d, yyyy");
			return <div>{formatted}</div>;
		},
		enableSorting: true,
	},
];

export const PersonsTable = ({ data }: { data: Array<Person> }) => {
	return (
		<DataTableProvider columns={columns} data={data}>
			<div className="space-y-4">
				<DataTableToolbar title="Random People" />

				<div className="rounded-md border p-1">
					<DataTable />
				</div>

				<div className="flex items-center gap-4">
					<div className="flex items-baseline gap-2">
						<p>Rows per page</p>
						<DataTableSelectRowsPerPage sizeOptions={[5, 10, 15, 20]} />
					</div>

					<div className="flex items-baseline gap-2">
						<DataTableSelectedCount />
					</div>

					<DataTableCurrentPage />
					<div className="flex-1" />
					<DataTablePagination goToLastPage goToFirstPage>
						<DataTableSelectPage />
					</DataTablePagination>
				</div>
			</div>
		</DataTableProvider>
	);
};
