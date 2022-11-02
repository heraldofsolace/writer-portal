import { requireAuth, users } from "@clerk/nextjs/api";
import { getAssignments } from "../../../functions/assignments";
import { withAxiom } from "next-axiom";

export default requireAuth(
  withAxiom(async (req, res) => {
    const { type } = req.query;

    if (req.method !== "GET") return res.status(400).send("Method not allowed");
    const { userId } = req.auth;
    const user = await users.getUser(userId);
    const result = await getAssignments(
      type,
      user.emailAddresses[0].emailAddress
    );

    if (!result.error) {
      if (!result.data || result.data.length === 0) {
        req.log.error(
          `User ${user.emailAddresses[0].emailAddress} does not have any assignments of type ${type}`,
          { user: user.emailAddresses[0].emailAddress }
        );
      }
      return res.status(200).send(result.data);
    }
    req.log.error(result.error, { user: user.emailAddresses[0].emailAddress });
    return res.status(500).send(result.error);
  })
);
