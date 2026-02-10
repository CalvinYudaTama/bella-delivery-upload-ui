// Utility functions for downloading files from localStorage

export interface DownloadProgress {
  current: number;
  total: number;
  percentage: number;
  currentFileName: string;
}

export interface DownloadOptions {
  onProgress?: (progress: DownloadProgress) => void;
  onComplete?: () => void;
  onError?: (error: Error) => void;
  delayBetweenFiles?: number; // Delay between downloads in ms
}

/**
 * Download a single file asynchronously
 */
export const downloadFile = async (file: File, delay: number = 100): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      const url = URL.createObjectURL(file);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      a.style.display = 'none';
      
      // Add to DOM temporarily
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        resolve();
      }, delay);
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Download multiple files asynchronously with progress tracking
 */
export const downloadFilesAsync = async (
  files: File[],
  options: DownloadOptions = {}
): Promise<void> => {
  const {
    onProgress,
    onComplete,
    onError,
    delayBetweenFiles = 200
  } = options;

  try {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Update progress
      if (onProgress) {
        onProgress({
          current: i + 1,
          total: files.length,
          percentage: Math.round(((i + 1) / files.length) * 100),
          currentFileName: file.name
        });
      }

      // Download file
      await downloadFile(file, delayBetweenFiles);
    }

    // Complete callback
    if (onComplete) {
      onComplete();
    }
  } catch (error) {
    if (onError) {
      onError(error as Error);
    } else {
      throw error;
    }
  }
};

/**
 * Create and download a ZIP file from multiple files
 * This requires JSZip library to be installed
 */
export const downloadAsZip = async (
  files: File[],
  zipFileName: string = 'uploaded-files.zip',
  options: DownloadOptions = {}
): Promise<void> => {
  const {
    onProgress,
    onComplete,
    onError
  } = options;

  try {
    // Dynamic import of JSZip to avoid bundle size issues
    const JSZip = (await import('jszip')).default;
    const zip = new JSZip();

    // Add files to zip
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Update progress
      if (onProgress) {
        onProgress({
          current: i + 1,
          total: files.length,
          percentage: Math.round(((i + 1) / files.length) * 100),
          currentFileName: file.name
        });
      }

      // Add file to zip (no compression to maintain quality)
      zip.file(file.name, file, { compression: 'STORE' });
    }

    // Generate zip file
    if (onProgress) {
      onProgress({
        current: files.length,
        total: files.length,
        percentage: 100,
        currentFileName: 'Generating ZIP...'
      });
    }

    const zipBlob = await zip.generateAsync({
      type: 'blob',
      compression: 'STORE', // No compression to maintain quality
      compressionOptions: {
        level: 0 // No compression
      }
    });

    // Download the zip file
    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = zipFileName;
    a.style.display = 'none';
    
    document.body.appendChild(a);
    a.click();
    
    // Cleanup
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);

    if (onComplete) {
      onComplete();
    }
  } catch (error) {
    if (onError) {
      onError(error as Error);
    } else {
      throw error;
    }
  }
};

/**
 * Download files from localStorage with progress tracking
 */
export const downloadFromStorage = async (
  storageKey: string,
  options: DownloadOptions = {}
): Promise<void> => {
  try {
    // Load files from localStorage
    const stored = localStorage.getItem(storageKey);
    if (!stored) {
      throw new Error('No files found in storage');
    }

    const storedImages = JSON.parse(stored);
    const files: File[] = [];

    // Convert stored images back to File objects
    for (const storedImage of storedImages) {
      const file = base64ToFile(storedImage.base64, storedImage.name, storedImage.type);
      files.push(file);
    }

    if (files.length === 0) {
      throw new Error('No files to download');
    }

    // Download as ZIP
    await downloadAsZip(files, `project-files-${Date.now()}.zip`, options);
  } catch (error) {
    if (options.onError) {
      options.onError(error as Error);
    } else {
      throw error;
    }
  }
};

/**
 * Download images from URLs and create a ZIP file
 */
export const downloadImagesAsZip = async (
  imageUrls: string[],
  zipFileName: string = 'delivery-images.zip',
  options: DownloadOptions = {}
): Promise<void> => {
  const {
    onProgress,
    onComplete,
    onError
  } = options;

  try {
    if (imageUrls.length === 0) {
      throw new Error('No images to download');
    }

    // Dynamic import of JSZip
    const JSZip = (await import('jszip')).default;
    const zip = new JSZip();

    // Download each image and add to zip
    for (let i = 0; i < imageUrls.length; i++) {
      const imageUrl = imageUrls[i];
      
      // Update progress
      if (onProgress) {
        onProgress({
          current: i + 1,
          total: imageUrls.length,
          percentage: Math.round(((i + 1) / imageUrls.length) * 100),
          currentFileName: `Downloading image ${i + 1}...`
        });
      }

      try {
        // Fetch the image
        const response = await fetch(imageUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch image: ${response.statusText}`);
        }

        const blob = await response.blob();
        
        // Extract filename from URL or generate one
        const urlPath = new URL(imageUrl).pathname;
        const filename = urlPath.split('/').pop() || `image-${i + 1}.jpg`;
        
        // Add to zip
        zip.file(filename, blob);
      } catch (error) {
        console.error(`Failed to download image ${i + 1}:`, error);
        // Continue with other images even if one fails
      }
    }

    // Generate zip file
    if (onProgress) {
      onProgress({
        current: imageUrls.length,
        total: imageUrls.length,
        percentage: 100,
        currentFileName: 'Generating ZIP...'
      });
    }

    const zipBlob = await zip.generateAsync({
      type: 'blob',
      compression: 'STORE', // No compression to maintain quality
      compressionOptions: {
        level: 0
      }
    });

    // Download the zip file
    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = zipFileName;
    a.style.display = 'none';
    
    document.body.appendChild(a);
    a.click();
    
    // Cleanup
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);

    if (onComplete) {
      onComplete();
    }
  } catch (error) {
    if (onError) {
      onError(error as Error);
    } else {
      throw error;
    }
  }
};

/**
 * Convert base64 to File (helper function)
 */
const base64ToFile = (base64: string, filename: string, mimeType: string): File => {
  const arr = base64.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || mimeType;
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
};
