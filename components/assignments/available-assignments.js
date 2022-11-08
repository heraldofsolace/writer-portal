import * as dayjs from "dayjs";
import * as localizedFormat from "dayjs/plugin/localizedFormat";
import { useAvailableAssignments } from "../../data/use-assignments";
import { Error } from "../error";
import * as utc from "dayjs/plugin/utc";
import { useWriter } from "../../data/use-writer";

dayjs.extend(localizedFormat);
dayjs.extend(utc);

export default function AvailableAssignments() {
  const { assignments, isLoading, isError } = useAvailableAssignments();
  const {
    writer,
    isLoading: writerIsLoading,
    isError: writerIsError,
  } = useWriter("me");

  if (isLoading || writerIsLoading) {
    return (
      <div className="overflow-x-auto w-full">
        <table className="table w-full">
          <thead>
            <tr>
              <th></th>
              <th>Title</th>
              <th>Due Date</th>
              <th>Content Categories</th>
            </tr>
          </thead>
          <tbody>
            <tr role="status" className="max-w-sm animate-pulse p-5">
              <td></td>
              <td>
                <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
              </td>
              <td>
                <div className="h-2.5 bg-gray-100 rounded-full dark:bg-gray-500 w-8 mb-4"></div>
              </td>
              <td>
                <div className="h-2.5 bg-gray-100 rounded-full dark:bg-gray-500 w-16 mb-4"></div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
  if (isError || writerIsError) {
    return <Error />;
  }

  if (writer.status === "Potential Dev Writer") {
    return (
      <Error
        code={403}
        message="You can request articles only after completing the onboarding process"
      />
    );
  }

  let serial = 1;
  return (
    <div className="overflow-x-auto">
      <table className="table w-full">
        <thead>
          <tr>
            <th></th>
            <th>Title</th>
            <th>Due Date</th>
            <th>Content Categories</th>
          </tr>
        </thead>
        <tbody>
          {assignments.map((assignment) => (
            <tr key={assignment.id}>
              <th>{serial++}</th>
              <td>
                <div className="flex flex-col">
                  <div className="font-bold">
                    <a href={"/assignments/" + assignment.id}>
                      {assignment.title}
                    </a>
                  </div>
                  <div className="text-sm opacity-50">
                    For {assignment.client_name}
                  </div>
                  {assignment.request_date ? (
                    <div
                      className="tooltip text-left"
                      data-tip={
                        "Requested on " +
                        dayjs(assignment.request_date).format("LL")
                      }
                    >
                      <span
                        className={`badge badge-sm badge-request-${assignment.request_status}`}
                      >
                        Request {assignment.request_status}
                      </span>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </td>
              <td>{dayjs(assignment.writer_due_date).format("LL")}</td>
              <td>{assignment.content_category_names}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <th></th>
            <th>Title</th>
            <th>Due Date</th>
            <th>Content Categories</th>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
