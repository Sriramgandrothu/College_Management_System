import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { setUserData } from "../../redux/actions";
import { baseApiURL } from "../../baseUrl";
import toast from "react-hot-toast";

const Profile = () => {
  const [showPass, setShowPass] = useState(false);
  const router = useLocation();
  const [data, setData] = useState();
  const dispatch = useDispatch();
  const [password, setPassword] = useState({
    new: "",
    current: "",
  });

  useEffect(() => {
    const headers = {
      "Content-Type": "application/json",
    };
    axios
      .post(
        `${baseApiURL()}/${router.state.type}/details/getDetails`,
        { employeeId: router.state.loginid },
        { headers }
      )
      .then((response) => {
        if (response.data.success) {
          const userData = response.data.user[0];
          setData(userData);
          dispatch(
            setUserData({
              fullname: `${userData.firstName} ${userData.middleName} ${userData.lastName}`,
              semester: userData.semester,
              enrollmentNo: userData.enrollmentNo,
              branch: userData.branch,
            })
          );

          // Determine the time of day and show a greeting toast
          const currentHour = new Date().getHours();
          let greeting = "Hello";
          let greeting2 = "Welcome to the Portal";
          let emoji = "👋";

          if (currentHour >= 5 && currentHour < 12) {
            greeting = "Good Morning";
            emoji = "☀️";
          } else if (currentHour >= 12 && currentHour < 17) {
            greeting = "Good Afternoon";
            emoji = "🌞";
          } else if (currentHour >= 17 && currentHour < 21) {
            greeting = "Good Evening";
            emoji = "🌇";
          } else {
            greeting = "Good Night";
            emoji = "🌙";
          }

          
          toast(`Hi 👋! ${greeting}, ${userData.lastName}! ${greeting2} ${emoji}`, {
            position: "bottom-right",
            icon: null,
            style: {
              padding: '12px',         
              fontSize: '16px',        
              backgroundColor: '#6c757d', 
              color: '#f8f9fa',        
              borderRadius: '8px',    
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', 
            },
          });
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        console.error("Error fetching details:", error);
      });
  }, [dispatch, router.state.loginid, router.state.type]);

  const checkPasswordHandler = (e) => {
    e.preventDefault();
    const headers = {
      "Content-Type": "application/json",
    };
    axios
      .post(
        `${baseApiURL()}/admin/auth/login`,
        { loginid: router.state.loginid, password: password.current },
        { headers }
      )
      .then((response) => {
        if (response.data.success) {
          changePasswordHandler(response.data.id);
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        const message = error.response?.data?.message || "An error occurred.";
        toast.error(message);
        console.error("Error checking password:", error);
      });
  };

  const changePasswordHandler = (id) => {
    const headers = {
      "Content-Type": "application/json",
    };
    axios
      .put(
        `${baseApiURL()}/admin/auth/update/${id}`,
        { loginid: router.state.loginid, password: password.new },
        { headers }
      )
      .then((response) => {
        if (response.data.success) {
          toast.success(response.data.message);
          setPassword({ new: "", current: "" });
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        const message = error.response?.data?.message || "An error occurred.";
        toast.error(message);
        console.error("Error changing password:", error);
      });
  };

  return (
    <div className="w-full mx-auto my-8 flex justify-between items-start">
      {data && (
        <>
          <div>
            <p className="text-2xl font-semibold">
              Hello {data.middleName} {data.lastName} {data.firstName} 👋
            </p>
            <div className="mt-3">
              <p className="text-lg font-normal mb-2">
                Employee Id: {data.employeeId}
              </p>
              <p className="text-lg font-normal mb-2">
                Phone Number: +91 {data.phoneNumber}
              </p>
              <p className="text-lg font-normal mb-2">
                Email Address: {data.email}
              </p>
              <p className="text-lg font-normal mb-2">
                Role: {router.state.type}
              </p>
            </div>
            <button
              className={`${
                showPass ? "bg-red-100 text-red-600" : "bg-blue-600 text-white"
              } px-3 py-1 rounded mt-4`}
              onClick={() => setShowPass(!showPass)}
            >
              {!showPass ? "Change Password" : "Close Change Password"}
            </button>
            {showPass && (
              <form
                className="mt-4 border-t-2 border-blue-500 flex flex-col justify-center items-start"
                onSubmit={checkPasswordHandler}
              >
                <input
                  type="password"
                  value={password.current}
                  onChange={(e) =>
                    setPassword({ ...password, current: e.target.value })
                  }
                  placeholder="Current Password"
                  className="px-3 py-1 border-2 border-blue-500 outline-none rounded mt-4"
                />
                <input
                  type="password"
                  value={password.new}
                  onChange={(e) =>
                    setPassword({ ...password, new: e.target.value })
                  }
                  placeholder="New Password"
                  className="px-3 py-1 border-2 border-blue-500 outline-none rounded mt-4"
                />
                <button
                  className="mt-4 hover:border-b-2 hover:border-blue-500"
                  type="submit"
                >
                  Change Password
                </button>
              </form>
            )}
          </div>
          <img
            src={`${process.env.REACT_APP_MEDIA_LINK}/${data.profile}`}
            alt="student profile"
            className="h-[200px] w-[200px] object-cover rounded-lg shadow-md"
          />
        </>
      )}
    </div>
  );
};

export default Profile;
