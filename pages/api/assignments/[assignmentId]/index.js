import {CotterAccessToken} from "cotter-token-js";
const {Pool} = require("pg");
const connectionString = process.env.PG_CONNECTION_STRING;
const pool = new Pool({connectionString});

export default async (req, res) => {
    const {assignmentId} = req.query;

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
            // Get assignment by assignmentId
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
                                  assignments.writer_deliverables,
                                  assignments.writer,
                                  your_requests.request_date
                           from assignments
                           left join (
                               select * from requests
                               where $2 = ANY (writer_email)
                           ) as your_requests on your_requests.id = ANY (assignments.requests)
                           where assignments.id like $1;`;
            const {rows} = await pool.query(query, [assignmentId, decoded.payload.identifier]);

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
