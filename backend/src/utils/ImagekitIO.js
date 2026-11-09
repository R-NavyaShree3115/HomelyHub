// ---- where user photos are stored ----
// Images are NOT kept in our database. We send them to
// ImageKit and save only the link they give back.
import ImageKit from "imagekit";
let imagekit;

const getImageKitClient = () => {
  const { IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY, IMAGEKIT_URL_ENDPOINT } = process.env;
  if (!IMAGEKIT_PUBLIC_KEY || !IMAGEKIT_PRIVATE_KEY || !IMAGEKIT_URL_ENDPOINT) {
    const error = new Error("Image upload service is not configured");
    error.code = "IMAGEKIT_NOT_CONFIGURED";
    throw error;
  }

  if (!imagekit) {
    imagekit = new ImageKit({
      publicKey: IMAGEKIT_PUBLIC_KEY,
      privateKey: IMAGEKIT_PRIVATE_KEY,
      urlEndpoint: IMAGEKIT_URL_ENDPOINT,
    });
  }

  return imagekit;
};

export default getImageKitClient;
