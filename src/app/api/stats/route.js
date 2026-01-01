import { NextResponse } from 'next/server';
import dbConnect from "@/lib/db"; // আগে এখানে dbConnect ছিল, এখন db.js অনুযায়ী db দিলাম
import Income from "@/models/Income";

export async function GET() {
  await dbConnect();

  try {
    // 1. Batch Wise Stats
    const batchStats = await Income.aggregate([
      { $match: { sourceType: "BATCH" } },
      { $group: { _id: "$batchName", total: { $sum: "$amount" } } },
      { $sort: { total: -1 } }
    ]);

    // 2. Account Wise Stats
    const accountStats = await Income.aggregate([
      { $group: { _id: "$receivedBy", total: { $sum: "$amount" } } },
      { $sort: { total: -1 } }
    ]);

    // 3. Top Contributors
    const topContributors = await Income.find({ name: { $ne: "Collective Total" } })
      .sort({ amount: -1 })
      .limit(5)
      .select("name batchName amount sourceType");

    // 4. Summaries
    const allData = await Income.find({}, "sourceType amount");
    const summary = {
      total: allData.reduce((acc, curr) => acc + curr.amount, 0),
      batch: allData.filter(d => d.sourceType === "BATCH").reduce((acc, c) => acc + c.amount, 0),
      external: allData.filter(d => d.sourceType === "EXTERNAL").reduce((acc, c) => acc + c.amount, 0),
    };

    return NextResponse.json({ 
      batchStats, 
      accountStats, 
      topContributors, 
      summary 
    }, { status: 200 });

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" }, 
      { status: 500 }
    );
  }
}