/**
 * Client-side image compression utility.
 * Uses the browser's Canvas API to resize and compress images
 * that exceed the specified size threshold.
 */

const MAX_SIZE_BYTES = 500 * 1024; // 500KB threshold
const MAX_DIMENSION = 1920; // Max width/height in pixels
const INITIAL_QUALITY = 0.8; // Starting JPEG quality
const MIN_QUALITY = 0.4; // Minimum acceptable quality

/**
 * Compresses an image file if it exceeds 500KB.
 * - Resizes to max 1920px on the longest side (preserving aspect ratio)
 * - Converts to JPEG/WebP with progressive quality reduction
 * - Returns the original file if it's already under 500KB or is not an image
 *
 * @param file - The original File object
 * @returns A promise that resolves to a (possibly compressed) File object
 */
export async function compressImage(file: File): Promise<File> {
  // Skip non-image files (e.g., videos)
  if (!file.type.startsWith("image/")) {
    return file;
  }

  // Skip if already under the size limit
  if (file.size <= MAX_SIZE_BYTES) {
    console.log(`✅ Image already under 500KB (${(file.size / 1024).toFixed(1)}KB), skipping compression.`);
    return file;
  }

  console.log(`🔄 Compressing image: ${file.name} (${(file.size / 1024).toFixed(1)}KB)...`);

  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      // Calculate new dimensions (maintain aspect ratio)
      let { width, height } = img;

      if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
        if (width > height) {
          height = Math.round((height / width) * MAX_DIMENSION);
          width = MAX_DIMENSION;
        } else {
          width = Math.round((width / height) * MAX_DIMENSION);
          height = MAX_DIMENSION;
        }
      }

      // Draw to canvas
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Failed to get canvas context"));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);

      // Try progressive quality reduction until under threshold
      const tryCompress = (quality: number) => {
        // Use WebP if supported, fallback to JPEG
        const outputType = "image/webp";

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Canvas compression failed"));
              return;
            }

            if (blob.size <= MAX_SIZE_BYTES || quality <= MIN_QUALITY) {
              // Generate filename with new extension
              const baseName = file.name.replace(/\.[^.]+$/, "");
              const ext = outputType === "image/webp" ? "webp" : "jpg";
              const compressedFile = new File([blob], `${baseName}.${ext}`, {
                type: outputType,
                lastModified: Date.now(),
              });

              const savings = ((1 - compressedFile.size / file.size) * 100).toFixed(1);
              console.log(
                `✅ Compressed: ${(file.size / 1024).toFixed(1)}KB → ${(compressedFile.size / 1024).toFixed(1)}KB (${savings}% saved, quality: ${quality.toFixed(2)})`
              );

              resolve(compressedFile);
            } else {
              // Try with lower quality
              tryCompress(quality - 0.1);
            }
          },
          outputType,
          quality
        );
      };

      tryCompress(INITIAL_QUALITY);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      // If we can't load the image, return the original
      console.warn("⚠️ Could not load image for compression, using original.");
      resolve(file);
    };

    img.src = url;
  });
}
