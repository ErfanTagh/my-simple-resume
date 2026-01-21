/**
 * Image compression and optimization utilities
 */

interface CompressImageOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  maxSizeKB?: number;
}

/**
 * Compress and resize an image file
 * @param file - The image file to compress
 * @param options - Compression options
 * @returns Promise resolving to base64 string of compressed image
 */
export async function compressImage(
  file: File,
  options: CompressImageOptions = {}
): Promise<string> {
  const {
    maxWidth = 400, // Profile photos don't need to be huge
    maxHeight = 400,
    quality = 0.85, // Good balance between quality and size
    maxSizeKB = 200, // Target max size in KB
  } = options;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      
      img.onload = () => {
        // Calculate new dimensions while maintaining aspect ratio
        let width = img.width;
        let height = img.height;
        
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = width * ratio;
          height = height * ratio;
        }
        
        // Create canvas and draw resized image
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }
        
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to base64 with compression
        const compressRecursive = (currentQuality: number): void => {
          const base64 = canvas.toDataURL('image/jpeg', currentQuality);
          const sizeKB = (base64.length * 3) / 4 / 1024; // Approximate size in KB
          
          // If size is acceptable or quality is too low, return
          if (sizeKB <= maxSizeKB || currentQuality <= 0.5) {
            resolve(base64);
          } else {
            // Reduce quality and try again
            compressRecursive(currentQuality - 0.1);
          }
        };
        
        compressRecursive(quality);
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
      
      img.src = e.target?.result as string;
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsDataURL(file);
  });
}

/**
 * Get optimized image dimensions for profile photos
 */
export function getOptimizedProfileImageSize() {
  return {
    width: 400,
    height: 400,
    quality: 0.85,
  };
}

