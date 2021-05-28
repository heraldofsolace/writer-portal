const {Pool} = require("pg");
const connectionString = process.env.PG_CONNECTION_STRING;
const pool = new Pool({connectionString});
import * as dayjs from "dayjs";

export default async (req, res) => {
    const {writerId} = req.query;

    try {
        if (req.method === "GET") {

            const query = `select first_name,
                                  last_name,
                                  location,
                                  website,
                                  bio,
                                  profile_photo,
                                  created_at,
                                  post_count,
                                  twitter_link
                           from writers
                           where writers.id like $1;`;
            const {rows} = await pool.query(query, [writerId]);

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
