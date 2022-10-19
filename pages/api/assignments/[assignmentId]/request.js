import { requireAuth, users } from "@clerk/nextjs/api";
import { createRequest } from "../../../../functions/requests";
import { getSingleAssignment } from "../../../../functions/assignments";
import { assignmentStatuses } from "../../../../constants/assignment-statuses";
import { getCurrentWriter } from "../../../../functions/writers";

export default requireAuth(async (req, res) => {
  if (req.method !== "POST") return res.status(400).send("Method not allowed");
  const { assignmentId } = req.query;
  const { userId } = req.auth;
  const user = await users.getUser(userId);
  const assignmentData = await getSingleAssignment(assignmentId);
  const writerData = await getCurrentWriter(
    user.emailAddresses[0].emailAddress
  );

  if (assignmentData.error || writerData.error) {
    return res.status(500).send("Server error");
  }

  if (!assignmentData.data || !writerData.data) {
    return res.status(404).send("Not found");
  }

  if (assignmentData.data.status !== assignmentStatuses.assigning) {
    return res.status(403).send("Forbidden");
  }

  const result = await createRequest(assignmentId, writerData.data.id);

  if (!result.error) {
    return res.status(200).send({ requestId: result.data[0].id });
  }
  return res.status(500).send("Server error");
});
