import { useState, useEffect, useContext } from "react";
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

  useEffect(() => {
    return () => {
      cleanup();
    };
  }, []);

  useEffect(() => {
    if (user) {
      setBio(user.bio || DEFAULT_BIO);
      setUsername(user.username || "");
      setImageLoadError(false);

      const fetchUserProfile = async () => {
        try {
          const token = localStorage.getItem("token");
          const response = await axios.get(
            `${process.env.REACT_APP_API_URL}/api/users/profile`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const updatedUser = {
            ...user,
            bio: response.data.bio,
            username: response.data.username,
            email: response.data.email,
            profilePicture: response.data.profilePicture,
            createdAt: response.data.createdAt,
          };
          setUser(updatedUser);
          setBio(response.data.bio || DEFAULT_BIO);
          setUsername(response.data.username || "");
        } catch (err) {
          console.error("Failed to fetch user profile:", err.message);
          setTemporaryMessage(
            setError,
            setSuccess,
            "Failed to fetch user profile"
          );
        }
      };

      const fetchUserPosts = async () => {
        setIsPostsLoading(true);
        try {
          const response = await fetch(
            `${process.env.REACT_APP_API_URL}/api/posts?author=${user.id}`
          );
          if (!response.ok) {
            throw new Error(`Failed to fetch user posts: ${response.status}`);
          }
          const data = await response.json();
          setPosts(data);
        } catch (err) {
          setTemporaryMessage(setError, setSuccess, "Failed to fetch posts");
        } finally {
          setIsPostsLoading(false);
        }
      };

      const fetchUserGroups = async () => {
        setIsGroupsLoading(true);
        try {
          const response = await fetch(
            `${process.env.REACT_APP_API_URL}/api/study-groups`
          );
          if (!response.ok) {
            throw new Error(`Failed to fetch study groups: ${response.status}`);
          }
          const data = await response.json();
          const userGroups = data.filter((group) =>
            group.members?.some((member) => member._id === user.id)
          );
          setJoinedGroups(userGroups);
        } catch (err) {
          setTemporaryMessage(
            setError,
            setSuccess,
            "Failed to fetch study groups"
          );
        } finally {
          setIsGroupsLoading(false);
        }
      };

      fetchUserProfile();
      fetchUserPosts();
      fetchUserGroups();
    }
  }, [user?.id, setUser]);

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
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.post(
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
      const updatedUser = {
        ...user,
        bio: profileResponse.data.bio,
        username: profileResponse.data.username,
        email: profileResponse.data.email,
        profilePicture: response.data.profilePicture,
        createdAt: profileResponse.data.createdAt,
      };
      setUser(updatedUser);
      setImageLoadError(false);
      setTemporarySuccess(
        setError,
        setSuccess,
        "Profile picture updated successfully"
      );
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to upload profile picture";
      setTemporaryMessage(setError, setSuccess, errorMessage);
    } finally {
      setIsLoading(false);
      setProfilePicture(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveProfilePicture = async (fileInputRef) => {
    try {
      setIsLoading(true);
      setUploadError("");

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token missing. Please log in again.");
      }

      const response = await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/users/me/profile-picture`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

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
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to remove profile picture";
      setTemporaryMessage(setUploadError, setSuccess, errorMessage);
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const performProfileUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found. Please log in again.");
      }
      if (typeof setUser !== "function") {
        throw new Error(
          "setUser is not a function. Ensure AuthProvider wraps the app."
        );
      }

      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/users/profile`,
        { bio, username },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updatedUser = {
        id: response.data.id,
        username: response.data.username,
        email: response.data.email,
        bio: response.data.bio,
        profilePicture: user.profilePicture || response.data.profilePicture,
        createdAt: response.data.createdAt,
      };
      setUser(updatedUser);
      setIsEditing(false);
      setUsernameChangeConfirmation(false);
      setTemporarySuccess(setError, setSuccess, "Profile updated successfully");
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to update profile";
      setTemporaryMessage(setError, setSuccess, errorMessage);
      setUsernameChangeConfirmation(false);
    } finally {
      setIsLoading(false);
    }
  };

  const confirmUsernameChange = () => {
    setIsLoading(true);
    performProfileUpdate();
  };

  const cancelUsernameChange = () => {
    setUsernameChangeConfirmation(false);
  };

  const handleBioUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    if (!bio.trim()) {
      setTemporaryMessage(setError, setSuccess, "Bio cannot be empty");
      setIsLoading(false);
      return;
    }

    if (bio.length > BIO_MAX_LENGTH) {
      setTemporaryMessage(
        setError,
        setSuccess,
        `Bio cannot exceed ${BIO_MAX_LENGTH} characters`
      );
      setIsLoading(false);
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
      setIsLoading(false);
      return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setTemporaryMessage(
        setError,
        setSuccess,
        "Username can only contain letters, numbers, and underscores"
      );
      setIsLoading(false);
      return;
    }

    // Check if username has changed
    if (username !== user.username && !usernameChangeConfirmation) {
      setUsernameChangeConfirmation(true);
      setIsLoading(false);
      return;
    }

    // If confirmation is already shown and user has confirmed, proceed with update
    if (usernameChangeConfirmation) {
      // Update is handled by confirmUsernameChange
      setIsLoading(false);
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
