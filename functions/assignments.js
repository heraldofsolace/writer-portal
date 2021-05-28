import Airtable from "airtable";
import { assignmentStatuses } from "../constants/assignment-statuses";
const tableName = "Assignments";

const base = new Airtable({
    apiKey: process.env.AIRTABLE_API_KEY,
    endpointUrl: "https://proxy.syncinc.so/api.airtable.com",
}).base(process.env.AIRTABLE_BASE);

export const accept = (assignmentId) => {
    const today = new Date().toISOString();
    return base(tableName).update([
        {
            id: assignmentId,
            fields: {
                "Writer Confirmed": today,
                Status: assignmentStatuses.writing,
            },
        },
    ]);
}

export const submit = (assignmentId) => {
    const today = new Date().toISOString();
    return base(tableName).update([
        {
            id: assignmentId,
            fields: {
                "Writer Submitted": today,
                Status: assignmentStatuses.ready_for_editing,
            },
        },
    ]);
}
