import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { TransactionDocument } from "@/src/models/Transaction";

const DB = "nexo";
const COL = "transactions";

/* ────────────────────────────────────────────────────────────────
   GET /api/transactions
   Fetches all saved transactions from MongoDB.
──────────────────────────────────────────────────────────────── */
export async function GET() {
  try {
    const client = await clientPromise;
    const col = client.db(DB).collection<TransactionDocument>(COL);

    const transactions = await col
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ success: true, transactions });
  } catch (err: any) {
    console.error("GET /api/transactions error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch transactions from MongoDB" },
      { status: 500 }
    );
  }
}

/* ────────────────────────────────────────────────────────────────
   POST /api/transactions
   Stores a new investment transaction in MongoDB.
──────────────────────────────────────────────────────────────── */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const client = await clientPromise;
    const col = client.db(DB).collection<TransactionDocument>(COL);

    const newDoc: TransactionDocument = {
      id: body.id || `txn_${Date.now()}`,
      ipoId: body.ipoId || "1",
      ipoName: body.ipoName || "IPO",
      type: body.type || "SOLO",
      amount: Number(body.amount) || 15000,
      applicationNumber: body.applicationNumber || `NEXO-APP-${Math.floor(1000 + Math.random() * 9000)}`,
      participants: Array.isArray(body.participants) ? body.participants : ["Member"],
      createdAt: new Date(),
    };

    const result = await col.insertOne(newDoc as any);

    return NextResponse.json({
      success: true,
      message: "Transaction saved to MongoDB",
      insertedId: result.insertedId,
      transaction: newDoc,
    });
  } catch (err: any) {
    console.error("POST /api/transactions error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to save transaction to MongoDB" },
      { status: 500 }
    );
  }
}
