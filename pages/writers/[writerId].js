import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useWriter } from "../../data/use-writer";
import { Error } from "../../components/error";
import Image from "next/image";

export default function Writer() {
  const router = useRouter();
  const { writerId } = router.query;
  const { writer, isError, isLoading } = useWriter(writerId);

  if (isLoading) return "";
  if (isError) return <Error />;
  return (
    <div className="flex justify-center mb-64 mt-10">
      <div className="max-w-4xl flex justify-center">
        <div className="card lg:card-side bg-base-100 shadow-xl">
          <figure className="max-w-2/3 lg:w-[400px]">
            <Image src={writer.profile_photo} alt={"Writer profile photo"} />
          </figure>
          <div className="card-body">
            <h2 className="card-title">
              {writer.first_name} {writer.last_name}
            </h2>
            <div>
              {writer.location ? (
                <div className="tooltip tooltip-left mr-4" data-tip="Location">
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
  );
}
