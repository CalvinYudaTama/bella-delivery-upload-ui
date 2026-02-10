import React from 'react'
import { useCollection } from '@/contexts/CollectionContext'

interface CollectionIconProps {
  onClick?: () => void
  isWhiteMode?: boolean
}

const CollectionIcon: React.FC<CollectionIconProps> = ({ 
  onClick,
  isWhiteMode = false
}) => {
  const { itemCount } = useCollection()
  
  // console.log('CollectionIcon rendering, itemCount:', itemCount)

  return (
    <button
      onClick={onClick}
      className="flex items-center space-x-1 px-3 py-2 rounded-lg transition-all duration-200 relative group"
      aria-label={`Inspiration (${itemCount} items)`}
    >
      <span 
        className={`font-montserrat font-normal tracking-[1.28px] transition-colors duration-200 relative ${
          isWhiteMode ? 'text-gray-900 hover:text-gray-600' : 'text-gray-300 hover:text-gray-100'
        }`}
        style={{
          color: isWhiteMode ? 'var(--neutral-900)' : 'var(--neutral-400)',
        }}
      >
        Inspiration
        {/* Hover underline - only in white mode */}
        {isWhiteMode && (
          <span className="absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-200 group-hover:w-full bg-gray-600"></span>
        )}
      </span>
      
      {/* Heart Icon - 13px width */}
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="13" 
        height="20" 
        viewBox="0 0 15 20" 
        fill="none"
        className="self-stretch"
      >
        <path 
          d="M14 8.27273C14 6.46545 12.4841 5 10.6142 5C9.21672 5 8.01639 5.81891 7.5 6.98764C6.98361 5.81891 5.78328 5 4.38506 5C2.51667 5 1 6.46545 1 8.27273C1 13.5236 7.5 17 7.5 17C7.5 17 14 13.5236 14 8.27273Z" 
          stroke="var(--neutral-400)" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
      </svg>
      
      {/* Count badge */}
      {itemCount > 0 && (
        <span 
          className="text-neutral-0 text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium"
          style={{ background: 'var(--brand-primary)' }}
        >
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
    </button>
  )
}

export default CollectionIcon 