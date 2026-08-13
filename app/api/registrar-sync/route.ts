import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const SHARED_FILE_PATH_PARENT = path.join(process.cwd(), "..", "shared_ipos.json");
const SHARED_FILE_PATH_LOCAL = path.join(process.cwd(), "shared_ipos.json");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

function readSharedIpos(): any[] {
  try {
    if (fs.existsSync(SHARED_FILE_PATH_LOCAL)) {
      const data = fs.readFileSync(SHARED_FILE_PATH_LOCAL, "utf-8");
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
    if (fs.existsSync(SHARED_FILE_PATH_PARENT)) {
      const data = fs.readFileSync(SHARED_FILE_PATH_PARENT, "utf-8");
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
    const jsonStr = JSON.stringify(ipos, null, 2);
    fs.writeFileSync(SHARED_FILE_PATH_LOCAL, jsonStr, "utf-8");
    try {
      fs.writeFileSync(SHARED_FILE_PATH_PARENT, jsonStr, "utf-8");
    } catch (_e) {}
  } catch (err) {
    console.error("Error writing shared_ipos.json:", err);
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

/* ─────────────────────────────────────────────────────────────────
   POST /api/registrar-sync
   Admin-only manual actions:
     - "updateStatus"   : Admin manually sets ALLOTTED / REFUNDED / AWAITING
     - "checkRealPan"   : Admin checks a real PAN on registrar
───────────────────────────────────────────────────────────────── */
export async function GET() {
  // Just return current data, no automatic updates
  const allIpos = readSharedIpos();
  return NextResponse.json({ success: true, ipos: allIpos }, { headers: corsHeaders });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));

  // ── ACTION: Admin manually updates a single application status ──
  if (body.action === "updateStatus") {
    const { ipoId, applicationId, newStatus } = body;
    if (!ipoId || !applicationId || !newStatus) {
      return NextResponse.json(
        { success: false, error: "Missing ipoId, applicationId, or newStatus." },
        { status: 400, headers: corsHeaders }
      );
    }

    const allIpos = readSharedIpos();
    let found = false;

    const updatedIpos = allIpos.map((ipo) => {
      if (ipo.id === ipoId) {
        const apps = Array.isArray(ipo.applications) ? ipo.applications : [];
        const updatedApps = apps.map((app: any) => {
          if (app.id === applicationId) {
            found = true;
            return {
              ...app,
              status: newStatus,
              allotmentStatus: newStatus,
              updatedAt: new Date().toISOString(),
              updatedBy: "admin",
            };
          }
          return app;
        });
        return { ...ipo, applications: updatedApps };
      }
      return ipo;
    });

    if (found) {
      writeSharedIpos(updatedIpos);
    }

    return NextResponse.json(
      {
        success: true,
        message: `✓ Application status updated to ${newStatus}.`,
        newStatus,
      },
      { headers: corsHeaders }
    );
  }

  // ── ACTION: Admin checks a real PAN on registrar website ──
  if (body.action === "checkRealPan") {
    const { pan, registrar, ipoName } = body;
    if (!pan) {
      return NextResponse.json(
        { success: false, error: "Missing PAN card number." },
        { status: 400, headers: corsHeaders }
      );
    }

    const cleanPan = pan.trim().toUpperCase();
    const reg = registrar || "Link Intime India";
    const name = ipoName || "IPO Opportunity";

    // Try to query registrar — returns AWAITING if we can't confirm
    const result = await queryRealRegistrar(cleanPan, reg, name);

    return NextResponse.json(
      {
        success: true,
        status: result.status,
        message: result.message,
        pan: cleanPan,
        registrar: reg,
      },
      { headers: corsHeaders }
    );
  }

  // Default: return current data (no automatic changes)
  const allIpos = readSharedIpos();
  return NextResponse.json({ success: true, ipos: allIpos }, { headers: corsHeaders });
}

async function queryRealRegistrar(
  pan: string,
  registrar: string,
  ipoName: string
): Promise<{ status: "ALLOTTED" | "REFUNDED" | "AWAITING"; message: string }> {
  const cleanPan = pan.trim().toUpperCase();
  const regName = registrar.toLowerCase();

  try {
    if (regName.includes("link") || regName.includes("linkintime")) {
      const targetUrl = "https://linkintime.co.in/initial_offer/public-issues.html";
      const res = await fetch(targetUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
        body: new URLSearchParams({ clientid: cleanPan, clienttype: "PAN" }),
      }).catch(() => null);

      if (res && res.ok) {
        const html = await res.text();
        if (html.toLowerCase().includes("allotted") && !html.toLowerCase().includes("non-allottee")) {
          return { status: "ALLOTTED", message: `Link Intime: Shares ALLOTTED for PAN ${cleanPan} in ${ipoName}` };
        } else if (html.toLowerCase().includes("non-allottee") || html.toLowerCase().includes("refund")) {
          return { status: "REFUNDED", message: `Link Intime: NOT ALLOTTED for PAN ${cleanPan} in ${ipoName}` };
        }
      }
    } else if (regName.includes("kfin") || regName.includes("kfintech")) {
      const targetUrl = "https://ris.kfintech.com/ipostatus/";
      const res = await fetch(targetUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
        body: JSON.stringify({ panNo: cleanPan }),
      }).catch(() => null);

      if (res && res.ok) {
        const text = await res.text();
        if (text.toLowerCase().includes("allotted")) {
          return { status: "ALLOTTED", message: `KFintech: Shares ALLOTTED for PAN ${cleanPan} in ${ipoName}` };
        } else if (text.toLowerCase().includes("refund") || text.toLowerCase().includes("not allotted")) {
          return { status: "REFUNDED", message: `KFintech: NOT ALLOTTED for PAN ${cleanPan} in ${ipoName}` };
        }
      }
    } else if (regName.includes("bigshare")) {
      const targetUrl = "https://www.bigshareonline.com/ipo_status.html";
      const res = await fetch(targetUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
        body: new URLSearchParams({ txtpan: cleanPan }),
      }).catch(() => null);

      if (res && res.ok) {
        const text = await res.text();
        if (text.toLowerCase().includes("allotted") && !text.toLowerCase().includes("not allotted")) {
          return { status: "ALLOTTED", message: `Bigshare: Shares ALLOTTED for PAN ${cleanPan}` };
        } else if (text.toLowerCase().includes("not allotted") || text.toLowerCase().includes("refund")) {
          return { status: "REFUNDED", message: `Bigshare: NOT ALLOTTED for PAN ${cleanPan}` };
        }
      }
    }
  } catch (err) {
    console.warn("Registrar query error:", err);
  }

  // Could not confirm from registrar — return AWAITING so admin decides manually
  return {
    status: "AWAITING",
    message: `Could not confirm status from ${registrar} for PAN ${cleanPan}. Please check registrar website manually and update status.`,
  };
}
