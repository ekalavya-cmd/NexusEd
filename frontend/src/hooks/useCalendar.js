import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { isDateValid } from "../utils/dateUtils";

const useCalendar = () => {
  const { user, isLoading: authLoading } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    start: new Date(),
    end: new Date(new Date().getTime() + 60 * 60 * 1000), // Default to 1 hour later
    groupId: "",
  });
  const [groups, setGroups] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({
    title: "",
    description: "",
    start: "",
    end: "",
    groupId: "",
  });
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState("month");

  // Update currentDateTime every second to reflect the passage of time
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000); // Update every second
    return () => clearInterval(interval);
  }, []);

  // Fetch user's groups
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/study-groups`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch groups");
        }
        const data = await response.json();
        const userGroups = data.filter((group) =>
          group.members.some((member) => member._id === user.id)
        );
        setGroups(userGroups);
        if (userGroups.length > 0) {
          setNewEvent((prev) => ({ ...prev, groupId: userGroups[0]._id }));
        }
      } catch (err) {
        setError(err.message || "Failed to load groups");
      }
    };

    if (user && !authLoading) {
      fetchGroups();
    }
  }, [user, authLoading]);

  // Fetch events and filter out expired ones (as a fallback)
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/events`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }
        const data = await response.json();
        const formattedEvents = data
          .map((event) => ({
            ...event,
            start: new Date(event.start),
            end: new Date(event.end),
            title: `${event.title} (${event.group?.name || "Unknown Group"})`,
            group: event.group,
            creator: event.creator,
          }))
          .filter((event) => {
            const endDate = new Date(event.end);
            return isDateValid(endDate) && endDate > currentDateTime;
          });
        setEvents(formattedEvents);
      } catch (err) {
        setError(err.message || "Failed to load events");
      } finally {
        setIsLoading(false);
      }
    };

    if (authLoading) {
      setIsLoading(true);
    } else if (user) {
      fetchEvents();
    } else {
      setIsLoading(false);
      setError("Please log in to view events.");
    }
  }, [user, authLoading, currentDateTime]);

  // Clear fieldErrors after 3 seconds
  useEffect(() => {
    const hasErrors = Object.values(fieldErrors).some(error => error.trim() !== "");
    if (hasErrors) {
      const timer = setTimeout(() => {
        setFieldErrors({
          title: "",
          description: "",
          start: "",
          end: "",
          groupId: "",
        });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [fieldErrors]);

  // Clear general error after 3 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Periodically refetch events to reflect server-side cleanup
  useEffect(() => {
    const interval = setInterval(() => {
      const fetchEvents = async () => {
        try {
          const response = await fetch(
            `${process.env.REACT_APP_API_URL}/api/events`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          if (!response.ok) {
            throw new Error("Failed to fetch events");
          }
          const data = await response.json();
          const formattedEvents = data
            .map((event) => ({
              ...event,
              start: new Date(event.start),
              end: new Date(event.end),
              title: `${event.title} (${event.group?.name || "Unknown Group"})`,
              group: event.group,
              creator: event.creator,
            }))
            .filter((event) => {
              const endDate = new Date(event.end);
              return isDateValid(endDate) && endDate > currentDateTime;
            });
          setEvents(formattedEvents);
        } catch (err) {
          setError(err.message || "Failed to load events");
        }
      };

      if (user && !authLoading) {
        fetchEvents();
      }
    }, 60000); // Refetch every minute

    return () => clearInterval(interval);
  }, [user, authLoading, currentDateTime]);

  // Clear field-specific errors after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setFieldErrors({
        title: "",
        description: "",
        start: "",
        end: "",
        groupId: "",
      });
    }, 3000);

    return () => clearTimeout(timer);
  }, [fieldErrors]);

  const validateForm = () => {
    const errors = {
      title: "",
      description: "",
      start: "",
      end: "",
      groupId: "",
    };
    let formIsValid = true;

    // Validate Title
    if (!newEvent.title.trim()) {
      errors.title = "Title is required.";
      formIsValid = false;
    }

    // Validate Description
    if (!newEvent.description.trim()) {
      errors.description = "Description is required.";
      formIsValid = false;
    }

    // Validate Start Time (must be after current date and time)
    if (!isDateValid(newEvent.start) || newEvent.start < currentDateTime) {
      errors.start =
        "Start time must be a valid date and after the current date and time.";
      formIsValid = false;
    }

    // Validate End Time (must be after Start Time)
    if (!isDateValid(newEvent.end) || newEvent.end <= newEvent.start) {
      errors.end = "End time must be a valid date and after the start time.";
      formIsValid = false;
    }

    // Validate Group
    if (!newEvent.groupId) {
      errors.groupId = "Please select a group.";
      formIsValid = false;
    }

    setFieldErrors(errors);
    return formIsValid;
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();

    console.log("Creating event with data:", newEvent);
    console.log("Current groups:", groups);

    // Validate form before submission
    if (!validateForm()) {
      console.log("Form validation failed:", fieldErrors);
      return;
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/events`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            title: newEvent.title,
            description: newEvent.description,
            start: newEvent.start,
            end: newEvent.end,
            groupId: newEvent.groupId,
          }),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create event");
      }
      const createdEvent = await response.json();
      const createdEndDate = new Date(createdEvent.end);
      // Only add the event if its end time is in the future
      if (isDateValid(createdEndDate) && createdEndDate > currentDateTime) {
        setEvents([
          ...events,
          {
            ...createdEvent,
            start: new Date(createdEvent.start),
            end: createdEndDate,
            title: `${createdEvent.title} (${
              groups.find((g) => g._id === createdEvent.group.toString())
                ?.name || "Unknown Group"
            })`,
            group: groups.find((g) => g._id === createdEvent.group.toString()),
            creator: { _id: user.id, username: user.username },
          },
        ]);
      }
      setShowModal(false);
      setNewEvent({
        title: "",
        description: "",
        start: currentDateTime,
        end: new Date(currentDateTime.getTime() + 60 * 60 * 1000),
        groupId: groups.length > 0 ? groups[0]._id : "",
      });
    } catch (err) {
      setError(err.message || "Failed to create event");
    }
  };

  const handleDeleteEvent = async () => {
    if (!selectedEvent) return;
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/events/${selectedEvent._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete event");
      }
      setEvents(events.filter((event) => event._id !== selectedEvent._id));
      setSelectedEvent(null);
    } catch (err) {
      setError(err.message || "Failed to delete event");
    }
  };

  const handleSelectSlot = (selectedDate) => {
    // For react-calendar, selectedDate is a Date object
    const adjustedStart = selectedDate < currentDateTime ? currentDateTime : selectedDate;
    const adjustedEnd = new Date(adjustedStart.getTime() + 60 * 60 * 1000);
    setNewEvent((prev) => ({
      ...prev,
      start: adjustedStart,
      end: adjustedEnd,
    }));
    setShowModal(true);
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
  };

  const handleNavigate = (newDate) => {
    setDate(newDate);
  };

  const handleViewChange = (newView) => {
    setView(newView);
  };

  return {
    user,
    authLoading,
    events,
    isLoading,
    error,
    showModal,
    setShowModal,
    newEvent,
    setNewEvent,
    groups,
    selectedEvent,
    setSelectedEvent,
    fieldErrors,
    currentDateTime,
    date,
    view,
    handleCreateEvent,
    handleDeleteEvent,
    handleSelectSlot,
    handleSelectEvent,
    handleNavigate,
    handleViewChange,
  };
};

export default useCalendar;
