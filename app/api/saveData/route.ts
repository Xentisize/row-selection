import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
	const selectedRows = await request.json();

	console.log(selectedRows);

	try {
		return NextResponse.json({ message: 'Data saved' });
	} catch (error) {
		console.error('Error saving data:', error);
	}
}
