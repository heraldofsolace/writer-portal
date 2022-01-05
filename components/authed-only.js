import {useEffect, useState} from "react";
import { SignedIn, SignedOut, SignIn, useUser } from '@clerk/nextjs';
import SignoutLink from "./navs/signout-link";
import SigninForm from "./navs/signin-form";
import LogUser from "./log-user";

export default function AuthedOnly({children}) {
  return (
    <main>
      <SignedIn>
        <LogUser />
        {children}
        <p><SignoutLink /></p>
      </SignedIn>
      <SignedOut>
        <SigninForm />
      </SignedOut>
    </main>
  );
}
