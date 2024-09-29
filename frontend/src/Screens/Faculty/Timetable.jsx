import axios from "axios";
import React, { useEffect, useState } from "react";
import { FiUpload } from "react-icons/fi";
import Heading from "../../components/Heading";
import { AiOutlineClose } from "react-icons/ai";
import toast from "react-hot-toast";
import { baseApiURL } from "../../baseUrl";

const Timetable = () => {
  const [addSelected, setAddSelected] = useState({
    branch: "",
    semester: "",
  });
  const [file, setFile] = useState(null);
  const [branch, setBranch] = useState([]);
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    getBranchData();
  }, []);

  const getBranchData = () => {
    const headers = {
      "Content-Type": "application/json",
    };
    axios
      .get(`${baseApiURL()}/branch/getBranch`, { headers })
      .then((response) => {
        if (response.data.success) {
          setBranch(response.data.branches);
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        console.error("Error fetching branches:", error);
        toast.error("Error fetching branches");
      });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const imageUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(imageUrl);
    } else {
      setFile(null);
      setPreviewUrl("");
    }
  };

  const confirmUpload = () => {
    return new Promise((resolve, reject) => {
      const id = toast(
        (t) => (
          <span>
            Confirm upload of timetable?
            <div className="mt-2 flex justify-end">
              <button
                className="bg-blue-500 text-white px-4 py-1 mr-2 rounded-sm"
                onClick={() => {
                  toast.dismiss(t.id);
                  resolve(true);
                }}
              >
                Yes
              </button>
              <button
                className="bg-gray-300 px-4 py-1 rounded-sm"
                onClick={() => {
                  toast.dismiss(t.id);
                  reject();
                }}
              >
                No
              </button>
            </div>
          </span>
        ),
        { duration: Infinity }
      );
    });
  };

  const addTimetableHandler = async () => {
    if (!file || !addSelected.branch || !addSelected.semester) {
      toast.error("Please fill all the fields and upload a timetable");
      return;
    }

    try {
      await confirmUpload();
      toast.loading("Adding Timetable");

      const formData = new FormData();
      formData.append("branch", addSelected.branch);
      formData.append("semester", addSelected.semester);
      formData.append("type", "timetable");
      formData.append("timetable", file);

      axios
        .post(`${baseApiURL()}/timetable/addTimetable`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          toast.dismiss();
          if (response.data.success) {
            toast.success(response.data.message);
            setAddSelected({
              branch: "",
              semester: "",
            });
            setFile(null);
            setPreviewUrl("");
          } else {
            toast.error(response.data.message);
          }
        })
        .catch((error) => {
          toast.dismiss();
          console.error("File upload error:", error);
          toast.error(
            error.response?.data?.message || "Error uploading timetable"
          );
        });
    } catch {
      toast.error("Timetable upload cancelled");
    }
  };

  return (
    <div className="w-full mx-auto mt-10 flex justify-center items-start flex-col mb-10">
      <div className="flex justify-between items-center w-full">
        <Heading title={`Upload Timetable`} />
      </div>
      <div className="w-full flex justify-evenly items-center mt-12">
        <div className="w-1/2 flex flex-col justify-center items-center">
          <p className="mb-4 text-xl font-medium">Add Timetable</p>

          {/* Branch selection dropdown */}
          <select
            id="branch"
            className="px-2 bg-blue-50 py-3 rounded-sm text-base w-[80%] accent-blue-700 mt-4"
            value={addSelected.branch}
            onChange={(e) =>
              setAddSelected({ ...addSelected, branch: e.target.value })
            }
          >
            <option value="" disabled>
              -- Select Branch --
            </option>
            {branch.length > 0 ? (
              branch.map((branchItem) => (
                <option value={branchItem.name} key={branchItem.name}>
                  {branchItem.name}
                </option>
              ))
            ) : (
              <option disabled>No Branches Available</option>
            )}
          </select>

          {/* Semester selection dropdown */}
          <select
            id="semester"
            onChange={(e) =>
              setAddSelected({ ...addSelected, semester: e.target.value })
            }
            value={addSelected.semester}
            className="px-2 bg-blue-50 py-3 rounded-sm text-base w-[80%] accent-blue-700 mt-4"
          >
            <option value="" disabled>
              -- Select Semester --
            </option>
            {[...Array(8).keys()].map((i) => (
              <option key={i + 1} value={i + 1}>
                {`${i + 1}${i === 0 ? "st" : i === 1 ? "nd" : "th"} Semester`}
              </option>
            ))}
          </select>

          {/* File upload button */}
          {!file && (
            <label
              htmlFor="upload"
              className="px-2 bg-blue-50 py-3 rounded-sm text-base w-[80%] mt-4 flex justify-center items-center cursor-pointer"
            >
              Select Timetable
              <span className="ml-2">
                <FiUpload />
              </span>
            </label>
          )}

          {/* File remove button */}
          {file && (
            <p
              className="px-2 border-2 border-blue-500 py-2 rounded text-base w-[80%] mt-4 flex justify-center items-center cursor-pointer"
              onClick={() => {
                setFile(null);
                setPreviewUrl("");
              }}
            >
              Remove Selected Timetable
              <span className="ml-2">
                <AiOutlineClose />
              </span>
            </p>
          )}

          {/* File input */}
          <input
            type="file"
            id="upload"
            hidden
            accept="image/*"
            onChange={handleFileChange}
          />

          {/* Submit button */}
          <button
            className="bg-blue-500 text-white mt-8 px-4 py-2 rounded-sm"
            onClick={addTimetableHandler}
          >
            Add Timetable
          </button>

          {/* Timetable preview */}
          {previewUrl && (
            <img
              className="mt-6 h-48 w-48 object-cover rounded"
              src={previewUrl}
              alt="Preview of timetable"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Timetable;
