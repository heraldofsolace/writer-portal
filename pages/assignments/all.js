import { useEffect, useState } from "react";
import * as dayjs from "dayjs";
import * as localizedFormat from "dayjs/plugin/localizedFormat";
import SecondaryNav from "../../components/navs/secondary-nav";
import AuthedOnly from "../../components/authed-only";
import AvailableAssignments from "../../components/assignments/available-assignments";
import Assignments from "../../components/assignments/assignments";

dayjs.extend(localizedFormat);

export default function AllAssignments() {
  return (
    <AuthedOnly>
      <div>
        <Assignments type="all" />
      </div>
    </AuthedOnly>
  );
}
