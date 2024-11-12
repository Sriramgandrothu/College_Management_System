import React, { useState } from "react";
import toast from "react-hot-toast";
import Heading from "../../components/Heading";
import axios from "axios";
import { baseApiURL } from "../../baseUrl";
import { FiSearch } from "react-icons/fi";

const Student = () => {
  const [search, setSearch] = useState("");
  const [data, setData] = useState({
    enrollmentNo: "",
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    semester: "",
    branch: "",
    gender: "",
    profile: "",
    internal: {},
    external: {},
  });
  const [id, setId] = useState();

  const searchStudentHandler = (e) => {
    e.preventDefault();
    setId("");
    setData({
      enrollmentNo: "",
      firstName: "",
      middleName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      semester: "",
      branch: "",
      gender: "",
      profile: "",
      internal: {},
      external: {},
    });
    toast.loading("Getting Student");
    const headers = {
      "Content-Type": "application/json",
    };

    // Fetch student details
    axios
      .post(
        `${baseApiURL()}/student/details/getDetails`,
        { enrollmentNo: search },
        { headers }
      )
      .then((response) => {
        toast.dismiss();
        if (response.data.success) {
          if (response.data.user.length === 0) {
            toast.error("No Student Found!");
          } else {
            const student = response.data.user[0];
            setData({
              enrollmentNo: student.enrollmentNo,
              firstName: student.firstName,
              middleName: student.middleName,
              lastName: student.lastName,
              email: student.email,
              phoneNumber: student.phoneNumber,
              semester: student.semester,
              branch: student.branch,
              gender: student.gender,
              profile: student.profile,
              internal: {},
              external: {},
            });
            setId(student._id);

            // Fetch marks
            return axios.post(`${baseApiURL()}/marks/getMarks`, { enrollmentNo: student.enrollmentNo }, { headers });
          }
        } else {
          toast.error(response.data.message);
        }
      })
      .then((response) => {
        if (response.data.length !== 0) {
          setData((prevData) => ({
            ...prevData,
            internal: response.data.Mark[0].internal,
            external: response.data.Mark[0].external,
          }));
        }
      })
      .catch((error) => {
        toast.dismiss();
        toast.error(error.response?.data?.message || "An error occurred");
        console.error(error);
      });
  };

  return (
    <div className="w-full mx-auto mt-10 flex justify-center items-start flex-col mb-10">
      <div className="flex justify-between items-center w-full">
        <Heading title="Student Details" />
      </div>
      <div className="my-6 mx-auto w-full">
        <form
          className="flex justify-center items-center border-2 border-blue-500 rounded w-[40%] mx-auto"
          onSubmit={searchStudentHandler}
        >
          <input
            type="text"
            className="px-6 py-3 w-full outline-none"
            placeholder="Enrollment No."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="px-4 text-2xl hover:text-blue-500" type="submit">
            <FiSearch />
          </button>
        </form>
        {id && (
          <div className="mx-auto w-full bg-blue-50 mt-10 flex justify-between items-center p-10 rounded-md shadow-md">
            <div>
              <p className="text-2xl font-semibold">
                {data.firstName} {data.middleName} {data.lastName}
              </p>
              <div className="mt-3">
                <p className="text-lg font-normal mb-2">
                  Enrollment No: {data.enrollmentNo}
                </p>
                <p className="text-lg font-normal mb-2">
                  Phone Number: +91 {data.phoneNumber}
                </p>
                <p className="text-lg font-normal mb-2">
                  Email Address: {data.email}
                </p>
                <p className="text-lg font-normal mb-2">
                  Branch: {data.branch}
                </p>
                <p className="text-lg font-normal mb-2">
                  Semester: {data.semester}
                </p>
              </div>
            </div>
            <img
              src={process.env.REACT_APP_MEDIA_LINK + "/" + data.profile}
              alt="student profile"
              className="h-[200px] w-[200px] object-cover rounded-lg shadow-md"
            />
          </div>
        )}

        {id && (data.internal || data.external) && (
          <div className="w-full mt-10 bg-gray-50 p-6 rounded-md shadow-md">
            <h2 className="text-xl font-semibold mb-4">Marks</h2>
            {data.internal && (
              <div className="mb-4">
                <p className="border-b-2 border-red-500 text-lg font-semibold pb-2">
                  Internal Marks (Out of 30)
                </p>
                {Object.keys(data.internal).map((item, index) => (
                  <div key={index} className="flex justify-between text-lg mt-2">
                    <p>{item}</p>
                    <span>{data.internal[item]}</span>
                  </div>
                ))}
              </div>
            )}
            {data.external && (
              <div>
                <p className="border-b-2 border-red-500 text-lg font-semibold pb-2">
                  External Marks (Out of 70)
                </p>
                {Object.keys(data.external).map((item, index) => (
                  <div key={index} className="flex justify-between text-lg mt-2">
                    <p>{item}</p>
                    <span>{data.external[item]}</span>
                  </div>
                ))}
              </div>
            )}
            {(!data.internal && !data.external) && (
              <p>No Marks Available At The Moment!</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Student;
