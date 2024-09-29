import React, { useEffect, useState, useCallback } from "react";
import Heading from "./Heading";
import axios from "axios";
import { IoMdLink } from "react-icons/io";
import { HiOutlineCalendar } from "react-icons/hi";
import { useLocation } from "react-router-dom";
import { IoAddOutline } from "react-icons/io5";
import { MdDeleteOutline, MdEditNote } from "react-icons/md";
import { BiArrowBack } from "react-icons/bi";
import toast from "react-hot-toast";
import { baseApiURL } from "../baseUrl";

const Notice = () => {
  const router = useLocation();
  const [notice, setNotice] = useState([]);
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(false);
  const [id, setId] = useState("");
  const [data, setData] = useState({
    title: "",
    description: "",
    type: "student",
    link: "",
  });

  const getNoticeHandler = useCallback(async () => {
    let role;

    if (router.pathname === "/student") {
      role = "student";
    } else if (router.pathname === "/faculty") {
      role = "faculty";
    } else if (router.pathname === "/admin") {
      role = "admin";
    }

    const headers = { "Content-Type": "application/json" };

    try {
      const response = await axios.get(`${baseApiURL()}/notice/getNotice`, {
        params: { role },
        headers,
      });
      if (response.data.success) {
        setNotice(response.data.notices);
      } else {
        if (router.pathname !== "/student") {
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      if (router.pathname !== "/student") {
        toast.dismiss();
        toast.error(error.response.data.message);
      }
    }
  }, [router.pathname]);

  useEffect(() => {
    getNoticeHandler();
  }, [getNoticeHandler]);

  const addNoticeHandler = (e) => {
    e.preventDefault();

    // Confirmation toast
    toast(
      (t) => (
        <div>
          <p>Are you posting it to the correct role?</p>
          <button
          className="bg-green-500 text-white px-4 py-1 rounded mr-2"
            onClick={() => {
              toast.loading("Adding Notice");
              const headers = { "Content-Type": "application/json" };

              axios
                .post(`${baseApiURL()}/notice/addNotice`, data, { headers })
                .then((response) => {
                  toast.dismiss();
                  if (response.data.success) {
                    toast.success("Notice added successfully!");
                    getNoticeHandler();
                    openHandler();
                  } else {
                    toast.error(response.data.message);
                  }
                })
                .catch((error) => {
                  toast.dismiss();
                  toast.error(error.response.data.message);
                });
              toast.dismiss(t.id); // Dismiss the confirmation toast
            }}
          >
            Yes
          </button>
          <button
            className="bg-red-500 text-white px-4 py-1 rounded"
            onClick={() => {
              toast.dismiss(t.id); // Dismiss the confirmation toast
              toast.error("Correct the notice and update it again.");
            }}
          >
            No
          </button>
        </div>
      ),
      {
        duration: Infinity,
      }
    );
  };

  const deleteNoticeHandler = (id) => {
    toast.loading("Deleting Notice");
    const headers = { "Content-Type": "application/json" };

    axios
      .delete(`${baseApiURL()}/notice/deleteNotice/${id}`, { headers })
      .then((response) => {
        toast.dismiss();
        if (response.data.success) {
          toast.success("Notice deleted successfully!");
          getNoticeHandler();
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        toast.dismiss();
        toast.error(error.response.data.message);
      });
  };

  const updateNoticeHandler = (e) => {
    e.preventDefault();
    toast.loading("Updating Notice");
    const headers = { "Content-Type": "application/json" };

    axios
      .put(`${baseApiURL()}/notice/updateNotice/${id}`, data, { headers })
      .then((response) => {
        toast.dismiss();
        if (response.data.success) {
          toast.success("Notice updated successfully!");
          getNoticeHandler();
          openHandler();
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        toast.dismiss();
        toast.error(error.response.data.message);
      });
  };

  const setOpenEditSectionHandler = (index) => {
    setEdit(true);
    setOpen(true);
    setData({
      title: notice[index].title,
      description: notice[index].description,
      type: notice[index].type,
      link: notice[index].link,
    });
    setId(notice[index]._id);
  };

  const openHandler = () => {
    setOpen(!open);
    setEdit(false);
    setData({ title: "", description: "", type: "student", link: "" });
  };

  return (
    <div className="w-full mx-auto flex justify-center items-start flex-col my-10 px-4 lg:px-0">
      <div className="relative flex justify-between items-center w-full mb-4">
        <Heading title="Notices" />
        {(router.pathname === "/faculty" || router.pathname === "/admin") && (
          <button
            className="absolute right-2 flex justify-center items-center border-2 border-red-500 px-3 py-2 rounded text-red-500"
            onClick={openHandler}
          >
            {open ? (
              <>
                <span className="mr-2">
                  <BiArrowBack className="text-red-500" />
                </span>
                Close
              </>
            ) : (
              <>
                Add Notice
                <span className="ml-2">
                  <IoAddOutline className="text-red-500 text-xl" />
                </span>
              </>
            )}
          </button>
        )}
      </div>
      {!open && (
        <div className="mt-8 w-full">
          {notice.map((item, index) => (
            <div
              key={item._id}
              className="border-blue-500 border-2 w-full rounded-md shadow-sm py-4 px-6 mb-4 relative bg-white"
            >
              {(router.pathname === "/faculty" || router.pathname === "/admin") && (
                <div className="absolute flex justify-center items-center right-4 bottom-3">
                  <span className="text-sm bg-blue-500 px-4 py-1 text-white rounded-full">
                    {item.type.join(", ")}
                  </span>
                  <span
                    className="text-2xl group-hover:text-blue-500 ml-2 cursor-pointer hover:text-red-500"
                    onClick={() => deleteNoticeHandler(item._id)}
                  >
                    <MdDeleteOutline />
                  </span>
                  <span
                    className="text-2xl group-hover:text-blue-500 ml-2 cursor-pointer hover:text-blue-500"
                    onClick={() => setOpenEditSectionHandler(index)}
                  >
                    <MdEditNote />
                  </span>
                </div>
              )}
              <p
                className={`text-xl font-medium flex justify-start items-center ${item.link && "cursor-pointer"} group`}
                onClick={() => item.link && window.open(item.link)}
              >
                {item.title}
                {item.link && (
                  <span className="text-2xl group-hover:text-blue-500 ml-1">
                    <IoMdLink />
                  </span>
                )}
              </p>
              <p className="text-base font-normal mt-1">{item.description}</p>
              <p className="text-sm absolute top-4 right-4 flex justify-center items-center">
                <span className="text-base mr-1">
                  <HiOutlineCalendar />
                </span>
                {new Date(item.createdAt).toLocaleDateString() +
                  " " +
                  new Date(item.createdAt).toLocaleTimeString()}
              </p>
              {router.pathname === "/student" && (
                <span className="text-sm bg-yellow-500 px-2 py-1 rounded-full absolute top-4 left-4 text-white">
                  {item.type.includes("student")
                    ? "For Students"
                    : "For Both Students and Faculty"}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
      {open && (
        <form className="mt-8 w-full" onSubmit={edit ? updateNoticeHandler : addNoticeHandler}>
          <div className="w-[40%] mt-2">
            <label htmlFor="title">Notice Title</label>
            <input
              type="text"
              id="title"
              className="bg-blue-50 py-2 px-4 w-full mt-1"
              value={data.title}
              onChange={(e) => setData({ ...data, title: e.target.value })}
              placeholder="Enter notice title"
            />
          </div>
          <div className="w-[40%] mt-4">
            <label htmlFor="description">Notice Description</label>
            <textarea
              id="description"
              cols="30"
              rows="4"
              className="bg-blue-50 py-2 px-4 w-full mt-1"
              value={data.description}
              onChange={(e) => setData({ ...data, description: e.target.value })}
              placeholder="Enter notice description"
            />
          </div>
          <div className="w-[40%] mt-4">
            <label htmlFor="link">Notice Link (Optional)</label>
            <input
              type="text"
              id="link"
              className="bg-blue-50 py-2 px-4 w-full mt-1"
              value={data.link}
              onChange={(e) => setData({ ...data, link: e.target.value })}
              placeholder="Enter notice link"
            />
          </div>
          <div className="w-[40%] mt-4">
            <label htmlFor="type">Notice Type</label>
            <select
              id="type"
              className="bg-blue-50 py-2 px-4 w-full mt-1"
              value={data.type}
              onChange={(e) => setData({ ...data, type: e.target.value })}
            >
              <option value="student">Students</option>
              <option value="faculty">Faculty</option>
              <option value="both">Both</option>
            </select>
          </div>
          <div className="mt-4">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded shadow-md hover:bg-blue-600"
            >
              {edit ? "Update Notice" : "Add Notice"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Notice;
