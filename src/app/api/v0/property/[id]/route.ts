import { connectToDatabase } from "../../../../../lib/mongodb";
 
import mongoose from "mongoose";

export async function GET(request: Request, context: any) {
  await connectToDatabase();

  const rawId = context?.params?.id;

  if (!rawId) {
    return new Response(
      JSON.stringify({ success: false, message: "Property id or slug is required" }),
      { status: 400 }
    );
  }

  // ✅ Decode URL (%26 → &)
  const decodedId = decodeURIComponent(rawId);

  // ✅ Normalize for flexible matching
  const normalizedName = decodedId
    .replace(/&/g, "and")
    .replace(/-/g, " ")
    .toLowerCase();

  // ✅ Build query
  const query: any[] = [
    { slug: decodedId },
    { slug: decodedId.replace(/&/g, "and") },
    {
      projectName: {
        $regex: new RegExp(`^${normalizedName}$`, "i"),
      },
    },
  ];

  // ✅ Allow Mongo ObjectId lookup
  if (mongoose.Types.ObjectId.isValid(decodedId)) {
    query.unshift({ _id: decodedId });
  }

  let property: any = null;

  try {
    // Try with isActive first
    property = await Property.findOne({
      $or: query,
      isActive: true,
    }).lean();

    // Fallback if isActive doesn't exist
    if (!property) {
      property = await Property.findOne({ $or: query }).lean();
    }
  } catch {
    property = await Property.findOne({ $or: query }).lean();
  }

  // ❌ Not found
  if (!property) {
    return new Response(
      JSON.stringify({ success: false, message: "Property not found" }),
      { status: 404 }
    );
  }

  // ✅ Fallback: inherit size from sub-property
  if (
    property.propertyType === "project" &&
    (!property.minSize || !property.sizeUnit)
  ) {
    const sub = await Property.findOne(
      {
        parentId: property._id,
        minSize: { $exists: true },
      },
      { minSize: 1, sizeUnit: 1 }
    ).lean();

    if (sub) {
      property.minSize = sub.minSize;
      property.sizeUnit = sub.sizeUnit;
    }
  }

  return new Response(JSON.stringify({ success: true, data: property }), {
    status: 200,
  });
}
