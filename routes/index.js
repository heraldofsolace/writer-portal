import {
  BiPen,
  BiNotepad,
  BiMessageAltAdd,
  BiMessageAltCheck,
  BiMessageAltDetail,
} from "react-icons/bi";
import PendingRequestsCount from "../components/badges/pending_requests_count";
import PendingOutreachesCount from "../components/badges/pending_outreaches_count";
import CurrentAssignmentsCount from "../components/badges/current_assignments_count";
const routes = [
  {
    name: "Assignments",
    routes: [
      {
        path: "/",
        name: "Current Assignments",
        icon: BiPen,
        badge: CurrentAssignmentsCount,
      },
      {
        path: "/assignments/all",
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
        path: "/requests/pending",
        name: "Pending requests",
        icon: BiMessageAltAdd,
        badge: PendingRequestsCount,
      },
      {
        path: "/requests/past",
        name: "Past requests",
        icon: BiMessageAltCheck,
      },
      {
        path: "/requests",
        name: "All requests",
        icon: BiMessageAltDetail,
      },
    ],
  },
  {
    name: "Outreaches",
    routes: [
      {
        path: "/outreaches/pending",
        name: "Pending outreaches",
        icon: BiMessageAltAdd,
        badge: PendingOutreachesCount,
      },
      {
        path: "/outreaches/past",
        name: "Past outreaches",
        icon: BiMessageAltCheck,
      },
      {
        path: "/outreaches",
        name: "All outreaches",
        icon: BiMessageAltDetail,
      },
    ],
  },
];

export default routes;
