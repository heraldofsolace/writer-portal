import { getSingleAssignment, submit } from "../../../../functions/assignments";
import { requireAuth, users } from "@clerk/nextjs/api";
import { getCurrentWriter } from "../../../../functions/writers";

const submitAssignment = requireAuth(async (req, res) => {
  const { assignmentId } = req.query;
  const { userId } = req.auth;

  const user = await users.getUser(userId);
  const assignment = await getSingleAssignment(assignmentId);
  const writer = await getCurrentWriter(user.emailAddresses[0].emailAddress);

  if (writer.error || assignment.error) {
    return res.status(500).send("Server error");
  }
  if (!writer.data || !assignment.data)
    return res.status(404).send("Not found");

  try {
    // Update writer submitted date
    await submit(assignmentId);

    res.status(200).send({ assignmentId });
  } catch (e) {
    // Handle any errors
    console.error(e);
    res.status(500).send("Server error");
  }
});

export default submitAssignment;
