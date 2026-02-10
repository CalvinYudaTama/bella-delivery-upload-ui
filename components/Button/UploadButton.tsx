'use client';

import React, { useRef } from 'react';

interface UploadButtonProps {
  onFileSelect: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
  style?: React.CSSProperties;
  onMouseEnter?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onMouseLeave?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const UploadButton: React.FC<UploadButtonProps> = ({
  onFileSelect,
  accept = "image/png,image/jpeg,image/jpg",
  multiple = true,
  className = "",
  children,
  disabled = false,
  style,
  onMouseEnter,
  onMouseLeave
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      onFileSelect(files);
    }
    // Reset the input value so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        disabled={disabled}
        className={`${className} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        style={style}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {children}
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileChange}
        className="hidden"
      />
    </>
  );
};

export default UploadButton;
