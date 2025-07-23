// 1. Fixed useProfile.js
import { useState, useEffect, useContext, useCallback, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { useTemporaryMessage } from "../utils/formatUtils";

const useProfile = () => {
  const { user, setUser, isLoading: authLoading } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [isPostsLoading, setIsPostsLoading] = useState(false);
  const [joinedGroups, setJoinedGroups] = useState([]);
  const [isGroupsLoading, setIsGroupsLoading] = useState(false);
  const [bio, setBio] = useState("");
  const [username, setUsername] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sortOption, setSortOption] = useState("newest");
  const [imageLoadError, setImageLoadError] = useState(false);
  const [usernameChangeConfirmation, setUsernameChangeConfirmation] =
    useState(false);

  // Track if component is mounted
  const isMounted = useRef(true);
  // Skip initial user data fetching flag
  const initialFetchDone = useRef(false);

  const {
    setTemporaryMessage,
    setTemporarySuccess,
    setTemporaryUploadError,
    cleanup,
  } = useTemporaryMessage();

  const BIO_MAX_LENGTH = 150;
  const USERNAME_MIN_LENGTH = 3;
  const USERNAME_MAX_LENGTH = 20;
  const DEFAULT_BIO =
    "A student passionate about learning and sharing knowledge.";

  // Set up component unmount cleanup
  useEffect(() => {
    // On mount, set isMounted to true
    isMounted.current = true;

    // On unmount, clean up
    return () => {
      isMounted.current = false;
      cleanup();
    };
  }, [cleanup]);

  // Memoized message functions to prevent dependency warnings
  const memoizedSetTemporaryMessage = useCallback(
    (setter, successSetter, message) => {
      if (isMounted.current) {
        setTemporaryMessage(setter, successSetter, message);
      }
    },
    [setTemporaryMessage]
  );

  // Set initial state values from user when it becomes available
  useEffect(() => {
    if (user && isMounted.current) {
      setBio(user.bio || DEFAULT_BIO);
      setUsername(user.username || "");
      setProfilePicture(user.profilePicture || null);
      setImageLoadError(false);
    }
  }, [user, DEFAULT_BIO]);

  // Fetch profile data only once when user is available
  useEffect(() => {
    // Only fetch if user exists and we haven't fetched yet
    if (user && !initialFetchDone.current && isMounted.current) {
      initialFetchDone.current = true;

      const fetchUserProfile = async () => {
        try {
          const token = localStorage.getItem("token");
          if (!token) return;

          const response = await axios.get(
            `${process.env.REACT_APP_API_URL}/api/users/profile`,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          if (isMounted.current) {
            // IMPORTANT: Don't call setUser here - it triggers re-renders
            // Instead, just update the local state
            setBio(response.data.bio || DEFAULT_BIO);
            setUsername(response.data.username || "");
            setProfilePicture(response.data.profilePicture || user.profilePicture || null);
          }
        } catch (err) {
          console.error("Failed to fetch user profile:", err.message);
          if (isMounted.current) {
            memoizedSetTemporaryMessage(
              setError,
              setSuccess,
              "Failed to fetch user profile"
            );
          }
        }
      };

      const fetchUserPosts = async () => {
        if (isMounted.current) setIsPostsLoading(true);
        try {
          const response = await fetch(
            `${process.env.REACT_APP_API_URL}/api/posts?author=${user.id}`
          );
          if (!response.ok) {
            throw new Error(`Failed to fetch user posts: ${response.status}`);
          }
          const data = await response.json();
          if (isMounted.current) {
            setPosts(data);
          }
        } catch (err) {
          if (isMounted.current) {
            memoizedSetTemporaryMessage(
              setError,
              setSuccess,
              "Failed to fetch posts"
            );
          }
        } finally {
          if (isMounted.current) {
            setIsPostsLoading(false);
          }
        }
      };

      const fetchUserGroups = async () => {
        if (isMounted.current) setIsGroupsLoading(true);
        try {
          const response = await fetch(
            `${process.env.REACT_APP_API_URL}/api/study-groups`
          );
          if (!response.ok) {
            throw new Error(`Failed to fetch study groups: ${response.status}`);
          }
          const data = await response.json();
          if (isMounted.current) {
            const userGroups = data.filter((group) =>
              group.members?.some((member) => member._id === user.id)
            );
            setJoinedGroups(userGroups);
          }
        } catch (err) {
          if (isMounted.current) {
            memoizedSetTemporaryMessage(
              setError,
              setSuccess,
              "Failed to fetch study groups"
            );
          }
        } finally {
          if (isMounted.current) {
            setIsGroupsLoading(false);
          }
        }
      };

      fetchUserProfile();
      fetchUserPosts();
      fetchUserGroups();
    }
  }, [user, memoizedSetTemporaryMessage, DEFAULT_BIO]);

  const handleProfilePictureChange = async (e, fileInputRef) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setTemporaryUploadError(setUploadError, "Please upload an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setTemporaryUploadError(
        setUploadError,
        "Image size must be less than 5MB"
      );
      return;
    }

    const formData = new FormData();
    formData.append("profilePicture", file);

    try {
      if (isMounted.current) setIsLoading(true);
      const token = localStorage.getItem("token");

      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/users/upload-profile-picture`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const profileResponse = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/users/profile`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (isMounted.current) {
        const updatedUser = {
          ...user,
          profilePicture: profileResponse.data.profilePicture,
        };
        setUser(updatedUser);
        setProfilePicture(profileResponse.data.profilePicture);
        setImageLoadError(false);
        setTemporarySuccess(
          setError,
          setSuccess,
          "Profile picture updated successfully"
        );
      }
    } catch (err) {
      if (isMounted.current) {
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "Failed to upload profile picture";
        setTemporaryMessage(setError, setSuccess, errorMessage);
      }
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
        setProfilePicture(null);
        if (fileInputRef && fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    }
  };

  const handleRemoveProfilePicture = async (fileInputRef) => {
    try {
      if (isMounted.current) {
        setIsLoading(true);
        setUploadError("");
      }

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token missing. Please log in again.");
      }

      await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/users/me/profile-picture`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (isMounted.current) {
        const updatedUser = {
          ...user,
          profilePicture: null,
        };
        setUser(updatedUser);
        setProfilePicture(null);
        setImageLoadError(false);
        setTemporarySuccess(
          setError,
          setSuccess,
          "Profile picture removed successfully"
        );
      }
    } catch (err) {
      if (isMounted.current) {
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "Failed to remove profile picture";
        setTemporaryMessage(setUploadError, setSuccess, errorMessage);
      }
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
        if (fileInputRef && fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    }
  };

  const performProfileUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found. Please log in again.");
      }

      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/users/profile`,
        { bio, username },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (isMounted.current) {
        const updatedUser = {
          ...user,
          username: response.data.username,
          bio: response.data.bio,
        };
        setUser(updatedUser);
        setIsEditing(false);
        setUsernameChangeConfirmation(false);
        setTemporarySuccess(
          setError,
          setSuccess,
          "Profile updated successfully"
        );
      }
    } catch (err) {
      if (isMounted.current) {
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "Failed to update profile";
        setTemporaryMessage(setError, setSuccess, errorMessage);
        setUsernameChangeConfirmation(false);
      }
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  };

  const confirmUsernameChange = () => {
    if (isMounted.current) setIsLoading(true);
    performProfileUpdate();
  };

  const cancelUsernameChange = () => {
    if (isMounted.current) setUsernameChangeConfirmation(false);
  };

  const handleBioUpdate = async (e) => {
    e.preventDefault();
    if (isMounted.current) {
      setError("");
      setSuccess("");
      setIsLoading(true);
    }

    if (!bio.trim()) {
      setTemporaryMessage(setError, setSuccess, "Bio cannot be empty");
      if (isMounted.current) setIsLoading(false);
      return;
    }

    if (bio.length > BIO_MAX_LENGTH) {
      setTemporaryMessage(
        setError,
        setSuccess,
        `Bio cannot exceed ${BIO_MAX_LENGTH} characters`
      );
      if (isMounted.current) setIsLoading(false);
      return;
    }

    if (
      username.length < USERNAME_MIN_LENGTH ||
      username.length > USERNAME_MAX_LENGTH
    ) {
      setTemporaryMessage(
        setError,
        setSuccess,
        `Username must be between ${USERNAME_MIN_LENGTH} and ${USERNAME_MAX_LENGTH} characters`
      );
      if (isMounted.current) setIsLoading(false);
      return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setTemporaryMessage(
        setError,
        setSuccess,
        "Username can only contain letters, numbers, and underscores"
      );
      if (isMounted.current) setIsLoading(false);
      return;
    }

    // Check if username has changed
    if (username !== user.username && !usernameChangeConfirmation) {
      if (isMounted.current) {
        setUsernameChangeConfirmation(true);
        setIsLoading(false);
      }
      return;
    }

    // If confirmation is already shown and user has confirmed, proceed with update
    if (usernameChangeConfirmation) {
      if (isMounted.current) setIsLoading(false);
      return;
    }

    // If username hasn't changed, proceed with update directly
    await performProfileUpdate();
  };

  return {
    user,
    setUser,
    authLoading,
    posts,
    setPosts,
    isPostsLoading,
    joinedGroups,
    isGroupsLoading,
    bio,
    setBio,
    username,
    setUsername,
    profilePicture,
    setProfilePicture,
    isEditing,
    setIsEditing,
    error,
    setError,
    uploadError,
    setUploadError,
    success,
    setSuccess,
    isLoading,
    setIsLoading,
    sortOption,
    setSortOption,
    imageLoadError,
    setImageLoadError,
    setTemporaryMessage,
    setTemporarySuccess,
    usernameChangeConfirmation,
    confirmUsernameChange,
    cancelUsernameChange,
    handleProfilePictureChange,
    handleRemoveProfilePicture,
    handleBioUpdate,
    BIO_MAX_LENGTH,
    USERNAME_MIN_LENGTH,
    USERNAME_MAX_LENGTH,
    DEFAULT_BIO,
  };
};

export default useProfile;
