import { requireAuth, users } from "@clerk/nextjs/api";
import { getRequests } from "../../../functions/requests";
import { withAxiom } from "next-axiom";
import { getCurrentWriter } from "../../../functions/writers";

export default requireAuth(
  withAxiom(async (req, res) => {
    const { type } = req.query;
    if (!["all", "past", "pending"].includes(type)) {
      return res
        .status(400)
        .send("'type' must be one of 'all', 'pending', 'past'");
    }

    if (req.method !== "GET") return res.status(400).send("Method not allowed");
    const { userId } = req.auth;
    const user = await users.getUser(userId);
    const writer = await getCurrentWriter(user.emailAddresses[0].emailAddress);
    if (writer?.data?.status === "Potential Dev Writer") {
      req.log.error(
        `User ${user.emailAddresses[0].emailAddress} has not onboarded yet`,
        { user: user.emailAddresses[0].emailAddress }
      );
      return res.status(401).send("Not allowed");
    }
    const result = await getRequests(type, user.emailAddresses[0].emailAddress);

    if (!result.error) {
      if (!result.data || result.data.length === 0) {
        req.log.error(
          `User ${user.emailAddresses[0].emailAddress} does not have any request of type ${type}`,
          { user: user.emailAddresses[0].emailAddress }
        );
      }
      return res.status(200).send(result.data);
    }
    req.log.error(result.error, { user: user.emailAddresses[0].emailAddress });
    return res.status(500).send("Server error");
  })
);
