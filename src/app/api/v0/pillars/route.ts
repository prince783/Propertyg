// src/app/api/pillar/route.ts
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category") || "";

    // Use environment variable or fallback
    const CRM_BASE = process.env.CRM_API_BASE || "http://localhost:3001";

    const res = await fetch(
      `${CRM_BASE}/api/v0/public/pillars${category ? `?category=${category}` : ""}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) {
      return NextResponse.json(
        { success: false, data: [], message: `CRM API Error: ${res.status}` },
        { status: res.status }
      );
    }

    const result = await res.json();

    // Always return array in 'data'
    return NextResponse.json({
      success: true,
      data: Array.isArray(result.data) ? result.data : [],
    });
  } catch (error: any) {
    console.error("Pillar Route Error:", error);
    return NextResponse.json(
      { success: false, data: [], message: error.message || "Failed to fetch pillars" },
      { status: 500 }
    );
  }
}
