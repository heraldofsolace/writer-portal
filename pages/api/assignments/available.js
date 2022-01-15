const { Pool } = require("pg");
const connectionString = process.env.PG_CONNECTION_STRING;
const pool = new Pool({ connectionString });
import { requireSession, users } from "@clerk/nextjs/api";

export default requireSession(async (req, res) => {
  try {
    // Get user from Clerk API
    const user = await users.getUser(req.session.userId);

    if (req.method === "GET") {
      // Get assignments
      const query = `select assignments.title,
                            assignments.id,
                            assignments.client_name,
                            assignments.status,
                            assignments.pitch,
                            assignments.brief_url,
                            assignments.writer_due_date,
                            assignments.writer,
                            assignments.content_categories,
                            string_agg(content_categories.name, ', ') as content_category_names,
                            your_requests.request_date
                     from assignments
                            left join content_categories on content_categories.id = ANY (assignments.content_categories)
                            left join (
                                select * from requests
                                where $2 = ANY (writer_email)
                            ) as your_requests on your_requests.id = ANY (assignments.requests)
                     where assignments.status like $1
                     and assignments.writer_due_date < current_date + interval '30' day
                     and assignments.writer = '{}'
                     group by assignments.id, your_requests.request_date
                     order by assignments.writer_due_date asc;`;
      const { rows } = await pool.query(query, ['Assigning', user.emailAddresses[0].emailAddress]);

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
