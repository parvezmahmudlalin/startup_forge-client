// NEXT_PUBLIC_SERVER_URL না পেলে ডিফল্ট হিসেবে http://localhost:5000 ব্যবহার করবে
const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

// GET Requests
export const serverFetch = async (path) => {
  try {
    const res = await fetch(`${baseUrl}${path}`, {
      cache: "no-store",
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || data.message || "Something went wrong!");
    }

    return data;
  } catch (error) {
    console.error("serverFetch Error:", error.message);
    throw error;
  }
};

// POST, PUT, PATCH, DELETE Requests
export const serverMutation = async (path, method = "POST", data = null) => {
  try {
    const options = {
      method,
      headers: {
        "Content-Type": "application/json",
      },
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    const res = await fetch(`${baseUrl}${path}`, options);
    const responseData = await res.json();

    if (!res.ok) {
      throw new Error(
        responseData.error || responseData.message || "Failed to process request"
      );
    }

    return responseData;
  } catch (error) {
    console.error("serverMutation Error:", error.message);
    throw error;
  }
};