import { NextResponse } from "next/server";

const CRM_PUBLIC_API =
  process.env.CRM_PUBLIC_API || "http://localhost:3001";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params?.slug;

    if (!slug) {
      return NextResponse.json(
        { success: false, message: "Slug is required" },
        { status: 400 }
      );
    }

    // 🔥 PROXY TO CRM PUBLIC API
    const crmResponse = await fetch(
      `/api/public/property/${encodeURIComponent(slug)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    const data = await crmResponse.json();

    if (!crmResponse.ok) {
      return NextResponse.json(data, { status: crmResponse.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Website Property Proxy Error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to fetch property" },
      { status: 500 }
    );
  }
}
