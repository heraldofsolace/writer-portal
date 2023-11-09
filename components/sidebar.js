"use client";

import routes from "../routes";
import Link from "next/link";
import { IconContext } from "react-icons";
import React from "react";
import { useWriter } from "../data/use-writer";
import Image from "next/legacy/image";
import SignoutLink from "./navs/signout-link";
import { usePathname } from "next/navigation";

export default function Sidebar({ children }) {
  const pathname = usePathname();
  const { writer, isLoading, isError } = useWriter("me");
  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="overflow-y-hidden drawer-content flex flex-col">
        {children}
        <footer className="footer footer-center p-4 bg-primary text-white mt-auto">
          <div>
            For general inquiries or technical support, email{" "}
            <a className="text-white" href="mailto:portal@draft.dev">
              portal@draft.dev
            </a>
          </div>
        </footer>
      </div>
      {!pathname.match(/\/writers\/*/) ? (
        <div className="drawer-side">
          <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
          <ul className="menu p-4 overflow-y-auto bg-gray-50 min-h-full w-80 text-base-content">
            <div className="mb-4 flex flex-col items-center justify-center">
              <span className="font-bold">
                {isLoading ? (
                  <div
                    role="status"
                    className="space-y-2.5 animate-pulse max-w-lg"
                  >
                    <div className="flex items-center space-x-2 w-full mt-4">
                      <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-32"></div>
                      <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24"></div>
                    </div>
                  </div>
                ) : isError ? null : (
                  writer.full_name
                )}
              </span>
            </div>
            {routes.map((section) => {
              const hidden =
                writer?.status === "Potential Dev Writer" &&
                section.name === "Requests";
              return (
                <div
                  className={`p-1 ${hidden ? "hidden" : ""}`}
                  key={section.name}
                >
                  <span className="uppercase text-gray-500 mb-2">
                    {section.name}
                  </span>
                  {section.routes.map((route) => {
                    return (
                      <li key={route.path}>
                        <Link
                          href={route.path}
                          className={
                            pathname === route.path
                              ? "bg-primary text-body"
                              : ""
                          }
                        >
                          <IconContext.Provider
                            value={{
                              size: "1.5em",
                              className: "global-class-name",
                            }}
                          >
                            <span>{route.icon()}</span>
                          </IconContext.Provider>
                          {route.name}
                          {route.badge?.()}
                        </Link>
                      </li>
                    );
                  })}
                </div>
              );
            })}
            <li className="justify-self-end mt-10">
              <SignoutLink />
            </li>
          </ul>
        </div>
      ) : null}
    </div>
  );
}
