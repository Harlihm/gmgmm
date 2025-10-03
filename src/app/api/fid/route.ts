import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address');

  if (!address) {
    return Response.json(
      { error: "Address parameter is required" },
      { status: 400 }
    );
  }

  try {
    // Use Neynar API to get FID by wallet address
    const response = await fetch(
      `https://api.neynar.com/v2/farcaster/user/bulk-by-address?addresses=${address}`,
      {
        headers: {
          'api_key': process.env.NEYNAR_API_KEY || '',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Neynar API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.users && data.users.length > 0) {
      const user = data.users[0];
      return Response.json({
        fid: user.fid,
        score: user.score || 0,
        username: user.username,
        displayName: user.display_name
      });
    } else {
      return Response.json({
        fid: null,
        score: 0,
        error: "No Farcaster user found for this address"
      });
    }
  } catch (error) {
    console.error('Error fetching FID:', error);
    return Response.json(
      { error: "Failed to fetch FID" },
      { status: 500 }
    );
  }
}

