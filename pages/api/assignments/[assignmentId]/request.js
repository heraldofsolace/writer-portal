import { requireAuth, users } from "@clerk/nextjs/api";
import { createRequest } from "../../../../functions/requests";
import { getSingleAssignment } from "../../../../functions/assignments";
import { assignmentStatuses } from "../../../../constants/assignment-statuses";
import { getCurrentWriter } from "../../../../functions/writers";
import { withAxiom } from "next-axiom";

export default requireAuth(
  withAxiom(async (req, res) => {
    if (req.method !== "POST")
      return res.status(400).send("Method not allowed");
    const { assignmentId } = req.query;
    const { userId } = req.auth;
    const user = await users.getUser(userId);
    const assignmentData = await getSingleAssignment(assignmentId);
    const writerData = await getCurrentWriter(
      user.emailAddresses[0].emailAddress
    );

    if (assignmentData.error || writerData.error) {
      req.log.error("Error in writer or assignment", {
        user: user.emailAddresses[0].emailAddress,
        error: writerData.error ? writerData : assignmentData,
      });
      return res.status(500).send("Server error");
    }

    if (!assignmentData.data || !writerData.data) {
      req.log.error("Writer or assignment not found", {
        user: user.emailAddresses[0].emailAddress,
      });
      return res.status(404).send("Not found");
    }

    if (writerData.data.status === "Potential Dev Writer") {
      req.log.error(
        `User ${user.emailAddresses[0].emailAddress} has not onboarded yet`,
        { user: user.emailAddresses[0].emailAddress }
      );
      return res.status(401).send("Not allowed");
    }

    if (assignmentData.data.status !== assignmentStatuses.assigning) {
      req.log.error("Assignment not in assigning", {
        user: user.emailAddresses[0].emailAddress,
      });
      return res.status(403).send("Forbidden");
    }

    const result = await createRequest(assignmentId, writerData.data.id);

    if (!result.error) {
      req.log.info("Successfully requested", {
        user: user.emailAddresses[0].emailAddress,
      });
      return res.status(200).send({ requestId: result.data[0].id });
    }
    req.log.error(result.error, { user: user.emailAddresses[0].emailAddress });
    return res.status(500).send("Server error");
  })
);
