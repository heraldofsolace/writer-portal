const {Pool} = require("pg");
const connectionString = process.env.PG_CONNECTION_STRING;
const pool = new Pool({connectionString});
import { requireSession, users } from "@clerk/nextjs/api";

export default requireSession(async (req, res) => {
    try {
      // Get user from Clerk API
      const user = await users.getUser(req.session.userId);
      // Get user
      if (req.method === "GET") {
          // Get assignment by assignmentId
          const query = `select writers.id,
                                writers.email,
                                requests.writer_at_max_requests
                          from writers
                          left join requests on requests.id = ANY (writers.requests)
                          where writers.email like $1;`;
          const {rows} = await pool.query(query, [user.emailAddresses[0].emailAddress]);

          // Respond with results
          res.statusCode = 200;
          res.json(rows[0]);
      }
    } catch (e) {
        // Handle any errors
        console.log(e);
        res.statusCode = 500;
        res.end("Server error. Something went wrong.");
    }
});
