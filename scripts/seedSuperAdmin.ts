import fs from "fs";
import path from "path";
import { MongoClient } from "mongodb";
import crypto from "crypto";

// Helper to load env variables from .env.local manually
function loadEnv() {
  const envPath = path.resolve(process.cwd(), ".env.local");
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, "utf-8");
    content.split("\n").forEach((line) => {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        const key = match[1];
        let value = match[2] || "";
        if (value.startsWith('"') && value.endsWith('"')) {
          value = value.substring(1, value.length - 1);
        } else if (value.startsWith("'") && value.endsWith("'")) {
          value = value.substring(1, value.length - 1);
        }
        process.env[key] = value.trim();
      }
    });
  }
}

// Reuse hashing algorithm from codebase
const ITERATIONS = 100000;
const KEY_LEN = 64;
const DIGEST = "sha512";

function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, ITERATIONS, KEY_LEN, DIGEST).toString("hex");
  return `${salt}:${hash}`;
}

async function main() {
  loadEnv();

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("Error: MONGODB_URI is not defined in environment or .env.local");
    process.exit(1);
  }

  const email = process.env.SUPER_ADMIN_EMAIL;
  const username = process.env.SUPER_ADMIN_USERNAME;
  const password = process.env.SUPER_ADMIN_PASSWORD;
  const name = process.env.SUPER_ADMIN_NAME;

  if (!email || !username || !password || !name) {
    console.error("Error: Missing one of the required environment variables: SUPER_ADMIN_EMAIL, SUPER_ADMIN_USERNAME, SUPER_ADMIN_PASSWORD, SUPER_ADMIN_NAME");
    process.exit(1);
  }

  const cleanUsername = username.trim().toLowerCase().replace(/[^a-z0-9_]+/g, "");
  const emailNorm = email.trim().toLowerCase();

  console.log(`Connecting to MongoDB...`);
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db("nexo");

    // 1. Check if a SUPER_ADMIN already exists
    const existingSuperAdmin = await db.collection("users").findOne({ role: "SUPER_ADMIN" });
    if (existingSuperAdmin) {
      console.log("NEXO requires at least one active Super Admin. A Super Admin account already exists in the database. Seeding skipped to prevent duplicate Super Admins.");
      return;
    }

    // Check if user/member with same email or username exists
    const existingUser = await db.collection("users").findOne({ emailNormalized: emailNorm });
    if (existingUser) {
      console.error(`Error: A user with email '${email}' already exists. Cannot seed new Super Admin.`);
      process.exit(1);
    }

    const existingMember = await db.collection("members").findOne({ username: cleanUsername });
    if (existingMember) {
      console.error(`Error: A member with username '${cleanUsername}' already exists. Cannot seed new Super Admin.`);
      process.exit(1);
    }

    // 2. Create Member Record
    const memberId = `mem_${Date.now()}`;
    const memberDoc = {
      id: memberId,
      name: name.trim(),
      username: cleanUsername,
      password: "", // Never store plaintext password
      email: emailNorm,
      avatar: "/oggy.png",
      role: "SUPER_ADMIN",
      status: "ACTIVE",
      panMasked: "ABCDE1234F",
      panFull: "ABCDE1234F",
      defaultContribution: 100000,
      joinedAt: "Aug 2026",
      createdAt: new Date(),
      updatedAt: new Date(),
      permissions: {
        canSubmitApplications: true,
        canDistributeProfit: true,
        canEditIpos: true,
        canAccessAdminConsole: true,
        canManageMembers: true,
      }
    };

    // 3. Create User Record
    const userId = `usr_${Date.now()}`;
    const passwordHash = hashPassword(password);
    const userDoc = {
      id: userId,
      email: email.trim(),
      emailNormalized: emailNorm,
      passwordHash,
      memberId: memberId,
      role: "SUPER_ADMIN",
      status: "ACTIVE",
      emailVerified: true,
      mustChangePassword: false, // The script seeds with final password
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // 4. Create Profile Record
    const profileDoc = {
      userId: memberId,
      name: name.trim(),
      displayName: name.trim(),
      email: emailNorm,
      phone: "+91 98200 12345",
      avatar: "/oggy.png",
      bio: "NEXO SUPER_ADMIN Member",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Write to database
    await db.collection("members").insertOne(memberDoc);
    await db.collection("users").insertOne(userDoc);
    await db.collection("profiles").insertOne(profileDoc);

    console.log("Successfully seeded initial Super Admin account!");
    console.log(`Username: @${cleanUsername}`);
    console.log(`Email: ${email}`);
  } catch (err: any) {
    console.error("Failed to seed Super Admin:", err);
    process.exit(1);
  } finally {
    await client.close();
  }
}

main();
