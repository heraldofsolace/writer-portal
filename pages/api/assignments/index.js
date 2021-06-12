import {CotterAccessToken} from "cotter-token-js";
const { Pool } = require("pg");
const connectionString = process.env.PG_CONNECTION_STRING;
const pool = new Pool({ connectionString });

export default async (req, res) => {
  // Check that the authorization header exists
  if (!("authorization" in req.headers)) {
    res.statusCode = 401;
    return res.end("Authorization header missing");
  }

  // Extract the token string
  const auth = await req.headers.authorization;
  const bearer = auth.split(" ");
  const token = bearer[1];

  try {
    // Decode the Cotter JWT, "decoded.payload.identifier" is the user's email
    const decoded = new CotterAccessToken(token);

    if (req.method === "GET") {
      // Get assignments
      const query = `select assignments.title,
                            assignments.id,
                            assignments.client_name,
                            assignments.status,
                            assignments.pitch,
                            assignments.brief_url,
                            assignments.published_url,
                            assignments.writer_email,
                            assignments.writer_payout,
                            assignments.writer_due_date,
                            assignments.writer_paid_date,
                            assignments.writer
                     from assignments
                            join writers on writers.id = ANY (assignments.writer)
                     where writers.email like $1
                     and assignments.writer_due_date is not null
                     order by assignments.writer_due_date desc;`;
      const { rows } = await pool.query(query, [decoded.payload.identifier]);

      // Respond with results
      res.statusCode = 200;
      return res.json(rows);
    }
  } catch (e) {
    // Handle any errors
    console.log(e);
    res.statusCode = 500;
    return res.end("Server error. Something went wrong.");
  }
};
