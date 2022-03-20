import {useRouter} from "next/router";
import SingleAssignment from "../../components/assignments/single-assignment";
import AuthedOnly from "../../components/authed-only";

export default function Assignment() {
    const router = useRouter();
    const {assignmentId} = router.query;

    return (
        <AuthedOnly>
          <SingleAssignment assignmentId={assignmentId} />
        </AuthedOnly>
    );
}
