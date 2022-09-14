import { useEffect, useState } from "react";
import * as dayjs from "dayjs";
import * as localizedFormat from "dayjs/plugin/localizedFormat";
import SecondaryNav from "../../components/navs/secondary-nav";
import AuthedOnly from "../../components/authed-only";
import AvailableAssignments from "../../components/assignments/available-assignments";

dayjs.extend(localizedFormat);

export default function Available() {
  return (
    <AuthedOnly>
      <div>
        <AvailableAssignments />
      </div>
    </AuthedOnly>
  );
}
