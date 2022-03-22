import SecondaryNav from "../../components/navs/secondary-nav";
import AuthedOnly from "../../components/authed-only";
import AvailableAssignments from "../../components/assignments/available-assignments";

export default function Available() {
    return (
        <AuthedOnly>
          <h1 style={{textAlign: 'center'}}>Writer Portal</h1>
          <div>
              <SecondaryNav currentPage='available' />
              <AvailableAssignments />
          </div>
        </AuthedOnly>
    );
}
