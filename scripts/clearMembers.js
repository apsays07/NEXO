const { MongoClient } = require("mongodb");

const uri = "mongodb+srv://ankit_database:iamaniket07@cluster0.bpd1pms.mongodb.net/nexo?appName=Cluster0";

async function clearMembers() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db("nexo");

    const membersResult = await db.collection("members").deleteMany({});
    console.log(`Deleted ${membersResult.deletedCount} members`);

    const usersResult = await db.collection("users").deleteMany({});
    console.log(`Deleted ${usersResult.deletedCount} users`);

    const sessionsResult = await db.collection("sessions").deleteMany({});
    console.log(`Deleted ${sessionsResult.deletedCount} sessions`);

    console.log("All member profiles cleared successfully.");
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await client.close();
  }
}

clearMembers();
