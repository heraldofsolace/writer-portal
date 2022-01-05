import {useEffect, useState} from "react";
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/nextjs';

export default function AuthedOnly({children}) {
    // Display the login page
    return (
        <main>
            <SignedIn>
              {children}
            </SignedIn>
            <SignedOut>
              <RedirectToSignIn />
                <div style={{textAlign: 'center'}}>
                    <h1>Writer Portal</h1>
                    <p>This portal is exclusively for <a href="https://draft.dev/">Draft.dev</a> writers.</p>
                    <p>Log in using the same email you used to apply.</p>
                </div>
            </SignedOut>
        </main>
    );
}
