import {
  BiMessageAltAdd,
  BiMessageAltCheck,
  BiMessageAltDetail,
  BiNotepad,
  BiPen,
} from "react-icons/bi";
import PendingRequestsCount from "../components/badges/pending_requests_count";
import PendingOutreachesCount from "../components/badges/pending_outreaches_count";
import CurrentAssignmentsCount from "../components/badges/current_assignments_count";

const routes = [
  {
    name: "Assignments",
    routes: [
      {
        path: "/assignments?type=current",
        name: "Current Assignments",
        icon: BiPen,
        badge: CurrentAssignmentsCount,
      },
      {
        path: "/assignments?type=all",
        name: "All Assignments",
        icon: BiNotepad,
      },
    ],
  },
  {
    name: "Requests",
    routes: [
      {
        path: "/assignments/available",
        name: "Request a New Assignment",
        icon: BiNotepad,
      },
      {
        path: "/requests?type=pending",
        name: "Pending requests",
        icon: BiMessageAltAdd,
        badge: PendingRequestsCount,
      },
      {
        path: "/requests?type=past",
        name: "Past requests",
        icon: BiMessageAltCheck,
      },
      {
        path: "/requests?type=all",
        name: "All requests",
        icon: BiMessageAltDetail,
      },
    ],
  },
  {
    name: "Outreaches",
    routes: [
      {
        path: "/outreaches?type=pending",
        name: "Pending outreaches",
        icon: BiMessageAltAdd,
        badge: PendingOutreachesCount,
      },
      {
        path: "/outreaches?type=past",
        name: "Past outreaches",
        icon: BiMessageAltCheck,
      },
      {
        path: "/outreaches?type=all",
        name: "All outreaches",
        icon: BiMessageAltDetail,
      },
    ],
  },
];

export default routes;
