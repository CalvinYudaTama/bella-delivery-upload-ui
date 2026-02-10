'use client'

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'

interface CollectionItem {
  imageId: string
  imageUrl: string
  title: string
  brandName?: string  // Add brand name for grouping
  companyId?: number  // Add company ID for brand lookup
}

interface CollectionContextType {
  items: CollectionItem[]
  itemCount: number
  addItem: (item: CollectionItem) => void
  removeItem: (imageId: string) => void
  isInCollection: (imageId: string) => boolean
  clearCollection: () => void
}

const CollectionContext = createContext<CollectionContextType | undefined>(undefined)

export function CollectionProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CollectionItem[]>([])

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('bella-collection')
    if (saved) {
      try {
        setItems(JSON.parse(saved))
      } catch (error) {
        console.error('Failed to load collection from localStorage:', error)
      }
    }
  }, [])

  // Save to localStorage when items change
  useEffect(() => {
    localStorage.setItem('bella-collection', JSON.stringify(items))
  }, [items])

  const addItem = useCallback((item: CollectionItem) => {
    setItems(prev => {
      // Check if item already exists
      if (prev.some(existing => existing.imageId === item.imageId)) {
        return prev
      }
      return [...prev, item]
    })
  }, [])

  const removeItem = useCallback((imageId: string) => {
    setItems(prev => prev.filter(item => item.imageId !== imageId))
  }, [])

  const isInCollection = useCallback((imageId: string) => {
    return items.some(item => item.imageId === imageId)
  }, [items])

  const clearCollection = useCallback(() => {
    setItems([])
  }, [])

  const value: CollectionContextType = {
    items,
    itemCount: items.length,
    addItem,
    removeItem,
    isInCollection,
    clearCollection
  }

  return (
    <CollectionContext.Provider value={value}>
      {children}
    </CollectionContext.Provider>
  )
}

export function useCollection() {
  const context = useContext(CollectionContext)
  if (context === undefined) {
    throw new Error('useCollection must be used within a CollectionProvider')
  }
  return context
} 