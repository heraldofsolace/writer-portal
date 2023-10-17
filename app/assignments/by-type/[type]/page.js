import Home from "./home-page";

export default async function Page({ params }) {
  const { type } = params;
  return <Home type={type} />;
}
