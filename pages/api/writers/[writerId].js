import { getWriter } from "../../../functions/writers";

const fetchWriter = async (req, res) => {
  if (req.method !== "GET") {
    return res.status(405).send("Method not allowed");
  }

  const { writerId } = req.query;
  const result = await getWriter(writerId);

  if (!result.error) {
    if (!result.data) return res.status(404).send("Not found");
    return res.status(200).send(result.data);
  }
  return res.status(500).send("Server error");
};
export default fetchWriter;
