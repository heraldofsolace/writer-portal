import { getSingleOutreach } from "../../../../functions/outreaches";
import { requireAuth, users } from "@clerk/nextjs/api";
import Airtable from "airtable";

const { Pool } = require("pg");
const connectionString = process.env.PG_CONNECTION_STRING;
const pool = new Pool({ connectionString });
const tableName = "Outreaches";

const base = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY,
  endpointUrl: "https://proxy.sequin.io/api.airtable.com",
}).base(process.env.AIRTABLE_BASE);

const deleteOutreach = (outreachId) => {
  return base(tableName).destroy(outreachId);
};

export default requireAuth(async (req, res) => {
  if (req.method !== "GET") return res.status(400).send("Method not allowed");
  const { outreachId } = req.query;
  const { userId } = req.auth;
  const user = await users.getUser(userId);
  const result = await getSingleOutreach(
    outreachId,
    user.emailAddresses[0].emailAddress
  );

  if (!result.error) {
    if (!result.data) return res.status(404).send("Not found");
    return res.status(200).send(result.data);
  }
  return res.status(500).send("Server error");
});
