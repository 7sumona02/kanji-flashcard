"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { Mic } from "lucide-react"

interface VocabCardProps {
  vocabData: {
    Kanji: string
    Furigana: string
    Romaji: string
    Meaning: string
  }
  isFlipped: boolean
  onSwipeLeft: () => void
  onSwipeRight: () => void
  onClick: () => void
}

export default function VocabCard({ vocabData, isFlipped, onSwipeLeft, onSwipeRight, onClick }: VocabCardProps) {
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [wasDragged, setWasDragged] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = "ja-JP" // Set the language to Japanese
    window.speechSynthesis.speak(utterance)
  }

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true)
    setWasDragged(false)

    // Get the starting position
    if ("touches" in e) {
      setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY })
    } else {
      setDragStart({ x: e.clientX, y: e.clientY })
    }
  }

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return

    let currentX: number
    let currentY: number

    if ("touches" in e) {
      currentX = e.touches[0].clientX
      currentY = e.touches[0].clientY
    } else {
      currentX = e.clientX
      currentY = e.clientY
    }

    const newOffset = {
      x: currentX - dragStart.x,
      y: currentY - dragStart.y,
    }

    setDragOffset(newOffset)

    // If dragged more than 10px, consider it a drag rather than a click
    if (Math.abs(newOffset.x) > 10 || Math.abs(newOffset.y) > 10) {
      setWasDragged(true)
    }
  }

  const handleDragEnd = () => {
    if (!isDragging) return

    setIsDragging(false)

    // Determine if the swipe was significant enough
    if (dragOffset.x > 100) {
      // Swipe right
      onSwipeRight()
    } else if (dragOffset.x < -100) {
      // Swipe left
      onSwipeLeft()
    }

    // Reset the drag offset
    setDragOffset({ x: 0, y: 0 })
  }

  const handleClick = () => {
    // Only trigger click if it wasn't a drag
    if (!wasDragged) {
      onClick()
    }
    setWasDragged(false)
  }

  useEffect(() => {
    const handleMouseUp = () => {
      if (isDragging) {
        handleDragEnd()
      }
    }

    window.addEventListener("mouseup", handleMouseUp)
    window.addEventListener("touchend", handleMouseUp)

    return () => {
      window.removeEventListener("mouseup", handleMouseUp)
      window.removeEventListener("touchend", handleMouseUp)
    }
  }, [isDragging, handleDragEnd])

  return (
    <div className="relative w-full perspective-1000" style={{ height: "300px" }}>
      <motion.div
        ref={cardRef}
        className="absolute w-full h-full transform-style-3d cursor-pointer"
        animate={{
          x: isDragging ? dragOffset.x : 0,
          y: isDragging ? dragOffset.y / 3 : 0, // Reduce vertical movement
          rotate: isDragging ? dragOffset.x / 10 : 0, // Slight rotation based on drag
          rotateY: isFlipped ? 180 : 0,
        }}
        transition={{
          x: { type: "spring", stiffness: 300, damping: 20 },
          y: { type: "spring", stiffness: 300, damping: 20 },
          rotate: { type: "spring", stiffness: 300, damping: 20 },
          rotateY: { type: "tween", duration: 0.3, ease: "easeInOut" },
        }}
        onMouseDown={handleDragStart}
        onMouseMove={handleDragMove}
        onTouchStart={handleDragStart}
        onTouchMove={handleDragMove}
        onMouseUp={handleDragEnd}
        onTouchEnd={handleDragEnd}
        onClick={handleClick}
      >
        {/* Front of card (English) */}
        <div className="absolute w-full h-full backface-hidden rounded-xl shadow-lg flex flex-col items-center justify-center p-6 bg-white rotate-y-180">
          <h3 className="text-xl font-bold mb-4">Meaning</h3>
          <span className="text-4xl font-bold mb-4">{vocabData.Meaning}</span>
        </div>

        {/* Back of card (Japanese) */}
        <div className="absolute w-full h-full backface-hidden rounded-xl shadow-lg flex flex-col items-center justify-center p-6 bg-white">
          <div className="text-center">
            {vocabData.Kanji && <p className="text-7xl font-bold mb-2">{vocabData.Kanji}</p>}
            <p className="text-2xl mb-2">{vocabData.Furigana}</p>
            <span className="text-lg font-medium mb-4">{vocabData.Meaning}</span>
          </div>
          {/* <button
            className="mt-4 text-sm text-blue-500 hover:text-blue-700"
            onClick={(e) => {
              e.stopPropagation()
              speak(vocabData.Furigana) // Speak the Japanese word
            }}
          >
            <Mic />
          </button> */}
        </div>
      </motion.div>
    </div>
  )
}