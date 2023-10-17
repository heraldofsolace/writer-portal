"use client";

import * as dayjs from "dayjs";
import * as localizedFormat from "dayjs/plugin/localizedFormat";
import AvailableAssignments from "../../../components/assignments/available-assignments";

dayjs.extend(localizedFormat);

export default async function AvailableAssignmentsPage() {
  return <AvailableAssignments />;
}
