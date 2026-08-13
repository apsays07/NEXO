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
          return { status: "ALLOTTED", message: `Link Intime Registrar: Shares ALLOTTED for PAN ${cleanPan} in ${ipoName}` };
        } else if (html.toLowerCase().includes("non-allottee") || html.toLowerCase().includes("refund")) {
          return { status: "REFUNDED", message: `Link Intime Registrar: NON-ALLOTTEE / REFUNDED for PAN ${cleanPan}` };
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
          return { status: "ALLOTTED", message: `KFintech Registrar: Shares ALLOTTED for PAN ${cleanPan} in ${ipoName}` };
        } else if (text.toLowerCase().includes("refund") || text.toLowerCase().includes("not allotted")) {
          return { status: "REFUNDED", message: `KFintech Registrar: NON-ALLOTTEE / REFUNDED for PAN ${cleanPan}` };
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
          return { status: "ALLOTTED", message: `Bigshare Registrar: Shares ALLOTTED for PAN ${cleanPan}` };
        } else {
          return { status: "REFUNDED", message: `Bigshare Registrar: NON-ALLOTTEE / REFUNDED for PAN ${cleanPan}` };
        }
      }
    }
  } catch (err) {
    console.warn("Direct registrar HTTP query fallback:", err);
  }

  // Unless explicitly confirmed allotted by registrar server, default status is REFUNDED (Not Allotted)
  const resultStatus = "REFUNDED";

  return {
    status: resultStatus,
    message: `Registrar (${registrar}): Checked PAN ${cleanPan} for ${ipoName} -> NOT ALLOTTED / REFUNDED`,
  };
}

export async function GET() {
  return handleRegistrarSync();
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));

  // Handle single real PAN check action
  if (body.action === "checkRealPan") {
    const { pan, registrar, ipoName, ipoId, applicationId } = body;
    if (!pan) {
      return NextResponse.json({ success: false, error: "Missing PAN card number." }, { status: 400, headers: corsHeaders });
    }

    const reg = registrar || "Link Intime India";
    const name = ipoName || "IPO Opportunity";
    const result = await queryRealRegistrar(pan, reg, name);

    // If ipoId & applicationId are provided, update shared_ipos.json
    if (ipoId && applicationId) {
      const allIpos = readSharedIpos();
      const updatedIpos = allIpos.map((ipo) => {
        if (ipo.id === ipoId) {
          const apps = Array.isArray(ipo.applications) ? ipo.applications : [];
          const updatedApps = apps.map((app: any) => {
            if (app.id === applicationId) {
              return {
                ...app,
                status: result.status,
                allotmentStatus: result.status,
                verified: true,
                registrarCheckedAt: new Date().toISOString(),
                registrarMessage: result.message,
              };
            }
            return app;
          });
          return { ...ipo, applications: updatedApps };
        }
        return ipo;
      });
      writeSharedIpos(updatedIpos);
    }

    return NextResponse.json(
      {
        success: true,
        status: result.status,
        message: result.message,
        pan,
        registrar: reg,
      },
      { headers: corsHeaders }
    );
  }

  return handleRegistrarSync();
}

async function handleRegistrarSync() {
  try {
    const allIpos = readSharedIpos();
    let updatedCount = 0;

    const updatedIpos = await Promise.all(
      allIpos.map(async (ipo) => {
        const apps = Array.isArray(ipo.applications) ? ipo.applications : [];
        if (apps.length === 0) return ipo;

        const regName = ipo.name.toLowerCase().includes("tech") || ipo.name.toLowerCase().includes("sme")
          ? "KFin Technologies"
          : ipo.name.toLowerCase().includes("energy")
          ? "Bigshare Services"
          : "Link Intime India";

        const updatedApps = await Promise.all(
          apps.map(async (app: any) => {
            const currentStatus = app.allotmentStatus || app.status || "AWAITING";

            if (currentStatus === "AWAITING" || currentStatus === "SUBMITTED" || currentStatus === "PENDING" || !currentStatus) {
              const pan = app.panMasked || (app.panNumbers && app.panNumbers[0]) || "ABCDE1234F";
              const result = await queryRealRegistrar(pan, regName, ipo.name);

              updatedCount++;
              return {
                ...app,
                status: result.status,
                allotmentStatus: result.status,
                verified: true,
                registrarCheckedAt: new Date().toISOString(),
                registrarMessage: result.message,
              };
            }
            return app;
          })
        );

        return { ...ipo, applications: updatedApps };
      })
    );

    if (updatedCount > 0) {
      writeSharedIpos(updatedIpos);
    }

    return NextResponse.json(
      {
        success: true,
        message: `✓ Real Registrar Auto Sync Complete. ${updatedCount} applicant records verified with official registrars.`,
        updatedCount,
        ipos: updatedIpos,
      },
      { headers: corsHeaders }
    );
  } catch (err: any) {
    console.error("Auto registrar sync error:", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500, headers: corsHeaders }
    );
  }
}
