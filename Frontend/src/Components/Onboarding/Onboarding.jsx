import React from "react";
import { Link } from "react-router-dom";

const Onboarding = () => {
  return (
    <div className="relative h-screen w-full bg-black text-white flex flex-col justify-between">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="/assets/name_img.png"
          alt="coffee"
          className="h-full w-full object-cover opacity-90"
        />
      </div>

      {/* Gradient overlay */}
      <div className="absolute ins.t-0 bg-linear-to-t from-black via-transparent to-transparent"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-end h-full p-6 text-center">
        <h1 className="text-3xl font-bold mb-3">
          Fall in Love with Coffee in Blissful Delight!
        </h1>
        <p className="text-gray-300 text-sm mb-6">
          Welcome to our cozy coffee corner, where every cup is a delightful for
          you.
        </p>
        <Link to={"/login"} className="bg-[#b87346] hover:bg-[#a1623f] text-white py-3 rounded-xl font-semibold transition">
          <button className="">
            Get Started
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Onboarding;
