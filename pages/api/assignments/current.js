const { Pool } = require("pg");
const connectionString = process.env.PG_CONNECTION_STRING;
const pool = new Pool({ connectionString });
import { requireSession, users } from "@clerk/nextjs/api";

export default requireSession(async (req, res) => {
  try {
    if (req.method === "GET") {
      // Get user from Clerk API
      const user = await users.getUser(req.session.userId);
      // Get assignments for user
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
                     and assignments.status = 'Writing'
                     order by assignments.writer_due_date desc;`;
      const { rows } = await pool.query(query, [
        user.emailAddresses[0].emailAddress,
      ]);

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
});
