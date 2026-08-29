const baseUrl = (
  process.env.NEXT_PUBLIC_SERVER_URL ||
  "http://localhost:5000"
).replace(/\/$/, "");

// =====================================================
// GET
// =====================================================

export const serverFetch = async (
  path,
  options = {}
) => {
  try {
    const res = await fetch(
      `${baseUrl}${path}`,
      {
        cache: "no-store",
        ...options,
      }
    );

    const contentType =
      res.headers.get("content-type");

    let data;

    if (
      contentType?.includes(
        "application/json"
      )
    ) {
      data = await res.json();
    } else {
      data = await res.text();
    }

    if (!res.ok) {
      const errorMessage =
        typeof data === "object"
          ? data?.message || data?.error
          : data;

      return {
        error: true,
        message:
          errorMessage ||
          `Request failed with status ${res.status}`,
      };
    }

    return data;
  } catch (error) {
    console.error(
      "serverFetch Error:",
      error
    );

    return {
      error: true,
      message: error.message || "Something went wrong",
    };
  }
};

// =====================================================
// POST / PUT / PATCH / DELETE
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

    if (
      data !== null &&
      data !== undefined
    ) {
      options.body = JSON.stringify(data);
    }

    const res = await fetch(
      `${baseUrl}${path}`,
      options
    );

    const contentType =
      res.headers.get("content-type");

    let responseData;

    if (
      contentType?.includes(
        "application/json"
      )
    ) {
      responseData = await res.json();
    } else {
      responseData = await res.text();
    }

    if (!res.ok) {
      const errorMessage =
        typeof responseData === "object"
          ? responseData?.message || responseData?.error
          : responseData;

      // throw new Error না করে error অবজেক্ট পাঠালে Next.js Overlay আসবে না
      return {
        error: true,
        message:
          errorMessage ||
          `Request failed with status ${res.status}`,
      };
    }

    return responseData;
  } catch (error) {
    console.error(
      "serverMutation Error:",
      error
    );

    return {
      error: true,
      message: error.message || "Something went wrong",
    };
  }
};

// =====================================================
// IMGBB
// =====================================================

export const imageUploader = async (
  imageFile
) => {
  if (!imageFile) {
    throw new Error(
      "Please select an image."
    );
  }

  const apiKey =
    process.env
      .NEXT_PUBLIC_IMGBB_API_KEY;

  if (!apiKey) {
    throw new Error(
      "ImgBB API key is missing."
    );
  }

  const formData = new FormData();

  formData.append(
    "key",
    apiKey
  );

  formData.append(
    "image",
    imageFile
  );

  const res = await fetch(
    "https://api.imgbb.com/1/upload",
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(
      data?.error?.message ||
        "Image upload failed."
    );
  }

  return data.data.url;
};