import { MongoClient } from "mongodb";

const MONGODB_URI = "mongodb+srv://ankit_database:iamaniket07@cluster0.bpd1pms.mongodb.net/nexo?appName=Cluster0";

async function run() {
  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    const db = client.db("nexo");

    console.log("Connected to MongoDB...");

    // 1. Remove any stale member/user with username 'admin'
    const deletedMembers = await db.collection("members").deleteMany({ username: "admin" });
    const deletedUsers = await db.collection("users").deleteMany({ username: "admin" });
    console.log(`Deleted stale 'admin' members: ${deletedMembers.deletedCount}, users: ${deletedUsers.deletedCount}`);

    // 2. Fix ankitgod's email in users, members, profiles so it is not 'admin@nexo.private'
    const updateUsers = await db.collection("users").updateMany(
      { $or: [{ emailNormalized: "admin@nexo.private" }, { email: "admin@nexo.private" }] },
      { $set: { email: "ankitgod@nexo.private", emailNormalized: "ankitgod@nexo.private" } }
    );

    const updateMembers = await db.collection("members").updateMany(
      { $or: [{ email: "admin@nexo.private" }, { username: "ankitgod" }] },
      { $set: { email: "ankitgod@nexo.private" } }
    );

    const updateProfiles = await db.collection("profiles").updateMany(
      { email: "admin@nexo.private" },
      { $set: { email: "ankitgod@nexo.private" } }
    );

    console.log(`Updated ankitgod email in users: ${updateUsers.modifiedCount}, members: ${updateMembers.modifiedCount}, profiles: ${updateProfiles.modifiedCount}`);

    console.log("Database cleanup completed successfully.");
  } catch (err) {
    console.error("Error executing script:", err);
  } finally {
    await client.close();
  }
}

run();
