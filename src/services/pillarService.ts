export async function fetchPillarsByCategory(category: string) {
  try {
    const res = await fetch(
      `/api/v0/pillars?category=${encodeURIComponent(category)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const result = await res.json();

    if (!result.success) {
      console.error("Pillars API error:", result.message);
      return [];
    }

    return result.data || [];
  } catch (error) {
    console.error("Failed to fetch pillars:", error);
    return [];
  }
}
