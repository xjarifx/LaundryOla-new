// Date utility functions for safe date handling

/**
 * Safely formats a date string/object to a readable format
 * @param {string|Date|null|undefined} dateValue - The date value to format
 * @param {object} options - Formatting options
 * @returns {string} Formatted date string or fallback message
 */
export const formatDate = (dateValue, options = {}) => {
  // Handle null, undefined, empty string
  if (!dateValue || dateValue === "" || dateValue === "null") {
    return options.fallback || "Not available";
  }

  try {
    let date;

    // If it's already a Date object
    if (dateValue instanceof Date) {
      date = dateValue;
    } else {
      // Try to create Date from string/number
      date = new Date(dateValue);
    }

    // Check if date is valid
    if (isNaN(date.getTime())) {
      console.warn("Invalid date value:", dateValue);
      return options.fallback || "Invalid date";
    }

    // Default formatting options
    const defaultOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
      ...options.dateOptions,
    };

    // Format the date
    return date.toLocaleDateString(options.locale || "en-IN", defaultOptions);
  } catch (error) {
    console.error("Date formatting error:", error, "for value:", dateValue);
    return options.fallback || "Invalid date";
  }
};

/**
 * Safely formats a date with time
 * @param {string|Date|null|undefined} dateValue - The date value to format
 * @param {object} options - Formatting options
 * @returns {string} Formatted datetime string or fallback message
 */
export const formatDateTime = (dateValue, options = {}) => {
  if (!dateValue || dateValue === "" || dateValue === "null") {
    return options.fallback || "Not available";
  }

  try {
    let date;

    if (dateValue instanceof Date) {
      date = dateValue;
    } else {
      date = new Date(dateValue);
    }

    if (isNaN(date.getTime())) {
      console.warn("Invalid datetime value:", dateValue);
      return options.fallback || "Invalid date";
    }

    const defaultOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      ...options.dateOptions,
    };

    return date.toLocaleDateString(options.locale || "en-IN", defaultOptions);
  } catch (error) {
    console.error("DateTime formatting error:", error, "for value:", dateValue);
    return options.fallback || "Invalid date";
  }
};

/**
 * Safely formats a date for display in lists/cards
 * @param {string|Date|null|undefined} dateValue - The date value to format
 * @param {string} fallback - Fallback message if date is invalid
 * @returns {string} Formatted date string
 */
export const formatDateShort = (dateValue, fallback = "No date") => {
  return formatDate(dateValue, {
    dateOptions: {
      day: "numeric",
      month: "short",
      year: "numeric",
    },
    fallback,
  });
};

/**
 * Safely formats a date for detailed views
 * @param {string|Date|null|undefined} dateValue - The date value to format
 * @param {string} fallback - Fallback message if date is invalid
 * @returns {string} Formatted date string with time
 */
export const formatDateLong = (dateValue, fallback = "No date available") => {
  return formatDateTime(dateValue, {
    dateOptions: {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    },
    fallback,
  });
};

/**
 * Check if a date value is valid
 * @param {string|Date|null|undefined} dateValue - The date value to check
 * @returns {boolean} True if valid date, false otherwise
 */
export const isValidDate = (dateValue) => {
  if (!dateValue || dateValue === "" || dateValue === "null") {
    return false;
  }

  try {
    const date = new Date(dateValue);
    return !isNaN(date.getTime());
  } catch {
    return false;
  }
};

/**
 * Get relative time (e.g., "2 hours ago", "yesterday")
 * @param {string|Date|null|undefined} dateValue - The date value
 * @param {string} fallback - Fallback message if date is invalid
 * @returns {string} Relative time string
 */
export const getRelativeTime = (dateValue, fallback = "Unknown time") => {
  if (!isValidDate(dateValue)) {
    return fallback;
  }

  try {
    const date = new Date(dateValue);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800)
      return `${Math.floor(diffInSeconds / 86400)} days ago`;

    return formatDateShort(dateValue);
  } catch (error) {
    console.error("Relative time error:", error, "for value:", dateValue);
    return fallback;
  }
};
