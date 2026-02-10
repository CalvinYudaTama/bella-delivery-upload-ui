'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useProjectContext } from '../Upload/context/ProjectContext';
import { useCollection } from '@/contexts/CollectionContext';
import { HomepageFilterService } from '@/services/homepageFilterService';

const SubmitButton: React.FC = () => {
  const { state, setLoading, setUploadProgress } = useProjectContext();
  const { items: collectionItems, clearCollection } = useCollection();
  const router = useRouter();
  
  // State for upload validation
  const [uploadValidation, setUploadValidation] = useState<{
    isValid: boolean;
    totalRequired: number;
    totalUploaded: number;
    message: string;
  }>({
    isValid: true,
    totalRequired: 0,
    totalUploaded: 0,
    message: ''
  });
  
  
  // Validate upload count against project requirements
  useEffect(() => {
    const validateUploadCount = async () => {
      const projectId = localStorage.getItem('currentProjectId');
      
      if (!projectId) {
        setUploadValidation({
          isValid: true,
          totalRequired: 0,
          totalUploaded: state.uploadedImages.length,
          message: ''
        });
        return;
      }
      
      try {
        // Fetch project requirements
        const response = await fetch(`/api/projects/${projectId}`);
        const data = await response.json();
        const serviceStats = data.service_stats || [];
        
        // Calculate total required uploads
        const totalRequired = serviceStats.reduce((sum: number, service: {
          total_jobs: number;
        }) => sum + service.total_jobs, 0);
        
        const totalUploaded = state.uploadedImages.length;
        
        // Validate
        if (totalUploaded < totalRequired) {
          setUploadValidation({
            isValid: false,
            totalRequired,
            totalUploaded,
            message: `Please upload ${totalRequired - totalUploaded} more photo(s). You have uploaded ${totalUploaded} out of ${totalRequired} required.`
          });
        } else if (totalUploaded > totalRequired) {
          setUploadValidation({
            isValid: false,
            totalRequired,
            totalUploaded,
            message: `You have uploaded ${totalUploaded - totalRequired} too many photo(s). Please remove ${totalUploaded - totalRequired} photo(s). Required: ${totalRequired}.`
          });
        } else {
          setUploadValidation({
            isValid: true,
            totalRequired,
            totalUploaded,
            message: ''
          });
        }
      } catch (error) {
        console.error('Failed to validate upload count:', error);
        // On error, allow submission
        setUploadValidation({
          isValid: true,
          totalRequired: 0,
          totalUploaded: state.uploadedImages.length,
          message: ''
        });
      }
    };
    
    validateUploadCount();
  }, [state.uploadedImages]);

  // Save wishlist to database
  const saveWishlistToDatabase = async (projectId: string, skus: string[]) => {
    try {
      const response = await fetch(`/api/projects/${projectId}/wishlist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skus })
      });
      
      if (response.ok) {
        console.log(' Wishlist API: Success');
        return true;
      } else {
        console.error(' Wishlist API: Failed');
        return false;
      }
    } catch {
      console.error(' Wishlist API: Error');
      return false;
    }
  };
  
  const handleSubmitProject = async () => {
    // Immediately set loading state to show page-level animation
    setLoading(true);
    
    try {
      console.log('Starting project submission...', {
        stylesCount: collectionItems.length,
        comment: state.comment,
        hasComment: !!state.comment
      });
      
      // Get projectId from localStorage
      const projectId = localStorage.getItem('currentProjectId');
      
      if (!projectId) {
        console.error('No projectId found. Cannot upload to GCS.');
        alert('Error: No project ID found. Please contact support.');
        setLoading(false);
        return;
      }
      
      // Start upload and wait for completion
      await (async () => {
        try {
          // Get projectId from localStorage
          const projectId = localStorage.getItem('currentProjectId');
          
          if (!projectId) {
            console.error(' No projectId found. Cannot upload to GCS.');
            // console.error('localStorage contents:', {
            //   currentProjectId: localStorage.getItem('currentProjectId'),
            //   currentOrderId: localStorage.getItem('currentOrderId'),
            //   allKeys: Object.keys(localStorage)
            // });
            alert('Error: No project ID found. Please contact support.');
            return;
          }
          
          console.log(' Using projectId for upload:', projectId);

          // 1. Get project service stats to determine which service to use
          const projectResponse = await fetch(`/api/projects/${projectId}`);
          const projectDetails = await projectResponse.json();
          const serviceStats = projectDetails.service_stats || [];
          
          console.log('Service stats:', serviceStats);
          
          // 2. Upload images to GCS (using resumable upload with parallel processing)
          // Upload files from UploadPhotos component to original_photo folder
          if (state.uploadedImages.length > 0) {
            console.log(`Uploading ${state.uploadedImages.length} images from UploadPhotos to GCS (parallel)...`);
            
            const failedFiles: Array<{ name: string; reason: string }> = [];
            const uploadedRecords: Array<{ file: File; photoId: string; jobId: string }> = [];
            
            // Pre-validate all files before uploading
            for (const file of state.uploadedImages) {
              if (file.size > 100 * 1024 * 1024) {
                failedFiles.push({ 
                  name: file.name, 
                  reason: 'File size exceeds 100MB limit' 
                });
              }
            }
            
            // If any validation failed, log but continue background processing
            if (failedFiles.length > 0) {
              console.error('Pre-validation failed for some files:', failedFiles);
              // Continue with upload anyway - background processing will handle failures
            }
            
            // Upload all files in parallel (background processing)
            if (failedFiles.length === 0) {
              // Calculate total files for progress tracking
              const totalFiles = state.uploadedImages.length;
              let completedFiles = 0;
              
              // Update progress helper
              const updateProgress = (fileIndex: number, fileProgress: number, fileSize: number) => {
                // Calculate progress for this specific file (0-1)
                const filePercent = fileProgress / fileSize;
                // Calculate overall progress across all files
                // Each file contributes 1/totalFiles, current file contributes filePercent/totalFiles
                const overallProgress = ((completedFiles + filePercent) / totalFiles) * 100;
                setUploadProgress(Math.min(100, Math.max(0, overallProgress)));
              };
              
              // Helper function to upload a single file with resumable upload support
              const uploadSingleFile = async (
                file: File,
                availableService: { service_id: string; service_name: string; remaining: number; uploaded_count: number },
                fileIndex: number
              ): Promise<{ success: boolean; file?: File; photoId?: string; jobId?: string; error?: string }> => {
                try {
                  console.log(`[Parallel] Uploading: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`);
                  
                  // Check for existing upload progress
                  const progressKey = `upload_progress_${projectId}_${file.name}_${file.size}`;
                  const savedProgress = localStorage.getItem(progressKey);
                  let resumableUrl: string | null = null;
                  let uploadedBytes = 0;
                  let instruction: {
                    uploadUrl: string;
                    publicUrl: string;
                    objectPath: string;
                    contentType?: string;
                  } | null = null;
                  
                  if (savedProgress) {
                    try {
                      const progress = JSON.parse(savedProgress);
                      // Check if progress is less than 7 days old (resumable URL expiry)
                      const progressAge = Date.now() - (progress.timestamp || 0);
                      const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
                      
                      if (progressAge < maxAge && progress.fileSize === file.size) {
                        resumableUrl = progress.resumableUrl;
                        uploadedBytes = progress.uploadedBytes || 0;
                        instruction = progress.instruction;
                        console.log(`[Resume] Found saved progress for ${file.name}: ${uploadedBytes}/${file.size} bytes`);
                      } else {
                        console.log(`[Resume] Saved progress for ${file.name} expired or file size changed, starting fresh`);
                        localStorage.removeItem(progressKey);
                      }
                    } catch (e) {
                      console.warn(`[Resume] Failed to parse saved progress for ${file.name}`, e);
                      localStorage.removeItem(progressKey);
                    }
                  }
                  
                  // If we don't have a resumable URL, get presigned URL and initialize resumable upload
                  if (!resumableUrl) {
                  const uploadResponse = await fetch(`/api/projects/${projectId}/upload`, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      files: [{
                        fileName: file.name,
                        contentType: file.type || 'application/octet-stream',
                      }],
                      serviceId: availableService.service_id,
                    }),
                  });

                  const presignedResult = await uploadResponse.json();
                  
                  if (!presignedResult.success || !presignedResult.uploadInstructions || presignedResult.uploadInstructions.length === 0) {
                    const errorReason = presignedResult.details || presignedResult.error || 'Failed to get presigned URL';
                      return {
                        success: false,
                        error: errorReason
                      };
                    }

                    instruction = presignedResult.uploadInstructions[0];
                    
                    // Check instruction is valid
                    if (!instruction) {
                      return {
                        success: false,
                        error: 'Failed to get upload instruction'
                      };
                    }
                    
                    // Initialize resumable upload
                    console.log(`[Resume] Step 1: Initializing resumable upload for ${file.name}...`);
                    const initResponse = await fetch(instruction.uploadUrl, {
                      method: 'POST',
                      headers: {
                        'x-goog-resumable': 'start',       
                        'x-upload-content-type': file.type, 
                      },
                    });

                    if (!initResponse.ok) {
                      const errorText = await initResponse.text();
                      console.error(`[Resume] Resumable init failed for ${file.name}:`, initResponse.status, errorText);
                      return {
                        success: false,
                        error: `Resumable init failed: ${initResponse.status}`
                      };
                    }

                    resumableUrl = initResponse.headers.get('location');
                    if (!resumableUrl) {
                      return {
                        success: false,
                        error: 'No location header in resumable init response'
                      };
                    }
                    
                    // Save initial progress (instruction is guaranteed to be non-null here)
                    if (instruction) {
                      localStorage.setItem(progressKey, JSON.stringify({
                        resumableUrl,
                        uploadedBytes: 0,
                        fileSize: file.size,
                        instruction,
                        timestamp: Date.now()
                      }));
                    }
                  } else {
                    // Verify resumable URL is still valid by checking upload status
                    try {
                      const statusResponse = await fetch(resumableUrl, {
                        method: 'PUT',
                        headers: {
                          'Content-Range': `bytes */${file.size}`
                        }
                      });
                      
                      if (statusResponse.status === 308) {
                        // Resumable upload in progress, get current uploaded bytes from Range header
                        const rangeHeader = statusResponse.headers.get('Range');
                        if (rangeHeader) {
                          const match = rangeHeader.match(/bytes=0-(\d+)/);
                          if (match) {
                            uploadedBytes = parseInt(match[1], 10) + 1;
                            console.log(`[Resume] Resuming upload for ${file.name} from byte ${uploadedBytes}`);
                          }
                        }
                      } else if (statusResponse.status === 200 || statusResponse.status === 201) {
                        // Upload already completed
                        console.log(`[Resume] Upload for ${file.name} already completed`);
                        uploadedBytes = file.size;
                      } else {
                        // URL expired or invalid, start fresh
                        console.warn(`[Resume] Resumable URL for ${file.name} expired, starting fresh`);
                        localStorage.removeItem(progressKey);
                        resumableUrl = null;
                        uploadedBytes = 0;
                        // Will retry initialization below
                      }
                  } catch (e) {
                      console.warn(`[Resume] Failed to check upload status for ${file.name}, starting fresh`, e);
                      localStorage.removeItem(progressKey);
                      resumableUrl = null;
                      uploadedBytes = 0;
                    }
                  }
                  
                  // If we still don't have a valid resumable URL, retry initialization
                  if (!resumableUrl && uploadedBytes === 0) {
                    // Retry getting presigned URL and initializing
                    const uploadResponse = await fetch(`/api/projects/${projectId}/upload`, {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        files: [{
                          fileName: file.name,
                          contentType: file.type || 'application/octet-stream',
                        }],
                        serviceId: availableService.service_id,
                      }),
                    });

                    const presignedResult = await uploadResponse.json();
                    
                    if (!presignedResult.success || !presignedResult.uploadInstructions || presignedResult.uploadInstructions.length === 0) {
                      return {
                        success: false,
                        error: 'Failed to get presigned URL on retry'
                      };
                    }

                    instruction = presignedResult.uploadInstructions[0];
                    
                    if (!instruction) {
                      return {
                        success: false,
                        error: 'Failed to get upload instruction on retry'
                      };
                    }

                    const initResponse = await fetch(instruction.uploadUrl, {
                      method: 'POST',
                      headers: {
                        'x-goog-resumable': 'start',       
                        'x-upload-content-type': file.type, 
                      },
                    });

                    if (!initResponse.ok) {
                      return {
                        success: false,
                        error: 'Resumable init failed on retry'
                      };
                    }

                    resumableUrl = initResponse.headers.get('location');
                    if (!resumableUrl) {
                      return {
                        success: false,
                        error: 'No location header in resumable init response on retry'
                      };
                    }
                    
                    // Save new progress (instruction is guaranteed to be non-null here)
                    localStorage.setItem(progressKey, JSON.stringify({
                      resumableUrl,
                      uploadedBytes: 0,
                      fileSize: file.size,
                      instruction,
                      timestamp: Date.now()
                    }));
                  }
                  
                  // Upload file (full or resume from byte)
                  console.log(`[Resume] Step 2: Uploading ${file.name} to resumable URL (${uploadedBytes > 0 ? `resuming from byte ${uploadedBytes}` : 'fresh upload'})...`);
                  
                  await new Promise<void>((resolve, reject) => {
                      const xhr = new XMLHttpRequest();
                    
                    // Track upload progress for error handling
                    let lastLoadedBytes = 0;
                      
                      xhr.upload.onprogress = (e) => {
                        if (e.lengthComputable) {
                        lastLoadedBytes = e.loaded; // Track last loaded bytes
                        const totalUploaded = uploadedBytes + e.loaded;
                        const percent = ((totalUploaded / file.size) * 100).toFixed(0);
                        console.log(`[Resume] ${file.name}: ${percent}% (${totalUploaded}/${file.size} bytes)`);
                        
                        // Update overall upload progress
                        updateProgress(fileIndex, totalUploaded, file.size);
                        
                        // Save progress every 5% or every 1MB
                        if (e.loaded % (1024 * 1024) === 0 || parseInt(percent) % 5 === 0) {
                          try {
                            localStorage.setItem(progressKey, JSON.stringify({
                              resumableUrl,
                              uploadedBytes: totalUploaded,
                              fileSize: file.size,
                              instruction,
                              timestamp: Date.now()
                            }));
                          } catch (e) {
                            console.warn(`[Resume] Failed to save progress for ${file.name}`, e);
                          }
                        }
                        }
                      };

                    xhr.onload = () => {
                      if (xhr.status === 200 || xhr.status === 201) {
                        console.log(`[Resume] ${file.name}: GCS upload complete`);
                        // Update progress to 100% for this file
                        updateProgress(fileIndex, file.size, file.size);
                        completedFiles++;
                        // Clear saved progress on success
                        localStorage.removeItem(progressKey);
                        resolve();
                      } else {
                        console.error(`[Resume] ${file.name}: GCS upload failed (${xhr.status})`);
                        console.error('Response:', xhr.responseText);
                        
                        // Save current progress before failing (use lastLoadedBytes from progress event)
                        try {
                          const currentProgress = uploadedBytes + lastLoadedBytes;
                          localStorage.setItem(progressKey, JSON.stringify({
                            resumableUrl,
                            uploadedBytes: currentProgress,
                            fileSize: file.size,
                            instruction,
                            timestamp: Date.now()
                          }));
                        } catch (e) {
                          console.warn(`[Resume] Failed to save progress on error for ${file.name}`, e);
                        }
                        
                          reject(new Error(`GCS upload failed: ${xhr.status}`));
                        }
                      };

                      xhr.onerror = () => {
                      console.error(`[Resume] Network error during upload for ${file.name}`);
                      
                      // Save current progress on network error (use lastLoadedBytes from progress event)
                      try {
                        const currentProgress = uploadedBytes + lastLoadedBytes;
                        localStorage.setItem(progressKey, JSON.stringify({
                          resumableUrl,
                          uploadedBytes: currentProgress,
                          fileSize: file.size,
                          instruction,
                          timestamp: Date.now()
                        }));
                      } catch (e) {
                        console.warn(`[Resume] Failed to save progress on network error for ${file.name}`, e);
                      }
                      
                        reject(new Error('Network error during upload'));
                      };

                    // PUT to resumable URL
                    xhr.open('PUT', resumableUrl!);
                    
                    // If resuming, set Content-Range header
                    if (uploadedBytes > 0) {
                      xhr.setRequestHeader('Content-Range', `bytes ${uploadedBytes}-${file.size - 1}/${file.size}`);
                      // Send only the remaining part of the file
                      xhr.send(file.slice(uploadedBytes));
                    } else {
                      xhr.send(file);
                    }
                    });

                    // After successful GCS upload, confirm with backend
                  if (!instruction) {
                    return {
                      success: false,
                      error: 'Missing upload instruction'
                    };
                  }
                  
                  console.log(`[Resume] Confirming upload for ${file.name}...`);
                    const confirmResponse = await fetch(`/api/projects/${projectId}/upload`, {
                      method: 'PUT',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        uploads: [{
                          fileName: file.name,
                          publicUrl: instruction.publicUrl,
                          objectPath: instruction.objectPath,
                          contentType: file.type || 'application/octet-stream',
                        }],
                        serviceId: availableService.service_id,
                      }),
                    });

                    const confirmResult = await confirmResponse.json();
                    
                    if (confirmResult.success && confirmResult.photos && confirmResult.photos.length > 0) {
                      const photo = confirmResult.photos[0];
                    // Clear saved progress on successful confirmation
                    localStorage.removeItem(progressKey);
                    
                    return {
                      success: true,
                        file,
                        photoId: photo.photo_id,
                      jobId: photo.job_id
                    };
                    } else {
                    return {
                      success: false,
                      error: confirmResult.error || 'Failed to confirm upload'
                    };
                  }
                } catch (uploadError: unknown) {
                  console.error(`[Parallel] Upload exception for ${file.name}:`, uploadError);
                  const errorReason = uploadError instanceof Error ? uploadError.message : 'Network error';
                  return {
                    success: false,
                    error: errorReason
                  };
                }
              };
              
              // Upload all files in parallel using Promise.allSettled
              const validFiles = state.uploadedImages.filter(file => 
                !failedFiles.some(f => f.name === file.name)
              );
              
              const uploadPromises = validFiles.map(async (file, fileIndex) => {
                // Find first service with remaining slots
                const availableService = serviceStats.find((s: { 
                  service_id: string; 
                  service_name: string; 
                  remaining: number;
                  uploaded_count: number;
                }) => s.remaining > 0);
                
                if (!availableService) {
                  return {
                    success: false as const,
                    error: 'No available service slots'
                  };
                }
                
                console.log(`[Parallel] Using service: ${availableService.service_name} for ${file.name}`);
                return uploadSingleFile(file, availableService, fileIndex);
              });
              
              // Wait for all uploads to complete (parallel)
              const uploadResults = await Promise.allSettled(uploadPromises);
              
              // Process results
              uploadResults.forEach((result, index) => {
                const file = validFiles[index];
                if (result.status === 'fulfilled') {
                  const uploadResult = result.value;
                  if (uploadResult.success && uploadResult.photoId && uploadResult.jobId) {
                    uploadedRecords.push({
                      file,
                      photoId: uploadResult.photoId,
                      jobId: uploadResult.jobId,
                    });
                    console.log(`[Parallel] Upload confirmed: ${file.name} (photoId=${uploadResult.photoId})`);
                  } else {
                  failedFiles.push({ 
                    name: file.name, 
                      reason: uploadResult.error || 'Upload failed'
                    });
                    console.error(`[Parallel] Failed to upload ${file.name}:`, uploadResult.error);
                  }
                } else {
                  failedFiles.push({
                    name: file.name,
                    reason: result.reason?.toString() || 'Upload promise rejected'
                  });
                  console.error(`[Parallel] Upload promise rejected for ${file.name}:`, result.reason);
                }
              });
              
              // If any upload failed, clean up successful uploads
              if (failedFiles.length > 0 && uploadedRecords.length > 0) {
                console.log(` Upload failed with ${failedFiles.length} errors, cleaning up ${uploadedRecords.length} successfully uploaded files...`);
                console.log('Uploaded records to clean:', uploadedRecords.map(r => ({ 
                  name: r.file.name, 
                  photoId: r.photoId, 
                  jobId: r.jobId 
                })));
                
                // Delete all successfully uploaded files
                for (const record of uploadedRecords) {
                  try {
                    console.log(`Deleting ${record.file.name} (photoId: ${record.photoId}, jobId: ${record.jobId})...`);
                    const deleteResponse = await fetch(`/api/projects/${projectId}/upload`, {
                      method: 'DELETE',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        photoId: record.photoId,
                        jobId: record.jobId
                      }),
                    });
                    
                    const deleteResult = await deleteResponse.json();
                    
                    if (deleteResult.success) {
                      console.log(` Cleaned up: ${record.file.name}`);
                    } else {
                      console.error(` Failed to clean up ${record.file.name}:`, deleteResult.error);
                    }
                  } catch (deleteError) {
                    console.error(` Failed to clean up ${record.file.name}:`, deleteError);
                  }
                }
                console.log(`Cleanup complete for ${uploadedRecords.length} files`);
              } else if (failedFiles.length > 0) {
                console.log(` Upload failed but no files to clean up (uploadedRecords.length = ${uploadedRecords.length})`);
              }
              
              console.log(`Upload summary: ${uploadedRecords.length} succeeded, ${failedFiles.length} failed out of ${state.uploadedImages.length} total`);
              
              // Log failed files but continue background processing
              if (failedFiles.length > 0) {
                console.error('Some files failed to upload:', failedFiles);
                // Continue with remaining processing in background
              }
              // Note: mark-ready API removed - no longer needed with direct GCS upload
            }
          }
          
          // 3. Upload comments and attachments (background processing)
          if (state.comment || state.uploadedAttachments.length > 0) {
            console.log('Uploading comments and attachments...', {
              contentType: state.contentType,
              hasComment: !!state.comment,
              hasFiles: state.uploadedAttachments.length > 0,
              files: state.uploadedAttachments.map(f => f.name)
            });
            
            const failedCommentFiles: Array<{ name: string; reason: string }> = [];
            const uploadedAttachmentRecords: Array<{ file: File; publicUrl: string; objectPath: string }> = [];
            
            // If there are files, upload them to GCS first (client-side, same as uploadphoto)
            if (state.uploadedAttachments.length > 0) {
              try {
                // Step 1: Get presigned URLs for all attachment files
                const presignedResponse = await fetch('/api/gcp/generate-presigned-url', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    files: state.uploadedAttachments.map(file => ({
                      fileName: file.name,
                      contentType: file.type || 'application/octet-stream',
                    })),
                    projectId,
                    folder: 'external_upload', // Store comment attachments in external_upload folder
                  }),
                });

                if (!presignedResponse.ok) {
                  const errorText = await presignedResponse.text();
                  let errorReason = 'Unknown error';
                  try {
                    const errorJson = JSON.parse(errorText);
                    errorReason = errorJson.error || errorText;
                  } catch {
                    errorReason = errorText || `HTTP ${presignedResponse.status}`;
                  }
                  
                  state.uploadedAttachments.forEach(file => {
                  failedCommentFiles.push({ 
                    name: file.name, 
                      reason: `Failed to get presigned URL: ${errorReason}` 
                    });
                  });
                  console.error('Failed to get presigned URLs for attachments:', errorReason);
                } else {
                  const presignedResult = await presignedResponse.json();
                  
                  if (!presignedResult.urls || presignedResult.urls.length !== state.uploadedAttachments.length) {
                    const errorReason = 'Mismatch between files and presigned URLs';
                    state.uploadedAttachments.forEach(file => {
                      failedCommentFiles.push({ 
                        name: file.name, 
                        reason: errorReason 
                      });
                    });
                    console.error('Presigned URL mismatch:', {
                      files: state.uploadedAttachments.length,
                      urls: presignedResult.urls?.length || 0
                    });
                  } else {
                    // Step 2: Upload each file to GCS (client-side, same as uploadphoto)
                    for (let i = 0; i < state.uploadedAttachments.length; i++) {
                      const file = state.uploadedAttachments[i];
                      const instruction = presignedResult.urls[i];
                      
                      try {
                        console.log(`Uploading attachment ${file.name} to GCS...`);
                        
                        // Debug: Parse and log URL details
                        try {
                          const urlObj = new URL(instruction.uploadUrl);
                          console.log('\nAttachment Upload URL Details:');
                          console.log('   X-Goog-Date:', urlObj.searchParams.get('X-Goog-Date'));
                          console.log('   X-Goog-Algorithm:', urlObj.searchParams.get('X-Goog-Algorithm'));
                          console.log('   X-Goog-SignedHeaders:', urlObj.searchParams.get('X-Goog-SignedHeaders'));
                          console.log('   File type:', file.type);
                          console.log('   File size:', file.size);
                        } catch (e) {
                          console.error('Failed to parse URL:', e);
                        }

                        // Resumable Upload: Two-step process (same as uploadphoto)
                        // Step 1: Initialize resumable upload
                        console.log('   Step 1: Initializing resumable upload...');
                        const initResponse = await fetch(instruction.uploadUrl, {
                          method: 'POST',
                          headers: {
                            'x-goog-resumable': 'start',       
                            'x-upload-content-type': file.type, 
                          },
                        });

                        if (!initResponse.ok) {
                          const errorText = await initResponse.text();
                          console.error('   Resumable init failed:', initResponse.status, errorText);
                          throw new Error(`Resumable init failed: ${initResponse.status}`);
                        }

                        // Step 2: Get the temporary location URL from GCS
                        const resumableUrl = initResponse.headers.get('location');
                        if (!resumableUrl) {
                          throw new Error('No location header in resumable init response');
                        }

                        console.log('   Step 2: Uploading to resumable URL...');
                        console.log('   Resumable URL (first 80 chars):', resumableUrl.substring(0, 80));

                        // Step 3: Upload file to the temporary location URL
                        // This PUT doesn't need any special headers or signatures!
                        await new Promise((resolve, reject) => {
                          const xhr = new XMLHttpRequest();
                          
                          xhr.upload.onprogress = (e) => {
                            if (e.lengthComputable) {
                              const percent = (e.loaded / e.total) * 100;
                              console.log(`   ${file.name}: ${percent.toFixed(0)}%`);
                            }
                          };

                          xhr.onload = () => {
                            if (xhr.status === 200) {
                              console.log(`   ${file.name}: GCS upload complete`);
                              resolve(null);
                            } else {
                              console.error(`   ${file.name}: GCS upload failed (${xhr.status})`);
                              console.error('   Response:', xhr.responseText);
                              reject(new Error(`GCS upload failed: ${xhr.status}`));
                            }
                          };

                          xhr.onerror = () => {
                            console.error('   Network error during upload');
                            reject(new Error('Network error during upload'));
                          };

                          // PUT to GCS-provided location URL (no signature needed!)
                          xhr.open('PUT', resumableUrl);
                          xhr.send(file);
                        });

                        // Store upload record for confirmation (only after successful GCS upload)
                        uploadedAttachmentRecords.push({
                          file,
                          publicUrl: instruction.publicUrl,
                          objectPath: instruction.objectPath,
                        });
                        
                        console.log(`Attachment ${file.name} uploaded successfully to GCS:`, {
                          fileName: file.name,
                          publicUrl: instruction.publicUrl,
                          objectPath: instruction.objectPath
                        });
                      } catch (uploadError) {
                        const errorReason = uploadError instanceof Error ? uploadError.message : 'Upload failed';
                        failedCommentFiles.push({ name: file.name, reason: errorReason });
                        console.error(`Failed to upload attachment ${file.name}:`, errorReason);
                      }
                    }
                  }
                }
              } catch (error) {
                const errorReason = error instanceof Error ? error.message : 'Network error';
                state.uploadedAttachments.forEach(file => {
                  failedCommentFiles.push({ 
                    name: file.name, 
                    reason: errorReason 
                  });
                });
                console.error('Failed to upload attachments:', error);
              }
            }
            
            // Step 3: Create comment and external_files records (only if files uploaded successfully or no files)
            console.log('Preparing to create comment records:', {
              failedCommentFilesCount: failedCommentFiles.length,
              uploadedAttachmentsCount: state.uploadedAttachments.length,
              uploadedAttachmentRecordsCount: uploadedAttachmentRecords.length,
              uploadedAttachmentRecords: uploadedAttachmentRecords.map(r => ({
                fileName: r.file.name,
                publicUrl: r.publicUrl,
                objectPath: r.objectPath
              }))
            });
            
            if (failedCommentFiles.length === 0 || state.uploadedAttachments.length === 0) {
              try {
                // Send comment data with uploaded file metadata (not the files themselves)
                const requestBody = {
                  comment: state.comment || '',
                  contentType: state.contentType || (uploadedAttachmentRecords.length > 0 ? 'upload' : 'text'),
                  address: state.address || '',
                  uploads: uploadedAttachmentRecords.map(record => ({
                    fileName: record.file.name,
                    publicUrl: record.publicUrl,
                    objectPath: record.objectPath,
                    contentType: record.file.type || 'application/octet-stream',
                  })),
                };
                
                console.log('Sending comment request:', {
                  hasComment: !!requestBody.comment,
                  contentType: requestBody.contentType,
                  uploadsCount: requestBody.uploads.length,
                  uploads: requestBody.uploads
              });
              
              const commentResponse = await fetch(`/api/projects/${projectId}/comments`, {
                method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(requestBody),
                });

                if (!commentResponse.ok) {
                  const errorText = await commentResponse.text();
                  let errorReason = 'Unknown error';
                  try {
                    const errorJson = JSON.parse(errorText);
                    errorReason = errorJson.error || errorText;
                  } catch {
                    errorReason = errorText || `HTTP ${commentResponse.status}`;
                  }
                  
                  // Add error for each file or comment
                  if (uploadedAttachmentRecords.length > 0) {
                    uploadedAttachmentRecords.forEach(record => {
                      failedCommentFiles.push({ 
                        name: record.file.name, 
                        reason: errorReason 
                      });
                    });
                  } else if (state.comment) {
                    failedCommentFiles.push({ 
                      name: 'Comment', 
                      reason: errorReason 
                    });
                  }
                  console.error('Comment creation failed:', errorReason);
                } else {
                  const commentResult = await commentResponse.json();
              if (commentResult.success) {
                    console.log('Comments and attachments uploaded successfully:', commentResult);
              } else {
                const errorReason = commentResult.error || 'Unknown error';
                    if (uploadedAttachmentRecords.length > 0) {
                      uploadedAttachmentRecords.forEach(record => {
                  failedCommentFiles.push({ 
                          name: record.file.name, 
                    reason: errorReason 
                  });
                });
                    } else if (state.comment) {
                      failedCommentFiles.push({ 
                        name: 'Comment', 
                        reason: errorReason 
                      });
                    }
                    console.error('Comment creation failed:', errorReason);
                  }
              }
            } catch (commentError: unknown) {
              const errorReason = commentError instanceof Error ? commentError.message : 'Network error';
                if (uploadedAttachmentRecords.length > 0) {
                  uploadedAttachmentRecords.forEach(record => {
                failedCommentFiles.push({ 
                      name: record.file.name, 
                  reason: errorReason 
                });
              });
                } else if (state.comment) {
                  failedCommentFiles.push({ 
                    name: 'Comment', 
                    reason: errorReason 
                  });
                }
                console.error('Failed to create comment:', commentError instanceof Error ? commentError.message : commentError);
              }
            }
            
            // Log failed comment files but continue background processing
            if (failedCommentFiles.length > 0) {
              console.error('Some comment files failed to upload:', failedCommentFiles);
              // Continue with remaining processing in background
            }
          }
          
          // 4. Get shopify_order_id (already fetched above in projectDetails)
          const shopifyOrderId = projectDetails.shopify_order_id || 'NULL';
          
          // 5. Fetch real room info and SKU data
          const photosWithRoomInfo = await HomepageFilterService.getPhotosWithRoomInfo(
            collectionItems.map(item => item.imageId)
          );
          
          // 6. Create project data with real data (no temporary values)
          const projectData = {
            id: projectId,
            orderId: shopifyOrderId, // Use real Shopify Order ID
            images: state.uploadedImages, // Include uploadedImages for ZIP creation
            selectedStyles: collectionItems.map(item => {
              const photoInfo = photosWithRoomInfo.find(photo => photo.id === item.imageId);
              return {
                imageId: item.imageId,
                imageUrl: item.imageUrl,
                title: item.title,
                brandName: item.brandName || '',
                roomType: photoInfo?.room_type || '',
                roomStyle: photoInfo?.style || '',
                sku: photoInfo?.name || item.imageId.slice(-8).toUpperCase()
              };
            }),
            comment: state.comment || '',
            address: state.address || '', // Add address from context
            submittedAt: new Date()
          };
          
          console.log('Project data prepared with real data:', {
            id: projectData.id,
            orderId: projectData.orderId,
            imagesCount: projectData.images.length,
            stylesCount: projectData.selectedStyles.length,
            comment: projectData.comment,
            hasComment: !!projectData.comment
          });
          
          // Background processing complete
          // PDF will be generated when user clicks "Download Content Submitted" button
          console.log('Background processing completed: All data uploaded to GCS and project data prepared');
          
          // Background upload continues - all processing happens in background
          // Update project address if available
            if (state.address && state.address.trim() && projectId) {
              try {
                const addressResponse = await fetch(`/api/projects/${projectId}/address`, {
                  method: 'PATCH',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ address: state.address })
                });
                
                if (addressResponse.ok) {
                  console.log(' Project address updated successfully');
                } else {
                  const errorText = await addressResponse.text();
                  console.error(' Failed to update project address:', errorText);
                }
              } catch (addressError) {
                console.error(' Error updating project address:', addressError);
              }
            }
            
            // Save wishlist to database and clear frontend display
            // Get SKUs from collection items (the actual wishlist)
            const collectionSkus = collectionItems.map(item => {
              // Try to extract SKU from title first, then fallback to imageId
              let sku = item.title;
              if (!sku || sku === 'Bella Virtual Staging') {
                // Fallback to last 8 chars of imageId
                sku = item.imageId.slice(-8).toUpperCase();
              }
              return sku;
            });
            
            if (collectionItems.length > 0 && projectId) {
              const wishlistSaved = await saveWishlistToDatabase(projectId, collectionSkus);
              
              if (wishlistSaved) {
                clearCollection();
              }
            } else if (collectionItems.length > 0) {
              clearCollection();
            }
            
            // Update order status to 'in_progress' via Worker API
            if (projectDetails.shopify_order_id && projectId) {
              try {
                const orderStatusResponse = await fetch(`/api/projects/${projectId}/inprogress`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                });
                
                const orderStatusResult = await orderStatusResponse.json();
                
                if (orderStatusResult.success) {
                  console.log('Order status updated to in_progress:', orderStatusResult);
                } else {
                  console.warn('Failed to update order status to in_progress:', orderStatusResult.error_message);
                  // Don't fail the submission if order status update fails
                }
              } catch (orderStatusError) {
                console.error('Error updating order status to in_progress:', orderStatusError);
                // Don't fail the submission if order status update fails
              }
            }
            
            // After successful upload, navigate to submitted page
            console.log('Upload completed successfully, navigating to submitted page...');
            router.push(`/projects?page=${projectId}/submitted`);
            
        } catch (error) {
          console.error('Upload failed:', error);
          setLoading(false);
          alert('Upload failed. Please try again.');
          throw error; // Re-throw to prevent navigation on error
        }
      })();
      
    } catch (error) {
      console.error('Failed to submit project:', error);
      setLoading(false);
      // Error handling is done in the inner try-catch
    }
  };
  
  // Check if we have enough data to submit AND upload count is valid
  const hasContent = state.uploadedImages.length > 0 || 
                   state.selectedStyles.length > 0 || 
                   state.comment.trim().length > 0;
  
  const canSubmit = hasContent && uploadValidation.isValid;
  
  return (
    <>
        <div 
          className="upload-submit-button-wrap"
          style={{
            display: 'flex',
        width: '1240px',
        alignItems: 'flex-end',
          gap: '6px',
          flexDirection: 'column'
      }}
    >
      <button
        onClick={handleSubmitProject}
        disabled={!canSubmit}
        title={!uploadValidation.isValid ? uploadValidation.message : ''}
        className="upload-submit-button"
        style={{
          display: 'flex',
          padding: '16px 32px',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '8px',
          borderRadius: '8px',
          background: canSubmit ? '#4F46E5' : '#D1D5DB',
          color: canSubmit ? '#FFF' : '#9CA3AF',
          fontFamily: 'Inter',
          fontSize: '16px',
          fontStyle: 'normal',
          fontWeight: '600',
          lineHeight: '22px',
          border: 'none',
          cursor: canSubmit ? 'pointer' : 'not-allowed',
          transition: 'all 0.2s ease',
          minWidth: '200px',
          alignSelf: 'flex-end'
        }}
        onMouseEnter={(e) => {
          if (canSubmit) {
            e.currentTarget.style.backgroundColor = '#4338CA';
          }
        }}
        onMouseLeave={(e) => {
          if (canSubmit) {
            e.currentTarget.style.backgroundColor = '#4F46E5';
          }
        }}
      >
        Submit Project
      </button>
      
      
      {/* Validation message */}
      {!uploadValidation.isValid && (
        <div style={{
          color: 'var(--warning-primary, #D02B20)',
          fontFamily: 'Inter',
          fontSize: '14px',
          fontWeight: '400',
          lineHeight: '18px',
          marginTop: '8px',
          alignSelf: 'flex-end'
        }}>
          {uploadValidation.message}
        </div>
      )}
    </div>
    </>
  );
};

export default SubmitButton;

