import React from "react";
import { Link } from "react-router-dom";

export default function WelcomePage() {
  return (
    <>
      <h4 className="text-second text-3xl text-left font-bold leading-9 font-poppins pt-36 pl-9 pr-9 desktop:text-6xl desktop:font-bold desktop:leading-none">
        Welcome to{" "}
        <span className="text-first text-3xl font-bold leading-9 font-poppins desktop:text-6xl desktop:font-bold desktop:leading-none">
          Daci!
        </span>
      </h4>
      <p className="text-second text-sm text-left font-normal leading-5 font-inter pl-9 pr-9 pt-6 max-w-lg">
        Discover our favorite online card game! Join us for strategic battles
        and endless fun. Are you up for the challenge?
      </p>
      <Link
        to="/Character"
        className="flex p-3 gap-3 justify-center items-center self-stretc  text-black text-base font-normal leading-7 font-inter rounded-full bg-third ml-9 mr-9 mt-12 desktop:px-3 desktop:py-3 desktop:justify-end desktop:items-center desktop:gap-3  desktop:w-44 desktop:rounded-3xl"
      >
        Let's Play!
        <img
          src="/arrow-right.png"
          alt="!"
          className=" p-[9px] bg-forth rounded-full "
        />
      </Link>
    </>
  );
}
