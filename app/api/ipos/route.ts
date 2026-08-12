import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const SHARED_DATA_PATH = path.join(process.cwd(), "..", "shared_ipos.json");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

function readSharedIpos(): any[] {
  try {
    if (fs.existsSync(SHARED_DATA_PATH)) {
      const data = fs.readFileSync(SHARED_DATA_PATH, "utf-8");
      return JSON.parse(data);
    }
  } catch (err) {
    console.error("Error reading shared IPO data:", err);
  }
  return [
    {
      id: "ipo_1",
      name: "ABC Industries IPO",
      company: "ABC Industries IPO",
      logo: "AB",
      category: "Mainboard",
      status: "APPLICATION_OPEN",
      recommendation: "APPLY",
      thesis: "Leading automotive component manufacturer with strong domestic and export presence.",
      metrics: {
        issueSize: "₹2,400 Cr",
        priceBand: { min: 250, max: 270 },
        lotSize: 50,
        minInvestment: 15000,
        openDate: "18 Aug 2026",
        closeDate: "28 Aug 2026",
        allotmentDate: "01 Sep 2026",
        listingDate: "04 Sep 2026",
      },
      createdBy: "Shivam Prasad",
      participantsCount: 4,
      combinedCapital: 60000,
      applications: [],
      isHidden: false,
    },
    {
      id: "ipo_2",
      name: "XYZ Technologies IPO",
      company: "XYZ Technologies IPO",
      logo: "XY",
      category: "Mainboard",
      status: "APPLICATION_OPEN",
      recommendation: "APPLY",
      thesis: "High-growth enterprise software provider specializing in cloud migration solutions.",
      metrics: {
        issueSize: "₹1,800 Cr",
        priceBand: { min: 140, max: 150 },
        lotSize: 80,
        minInvestment: 12000,
        openDate: "20 Aug 2026",
        closeDate: "30 Aug 2026",
        allotmentDate: "03 Sep 2026",
        listingDate: "06 Sep 2026",
      },
      createdBy: "Shivam Prasad",
      participantsCount: 3,
      combinedCapital: 45000,
      applications: [],
      isHidden: false,
    },
  ];
}

function writeSharedIpos(ipos: any[]) {
  try {
    fs.writeFileSync(SHARED_DATA_PATH, JSON.stringify(ipos, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing shared IPO data:", err);
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const isAdmin = searchParams.get("admin") === "true";
  const allIpos = readSharedIpos();

  if (isAdmin) {
    return NextResponse.json({ success: true, ipos: allIpos }, { headers: corsHeaders });
  }

  // Filter non-hidden IPOs for members
  const visibleIpos = allIpos.filter((ipo) => !ipo.isHidden);
  return NextResponse.json({ success: true, ipos: visibleIpos }, { headers: corsHeaders });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.name || !body.minInvestment || !body.issueSize || !body.description || !body.closeDate) {
      return NextResponse.json(
        { success: false, message: "Missing required fields." },
        { status: 400, headers: corsHeaders }
      );
    }

    const allIpos = readSharedIpos();
    const formattedIssueSize = `₹${Number(body.issueSize).toLocaleString("en-IN")} Cr`;

    const newIpo = {
      id: `ipo_${Date.now()}`,
      name: body.name.trim(),
      company: body.name.trim(), // Direct company name without invented legal suffixes
      logo: body.name.trim().substring(0, 2).toUpperCase(),
      category: "Mainboard",
      status: "APPLICATION_OPEN",
      recommendation: "APPLY",
      thesis: body.description.trim(),
      isHidden: false,
      metrics: {
        issueSize: formattedIssueSize,
        priceBand: { min: 0, max: 0 },
        lotSize: 1,
        minInvestment: Number(body.minInvestment) || 15000,
        openDate: body.openDate?.trim() || "18 Aug 2026",
        closeDate: body.closeDate.trim() || "28 Aug 2026",
        allotmentDate: body.allotmentDate?.trim() || "01 Sep 2026",
        listingDate: body.listingDate?.trim() || "04 Sep 2026",
        fundUnblockDate: body.fundUnblockDate?.trim() || "02 Sep 2026",
      },
      createdBy: "Shivam Prasad",
      participantsCount: 0,
      combinedCapital: 0,
      applications: [],
    };

    const updated = [newIpo, ...allIpos];
    writeSharedIpos(updated);

    return NextResponse.json(
      {
        success: true,
        ipo: newIpo,
        message: `✓ IPO added successfully. ${body.name} is now visible to members.`,
      },
      { headers: corsHeaders }
    );
  } catch (err) {
    return NextResponse.json(
      { success: false, message: "Failed to process request." },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "IPO ID is required." },
        { status: 400, headers: corsHeaders }
      );
    }

    const allIpos = readSharedIpos();
    const target = allIpos.find((i) => i.id === id);

    if (!target) {
      return NextResponse.json(
        { success: false, message: "IPO not found." },
        { status: 404, headers: corsHeaders }
      );
    }

    // Soft hide the IPO
    const updated = allIpos.map((ipo) =>
      ipo.id === id ? { ...ipo, isHidden: true } : ipo
    );
    writeSharedIpos(updated);

    return NextResponse.json(
      {
        success: true,
        message: `✓ IPO removed. ${target.name} is no longer visible to members.`,
      },
      { headers: corsHeaders }
    );
  } catch (err) {
    return NextResponse.json(
      { success: false, message: "Failed to remove IPO." },
      { status: 500, headers: corsHeaders }
    );
  }
}
