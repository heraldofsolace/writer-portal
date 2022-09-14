import { useState, useEffect } from "react";
import * as dayjs from "dayjs";
import * as localizedFormat from "dayjs/plugin/localizedFormat";
import * as utc from "dayjs/plugin/utc";
import { truncate } from "lodash";
import AcceptAssignment from "../../components/assignments/accept-assignment";
import RequestAssignment from "../../components/assignments/request-assignment";
import { assignmentStatuses } from "../../constants/assignment-statuses";
import SubmitAssignment from "../../components/assignments/submit-assignment";
import AssignmentHeader from "../../components/assignments/assignment-header";
import { useWriter } from "../../data/use-writer";
import { useSingleAssignment } from "../../data/use-assignments";
import { Error } from "../error";
import dynamic from "next/dynamic";
const ReactMarkdown = dynamic(() => import("react-markdown"), { ssr: false });

dayjs.extend(localizedFormat);
dayjs.extend(utc);

export default function SingleAssignment({ assignmentId }) {
  const {
    writer,
    isLoading: writerIsLoading,
    isError: writerIsError,
  } = useWriter("me");
  const {
    assignment,
    isLoading: assignmentIsLoading,
    isError: assignmentIsError,
    mutate: mutateAssignment,
  } = useSingleAssignment(assignmentId);

  if (writerIsLoading || assignmentIsLoading) {
    return (
      <div>
        <div className="overflow-x-auto animate-pulse  p-2 mt-4">
          <h1 className="text-3xl">
            <div className="h-4 bg-gray-200 rounded-full dark:bg-gray-700 w-96 m-4"></div>
          </h1>
          <h3 className="uppercase bg-gray-100 text-gray-400 my-2 font-light">
            Client name
          </h3>
          <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 m-4"></div>
          <h3 className="uppercase bg-gray-100 text-gray-400 my-2 font-light">
            Pitch
          </h3>
          <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 m-4"></div>
          <h3 className="uppercase bg-gray-100 text-gray-400 my-2 font-light">
            Outline
          </h3>
          <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 m-4"></div>
          <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-24 m-4"></div>
          <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-64 m-4"></div>
          <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-8 m-4"></div>
          <h3 className="uppercase bg-gray-100 text-gray-400 my-2 font-light">
            Published URL
          </h3>
          <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-24 m-4"></div>
          <h3 className="uppercase bg-gray-100 text-gray-400 my-2 font-light">
            Due Date
          </h3>
          <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-8 m-4"></div>
          <h3 className="uppercase bg-gray-100 text-gray-400 my-2 font-light">
            Deliverables
          </h3>
          <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-16 m-4"></div>
          <h3 className="uppercase bg-gray-100 text-gray-400 my-2 font-light">
            Audience
          </h3>
          <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-16 m-4"></div>
          <h3 className="uppercase bg-gray-100 text-gray-400 my-2 font-light">
            Expected technical level
          </h3>
          <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-16 m-4"></div>
        </div>
      </div>
    );
  }

  if (writerIsError || assignmentIsError) {
    return <Error />;
  }
  const belongsToCurrentUser = () => {
    return (
      writer &&
      assignment.writer_email &&
      assignment.writer_email.length > 0 &&
      assignment.writer_email[0] &&
      assignment.writer_email[0] === writer.email
    );
  };

  const handleAccept = () => {
    mutateAssignment({ ...assignment, status: assignmentStatuses.writing });
  };

  const handleSubmit = () => {
    mutateAssignment({ ...assignment, status: assignmentStatuses.tech_review });
  };

  return (
    <div className="p-4">
      <AssignmentHeader assignment={assignment} />
      <div className="overflow-x-auto p-2 mt-4">
        <h1 className="text-3xl">{assignment.title}</h1>
        <h3 className="uppercase bg-gray-100 text-gray-400 my-4 font-light">
          Client Name
        </h3>
        <p>{assignment.client_name}</p>
        <h3 className="uppercase bg-gray-100 text-gray-400 my-4 font-light">
          Pitch
        </h3>
        <p>{assignment.pitch}</p>
        <h3 className="uppercase bg-gray-100 text-gray-400 my-4 font-light">
          Outline
        </h3>
        <div className="prose">
          <ReactMarkdown>{children}</ReactMarkdown>
        </div>
        {assignment.published_url ? (
          <>
            <h3 className="uppercase bg-gray-100 text-gray-400 my-4 font-light">
              Published URL
            </h3>
            <p>{assignment.published_url}</p>
          </>
        ) : null}
        {belongsToCurrentUser() ? (
          <>
            <h3 className="uppercase bg-gray-100 text-gray-400 my-4 font-light">
              Brief URL
            </h3>
            <p>{assignment.brief_url}</p>
            <h3 className="uppercase bg-gray-100 text-gray-400 my-4 font-light">
              Status
            </h3>
            <p>{assignment.status}</p>
            <h3 className="uppercase bg-gray-100 text-gray-400 my-4 font-light">
              Writer Assigned
            </h3>
            <p>{assignment.writer_email}</p>
            <h3 className="uppercase bg-gray-100 text-gray-400 my-4 font-light">
              Target keyword(s)
            </h3>
            <p>{assignment.target_keyword || "N/A"}</p>
            <h3 className="uppercase bg-gray-100 text-gray-400 my-4 font-light">
              What problem is {assignment.client_name} trying to solve? What
              sets them apart?
            </h3>
            <p>{assignment.what_sets_the_company_apart || "N/A"}</p>
            <h3 className="uppercase bg-gray-100 text-gray-400 my-4 font-light">
              Include a call to action?
            </h3>
            <p>{assignment.call_to_action || "No"}</p>
            <h3 className="uppercase bg-gray-100 text-gray-400 my-4 font-light">
              Tools that should be used
            </h3>
            <p>{assignment.tools_to_be_used || "N/A"}</p>
            <h3 className="uppercase bg-gray-100 text-gray-400 my-4 font-light">
              Tools that should not be used
            </h3>
            <p>{assignment.tools_to_be_excluded || "N/A"}</p>
            <h3 className="uppercase bg-gray-100 text-gray-400 my-4 font-light">
              Competitors of {assignment.client_name}
            </h3>
            <p>{assignment.competitors || "N/A"}</p>
            <h3 className="uppercase bg-gray-100 text-gray-400 my-4 font-light">
              How should the product(s) of {assignment.client_name} be
              mentioned?
            </h3>
            <p>{assignment.mention_of_product || "N/A"}</p>
            <h3 className="uppercase bg-gray-100 text-gray-400 my-4 font-light">
              Writer Assigned
            </h3>
            <p>{assignment.writer_email || "N/A"}</p>
          </>
        ) : null}
        <h3 className="uppercase bg-gray-100 text-gray-400 my-4 font-light">
          Due Date
        </h3>
        <p>{dayjs(assignment.writer_due_date).utc().format("LL")}</p>
        <h3 className="uppercase bg-gray-100 text-gray-400 my-4 font-light">
          Deliverables
        </h3>
        <p>{assignment.writer_deliverables.join(", ")}</p>
        <h3 className="uppercase bg-gray-100 text-gray-400 my-4 font-light">
          Audience
        </h3>
        <p>{assignment.audience}</p>
        <h3 className="uppercase bg-gray-100 text-gray-400 my-4 font-light">
          Expected technical level
        </h3>
        <p>{assignment.technical_level}</p>
        <RequestAssignment assignment={assignment} userData={writer} />
        {belongsToCurrentUser() ? (
          <div className="mt-8">
            <AcceptAssignment
              assignment={assignment}
              handleAccept={handleAccept}
            />
            <SubmitAssignment
              assignment={assignment}
              handleSubmit={handleSubmit}
            />
          </div>
        ) : null}
        <p className="my-4">
          Have a question about this assignment? Email{" "}
          <a href="mailto:editor@draft.dev">editor@draft.dev</a>
        </p>
      </div>
    </div>
  );
}
