'use client';

import * as React from 'react';
import {
	Column,
	ColumnDef,
	useReactTable,
	getCoreRowModel,
	flexRender,
	getFilteredRowModel,
} from '@tanstack/react-table';
import { parse } from 'csv-parse/sync';

import { CloudArrowUpIcon, CheckCircleIcon } from '@heroicons/react/24/solid';
import IndeterminateCheckbox from './indeterminate-checkbox';
import Filter from './filter';

interface CsvData {
	[key: string]: string;
}

const CsvTable = () => {
	const [data, setData] = React.useState<CsvData[]>([]);
	const [rowSelection, setRowSelection] = React.useState({});

	const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => {
				const csvData = e.target?.result as string;
				const records = parse(csvData, { columns: true }) as CsvData[];
				setData(records);
			};
			reader.readAsText(file);
		}
	};

	const columns = [
		{
			id: 'select',
			header: ({ table }) => (
				<IndeterminateCheckbox
					{...{
						checked: table.getIsAllRowsSelected(),
						indeterminate: table.getIsSomeRowsSelected(),
						onChange: table.getToggleAllRowsSelectedHandler(),
					}}
				/>
			),
			cell: ({ row }) => (
				<div className="px-1">
					<IndeterminateCheckbox
						{...{
							checked: row.getIsSelected(),
							disabled: !row.getCanSelect(),
							indeterminate: row.getIsSomeSelected(),
							onChange: row.getToggleSelectedHandler(),
						}}
					/>
				</div>
			),
		},
		...(Object.keys(data[0] || {}).map((key) => ({
			accessorKey: key,
			header: key,
		})) as ColumnDef<CsvData>[]),
	];

	const table = useReactTable({
		data,
		columns,
		state: {
			rowSelection,
		},
		enableRowSelection: true,
		onRowSelectionChange: setRowSelection,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
	});

	const handleSave = async () => {
		const response = await fetch('/api/saveData', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(rowSelection),
		});

		if (response.ok) {
			alert('Selected rows saved successfully');
		} else {
			alert('Error saving selected rows');
		}
	};

	return (
		<div className="container mx-auto">
			<div className="mb-4">
				<label htmlFor="csvUpload" className="cursor-pointer">
					<CloudArrowUpIcon className="w-6 h-6 inline-block mr-2" />
					Upload CSV
				</label>
				<input id="csvUpload" type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
			</div>

			<table className="table-auto w-full">
				<thead>
					{table.getHeaderGroups().map((headerGroup) => (
						<tr key={headerGroup.id}>
							{headerGroup.headers.map((header) => (
								<th key={header.id} className="px-4 py-2" colSpan={header.colSpan}>
									{header.isPlaceholder ? null : <>{flexRender(header.column.columnDef.header, header.getContext())}</>}
									{header.column.getCanFilter() ? (
										<div>
											<Filter column={header.column} table={table} />
										</div>
									) : null}
								</th>
							))}
						</tr>
					))}
				</thead>
				<tbody>
					{table.getRowModel().rows.map((row) => (
						<tr key={row.id}>
							{row.getVisibleCells().map((cell) => (
								<td key={cell.id} className="border px-4 py-2">
									{flexRender(cell.column.columnDef.cell, cell.getContext())}
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>

			<button
				onClick={handleSave}
				disabled={table.getSelectedRowModel().rows.length === 0}
				className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
			>
				<CheckCircleIcon className="w-6 h-6 inline-block mr-2" />
				Save Selected Rows
			</button>
		</div>
	);
};

export default CsvTable;
