import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { UserDocument } from "@/src/models/User";
import { MemberDocument } from "@/src/models/Member";
import { normalizeEmail, hashPassword, validatePasswordStrength } from "@/src/lib/auth/password";
import { createSession, SESSION_COOKIE_NAME, ABSOLUTE_EXPIRATION_MS } from "@/src/lib/auth/session";

const DB_NAME = "nexo";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, username, email, password, confirmPassword, phone } = body;

    // 1. Strict Server-Side Field Validations
    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json({ success: false, error: "Full Name is required." }, { status: 400 });
    }

    if (!username || typeof username !== "string" || username.trim().length < 3) {
      return NextResponse.json({ success: false, error: "Username must be at least 3 characters long." }, { status: 400 });
    }

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ success: false, error: "Please enter a valid email address." }, { status: 400 });
    }

    if (password !== confirmPassword) {
      return NextResponse.json({ success: false, error: "Passwords do not match." }, { status: 400 });
    }

    const strengthCheck = validatePasswordStrength(password);
    if (!strengthCheck.isValid) {
      return NextResponse.json({ success: false, error: strengthCheck.feedback || "Password must be at least 12 characters long." }, { status: 400 });
    }

    const emailNorm = normalizeEmail(email);
    const cleanUsername = username.trim().toLowerCase().replace(/[^a-z0-9_]+/g, "");

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    // 2. Server-side Uniqueness Checks
    const existingUser = await db.collection<UserDocument>("users").findOne({ emailNormalized: emailNorm });
    if (existingUser) {
      return NextResponse.json({ success: false, error: "An account with this email address already exists." }, { status: 409 });
    }

    const existingMember = await db.collection<MemberDocument>("members").findOne({
      $or: [{ username: cleanUsername }, { email: emailNorm }],
    });
    if (existingMember) {
      return NextResponse.json({ success: false, error: "Username is already taken by another member." }, { status: 409 });
    }

    // 3. Create Member Record First
    const memberId = `mem_${Date.now()}`;
    const newMember: MemberDocument = {
      id: memberId,
      name: name.trim(),
      username: cleanUsername,
      password: password, // Retained for backwards compat in member object
      email: emailNorm,
      avatar: "/oggy.png",
      role: "MEMBER",
      panMasked: "ABCDE1234F",
      panFull: "ABCDE1234F",
      defaultContribution: 50000,
      joinedAt: "Just now",
      phone: phone || undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.collection<MemberDocument>("members").insertOne(newMember as any);

    // 4. Create User Record (with Server-side Salted Password Hash)
    const userId = `usr_${Date.now()}`;
    const passwordHash = hashPassword(password);

    const newUser: UserDocument = {
      id: userId,
      email: email.trim(),
      emailNormalized: emailNorm,
      passwordHash,
      memberId: memberId,
      role: "MEMBER",
      status: "ACTIVE",
      emailVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.collection<UserDocument>("users").insertOne(newUser as any);

    // 5. Establish Server Session
    const userAgent = req.headers.get("user-agent") || undefined;
    const ipAddress = req.headers.get("x-forwarded-for") || "127.0.0.1";
    const { sessionToken } = await createSession(newUser.id, userAgent, ipAddress);

    // 6. Return Secure Cookie Response
    const response = NextResponse.json({
      success: true,
      message: "Account registered successfully!",
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
      },
      member: {
        id: newMember.id,
        name: newMember.name,
        username: newMember.username,
        avatar: newMember.avatar,
      },
    });

    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: sessionToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: Math.floor(ABSOLUTE_EXPIRATION_MS / 1000),
    });

    return response;
  } catch (err: any) {
    console.error("POST /api/auth/register error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to register account." },
      { status: 500 }
    );
  }
}
