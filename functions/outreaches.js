import Airtable from "airtable";

const tableName = "Outreach";
const { Pool } = require("pg");
const connectionString = process.env.PG_CONNECTION_STRING;
const pool = new Pool({ connectionString });

const base = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY,
  endpointUrl: "https://proxy.syncinc.so/api.airtable.com",
}).base(process.env.AIRTABLE_BASE);

const updateOutreach = async (outreachId, status) => {
  return base(tableName).update([
    {
      id: outreachId,
      fields: {
        Status: status,
      },
    },
  ]);
};
export const accept = (outreachId) => updateOutreach(outreachId, "Accepted");

export const reject = (outreachId) => updateOutreach(outreachId, "Rejected");

export const getOutreaches = async (type, email) => {
  if (!["all", "past", "pending"].includes(type)) {
    return {
      data: null,
      error: "'type' can be one of 'all', 'past', or 'pending'",
    };
  }

  const outreach_status_query = {
    all: "1=1",
    past: "outreach.status in ('Accepted', 'Rejected') or outreach.expired = 'Yes'",
    pending: "outreach.status is null and outreach.expired != 'Yes'",
  };
  try {
    const query = `select outreach.id,
                        outreach.status,
                        outreach.reached_out_on,
                        outreach.expired,
                        assignments.writer_due_date,
                        assignments.title,
                        assignments.id as assignment_id,
                        writers.email
                     from outreach
                            join writers on writers.id = ANY (outreach.writer)
                            join assignments on assignments.id = ANY(outreach.assignment)
                     where writers.email like $1 and (${outreach_status_query[type]})
                     and assignments.writer_due_date is not null
                     group by assignments.title, assignments.id, outreach.id, assignments.writer_due_date, writers.email
                     order by assignments.writer_due_date desc;`;
    const { rows } = await pool.query(query, [email]);

    return { data: rows, error: null };
  } catch (e) {
    // Handle any errors
    console.error(e);
    return { data: null, error: e };
  }
};

export const getSingleOutreach = async (outreachId, email) => {
  try {
    const query = `select outreach.id,
                        outreach.status,
                        outreach.reached_out_on,
                        outreach.expired,
                        assignments.writer_due_date,
                        assignments.title,
                        assignments.id as assignment_id,
                        writers.email
                     from outreach
                            join writers on writers.id = ANY (outreach.writer)
                            join assignments on assignments.id = ANY(outreach.assignment)
                     where outreach.id = $1 and writers.email like $2
                     and assignments.writer_due_date is not null
                     group by assignments.title, assignments.id, outreach.id, assignments.writer_due_date, writers.email
                     order by assignments.writer_due_date desc;`;
    const { rows } = await pool.query(query, [outreachId, email]);

    return { data: rows[0], error: null };
  } catch (e) {
    // Handle any errors
    console.error(e);
    return { data: null, error: e };
  }
};
