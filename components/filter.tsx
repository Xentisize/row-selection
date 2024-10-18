'use client';

import { Column, Table } from '@tanstack/react-table';

function Filter({ column, table }: { column: Column<any, any>; table: Table<any> }) {
	const firstValue = table.getPreFilteredRowModel().flatRows[0]?.getValue(column.id);

	return (
		<input
			type="text"
			value={(column.getFilterValue() ?? '') as string}
			onChange={(e) => column.setFilterValue(e.target.value)}
			placeholder={`Search...`}
			className="w-36 border shadow rounded"
		/>
	);
}

export default Filter;
