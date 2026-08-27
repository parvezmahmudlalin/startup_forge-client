// src/lib/api.js

// NEXT_PUBLIC_SERVER_URL না থাকলে default হিসেবে localhost:5000 ব্যবহার করবে
const baseUrl =
  process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

// =====================================================
// GET REQUEST
// =====================================================
export const serverFetch = async (path, options = {}) => {
  try {
    const res = await fetch(`${baseUrl}${path}`, {
      cache: "no-store",
      ...options,
    });

    const contentType = res.headers.get("content-type");

    let data;

    if (contentType?.includes("application/json")) {
      data = await res.json();
    } else {
      data = await res.text();
    }

    if (!res.ok) {
      throw new Error(
        data?.error ||
          data?.message ||
          `Request failed with status ${res.status}`
      );
    }

    return data;
  } catch (error) {
    console.error("serverFetch Error:", error.message);
    throw error;
  }
};

// =====================================================
// POST / PUT / PATCH / DELETE REQUEST
// =====================================================
export const serverMutation = async (
  path,
  method = "POST",
  data = null,
  customHeaders = {}
) => {
  try {
    const options = {
      method,
      headers: {
        "Content-Type": "application/json",
        ...customHeaders,
      },
    };

    if (data !== null && data !== undefined) {
      options.body = JSON.stringify(data);
    }

    const res = await fetch(`${baseUrl}${path}`, options);

    const contentType = res.headers.get("content-type");

    let responseData;

    if (contentType?.includes("application/json")) {
      responseData = await res.json();
    } else {
      responseData = await res.text();
    }

    if (!res.ok) {
      throw new Error(
        responseData?.error ||
          responseData?.message ||
          `Request failed with status ${res.status}`
      );
    }

    return responseData;
  } catch (error) {
    console.error("serverMutation Error:", error.message);
    throw error;
  }
};

// =====================================================
// IMGBB IMAGE UPLOADER
// =====================================================
export const imageUploader = async (imageFile) => {
  try {
    if (!imageFile) {
      throw new Error("Please select an image.");
    }

    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

    if (!apiKey) {
      throw new Error(
        "ImgBB API key is missing. Check NEXT_PUBLIC_IMGBB_API_KEY in .env"
      );
    }

    const formData = new FormData();

    formData.append("key", apiKey);
    formData.append("image", imageFile);

    const res = await fetch("https://api.imgbb.com/1/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(
        data?.error?.message || "Image upload failed"
      );
    }

    return data.data.url;
  } catch (error) {
    console.error("imageUploader Error:", error.message);
    throw error;
  }
};