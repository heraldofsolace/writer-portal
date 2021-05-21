import Airtable from "airtable";
import { assignmentStatuses } from "../../../../constants/assignment-statuses";
const tableName = "Assignments";

const base = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY,
  endpointUrl: "https://proxy.syncinc.so/api.airtable.com",
}).base(process.env.AIRTABLE_BASE);

export default async (req, res) => {
  const { assignmentId } = req.query;

  try {
    // Update writer confirmed date
    const today = new Date().toISOString();
    await base(tableName).update([
      {
        id: assignmentId,
        fields: {
          "Writer Confirmed": today,
          Status: assignmentStatuses.writing,
        },
      },
    ]);

    res.statusCode = 204;
    res.end();
  } catch (e) {
    // Handle any errors
    console.log(e);
    res.statusCode = 500;
    res.end("Server error. Something went wrong.");
  }
};
