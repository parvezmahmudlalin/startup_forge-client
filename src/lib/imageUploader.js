// lib/imageUploader.js

export const imageUploader = async (imageFile) => {
  if (!imageFile) return null;

  const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
  if (!apiKey) {
    throw new Error("ImgBB API Key is missing in environment variables.");
  }

  const formData = new FormData();
  formData.append("image", imageFile);

  const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
    method: "POST",
    body: formData,
  });

  const data = await res.json();

  if (!data.success) {
    throw new Error(data.error?.message || "Failed to upload image to ImgBB.");
  }

  // ImgBB response object-এর ভেতর থেকে Direct Link / Display URL রিটার্ন করা
  return data.data.url;
};