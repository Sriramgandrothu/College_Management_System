// login.jsx
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { FiLogIn, FiInfo, FiX, FiEye, FiEyeOff } from "react-icons/fi";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { baseApiURL } from "../baseUrl";
import ECE_LOGO from "../assests/ECE_LOGO.png";
import SRKR_LOGO from "../assests/Srkr logo.png";

// Modal Component
const InfoModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute bottom-20 right-6 bg-white p-6 rounded-lg shadow-lg w-[320px] z-50 border border-blue-400">
      <div className="flex justify-between items-center">
        <p className="font-bold text-xl text-blue-600">Project Team</p>
        <FiX className="text-gray-500 cursor-pointer w-6 h-6" onClick={onClose} />
      </div>
      {/* Modal content */}
      {/* ... */}
    </div>
  );
};

const Login = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState("Student");
  const { register, handleSubmit } = useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Show toast notification on component mount
  useEffect(() => {
    toast.success("Welcome to ECE Department Portal!");
  }, []);

  const onSubmit = async (data) => {
    if (data.loginid && data.password) {
      const headers = {
        "Content-Type": "application/json",
      };
      try {
        const response = await axios.post(
          `${baseApiURL()}/${selected.toLowerCase()}/auth/login`,
          data,
          { headers }
        );
        navigate(`/${selected.toLowerCase()}`, {
          state: { type: selected, loginid: response.data.loginid },
        });
      } catch (error) {
        console.error(error);
        toast.error(error.response?.data?.message || "Login failed");
      }
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
        <div className="flex flex-col items-center mb-10 mt-[-150px]">
          <div className="flex items-center space-x-2">
            <img src={SRKR_LOGO} alt="College Logo 1" className="w-16 h-16" />
            <p className="text-2xl font-bold text-blue-600">SRKR Engineering College</p>
            <img src={ECE_LOGO} alt="College Logo 2" className="w-14 h-14" />
          </div>
          <p className="text-sm text-gray-600 mt-0.4 text-center">Srkr Marg :: China-Amiram :: Bhimavaram</p>
        </div>
        <p className="text-3xl font-bold text-blue-600 mb-4 mt-[-4px]">Welcome to the ECE Department Portal ✨👋</p>

        <div className="flex justify-between mb-4 w-full">
          <p className="text-blue-500 font-semibold">Click Here ➤</p>
          <div className="flex justify-end">
            {["Student", "Faculty", "Admin"].map((role) => (
              <button
                key={role}
                className={`text-blue-500 mx-3 text-base font-semibold hover:text-blue-700 ease-linear duration-300 ${
                  selected === role && "border-b-2 border-green-500"
                }`}
                onClick={() => setSelected(role)}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        <p className="text-3xl font-semibold pb-2 border-b-2 border-green-500">{selected} Login</p>
        <form className="flex flex-col w-[70%] mt-5" onSubmit={handleSubmit(onSubmit)}>
          <label htmlFor="eno" className="mb-1">Login ID <span className="text-red-500">*</span></label>
          <input
            type="text"
            id="eno"
            required
            className="bg-white outline-none border-2 border-gray-400 py-2 px-4 rounded-md w-full focus:border-blue-500"
            placeholder="Enter your ID"
            {...register("loginid")}
          />
          <label htmlFor="password" className="mb-1 mt-3">Password <span className="text-red-500">*</span></label>
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
          <button type="submit" className="bg-blue-500 w-[70%] py-2 text-white font-bold text-lg rounded-md shadow-lg mt-6 hover:bg-blue-600 ease-linear duration-200">Login</button>
        </form>
        <Toaster />
      </div>
      <div className="absolute bottom-4 right-4 cursor-pointer" onClick={() => setIsModalOpen(!isModalOpen)}>
        <div className="bg-blue-500 p-2 rounded-lg flex items-center justify-center"><FiInfo className="w-5 h-5 text-white" /></div>
      </div>
      <InfoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default Login;
