import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const SHARED_FILE_PATH = path.join(process.cwd(), "..", "shared_ipos.json");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

function readSharedIpos(): any[] {
  try {
    if (fs.existsSync(SHARED_FILE_PATH)) {
      const data = fs.readFileSync(SHARED_FILE_PATH, "utf-8");
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.error("Error reading shared_ipos.json:", err);
  }
  return [];
}

function writeSharedIpos(ipos: any[]) {
  try {
    fs.writeFileSync(SHARED_FILE_PATH, JSON.stringify(ipos, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing shared_ipos.json:", err);
  }
}

function cleanDate(str: string | undefined, defaultVal: string): string {
  if (!str || !str.trim()) return defaultVal;
  let cleaned = str.trim().replace(/^(\d+)([a-zA-Z]+)/, "$1 $2");
  return cleaned.replace(/\s+/g, " ");
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET(req: NextRequest) {
  try {
    const allIpos = readSharedIpos();
    const url = new URL(req.url);
    const isAdmin = url.searchParams.get("admin") === "true";

    if (isAdmin) {
      return NextResponse.json({ success: true, ipos: allIpos }, { headers: corsHeaders });
    }

    // Filter out soft-hidden records for member user-side website
    const visibleIpos = allIpos.filter((ipo) => !ipo.isHidden);
    return NextResponse.json({ success: true, ipos: visibleIpos }, { headers: corsHeaders });
  } catch (err: any) {
    console.error("GET /api/ipos error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500, headers: corsHeaders });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { success: false, message: "Invalid JSON body" },
        { status: 400, headers: corsHeaders }
      );
    }

    const allIpos = readSharedIpos();

    // 1. Action: Publish Profit Distribution
    if (body.action === "publishProfit") {
      const { ipoId, profitDistribution } = body;
      const updated = allIpos.map((ipo) =>
        ipo.id === ipoId ? { ...ipo, profitDistribution } : ipo
      );
      writeSharedIpos(updated);
      return NextResponse.json({ success: true, message: "Profit distribution published." }, { headers: corsHeaders });
    }

    // 2. Action: Create New IPO Opportunity
    const name = body.name || body.company || "";
    const minInvestment = Number(body.minInvestment || body.minimumInvestment) || 15000;
    const issueSize = Number(body.issueSize) || 2400;
    const description = body.description || body.thesis || "";
    const closeDate = body.closeDate || "28 Aug 2026";

    if (!name || !description) {
      return NextResponse.json(
        { success: false, message: "Missing required fields (name, description)." },
        { status: 400, headers: corsHeaders }
      );
    }

    const formattedIssueSize = typeof issueSize === "number" ? `₹${issueSize.toLocaleString("en-IN")} Cr` : String(issueSize);

    const newIpo = {
      id: `ipo_${Date.now()}`,
      name: name.trim(),
      company: name.trim(),
      logo: name.trim().substring(0, 2).toUpperCase(),
      category: body.type || body.category || "Mainboard",
      status: body.status || "APPLICATION_OPEN",
      recommendation: body.recommendation || body.decision || "APPLY",
      thesis: description.trim(),
      isHidden: false,
      metrics: {
        issueSize: formattedIssueSize,
        priceBand: { min: body.priceMin || 0, max: body.priceMax || 0 },
        lotSize: body.lotSize || 1,
        minInvestment: minInvestment,
        openDate: cleanDate(body.openDate, "18 Aug 2026"),
        closeDate: cleanDate(closeDate, "28 Aug 2026"),
        allotmentDate: cleanDate(body.allotmentDate, "01 Sep 2026"),
        listingDate: cleanDate(body.listingDate, "04 Sep 2026"),
        fundUnblockDate: cleanDate(body.fundUnblockDate, "02 Sep 2026"),
      },
      createdBy: String(body.createdBy || "Shivam Prasad"),
      participantsCount: 0,
      combinedCapital: 0,
      applications: [],
    };

    const updated = [newIpo, ...allIpos];
    writeSharedIpos(updated);

    return NextResponse.json({
      success: true,
      ipo: newIpo,
      message: `✓ IPO added successfully. ${name} is now visible on the user website.`,
    }, { headers: corsHeaders });
  } catch (err: any) {
    console.error("POST /api/ipos error:", err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500, headers: corsHeaders });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, message: "Missing IPO ID." }, { status: 400, headers: corsHeaders });
    }

    const allIpos = readSharedIpos();
    const updated = allIpos.map((ipo) =>
      ipo.id === id ? { ...ipo, isHidden: true } : ipo
    );

    writeSharedIpos(updated);
    return NextResponse.json({ success: true, message: "✓ IPO removed." }, { headers: corsHeaders });
  } catch (err: any) {
    console.error("DELETE /api/ipos error:", err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500, headers: corsHeaders });
  }
}
