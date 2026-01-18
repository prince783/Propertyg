import { NextResponse } from "next/server";

const CRM_PUBLIC_API =
  process.env.CRM_PUBLIC_API || "http://localhost:3001";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const category = searchParams.get("category") || "";
    const featured = searchParams.get("featured") || "false";
    const limit = searchParams.get("limit") || "20";

    // 🔒 SERVER → SERVER call (NO data leak)
    const crmRes = await fetch(
      `${CRM_PUBLIC_API}/api/v0/public/property?category=${category}&featured=${featured}&limit=${limit}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    if (!crmRes.ok) {
      throw new Error("CRM API failed");
    }

    const crmData = await crmRes.json();

    // ✅ Always sanitize output
    const properties = Array.isArray(crmData?.data)
      ? crmData.data
      : [];

    return NextResponse.json({
      success: true,
      data: properties,
    });
  } catch (error) {
    console.error("Website Property Proxy Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch properties",
      },
      { status: 500 }
    );
  }
}
