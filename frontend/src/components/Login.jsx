import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { FiLogIn, FiInfo, FiX, FiEye, FiEyeOff } from "react-icons/fi"; // Imported eye icons for show/hide password
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { baseApiURL } from "../baseUrl";
import ECE_LOGO from "../assests/ECE_LOGO.png"
import SRKR_LOGO from "../assests/Srkr logo.png"

// Modal Component
const InfoModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute bottom-20 right-6 bg-white p-6 rounded-lg shadow-lg w-[320px] z-50 border border-blue-400">
      <div className="flex justify-between items-center">
        <p className="font-bold text-xl text-blue-600">Project Team</p>
        <FiX className="text-gray-500 cursor-pointer w-6 h-6" onClick={onClose} />
      </div>
      <div className="mt-4">
        <p className="font-bold text-lg text-gray-700 underline">Under the Guidance of</p>
        <p className="text-base text-gray-600">
          Dr.B.Sanjay <sub><i>M.Tech, PhD</i></sub>
        </p>
      </div>
      <div className="mt-6">
        <p className="font-bold text-lg text-gray-700 underline">Project Associates</p>
        <ul className="mt-2 space-y-2">
          <li className="text-base text-gray-600">A.Satish <sub><i>21B91A0409</i></sub></li>
          <li className="text-base text-gray-600">G.S.S.S.Sriram <sub><i>21B91A0454</i></sub></li>
          <li className="text-base text-gray-600">G.Jayanth <sub><i>21B91A0474</i></sub></li>
          <li className="text-base text-gray-600">D.Damodhar <sub><i>21B91A0449</i></sub></li>
        </ul>
      </div>
      <div className="mt-4">
        <p className="text-base text-gray-600 font-bold text-center">" 2021-2025 ECE Batch "</p>
      </div>
    </div>
  );
};

const Login = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState("Student");
  const { register, handleSubmit } = useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State for showing/hiding password

  // Show toast notification on component mount
  useEffect(() => {
    toast(
      <div className="flex items-center space-x-2">
        <span className="text-xl animate-pulse move-animation flip-animation">📢</span>
        <div className="toast-content">
          <p className="text-lg font-bold text-pink-500">Welcome to ECE Department Portal!</p>
          <p className="text-sm text-gray-700">Please login with your credentials 🔑</p>
        </div>
      </div>,
      {
        position: "top-left",
        icon: null,
        style: {
          background: "#FFF7F7",
          color: "#000",
          padding: "12px",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          fontFamily: "'Poppins', sans-serif",
          transition: "transform 0.6s ease-in-out",
          animation: "fadeSlideIn 0.6s ease-out",
        },
        duration: 3000,
      }
    );
  }, []);

  const onSubmit = (data) => {
    if (data.loginid !== "" && data.password !== "") {
      const headers = {
        "Content-Type": "application/json",
      };
      axios
        .post(`${baseApiURL()}/${selected.toLowerCase()}/auth/login`, data, { headers })
        .then((response) => {
          navigate(`/${selected.toLowerCase()}`, {
            state: { type: selected, loginid: response.data.loginid },
          });
        })
        .catch((error) => {
          toast.dismiss();
          console.error(error);
          toast.error(error.response?.data?.message || "Login failed");
        });

    }
  };

  return (
    <div className="bg-white h-[100vh] w-full flex justify-between items-center relative">
      <img
        className="w-[60%] h-[100vh] object-cover"
        src="https://images.unsplash.com/photo-1535982330050-f1c2fb79ff78?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt="Laptop and notebook"
      />
      <div className="w-[40%] flex justify-center items-start flex-col pl-8 mt-0">
        {/* College Logos and Information */}
        <div className="lex flex-col items-center mb-10 mt-[-150px]">
          <div className="flex items-center space-x-2">
            <img
              src={SRKR_LOGO}
              alt="College Logo 1"
              className="w-16 h-16" // Adjust size as needed
            />
            <p className="text-2xl font-bold text-blue-600">SRKR Engineering College</p>
            <img
              src={ECE_LOGO}
              alt="College Logo 2"
              className="w-14 h-14" // Adjust size as needed
            />
          </div>
          <p className="text-sm text-gray-600 mt-0.4 text-center">Srkr Marg :: China-Amiram :: Bhimavaram</p>
        </div>
        <p className="text-3xl font-bold text-blue-600 mb-4 mt-[-4px]">Welcome to the <br />ECE Department Portal ✨👋</p>
        {/* Buttons for selecting User Type */}
        <div className="flex justify-between mb-4 w-full">
            <div className="flex justify-start">
              <p className="text-blue-500 font-semibold">Click Here ➤</p>
            </div>
            <div className="flex justify-end">
              <button
                className={`text-blue-500 mx-3 text-base font-semibold hover:text-blue-700 ease-linear duration-300 ${
                  selected === "Student" && "border-b-2 border-green-500"
                }`}
                onClick={() => setSelected("Student")}
              >
                Student
              </button>
              <button
                className={`text-blue-500 mx-3 text-base font-semibold hover:text-blue-700 ease-linear duration-300 ${
                  selected === "Faculty" && "border-b-2 border-green-500"
                }`}
                onClick={() => setSelected("Faculty")}
              >
                Faculty
              </button>
              <button
                className={`text-blue-500 mx-3 text-base font-semibold hover:text-blue-700 ease-linear duration-300 ${
                  selected === "Admin" && "border-b-2 border-green-500"
                }`}
                onClick={() => setSelected("Admin")}
              >
                Admin
              </button>
            </div>
        </div>


        <p className="text-3xl font-semibold pb-2 border-b-2 border-green-500">
          {selected && selected} Login
        </p>
        <form
          className="flex justify-center items-start flex-col w-full mt-5"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="flex flex-col w-[70%]">
            <label className="mb-1" htmlFor="eno">
              {selected && selected} Login ID <span className="text-red-500">*</span> {/* Required field indicator */}
            </label>
            <input
              type="text"
              id="eno"
              required
              className="bg-white outline-none border-2 border-gray-400 py-2 px-4 rounded-md w-full focus:border-blue-500"
              placeholder="Enter your ID"
              {...register("loginid")}
            />
          </div>
          <div className="flex flex-col w-[70%] mt-3">
            <label className="mb-1" htmlFor="password">
              Password <span className="text-red-500">*</span> {/* Required field indicator */}
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                required
                className="bg-white outline-none border-2 border-gray-400 py-2 px-4 rounded-md w-full focus:border-blue-500"
                placeholder="••••••••••"
                {...register("password")}
              />
              <button
                type="button"
                className="absolute right-2 top-2 text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FiEyeOff className="w-6 h-6" /> : <FiEye className="w-6 h-6" />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="bg-blue-500 w-[70%] py-2 text-white font-bold text-lg rounded-md shadow-lg mt-6 hover:bg-blue-600 ease-linear duration-200"
          >
            Login
          </button>
        </form>
        {/* <div className="w-full mt-3 flex justify-between">
          <button
            className="text-blue-400 flex items-center"
            onClick={() => navigate("/forgot-password")}
          >
            Forgot password?
          </button>
          <button
            className="text-blue-400 flex items-center"
            onClick={() => setIsModalOpen(true)}
          >
            <FiInfo className="mr-1" /> About Project Team
          </button>
        </div> */}
        <Toaster />
      </div>
      <div className="absolute bottom-4 right-4 cursor-pointer">
        <div
          className="bg-blue-500 p-2 rounded-lg flex items-center justify-center"
          onClick={() => setIsModalOpen(!isModalOpen)}
        >
          <FiInfo className="w-5 h-5 text-white" /> {/* Reduced size */}
        </div>
      </div>

      <InfoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default Login;
