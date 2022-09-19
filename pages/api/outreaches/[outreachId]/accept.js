import { accept, getSingleOutreach } from "../../../../functions/outreaches";
import { requireAuth, users } from "@clerk/nextjs/api";

export default requireAuth(async (req, res) => {
  if (req.method !== "POST") return res.status(400).send("Method not allowed");
  const { outreachId } = req.query;
  const { userId } = req.auth;
  const user = await users.getUser(userId);
  const result = await getSingleOutreach(
    outreachId,
    user.emailAddresses[0].emailAddress
  );

  if (!result.error) {
    if (!result.data) return res.status(404).send("Not found");
    const _ = await accept(
      outreachId,
      result.data.assignment_id,
      result.data.writer_id,
      result.data.writer_rate
    );
    return res.status(200).send({ outreachId: _.id });
  }
  return res.status(500).send("Server error");
});
