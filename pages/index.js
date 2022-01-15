import {useEffect, useState} from "react";
import SecondaryNav from "../components/navs/secondary-nav";
import AuthedOnly from "../components/authed-only";
import { SignedIn, SignedOut, SignIn } from '@clerk/nextjs';
import SignoutLink from "../components/navs/signout-link";
import SigninForm from "../components/navs/signin-form";
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
