import {useEffect, useState} from "react";
import * as dayjs from "dayjs";
import * as localizedFormat from "dayjs/plugin/localizedFormat";
import SecondaryNav from "../../components/navs/secondary-nav";
import AuthedOnly from "../../components/authed-only";
import AvailableAssignments from "../../components/assignments/available-assignments";

dayjs.extend(localizedFormat);

export default function Available() {
    const getAssignments = () => {
        const token = localStorage.getItem("ACCESS_TOKEN");
        fetch(`/api/assignments/available`, {
            headers: {Authorization: `Bearer ${token}`},
        })
            .then(resp => resp.json())
            .then(json => setAssignments(json))
            .catch(e => {
                console.error(e);
                setAssignments(false);
            });
    };

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
