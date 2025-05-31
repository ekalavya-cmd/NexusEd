import React, { useState, useEffect, useContext, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import GroupForm from "./GroupForm";
import GroupCard from "./GroupCard";
import ConfirmationMessage from "./ConfirmationMessage";

function StudyGroups() {
  const { user, isLoading: authLoading } = useContext(AuthContext);
  const [groups, setGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [newGroup, setNewGroup] = useState({
    name: "",
    description: "",
    category: "",
    groupImage: "fa-users",
  });
  const [editGroup, setEditGroup] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [visibleMembers, setVisibleMembers] = useState({});
  const [confirmation, setConfirmation] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const timeoutRef = useRef(null);
  const confirmationTimeoutRef = useRef(null);
  const confirmationMessageRef = useRef(null);
  const editFormRef = useRef(null);

  const categories = [
    "Mathematics",
    "Programming",
    "Literature",
    "Science",
    "History",
  ];

  const groupIcons = [
    { value: "fa-users", label: "Users (Default)", icon: "fa-users" },
    { value: "fa-book", label: "Book", icon: "fa-book" },
    { value: "fa-code", label: "Code", icon: "fa-code" },
    { value: "fa-flask", label: "Flask (Science)", icon: "fa-flask" },
    { value: "fa-history", label: "History", icon: "fa-history" },
    {
      value: "fa-calculator",
      label: "Calculator (Math)",
      icon: "fa-calculator",
    },
  ];

  const setTemporaryMessage = (type, message) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (type === "error") {
      setError(message);
      setSuccess("");
    } else {
      setSuccess(message);
      setError("");
    }
    timeoutRef.current = setTimeout(() => {
      setError("");
      setSuccess("");
      timeoutRef.current = null;
    }, 3000);
  };

  const clearConfirmation = () => {
    if (confirmationTimeoutRef.current) {
      clearTimeout(confirmationTimeoutRef.current);
    }
    setConfirmation(null);
    confirmationTimeoutRef.current = null;
  };

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/study-groups`
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch study groups: ${response.status}`);
        }
        const data = await response.json();
        setGroups(data);
      } catch (err) {
        console.error("Error fetching study groups:", err.message);
        setTemporaryMessage("error", "Failed to load study groups.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchGroups();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (confirmationTimeoutRef.current) {
        clearTimeout(confirmationTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (confirmation && confirmationMessageRef.current) {
      confirmationMessageRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      if (confirmationMessageRef.current.focusUndoButton) {
        setTimeout(() => {
          confirmationMessageRef.current.focusUndoButton();
        }, 500);
      }
    }
  }, [confirmation]);

  useEffect(() => {
    if (editGroup && editFormRef.current) {
      editFormRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [editGroup]);

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (!user) {
      setTemporaryMessage("error", "Please log in to create a study group.");
      return;
    }
    if (
      !newGroup.name.trim() ||
      !newGroup.description.trim() ||
      !newGroup.category
    ) {
      setTemporaryMessage(
        "error",
        "Name, description, and category are required."
      );
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token missing. Please log in again.");
      }
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/study-groups`,
        {
          name: newGroup.name,
          description: newGroup.description,
          category: newGroup.category,
          groupImage: newGroup.groupImage,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setGroups([...groups, response.data]);
      setNewGroup({
        name: "",
        description: "",
        category: "",
        groupImage: "fa-users",
      });
      setTemporaryMessage("success", "Study group created successfully!");
    } catch (err) {
      setTemporaryMessage(
        "error",
        err.response?.data?.message || "Failed to create study group."
      );
    }
  };

  const handleEditGroup = (group) => {
    setEditGroup({
      id: group._id,
      name: group.name,
      description: group.description,
      category: group.category,
      groupImage: group.groupImage || "fa-users",
    });
  };

  const handleUpdateGroup = async (e) => {
    e.preventDefault();
    if (!user) {
      setTemporaryMessage("error", "Please log in to update a study group.");
      return;
    }
    if (
      !editGroup.name.trim() ||
      !editGroup.description.trim() ||
      !editGroup.category
    ) {
      setTemporaryMessage(
        "error",
        "Name, description, and category are required."
      );
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token missing. Please log in again.");
      }
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/study-groups/${editGroup.id}`,
        {
          name: editGroup.name,
          description: editGroup.description,
          category: editGroup.category,
          groupImage: editGroup.groupImage,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setGroups(
        groups.map((group) =>
          group._id === editGroup.id ? response.data : group
        )
      );
      setEditGroup(null);
      setTemporaryMessage("success", "Study group updated successfully!");
    } catch (err) {
      setTemporaryMessage(
        "error",
        err.response?.data?.message || "Failed to update study group."
      );
    }
  };

  const handleJoinGroup = async (groupId, fromUndo = false) => {
    if (!user) {
      setTemporaryMessage("error", "Please log in to join a study group.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token missing. Please log in again.");
      }
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/study-groups/${groupId}/join`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setGroups(
        groups.map((group) => (group._id === groupId ? response.data : group))
      );
    } catch (err) {
      setTemporaryMessage(
        "error",
        err.response?.data?.message || "Failed to join study group."
      );
    }
  };

  const handleLeaveGroup = async (groupId, fromUndo = false) => {
    if (!user) {
      setTemporaryMessage("error", "Please log in to leave a study group.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token missing. Please log in again.");
      }
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/study-groups/${groupId}/leave`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!fromUndo) {
        const previousGroups = [...groups];
        setGroups(
          groups.map((group) => (group._id === groupId ? response.data : group))
        );

        clearConfirmation();
        setConfirmation({
          type: "leave",
          groupId,
          message: "You have left the study group.",
          undo: () => {
            handleJoinGroup(groupId, true);
            setGroups(previousGroups);
          },
        });
        confirmationTimeoutRef.current = setTimeout(clearConfirmation, 5000);
      } else {
        setGroups(
          groups.map((group) => (group._id === groupId ? response.data : group))
        );
      }
    } catch (err) {
      setTemporaryMessage(
        "error",
        err.response?.data?.message || "Failed to leave study group."
      );
    }
  };

  const handleDeleteGroup = async (groupId) => {
    if (!user) {
      setTemporaryMessage("error", "Please log in to delete a study group.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setTemporaryMessage(
          "error",
          "Authentication token missing. Please log in again."
        );
        return;
      }

      await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/study-groups/${groupId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setGroups(groups.filter((group) => group._id !== groupId));
      setDeleteConfirmation(null);
      setTemporaryMessage("success", "Study group deleted successfully!");
    } catch (err) {
      console.error("Error deleting study group:", err);
      setTemporaryMessage(
        "error",
        err.response?.data?.message || "Failed to delete study group."
      );
    }
  };

  const handleDeleteConfirmation = (groupId) => {
    setDeleteConfirmation(groupId);
  };

  const toggleMembersVisibility = (groupId) => {
    setVisibleMembers((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  const filteredGroups =
    selectedCategory === "All"
      ? groups
      : groups.filter((group) => group.category === selectedCategory);

  if (authLoading) {
    return (
      <div className="text-gray-600 dark:text-gray-400 py-10 animate-pulse">
        Loading auth...
      </div>
    );
  }

  return (
    <section
      className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 py-10"
      aria-label="Study Groups"
    >
      <style>
        {`
          @keyframes fadeInUp {
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          @keyframes pulse {
            0% { opacity: 0.6; }
            50% { opacity: 1; }
            100% { opacity: 0.6; }
          }
          @keyframes glow {
            0% { box-shadow: 0 0 5px rgba(209, 213, 219, 0.3); }
            50% { box-shadow: 0 0 15px rgba(209, 213, 219, 0.5); }
            100% { box-shadow: 0 0 5px rgba(209, 213, 219, 0.3); }
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          .animate-fade-in-up {
            animation: fadeInUp 0.5s ease-out forwards;
          }
          .animate-pulse-text {
            animation: pulse 1.5s infinite;
          }
          .dark-glow {
            animation: glow 2s infinite ease-in-out;
          }
          .icon-hover:hover {
            animation: spin 1s linear infinite;
            box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
          }
          .dark .icon-hover:hover {
            box-shadow: 0 0 10px rgba(209, 213, 219, 0.5);
          }
          .hover-underline::after {
            content: '';
            position: absolute;
            width: 0;
            height: 2px;
            bottom: 0;
            left: 0;
            background: linear-gradient(to right, #2563eb, #4f46e5);
            transition: width 0.3s ease-in-out;
          }
          .dark .hover-underline::after {
            background: linear-gradient(to right, #9ca3af, #d1d5db);
          }
          .hover-underline:hover::after {
            width: 100%;
          }
          .tooltip {
            visibility: hidden;
            opacity: 0;
            transition: opacity 0.3s ease-in-out;
            position: absolute;
            bottom: 100%;
            left: 50%;
            transform: translateX(-50%);
            background-color: #1f2937;
            color: #fff;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            white-space: nowrap;
            z-index: 10;
          }
          .avatar:hover .tooltip {
            visibility: visible;
            opacity: 1;
          }
          input:-webkit-autofill,
          input:-webkit-autofill:hover,
          input:-webkit-autofill:focus,
          input:-webkit-autofill:active,
          textarea:-webkit-autofill,
          textarea:-webkit-autofill:hover,
          textarea:-webkit-autofill:focus,
          textarea:-webkit-autofill:active {
            -webkit-box-shadow: 0 0 0 30px #f9fafb inset !important;
            -webkit-text-fill-color: #1f2937 !important;
            border-radius: 0.5rem !important;
            border: 1px solid #e5e7eb !important;
          }
          .dark input:-webkit-autofill,
          .dark input:-webkit-autofill:hover,
          .dark input:-webkit-autofill:focus,
          .dark input:-webkit-autofill:active,
          .dark textarea:-webkit-autofill,
          .dark textarea:-webkit-autofill:hover,
          .dark textarea:-webkit-autofill:focus,
          .dark textarea:-webkit-autofill:active {
            -webkit-box-shadow: 0 0 0 30px #1f2937 inset !important;
            -webkit-text-fill-color: #d1d5db !important;
            border-radius: 0.5rem !important;
            border: 1px solid #4b5563 !important;
          }
        `}
      </style>
      <div className="container mx-auto px-4 animate-fade-in-up">
        <h1 className="relative text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-amber-200 dark:to-amber-100 hover-underline mb-8">
          Study Groups
        </h1>

        {user ? (
          <GroupForm
            formTitle="Create a New Study Group"
            formData={newGroup}
            setFormData={setNewGroup}
            onSubmit={handleCreateGroup}
            categories={categories}
            groupIcons={groupIcons}
            isEdit={false}
          />
        ) : (
          <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg transition-transform duration-200 hover:scale-105 animate-fade-in-up">
            Please log in to create or join a study group.
          </p>
        )}

        {editGroup && (
          <div ref={editFormRef}>
            <GroupForm
              formTitle="Edit Study Group"
              formData={editGroup}
              setFormData={setEditGroup}
              onSubmit={handleUpdateGroup}
              categories={categories}
              groupIcons={groupIcons}
              isEdit={true}
              onCancel={() => setEditGroup(null)}
            />
          </div>
        )}

        <div ref={confirmationMessageRef}>
          <ConfirmationMessage
            error={error}
            success={success}
            confirmation={confirmation}
            clearConfirmation={clearConfirmation}
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="category-filter"
            className="block text-gray-700 dark:text-gray-200 mb-2 font-medium bg-clip-text text-transparent bg-gradient-to-r from-gray-700 to-gray-900 dark:from-gray-400 dark:to-gray-300"
          >
            Filter by Category
          </label>
          <select
            id="category-filter"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full sm:w-48 p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gradient-to-r from-blue-500 to-indigo-500 dark:from-gray-500 dark:to-gray-400 focus:scale-[1.01] transition-all duration-300 text-gray-800 dark:text-gray-200"
            aria-label="Filter by Category"
          >
            <option value="All">All</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {isLoading ? (
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl shadow-xl border border-blue-100 dark:border-gray-600 hover:shadow-2xl dark:hover:shadow-[0_0_15px_rgba(209,213,219,0.3)] hover:-translate-y-2 transition-all duration-300 animate-fade-in-up flex flex-col items-center justify-center">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-gradient-to-r from-blue-600 to-indigo-600 dark:from-gray-500 dark:to-gray-400"></div>
            <p className="text-gray-600 dark:text-gray-400 mt-3 text-lg animate-pulse-text">
              Loading study groups...
            </p>
          </div>
        ) : filteredGroups.length > 0 ? (
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl shadow-xl border border-blue-100 dark:border-gray-600 hover:shadow-2xl dark:hover:shadow-[0_0_15px_rgba(209,213,219,0.3)] hover:-translate-y-2 transition-all duration-300 space-y-6">
            {filteredGroups.map((group, index) => (
              <GroupCard
                key={`${group._id}-${selectedCategory}`}
                group={group}
                user={user}
                visibleMembers={visibleMembers}
                toggleMembersVisibility={toggleMembersVisibility}
                handleEditGroup={handleEditGroup}
                handleDeleteConfirmation={handleDeleteConfirmation}
                handleJoinGroup={handleJoinGroup}
                handleLeaveGroup={handleLeaveGroup}
                deleteConfirmation={deleteConfirmation}
                handleDeleteGroup={handleDeleteGroup}
                cancelDeleteGroup={() => setDeleteConfirmation(null)}
                animationDelay={`${index * 0.1}s`}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-lg bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-amber-200 dark:to-amber-100 transition-transform duration-200 hover:scale-105">
            No study groups available.
          </p>
        )}
      </div>
    </section>
  );
}

export default StudyGroups;
