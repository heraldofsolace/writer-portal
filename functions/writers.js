import { requireSession, users } from "@clerk/nextjs/api";
import { assignmentStatuses } from "../constants/assignment-statuses";

const { Pool } = require("pg");
const connectionString = process.env.PG_CONNECTION_STRING;
const pool = new Pool({ connectionString });

const getWriter = async (writerId) => {
  try {
    const query = `select writers.first_name,
                                  writers.last_name,
                                  writers.location,
                                  writers.website,
                                  writers.bio,
                                  writers.profile_photo,
                                  writers.post_count,
                                  writers.twitter_link,
                                  writers.requests
                           from writers
                           where writers.id like $1;`;
    const { rows } = await pool.query(query, [writerId]);
    return { data: rows[0], error: null };
  } catch (e) {
    console.error(e);
    return { data: null, error: e };
  }
};

const getCurrentWriter = async (email) => {
  try {
    // The Writers table already has the current_assignments_count, pending_requests_count and pending_outreaches_count
    // fields. But they're lookup fields, so when we update an assignment, request or outreach through the Sequin proxy,
    // there's a slight delay (about 5 seconds now) in syncing the writer record. So the user would see the count change
    // momentarily, then go back to the previous value, and then jump back again. So we calculate these values with SQL
    // to make sure we always fetch the current value
    const query = `select writers.id,
                                writers.email,
                                writers.profile_photo,
                                writers.full_name,
                                writers.requests_count,                                
                                writers.past_requests_count,
                                writers.outreaches_count,                                
                                writers.past_outreaches_count,
                                requests.writer_at_max_requests,
                                (select count(*) from assignments where assignments.id = ANY(writers.pitches)
                                and assignments.status in ($2, $3)) as current_assignments_count,
                                (select count(*) from requests where requests.id = ANY(writers.requests)
                                and requests.request_status = 'Pending') as pending_requests_count,
                                (select count(*) from outreach where outreach.id = ANY(writers.outreach)
                                and outreach.status is null and outreach.expired = 'No') as pending_outreaches_count
                          from writers
                          left join requests on requests.id = ANY (writers.requests)
                          where writers.email like $1
                          ;`;
    const { rows } = await pool.query(query, [
      email,
      assignmentStatuses.writing,
      assignmentStatuses.assigning,
    ]);

    return { data: rows[0], error: null };
  } catch (e) {
    console.error(e);
    return { data: null, error: e };
  }
};

module.exports = { getWriter, getCurrentWriter };
