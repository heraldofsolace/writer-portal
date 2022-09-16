import { assignmentStatuses } from "../../constants/assignment-statuses";
import { useState, useEffect } from "react";
import * as dayjs from "dayjs";
import * as localizedFormat from "dayjs/plugin/localizedFormat";
import * as utc from "dayjs/plugin/utc";
import { useAssignments } from "../../data/use-assignments";
import { Error } from "../error";
dayjs.extend(localizedFormat);
dayjs.extend(utc);

export default function Assignments({ type }) {
  const { assignments, isLoading, isError } = useAssignments(type);

  if (isLoading) {
    return (
      <div className="overflow-x-auto w-full">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Due Date</th>
              <th>Payment</th>
            </tr>
          </thead>
          <tbody>
            <tr role="status" className="max-w-sm animate-pulse p-5">
              <td>
                <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
              </td>
              <td>
                <div className="h-2.5 bg-gray-100 rounded-full dark:bg-gray-500 w-8 mb-4"></div>
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
    <div className="overflow-x-auto p-2">
      {assignments.find((assignment) => {
        return assignment.status === assignmentStatuses.assigning;
      }) ? (
        <div className="alert alert-warning shadow-lg text-white my-4">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current flex-shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            You have one or more assignments that have not been confirmed yet.
            Please click on the article to accept the assignments.
          </div>
        </div>
      ) : (
        ""
      )}
      <table className="table w-full">
        <thead>
          <tr>
            <th></th>
            <th>Title</th>
            <th>Status</th>
            <th>Due Date</th>
            <th>Payment</th>
          </tr>
        </thead>
        <tbody>
          {assignments.map((assignment) => (
            <tr key={assignment.id}>
              <th className="text-xs">{serial++}</th>
              <td>
                <div className="flex flex-col flex-wrap break-words">
                  <div className="font-bold text-sm">
                    <a href={"/assignments/" + assignment.id}>
                      {assignment.title}
                    </a>
                  </div>
                  <div className="text-xs opacity-50">
                    For {assignment.client_name}
                  </div>
                </div>
              </td>
              <td>
                {assignment.published_url ? (
                  <a
                    className="link badge badge-success badge-lg text-sm text-white"
                    href={assignment.published_url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Published
                  </a>
                ) : (
                  <span
                    className={`badge ${
                      assignment.status === assignmentStatuses.assigning
                        ? "badge-info"
                        : "badge-primary"
                    } badge-lg text-sm`}
                  >
                    {assignment.status}
                  </span>
                )}
              </td>
              <td>
                <span className="text-sm">
                  {dayjs(assignment.writer_due_date).format("LL")}
                </span>
              </td>
              <td>
                <div className="text-sm">
                  ${assignment.writer_payout}{" "}
                  {assignment.writer_paid_date ? (
                    <div
                      className="tooltip tooltip-left"
                      data-tip={
                        "Payment initiated on " +
                        dayjs(assignment.writer_paid_date).format("LL")
                      }
                    >
                      <span className="badge badge-ghost badge-lg text-sm ml-3">
                        Paid
                      </span>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <th></th>
            <th>Title</th>
            <th>Status</th>
            <th>Due Date</th>
            <th>Payment</th>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
