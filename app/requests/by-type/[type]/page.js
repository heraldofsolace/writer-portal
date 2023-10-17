import RequestsPage from "./requests-page";

export default async function Page({ params }) {
  const { type } = params;
  return <RequestsPage type={type} />;
}
