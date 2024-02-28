import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";
import axios from "axios";

export default function JoinRoom({ images }) {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const roomId = queryParams.get("roomId");

  const nextImage = () => {
    const newIndex =
      currentImageIndex === images.length - 1 ? 0 : userData.imageIndex + 1;
    setCurrentImageIndex(newIndex);
    setUserData((prevUserData) => ({
      ...prevUserData,
      imageIndex: newIndex,
    }));
  };

  const [userData, setUserData] = useState({
    username: "",
    imageIndex: 0,
  });

  const handleInputChange = (event) => {
    setUserData({
      ...userData,
      [event.target.name]: event.target.value,
    });
  };
  const addToRoom = async () => {
    try {
      await axios.post("http://localhost:2000/api/addToRoom", {
        roomId,
        userData,
      });
      navigate("/WaitingRoom", { state: { roomId: roomId } });
    } catch (error) {
      console.error("Error adding player:", error);
    }
  };

  return (
    <div>
      <h4 className="text-second text-center text-3xl font-bold leading-9 font-poppins ml-9 mr-9 mt-16 mb-6">
        Welcome!
      </h4>
      <p className="text-second text-center text-sm font-normal leading-5 font-inter ml-9 mr-9 pl-2 pr-2">
        Pick a character and choose a username.
      </p>

      <img
        className=" h-auto w-[40%] ml-auto mr-auto justify-center rounded-full pt-4 pb-4"
        src={images[currentImageIndex]}
        alt="imagine caracter"
        onClick={nextImage}
      />
      <div className=" ml-9 mr-9">
        <input
          name="username"
          type="text"
          id="Username"
          className=" w-[100%] flex p-2 p-3 items-center gap-2 gap-3  rounded-md border border-gray-200 bg-white shadow-xs"
          placeholder="Enter your username"
          required
          onChange={handleInputChange}
        />
        <Link
          //   to={{
          //     pathname: "/WaitingRoom",
          //   }}
          //   state={{ roomId: roomId }}
          onClick={addToRoom}
          className="flex p-3 justify-center items-center   text-black text-base font-normal leading-7 font-inter rounded-full bg-third w-[100%] mt-12 "
        >
          Join Room!
          <img
            src="/arrow-right.png"
            alt="!"
            className=" p-[9px] bg-forth rounded-full ml-3"
          />
        </Link>
      </div>
    </div>
  );
}
