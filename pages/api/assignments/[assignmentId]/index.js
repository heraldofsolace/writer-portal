const {Pool} = require("pg");
const connectionString = process.env.PG_CONNECTION_STRING;
const pool = new Pool({connectionString});

export default async (req, res) => {
    const {assignmentId} = req.query;

    try {
        if (req.method === "GET") {
            // Get assignment by assignmentId
            const query = `select assignments.title,
                                  assignments.id,
                                  assignments.status,
                                  assignments.pitch,
                                  assignments.brief_url,
                                  assignments.writer_email,
                                  assignments.writer_payout,
                                  assignments.writer_due_date
                           from assignments
                           where assignments.id like $1;`;
            const {rows} = await pool.query(query, [assignmentId]);

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
};
