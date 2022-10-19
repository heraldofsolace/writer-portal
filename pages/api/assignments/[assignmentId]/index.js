import { requireAuth, users } from "@clerk/nextjs/api";
import { getSingleAssignment } from "../../../../functions/assignments";

export default requireAuth(async (req, res) => {
  if (req.method !== "GET") return res.status(400).send("Method not allowed");
  const { userId } = req.auth;
  const user = await users.getUser(userId);
  const { assignmentId } = req.query;
  const result = await getSingleAssignment(
    assignmentId,
    user.emailAddresses[0].emailAddress
  );

  if (!result.error) {
    if (!result.data) return res.status(404).send("Not found");
    return res.status(200).send(result.data);
  }
  return res.status(500).send(result.error);
});
