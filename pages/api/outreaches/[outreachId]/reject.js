import { getSingleOutreach, reject } from "../../../../functions/outreaches";
import { requireAuth, users } from "@clerk/nextjs/api";

export default requireAuth(async (req, res) => {
  if (req.method !== "POST") return res.status(400).send("Method not allowed");
  const { outreachId } = req.query;
  const { reasonForRejection } = JSON.parse(req.body);
  const { userId } = req.auth;
  const user = await users.getUser(userId);
  const result = await getSingleOutreach(
    outreachId,
    user.emailAddresses[0].emailAddress
  );

  if (!result.error) {
    if (!result.data) return res.status(404).send("Not found");
    const _ = await reject(outreachId, reasonForRejection);
    return res.status(200).send(_.id);
  }
  return res.status(500).send("Server error");
});
