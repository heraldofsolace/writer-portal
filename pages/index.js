import SecondaryNav from "../components/navs/secondary-nav";
import AuthedOnly from "../components/authed-only";
import MyAssignments from "../components/assignments/my-assignments";

export default function Home() {
    return (
        <AuthedOnly>
          <h1 style={{textAlign: 'center'}}>Writer Portal</h1>
          <div>
              <SecondaryNav currentPage='assignments' />
              <MyAssignments />
          </div>
      </AuthedOnly>
    );
}
