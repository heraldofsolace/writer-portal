import * as dayjs from "dayjs";
import * as localizedFormat from "dayjs/plugin/localizedFormat";
import * as utc from "dayjs/plugin/utc";
import { Error } from "../error";
import { useRequests } from "../../data/use-requests";
import Link from "next/link";
import RequestStatus from "../badges/requests_status";

dayjs.extend(localizedFormat);
dayjs.extend(utc);

export default function Requests({ type }) {
  const { requests, isLoading, isError } = useRequests(type);
  if (isLoading) {
    return (
      <div className="overflow-x-auto w-full">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Assignment</th>
              <th>Status</th>
              <th>Due Date</th>
            </tr>
          </thead>
          <tbody>
            <tr role="status" className="max-w-sm animate-pulse p-5">
              <td>
                <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
              </td>
              <td>
                <div className="h-2.5 bg-gray-100 rounded-full dark:bg-gray-500 w-16 mb-4"></div>
              </td>
              <td>
                <div className="h-2.5 bg-gray-100 rounded-full dark:bg-gray-500 w-8 mb-4"></div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  if (isError) {
    return <Error />;
  }
  let serial = 1;
  return (
    <div className="overflow-x-auto">
      {requests.length === 0 ? (
        <section className="flex items-center h-full p-16">
          <div className="container flex flex-col items-center justify-center px-5 mx-auto my-8">
            <div className="max-w-md text-center">
              <span className="mb-8 font-extrabold text-3xl dark:text-gray-600">
                Nothing to see here
              </span>
              <p className="text-sm font-semibold m-5">
                <Link href={"/assignments/available"}>
                  Request new articles
                </Link>
              </p>
              <Link href={"/"}>
                <a
                  rel="noopener noreferrer"
                  className="px-8 py-3 font-semibold rounded dark:bg-primary text-white"
                >
                  Back to homepage
                </a>
              </Link>
            </div>
          </div>
        </section>
      ) : (
        <table className="table w-full">
          <thead>
            <tr>
              <th></th>
              <th>Assignment</th>
              <th>Status</th>
              <th>Due Date</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request.id + request.assignment_id}>
                <th className="text-xs">{serial++}</th>
                <td>
                  <div className="flex flex-col flex-wrap break-words">
                    <div className="font-bold text-sm">
                      <Link href={"/assignments/" + request.assignment_id}>
                        <a>{request.title}</a>
                      </Link>
                    </div>
                  </div>
                </td>
                <td>
                  <RequestStatus status={request.request_status} />
                </td>
                <td>
                  <span className="text-sm">
                    {dayjs(request.writer_due_date).format("LL")}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th></th>
              <th>Assignment</th>
              <th>Status</th>
              <th>Due Date</th>
            </tr>
          </tfoot>
        </table>
      )}
    </div>
  );
}
