"use client"

import { useState, useEffect } from "react"
import KanjiCard from "@/components/kanji-card"
import ProgressBar from "@/components/progress-bar"
import { Button } from "@/components/ui/button"
import { RefreshCcw } from "lucide-react"
import kanjiData from "@/kanji.json" // Import the kanji data from JSON

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [knownKanji, setKnownKanji] = useState<number[]>([])
  const [unknownKanji, setUnknownKanji] = useState<number[]>([])
  const [isFlipped, setIsFlipped] = useState(false)
  const [isReviewing, setIsReviewing] = useState(false)
  const [reviewStack, setReviewStack] = useState<number[]>([])

  const handleKnown = () => {
    if (currentIndex < kanjiData.length) {
      setKnownKanji([...knownKanji, kanjiData[currentIndex].id])
      moveToNext()
    }
  }

  const handleUnknown = () => {
    if (currentIndex < kanjiData.length) {
      setUnknownKanji([...unknownKanji, kanjiData[currentIndex].id])
      setReviewStack([...reviewStack, currentIndex])
      moveToNext()
    }
  }

  const moveToNext = () => {
    setIsFlipped(false)

    if (currentIndex < kanjiData.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else if (reviewStack.length > 0 && !isReviewing) {
      // Start review mode
      setIsReviewing(true)
      setCurrentIndex(reviewStack[0])
      setReviewStack(reviewStack.slice(1))
    }
  }

  const resetCards = () => {
    setCurrentIndex(0)
    setKnownKanji([])
    setUnknownKanji([])
    setIsFlipped(false)
    setIsReviewing(false)
    setReviewStack([])
  }

  const toggleFlip = () => {
    setIsFlipped(!isFlipped)
  }

  const progress = Math.round(((knownKanji.length + unknownKanji.length) / kanjiData.length) * 100)
  const isComplete = progress === 100 && reviewStack.length === 0

  return (
    <main className="select-none flex min-h-screen flex-col items-center justify-between p-4 md:p-24 bg-gray-50">
      <div className="w-full max-w-md mx-auto flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-8 text-center">漢字 Flashcards</h1>

        <div className="w-full mb-4">
          <ProgressBar progress={progress} />
          <p className="text-sm text-center mt-2">{isReviewing ? "Review Mode" : `${progress}% Complete`}</p>
        </div>

        {isComplete ? (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">All Done! 🎉</h2>
            <p className="mb-6">You've completed all the kanji flashcards.</p>
            <Button onClick={resetCards} className="flex items-center gap-2">
              <RefreshCcw className="h-4 w-4" />
              Start Again
            </Button>
          </div>
        ) : (
          <>
            <KanjiCard
              kanjiData={kanjiData[currentIndex]} // Use the imported kanji data
              isFlipped={isFlipped}
              onSwipeLeft={handleUnknown}
              onSwipeRight={handleKnown}
              onClick={toggleFlip}
            />

            <div className="flex gap-4 mt-8">
              <Button
                variant="outline"
                className="flex-1 border-red-300 hover:bg-red-50 hover:text-red-600"
                onClick={handleUnknown}
              >
                Don't Know
              </Button>
              <Button
                variant="outline"
                className="flex-1 border-green-300 hover:bg-green-50 hover:text-green-600"
                onClick={handleKnown}
              >
                Know
              </Button>
            </div>

            <div className="mt-4 text-center">
              <Button variant="ghost" size="sm" onClick={toggleFlip}>
                {isFlipped ? "Show Kanji" : "Show Details"}
              </Button>
            </div>
          </>
        )}
      </div>
    </main>
  )
}

