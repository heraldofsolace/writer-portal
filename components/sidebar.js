import routes from "../routes";
import Link from "next/link";
import { IconContext } from "react-icons";
import React from "react";
import { useRouter } from "next/router";
import { useWriter } from "../data/use-writer";
import Image from "next/image";
import SignoutLink from "./navs/signout-link";

export default function Sidebar({ children }) {
  const router = useRouter();
  const { writer, isLoading, isError } = useWriter("me");

  return (
    <div className="drawer drawer-mobile">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="overflow-y-hidden drawer-content flex flex-col">
        {children}
        <footer className="mt-3 footer footer-center p-4 bg-primary text-white">
          <div>
            For general inquiries or technical support, email{" "}
            <a className="text-white" href="mailto:portal@draft.dev">
              portal@draft.dev
            </a>
          </div>
        </footer>
      </div>
      {!router.pathname.match(/\/writers\/*/) ? (
        <div className="drawer-side">
          <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
          <ul className="menu p-4 overflow-y-auto w-80 bg-base-100 text-base-content bg-gray-100">
            <div className="mb-4 flex flex-col items-center justify-center">
              {isLoading ? (
                <div
                  role="status"
                  className="space-y-8 animate-pulse md:space-y-0 md:space-x-8 md:flex md:items-center"
                >
                  <div className="flex justify-center items-center w-24 h-24 bg-gray-300 rounded-full">
                    <svg
                      className="w-12 h-12 text-gray-200"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                      fill="currentColor"
                      viewBox="0 0 640 512"
                    >
                      <path d="M480 80C480 35.82 515.8 0 560 0C604.2 0 640 35.82 640 80C640 124.2 604.2 160 560 160C515.8 160 480 124.2 480 80zM0 456.1C0 445.6 2.964 435.3 8.551 426.4L225.3 81.01C231.9 70.42 243.5 64 256 64C268.5 64 280.1 70.42 286.8 81.01L412.7 281.7L460.9 202.7C464.1 196.1 472.2 192 480 192C487.8 192 495 196.1 499.1 202.7L631.1 419.1C636.9 428.6 640 439.7 640 450.9C640 484.6 612.6 512 578.9 512H55.91C25.03 512 .0006 486.1 .0006 456.1L0 456.1z" />
                    </svg>
                  </div>
                </div>
              ) : isError ? null : (
                <div className="avatar mb-4">
                  <div className="w-24 h-24 rounded-full">
                    <Image
                      src={writer.profile_photo[0]}
                      alt={"Writer profile photo"}
                      width="120px"
                      height="120px"
                    />
                  </div>
                </div>
              )}

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
              return (
                <div className="p-1" key={section.name}>
                  <span className="uppercase text-gray-500 mb-2">
                    {section.name}
                  </span>
                  {section.routes.map((route) => {
                    return (
                      <li key={route.path}>
                        <Link href={route.path}>
                          <a
                            className={
                              router.asPath === route.path
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
                          </a>
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
