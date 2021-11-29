import Airtable from "airtable";
const tableName = "Requests";
const { Pool } = require("pg");
const connectionString = process.env.PG_CONNECTION_STRING;
const pool = new Pool({ connectionString });

const base = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY,
  endpointUrl: "https://proxy.syncinc.so/api.airtable.com",
}).base(process.env.AIRTABLE_BASE);

const getWriterIdFromEmail = async (email) => {
  const query = `select writers.id, writers.email
                     from writers
                     where writers.email like $1
                     and writers.status like 'Accepted';`;
  const { rows } = await pool.query(query, [email]);
  return rows[0].id;
}

const createRequest = (assignmentId, writerId) => {
  return base(tableName).create([
    {
      "fields": {
        "Assignment": [assignmentId],
        "Writer": [writerId]
      }
    },
  ]);
}

export default async (req, res) => {
  const { assignmentId } = req.query;
  const { email } = JSON.parse(req.body);

  try {
    const writerId = await getWriterIdFromEmail(email);
    await createRequest(assignmentId, writerId);

    res.statusCode = 204;
    res.end();
  } catch (e) {
    // Handle any errors
    console.log(e);
    res.statusCode = 500;
    res.end("Server error. Something went wrong.");
  }
};
