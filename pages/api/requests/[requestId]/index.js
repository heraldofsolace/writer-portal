import { requireAuth, users } from "@clerk/nextjs/api";
import {
  deleteRequest,
  getSingleRequest,
} from "../../../../functions/requests";
import { withAxiom } from "next-axiom";
import { getCurrentWriter } from "../../../../functions/writers";

export default requireAuth(
  withAxiom(async (req, res) => {
    if (!["GET", "DELETE"].includes(req.method))
      return res.status(400).send("Method not allowed");
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
    const { requestId } = req.query;
    const result = await getSingleRequest(
      requestId,
      user.emailAddresses[0].emailAddress
    );

    if (!result.error) {
      if (result.data.length === 0) {
        req.log.error(
          `User ${user.emailAddresses[0].emailAddress} does not have any request with ID=${requestId}`,
          { user: user.emailAddresses[0].emailAddress }
        );
        return res.status(404).send("Not found");
      }
      if (req.method === "GET") return res.status(200).send(result.data);
      else if (req.method === "DELETE") {
        req.log.info("Deleting request", {
          user: user.emailAddresses[0].emailAddress,
        });
        const deleteResult = await deleteRequest(requestId);
        req.log.info(deleteResult, {
          user: user.emailAddresses[0].emailAddress,
        });
        if (!deleteResult.error) return res.status(200).send("Deleted request");
      }
    }
    req.log.error(result.error, { user: user.emailAddresses[0].emailAddress });
    return res.status(500).send(result.error);
  })
);
