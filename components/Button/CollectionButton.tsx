import React, { useCallback } from 'react'
import { useCollection } from '@/contexts/CollectionContext'

interface CollectionButtonProps {
  imageId: string
  imageUrl: string
  title?: string
  brandName?: string  // Add brand name for grouping
  companyId?: number  // Add company ID for brand lookup
  variant?: 'default' | 'header' | 'card'
  className?: string
  showNotification?: boolean
  onToggle?: (isInCollection: boolean, imageId?: string) => void
}

const CollectionButton: React.FC<CollectionButtonProps> = ({
  imageId,
  imageUrl,
  title = "Bella Virtual Staging",
  brandName,
  companyId,
  variant = 'default',
  className = '',
  showNotification = false,
  onToggle
}) => {
  const { addItem, removeItem, isInCollection } = useCollection()
  const isCollected = isInCollection(imageId)

  const handleToggle = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (isCollected) {
      removeItem(imageId)
    } else {
      addItem({
        imageId,
        imageUrl,
        title,
        brandName,
        companyId
      })
    }

    onToggle?.(isCollected, imageId)
  }, [isCollected, imageId, imageUrl, title, brandName, companyId, addItem, removeItem, onToggle])

  // Variant styles
  const getVariantStyles = () => {
    switch (variant) {
      case 'header':
        return {
          container: 'relative hover:bg-gray-100 rounded-lg transition-colors',
          icon: 'w-6 h-6',
          badge: 'absolute -top-1 -right-1 bg-brand-primary text-neutral-0 text-xs rounded-full w-5 h-5 flex items-center justify-center'
        }
      case 'card':
        return {
          container: 'transition-all duration-200',
          icon: 'w-5 h-5',
          badge: ''
        }
      default:
        return {
          container: 'rounded-lg transition-colors',
          icon: 'w-5 h-5',
          badge: ''
        }
    }
  }

  const styles = getVariantStyles()

  return (
    <button
      onClick={handleToggle}
      className={`${styles.container} ${className}`}
      aria-label={isCollected ? 'Remove from collection' : 'Add to collection'}
      style={{
        width: '24px',
        height: '21px',
        flexShrink: 0,
        aspectRatio: '8/7'
      }}
    >
      {/* Custom Heart SVG Icon */}
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 26 23" 
        fill="none"
        className="w-full h-full"
        style={{
          width: '100%',
          height: '100%'
        }}
      >
        <path 
          d="M25 6.72727C25 3.56455 22.2013 1 18.7493 1C16.1693 1 13.9533 2.43309 13 4.47836C12.0467 2.43309 9.83067 1 7.24933 1C3.8 1 1 3.56455 1 6.72727C1 15.9164 13 22 13 22C13 22 25 15.9164 25 6.72727Z" 
          fill={isCollected ? 'var(--brand-primary)' : 'white'} 
          stroke={isCollected ? 'var(--brand-primary)' : 'var(--neutral-400)'} 
          strokeWidth="1.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
      </svg>
      
      {/* Show notification for card variant */}
      {showNotification && variant === 'card' && (
        <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
          {isCollected ? 'Added!' : 'Removed!'}
        </div>
      )}
    </button>
  )
}

export default CollectionButton 