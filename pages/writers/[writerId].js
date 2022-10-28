import React from "react";
import { useWriter } from "../../data/use-writer";
import Image from "next/image";
import { getWriter } from "../../functions/writers";
import { SWRConfig } from "swr";
import Link from "next/link";

export default function WriterPage({ fallback, writerId }) {
  return (
    <SWRConfig value={{ fallback }}>
      <Writer writerId={writerId} />
    </SWRConfig>
  );
}

function Writer({ writerId }) {
  const { writer } = useWriter(writerId);

  return (
    <>
      <header className="sticky h-20">
        <div className="logo">
          <Link href={"/"}>
            <a className="text-white text-xl font-bold">
              DRAFT.DEV
              <br />
            </a>
          </Link>
          <span className="site-name text-sm">Writer Profile</span>
        </div>
        <div className="nav-right">
          <Link href={"/"}>
            <a></a>
          </Link>
        </div>
      </header>
      {/*{console.log("LL", writer)}*/}
      <div className="flex justify-center mb-64 mt-10">
        <div className="max-w-4xl flex justify-center">
          <div className="card lg:card-side bg-base-100 shadow-xl">
            <div className="flex lg:block items-center justify-center">
              <figure className="h-[400px] w-[400px] rounded-full relative">
                <Image
                  src={writer.new_profile_photo}
                  alt={"Writer profile photo"}
                  layout="fill"
                />
              </figure>
            </div>

            <div className="card-body">
              <h2 className="card-title">
                {writer.first_name} {writer.last_name}
              </h2>
              <div>
                {writer.location ? (
                  <div
                    className="tooltip tooltip-left mr-4"
                    data-tip="Location"
                  >
                    <span>🌍 {writer.location}</span>
                  </div>
                ) : (
                  ""
                )}
                {writer.post_count > 5 ? (
                  <div
                    className="tooltip tooltip-left mr-4"
                    data-tip="This writer has written 5 or more articles for Draft.dev"
                  >
                    <span>📚 5+ Articles</span>
                  </div>
                ) : (
                  ""
                )}
              </div>
              <p>{writer.bio}</p>

              <div className="card-actions justify-end">
                <p>
                  {writer.website ? (
                    <span>
                      <a href={writer.website} target="_blank" rel="noreferrer">
                        Website
                      </a>{" "}
                    </span>
                  ) : (
                    ""
                  )}
                  {writer.twitter_link ? (
                    <span>
                      <a
                        href={writer.twitter_link}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Twitter
                      </a>{" "}
                    </span>
                  ) : (
                    ""
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  const { writerId } = context.params;
  const writer = await getWriter(writerId);
  console.log("WRITER ", writer);
  return {
    props: {
      fallback: {
        [`/api/writers/${writerId}`]: writer.data,
      },
      writerId,
    },
  };
}
