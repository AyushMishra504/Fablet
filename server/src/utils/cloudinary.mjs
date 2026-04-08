import { v2 as cloudinary } from "cloudinary";
import multer from "multer";

let configured = false;

function ensureConfig() {
  if (!configured) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    configured = true;
    console.log("Cloudinary configured for cloud:", process.env.CLOUDINARY_CLOUD_NAME);
  }
}

// Multer stores file in memory buffer (no local disk needed)
const storage = multer.memoryStorage();
export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"), false);
    }
  },
});

// Upload buffer to Cloudinary
export const uploadToCloudinary = (fileBuffer, folder = "fablet-covers") => {
  ensureConfig();
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
        transformation: [
          { width: 800, height: 1200, crop: "limit", quality: "auto" },
        ],
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    stream.end(fileBuffer);
  });
};

// Delete image from Cloudinary by public_id
export const deleteFromCloudinary = async (publicId) => {
  if (!publicId) return;
  ensureConfig();
  return cloudinary.uploader.destroy(publicId);
};

export default cloudinary;
