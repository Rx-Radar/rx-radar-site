// pulls pharmacies from places api

import { NextRequest, NextResponse } from 'next/server';

const GOOGLE_PLACES_API_KEY = 'AIzaSyBfDFCXPpLFBFdRnWwgDATJpyl_mgu9VZU';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const latitude = searchParams.get('latitude');
  const longitude = searchParams.get('longitude');

  if (!latitude || !longitude) {
    return NextResponse.json({ error: 'Latitude and longitude are required' }, { status: 400 });
  }

  try {
    const location = `${latitude},${longitude}`;
    const radius = 5000;
    const type = 'pharmacy';
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location}&radius=${radius}&type=${type}&key=${GOOGLE_PLACES_API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`Error fetching data: ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
    }
  }
}
