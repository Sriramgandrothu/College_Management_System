import axios from "axios";
import React, { useEffect, useState } from "react";
import { FiDownload } from "react-icons/fi";
import Heading from "../../components/Heading";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { baseApiURL } from "../../baseUrl";

const Timetable = () => {
  const [timetable, setTimetable] = useState("");
  const userData = useSelector((state) => state.userData);

  useEffect(() => {
    const getTimetable = () => {
      const headers = {
        "Content-Type": "application/json",
      };

      console.log("User Data:", userData); // Log user data
      console.log("Fetching timetable with:", {
        semester: userData.semester,
        branch: userData.branch,
      });

      axios
        .get(`${baseApiURL()}/timetable/getTimetable`, {
          params: {
            semester: userData.semester,
            branch: userData.branch,
          },
          headers: headers,
        })
        .then((response) => {
          console.log("API Response:", response.data); // Log the entire response

          if (response.data && Array.isArray(response.data)) {
            const timetableEntry = response.data.find(
              (entry) => entry.semester === userData.semester && entry.branch === userData.branch
            );

            if (timetableEntry) {
              setTimetable(timetableEntry.link);
            } else {
              toast.error("No timetable available for your branch and semester.");
            }
          } else {
            toast.error("Unexpected response format.");
          }
        })
        .catch((error) => {
          toast.dismiss();
          console.error("Error fetching timetable:", error.response ? error.response.data : error);
          toast.error("An error occurred while fetching the timetable.");
        });
    };

    if (userData && userData.branch && userData.semester) {
      getTimetable();
    }
  }, [userData]);

  const timetableURL = process.env.REACT_APP_MEDIA_LINK + "/" + timetable;

  return (
    <div className="w-full mx-auto mt-10 flex justify-center items-start flex-col mb-10">
      <div className="flex justify-between items-center w-full">
        <Heading title={`Timetable of Semester ${userData.semester}`} />
        {timetable && (
          <p
            className="flex justify-center items-center text-lg font-medium cursor-pointer hover:text-red-500 hover:scale-110 ease-linear transition-all duration-200"
            onClick={() => window.open(timetableURL)}
          >
            Download
            <span className="ml-2">
              <FiDownload />
            </span>
          </p>
        )}
      </div>
      
      {timetable ? (
        <img
          className="mt-8 rounded-lg shadow-md w-[70%] mx-auto"
          src={timetableURL}
          alt="timetable"
          onError={(e) => {
            e.target.onerror = null; // prevents looping
            e.target.src = "https://via.placeholder.com/150?text=Image+Not+Found"; // Fallback image
            toast.error("Failed to load timetable image.");
          }}
        />
      ) : (
        <p className="mt-10">No Timetable Available At The Moment!</p>
      )}
    </div>
  );
};

export default Timetable;
