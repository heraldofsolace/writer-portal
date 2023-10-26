import { HiMenu } from "react-icons/hi";
import Link from "next/link";
import React from "react";

export function Header() {
  return (
    <header className="sticky h-20">
      <label
        htmlFor="my-drawer-2"
        className="drawer-button lg:hidden flex items-center mr-5"
      >
        <span className="align-middle">
          <HiMenu />
        </span>
      </label>
      <div className="logo">
        <Link href={"/"} className="text-white text-xl font-bold">
          DRAFT.DEV
        </Link>
        <br />
        <span className="site-name text-sm">Writer Portal</span>
      </div>
      <div className="nav-right">
        <Link href={"/"}></Link>
      </div>
    </header>
  );
}
