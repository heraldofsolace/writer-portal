import { useClerk } from "@clerk/nextjs";
import { IconContext } from "react-icons";
import React from "react";
import { BiLogOut } from "react-icons/bi";

export default function SignoutLink() {
  const { signOut } = useClerk();
  return (
    <a href="#" onClick={() => signOut()}>
      <IconContext.Provider
        value={{
          size: "1.5em",
          className: "global-class-name",
        }}
      >
        <span>
          <BiLogOut />
        </span>
      </IconContext.Provider>
      Sign Out
    </a>
  );
}
