import React, { useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Particle from "./Particle";
import Logo from "../assets/Logo.png";

function Auth({ setIsAuthenticated }) {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const inputEl = useRef(null);
  const passEl = useRef(null);
  const [isName, setIsName] = useState(true);
  const [isPassword, setIsPassword] = useState(true);
  const [nameError, setNameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();

  const authorize = async () => {
    try {
      const res = await axios.post(
        "http://localhost:8080/identity/global/auth/token",
        new URLSearchParams({
          username: 'apartment',
          password: 'apartment',
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
  
      if (res.status === 200) {
        localStorage.setItem("token", res.data.token);
        setIsAuthenticated(true);  
        navigate("/apartments");  
        toast.success("Successfully authorized");
        console.log("Successfully");
      } else {
        toast.error("Error: Login information failed");
        console.log("failed");
      }
    } catch (error) {
      toast.error(`Error: ${error.response ? error.response.data : error.message}`);
      console.log("failed 2");
    }
  };
  

  const validateForm = () => {
    let isValid = true;

    if (userId.length < 3) {
      setIsName(false);
      setNameError("Username phải có ít nhất 3 ký tự");
      isValid = false;
    } else {
      setIsName(true);
      setNameError("");
    }

    if (password.length < 6) {
      setIsPassword(false);
      setPasswordError("Password phải có ít nhất 6 ký tự");
      isValid = false;
    } else {
      setIsPassword(true);
      setPasswordError("");
    }

    return isValid;
  };

  const submitHandler = (e) => {
    e.preventDefault();
    setUserId(inputEl.current.value);
    setPassword(passEl.current.value);

    if (validateForm()) {
      authorize();
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="relative flex justify-center items-center min-h-screen bg-gray-100">
      <Particle />
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg border border-blue-500 z-10">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-blue-600 mt-6">AMS</h1>
          <img src={Logo} alt="AMS Icon" className="w-16 h-16 mx-auto mt-4" />
          <h2 className="text-3xl font-bold mt-6">Login</h2>
        </div>
        <form onSubmit={submitHandler} className="mt-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Username <span className="text-red-500">*</span>
            </label>
            <input
              ref={inputEl}
              type="text"
              value={userId}
              onChange={() => setUserId(inputEl.current.value)}
              placeholder="Enter username"
              className={`w-full px-4 py-2 mt-1 border ${
                isName ? "border-gray-300" : "border-red-500"
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300`}
              required
            />
            {!isName && <p className="text-red-500 text-sm mt-1">{nameError}</p>}
          </div>
          <div className="mb-4 relative">
            <label className="block text-sm font-medium text-gray-700">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              ref={passEl}
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={() => setPassword(passEl.current.value)}
              placeholder="Enter password"
              className={`w-full px-4 py-2 mt-1 border ${
                isPassword ? "border-gray-300" : "border-red-500"
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300`}
              required
            />
            <span
              className="absolute right-3 top-8 cursor-pointer"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? "🙈" : "👁"}
            </span>
            {!isPassword && (
              <p className="text-red-500 text-sm mt-1">{passwordError}</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full py-2 text-white bg-blue-500 hover:bg-blue-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            LOGIN
          </button>
        </form>
      </div>
    </div>
  );
}

export default Auth;
