import { requireAuth, users } from "@clerk/nextjs/api";
import { getSingleAssignment } from "../../../../functions/assignments";
import { withAxiom } from "next-axiom";
import { getCurrentWriter } from "../../../../functions/writers";

export default requireAuth(
  withAxiom(async (req, res) => {
    if (req.method !== "GET") return res.status(400).send("Method not allowed");
    const { userId } = req.auth;
    const user = await users.getUser(userId);
    const writer = await getCurrentWriter(user.emailAddresses[0].emailAddress);

    const { assignmentId } = req.query;
    const result = await getSingleAssignment(
      assignmentId,
      user.emailAddresses[0].emailAddress
    );

    if (!result.error) {
      if (!result.data) {
        req.log.error(
          `${user.emailAddresses[0].emailAddress} does not have an assignment with ID=${assignmentId}`,
          { user: user.emailAddresses[0].emailAddress }
        );
        return res.status(404).send("Not found");
      }
      if (writer?.data?.status === "Potential Dev Writer") {
        if (
          result.data.outreach_id &&
          !result.data.outreach_status &&
          result.data.expired === "No"
        ) {
          req.log.info(
            `User ${user.emailAddresses[0].emailAddress} has not onboarded yet but this is an outreach`,
            { user: user.emailAddresses[0].emailAddress }
          );
          return res.status(200).send(result.data);
        }
        req.log.error(
          `User ${user.emailAddresses[0].emailAddress} has not onboarded yet`,
          { user: user.emailAddresses[0].emailAddress }
        );
        return res.status(401).send("Not allowed");
      }
      return res.status(200).send(result.data);
    }
    req.log.error(result.error, { user: user.emailAddresses[0].emailAddress });
    return res.status(500).send(result.error);
  })
);
