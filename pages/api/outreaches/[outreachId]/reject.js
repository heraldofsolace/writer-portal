import { getSingleOutreach, reject } from "../../../../functions/outreaches";
import { requireAuth, users } from "@clerk/nextjs/api";
import { withAxiom } from "next-axiom";

export default requireAuth(
  withAxiom(async (req, res) => {
    if (req.method !== "POST")
      return res.status(400).send("Method not allowed");
    const { outreachId } = req.query;
    const { reasonForRejection } = JSON.parse(req.body);
    const { userId } = req.auth;
    const user = await users.getUser(userId);
    const result = await getSingleOutreach(
      outreachId,
      user.emailAddresses[0].emailAddress
    );

    if (!result.error) {
      if (!result.data) {
        req.log.error(
          `User ${user.emailAddresses[0].emailAddress} does not have any outreach with ID ${outreachId}`,
          { user: user.emailAddresses[0].emailAddress }
        );
        return res.status(404).send("Not found");
      }
      const _ = await reject(outreachId, reasonForRejection);
      return res.status(200).send(_.id);
    }
    req.log.error(result.error, { user: user.emailAddresses[0].emailAddress });
    return res.status(500).send("Server error");
  })
);
