import { useEffect, useState } from "react";
import SecondaryNav from "../components/navs/secondary-nav";
import AuthedOnly from "../components/authed-only";
import { HiArrowCircleRight } from "react-icons/hi";
import Link from "next/link";
import Assignments from "../components/assignments/assignments";

export default function Home() {
  return (
    <AuthedOnly>
      <Assignments type="current" />
    </AuthedOnly>
  );
}
