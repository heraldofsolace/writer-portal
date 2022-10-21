import { getSingleAssignment, accept } from "../../../../functions/assignments";
import { requireAuth, users } from "@clerk/nextjs/api";
import { getCurrentWriter } from "../../../../functions/writers";
import { assignmentStatuses } from "../../../../constants/assignment-statuses";
import { withAxiom } from "next-axiom";

const acceptAssignment = requireAuth(
  withAxiom(async (req, res) => {
    const { assignmentId } = req.query;
    const { userId } = req.auth;

    const user = await users.getUser(userId);
    const assignment = await getSingleAssignment(assignmentId);
    const writer = await getCurrentWriter(user.emailAddresses[0].emailAddress);

    if (writer.error || assignment.error) {
      req.log.error("Error in writer or assignment", {
        user: user.emailAddresses[0].emailAddress,
        error: writer.error ? writer : assignment,
      });
      return res.status(500).send("Server error");
    }
    if (!writer.data || !assignment.data) {
      req.log.error("Writer or assignment not found", {
        user: user.emailAddresses[0].emailAddress,
      });
      return res.status(404).send("Not found");
    }

    if (assignment.data.writer[0] !== writer.data.id) {
      req.log.error("Writer doesn't have permission to accept assignment", {
        user: user.emailAddresses[0].emailAddress,
      });
      return res
        .status(403)
        .json({ error: "This assignment is not assigned to you" });
    }

    if (assignment.data.status !== assignmentStatuses.assigning) {
      req.log.error("Assignment not in assigning", {
        user: user.emailAddresses[0].emailAddress,
      });
      return res
        .status(403)
        .json({ error: "This article is not in the assigning stage" });
    }
    try {
      // Update writer submitted date
      await accept(assignmentId);
      req.log.info("Successfully accepted", {
        user: user.emailAddresses[0].emailAddress,
      });
      res.status(200).send({ assignmentId });
    } catch (e) {
      // Handle any errors
      req.log.error(e, { user: user.emailAddresses[0].emailAddress });
      res.status(500).send("Server error");
    }
  })
);
export default acceptAssignment;
