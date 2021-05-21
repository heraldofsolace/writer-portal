const { Pool } = require("pg");
const connectionString = process.env.PG_CONNECTION_STRING;
const pool = new Pool({ connectionString });
import * as dayjs from "dayjs";

export default async (req, res) => {
  const { assignmentId } = req.query;

  try {
    if (req.method === "GET") {
      // Get assignment by assignmentId
      const query = `select assignments.*
                           from assignments
                           where assignments.id like $1;`;
      const { rows } = await pool.query(query, [assignmentId]);

      // Respond with results
      res.statusCode = 200;
      res.json(rows[0]);
    } else if (req.method === "PUT") {
      // Update project complete status
      await base(tableName).update([
        {
          id: assignmentId,
          fields: { "Writer Confirmed": dayjs().toISOString() },
        },
      ]);

      // Respond with a 204
      res.statusCode = 204;
      res.end();
    }
  } catch (e) {
    // Handle any errors
    console.log(e);
    res.statusCode = 500;
    res.end("Server error. Something went wrong.");
  }
};