import React, { useRef } from "react";

function GroupForm({
  formTitle,
  formData,
  setFormData,
  onSubmit,
  categories,
  groupIcons,
  isEdit,
  onCancel,
}) {
  const groupNameRef = useRef(null);
  const categoryRef = useRef(null);
  const descriptionRef = useRef(null);
  const groupImageRef = useRef(null);
  const createGroupButtonRef = useRef(null);
  const cancelButtonRef = useRef(null);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      categoryRef.current.focus();
    }
  };

  const handleCategoryKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      descriptionRef.current.focus();
    }
  };

  const handleDescriptionKeyDown = (e) => {
    if (e.key === "Enter") {
      if (e.shiftKey) {
        e.preventDefault();
        setFormData({
          ...formData,
          description: formData.description + "\n",
        });
      } else {
        e.preventDefault();
        groupImageRef.current.focus();
      }
    }
  };

  const handleGroupImageKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (isEdit) {
        createGroupButtonRef.current.focus();
      } else {
        const syntheticEvent = new Event("submit", {
          bubbles: true,
          cancelable: true,
        });
        onSubmit(syntheticEvent);
      }
    }
  };

  const handleUpdateButtonKeyDown = (e) => {
    if (isEdit && e.key === "ArrowRight") {
      e.preventDefault();
      cancelButtonRef.current.focus();
    }
  };

  const handleCancelButtonKeyDown = (e) => {
    if (isEdit && e.key === "ArrowLeft") {
      e.preventDefault();
      createGroupButtonRef.current.focus();
    }
  };

  const handleSubmit = (e) => {
    if (createGroupButtonRef.current) {
      createGroupButtonRef.current.blur();
    }
    onSubmit(e);
  };

  return (
    <div className="mb-8 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl shadow-xl border border-blue-100 dark:border-gray-600 hover:shadow-2xl dark:hover:shadow-[0_0_15px_rgba(209,213,219,0.3)] hover:-translate-y-2 transition-all duration-300 animate-fade-in-up">
      <h2 className="relative text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-amber-200 dark:to-amber-100 mb-6 hover-underline">
        {formTitle}
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-5">
          <label
            htmlFor={isEdit ? "edit-group-name" : "group-name"}
            className="block text-gray-700 dark:text-gray-200 mb-2 font-medium bg-clip-text text-transparent bg-gradient-to-r from-gray-700 to-gray-900 dark:from-gray-400 dark:to-gray-300"
          >
            Group Name
          </label>
          <input
            type="text"
            id={isEdit ? "edit-group-name" : "group-name"}
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            onKeyDown={handleKeyDown}
            ref={groupNameRef}
            placeholder="Enter group name"
            className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gradient-to-r from-blue-500 to-indigo-500 dark:from-gray-500 dark:to-gray-400 focus:scale-[1.01] transition-all duration-300 text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400"
            aria-label={isEdit ? "Edit Group Name" : "Group Name"}
          />
        </div>
        <div className="mb-5">
          <label
            htmlFor={isEdit ? "edit-group-category" : "group-category"}
            className="block text-gray-700 dark:text-gray-200 mb-2 font-medium bg-clip-text text-transparent bg-gradient-to-r from-gray-700 to-gray-900 dark:from-gray-400 dark:to-gray-300"
          >
            Category
          </label>
          <select
            id={isEdit ? "edit-group-category" : "group-category"}
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            onKeyDown={handleCategoryKeyDown}
            ref={categoryRef}
            className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gradient-to-r from-blue-500 to-indigo-500 dark:from-gray-500 dark:to-gray-400 focus:scale-[1.01] transition-all duration-300 text-gray-800 dark:text-gray-200"
            aria-label={isEdit ? "Edit Group Category" : "Group Category"}
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-5">
          <label
            htmlFor={isEdit ? "edit-group-description" : "group-description"}
            className="block text-gray-700 dark:text-gray-200 mb-2 font-medium bg-clip-text text-transparent bg-gradient-to-r from-gray-700 to-gray-900 dark:from-gray-400 dark:to-gray-300"
          >
            Description
          </label>
          <textarea
            id={isEdit ? "edit-group-description" : "group-description"}
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            onKeyDown={handleDescriptionKeyDown}
            ref={descriptionRef}
            placeholder="Describe the study group"
            className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gradient-to-r from-blue-500 to-indigo-500 dark:from-gray-500 dark:to-gray-400 focus:scale-[1.01] transition-all duration-300 text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400"
            rows="4"
            aria-label={isEdit ? "Edit Group Description" : "Group Description"}
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor={isEdit ? "edit-group-image" : "group-image"}
            className="block text-gray-700 dark:text-gray-200 mb-2 font-medium bg-clip-text text-transparent bg-gradient-to-r from-gray-700 to-gray-900 dark:from-gray-400 dark:to-gray-300"
          >
            Group Icon
          </label>
          <div className="flex items-center space-x-4">
            <select
              id={isEdit ? "edit-group-image" : "group-image"}
              value={formData.groupImage}
              onChange={(e) =>
                setFormData({ ...formData, groupImage: e.target.value })
              }
              onKeyDown={handleGroupImageKeyDown}
              ref={groupImageRef}
              className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gradient-to-r from-blue-500 to-indigo-500 dark:from-gray-500 dark:to-gray-400 focus:scale-[1.01] transition-all duration-300 text-gray-800 dark:text-gray-200"
              aria-label={isEdit ? "Edit Group Icon" : "Group Icon"}
            >
              {groupIcons.map((icon) => (
                <option key={icon.value} value={icon.value}>
                  {icon.label}
                </option>
              ))}
            </select>
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 dark:from-orange-600 dark:to-amber-600 text-white text-xl">
              <i className={`fa-solid ${formData.groupImage}`}></i>
            </div>
          </div>
        </div>
        <div className="flex space-x-3">
          <button
            type="submit"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-cyan-600 dark:to-teal-600 text-white dark:text-gray-200 px-5 py-3 rounded-lg hover:shadow-[0_0_10px_rgba(59,130,246,0.5)] dark:hover:shadow-[0_0_10px_rgba(21,94,117,0.5)] dark:hover:dark-glow hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-cyan-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 flex items-center space-x-2"
            ref={createGroupButtonRef}
            onKeyDown={handleUpdateButtonKeyDown}
            aria-label={isEdit ? "Update Study Group" : "Create Study Group"}
          >
            <i className="fa-solid fa-users text-base"></i>
            <span>{isEdit ? "Update Group" : "Create Group"}</span>
          </button>
          {isEdit && (
            <button
              type="button"
              onClick={onCancel}
              className="bg-gradient-to-r from-gray-500 to-gray-600 dark:from-gray-600 dark:to-gray-500 text-white dark:text-gray-200 px-5 py-3 rounded-lg hover:shadow-[0_0_10px_rgba(107,114,128,0.5)] dark:hover:shadow-[0_0_10px_rgba(209,213,219,0.5)] dark:hover:dark-glow hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              ref={cancelButtonRef}
              onKeyDown={handleCancelButtonKeyDown}
              aria-label="Cancel Edit"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default GroupForm;
