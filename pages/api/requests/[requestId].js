import Airtable from "airtable";
const tableName = "Requests";

const base = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY,
  endpointUrl: "https://proxy.syncinc.so/api.airtable.com",
}).base(process.env.AIRTABLE_BASE);

const deleteRequest = (requestId) => {
  return base(tableName).destroy(requestId);
}

export default async (req, res) => {
  const { requestId } = req.query;
  if (req.method === 'DELETE') {
    try {
      await deleteRequest(requestId);

      res.statusCode = 204;
      res.end();
    } catch (e) {
      // Handle any errors
      console.log(e);
      res.statusCode = 500;
      res.end("Server error. Something went wrong.");
    }
  } else {
    res.statusCode = 405;
    res.end("This method is not currently supported.");
  }
};
