"use client"

import { useState, useEffect } from "react"
import KanjiCard from "@/components/kanji-card"
import ProgressBar from "@/components/progress-bar"
import { Button } from "@/components/ui/button"
import { RefreshCcw } from "lucide-react"
import kanjiData from "@/kanji.json" // Import the kanji data from JSON

const DECK_SIZE = 20; // Define the size of each deck

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [currentDeckIndex, setCurrentDeckIndex] = useState(0)
  const [decks, setDecks] = useState<any[]>([])
  const [isFlipped, setIsFlipped] = useState(false)
  const [isReviewing, setIsReviewing] = useState(false)
  const [reviewStack, setReviewStack] = useState<number[]>([])

  useEffect(() => {
    if (!window.speechSynthesis) {
      alert("Your browser does not support text-to-speech functionality.")
    }
    // Create decks when the component mounts
    const createDecks = () => {
      const newDecks = [];
      for (let i = 0; i < kanjiData.length; i += DECK_SIZE) {
        newDecks.push(kanjiData.slice(i, i + DECK_SIZE));
      }
      setDecks(newDecks);
    };
    createDecks();
  }, [])

  const handleDeckChange = (index: number) => {
    setCurrentDeckIndex(index);
    setCurrentIndex(0); // Reset to the first card in the selected deck
  };

  const moveToNext = () => {
    setIsFlipped(false);
    if (currentIndex < decks[currentDeckIndex]?.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else if (reviewStack.length > 0 && !isReviewing) {
      // Start review mode
      setIsReviewing(true);
      setCurrentIndex(reviewStack[0]);
      setReviewStack(reviewStack.slice(1));
    }
  }

  const moveToPrevious = () => {
    setIsFlipped(false);
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  }

  const resetCards = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setIsReviewing(false);
    setReviewStack([]);
  }

  const toggleFlip = () => {
    setIsFlipped(!isFlipped);
  }

  const progress = Math.round(((currentIndex + 1) / (decks[currentDeckIndex]?.length || 1)) * 100);
  const isComplete = progress === 100 && reviewStack.length === 0;

  return (
    <main className="select-none flex min-h-screen flex-col items-center justify-between p-4 md:p-24 bg-gray-50">

      <div className="w-full max-w-md mx-auto flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-8 text-center">漢字 Flashcards</h1>

        <div className="w-full mb-4">
          <ProgressBar progress={progress} />
          <p className="text-sm text-center mt-2">{isReviewing ? "Review Mode" : `${progress}% Complete`}</p>
        </div>

        {/* Deck Selection */}
        <div className="mb-6 grid grid-cols-3">
          {decks.map((deck, index) => (
            <Button
              key={index}
              variant="ghost"
              className={`mr-2 ${currentDeckIndex === index ? 'bg-blue-500 text-white' : 'text-blue-500'}`}
              onClick={() => handleDeckChange(index)}
            >
              Deck {index + 1}
            </Button>
          ))}
        </div>

        {isComplete ? (
          <div className="text-center flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-4">All Done! 🎉</h2>
            <p className="mb-6">You've completed all the kanji flashcards.</p>
            <Button onClick={resetCards} className="flex items-center gap-2">
              <RefreshCcw className="h-4 w-4" />
              Start Again
            </Button>
          </div>
        ) : (
          <>
            {decks[currentDeckIndex] && decks[currentDeckIndex][currentIndex] ? (
              <KanjiCard
                kanjiData={decks[currentDeckIndex][currentIndex]}
                isFlipped={isFlipped}
                onSwipeLeft={moveToPrevious}
                onSwipeRight={moveToNext}
                onClick={toggleFlip}
              />
            ) : (
              <p>No cards available in this deck.</p>
            )}

            <div className="flex gap-4 mt-8">
              <Button
                variant="outline"
                className="flex-1 border-gray-300 hover:bg-gray-50 hover:text-gray-600"
                onClick={moveToPrevious}
                disabled={currentIndex === 0}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                className="flex-1 border-gray-300 hover:bg-gray-50 hover:text-gray-600"
                onClick={moveToNext}
                disabled={currentIndex === decks[currentDeckIndex]?.length - 1}
              >
                Next
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
