import OutreachesPage from "./outreaches-page";

export default async function Page({ params }) {
  const { type } = params;
  return <OutreachesPage type={type} />;
}
