const {Pool} = require('pg');
const connectionString = process.env.PG_CONNECTION_STRING;
const pool = new Pool({ connectionString });
import Airtable from "airtable";
const tableName = 'Assignments';
import * as dayjs from 'dayjs';

const base = new Airtable({
    apiKey: process.env.AIRTABLE_API_KEY,
    endpointUrl: "https://proxy.syncinc.so/api.airtable.com",
}).base(process.env.AIRTABLE_BASE);

export default async (req, res) => {
    const { assignmentId } = req.query;

    try {
        if (req.method === 'GET') {
            // Get assignment by assignmentId
            const query = `select assignments.*
                           from assignments
                           where assignments.id like $1;`;
            const {rows} = await pool.query(query, [assignmentId]);

            // Respond with results
            res.statusCode = 200;
            res.json(rows[0]);
        } else if (req.method === 'PUT') {
            // Update project complete status
            await base(tableName)
                .update([{"id": assignmentId, "fields": {"Writer Confirmed": dayjs().toISOString()}}]);

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
}
