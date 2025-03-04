"use client";

import { useState, useEffect } from "react";
import VocabCard from "@/components/vocab-card";
import ProgressBar from "@/components/progress-bar";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";

type VocabData = {
  [category: string]: {
    [word: string]: string;
  };
};

import vocabData from "@/n5vocab.json";
const typedVocabData = vocabData as VocabData;

export default function VocabPage() {
  const [currentCategory, setCurrentCategory] = useState(Object.keys(typedVocabData)[0]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);
  const [reviewStack, setReviewStack] = useState<number[]>([]);

  const categoryVocab = Object.entries(typedVocabData[currentCategory]);

  useEffect(() => {
    if (!window.speechSynthesis) {
      alert("Your browser does not support text-to-speech functionality.");
    }
  }, []);

  const moveToNext = () => {
    setIsFlipped(false);
    if (currentIndex < categoryVocab.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else if (reviewStack.length > 0 && !isReviewing) {
      setIsReviewing(true);
      setCurrentIndex(reviewStack[0]);
      setReviewStack(reviewStack.slice(1));
    }
  };

  const moveToPrevious = () => {
    setIsFlipped(false);
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const resetCards = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setIsReviewing(false);
    setReviewStack([]);
  };

  const toggleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const progress = Math.round((currentIndex / (categoryVocab.length - 1)) * 100);
  const isComplete = currentIndex >= categoryVocab.length - 1 && reviewStack.length === 0;

  return (
    <main className="select-none flex min-h-screen flex-col items-center justify-between p-4 md:p-24 bg-gray-50">
      <div className="w-full max-w-2xl mx-auto flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-8 text-center">Vocabulary Flashcards</h1>

        {/* Category Selection */}
        <div className="mb-6 grid md:grid-cols-3 grid-cols-2 gap-2">
          {Object.keys(typedVocabData).map((category) => (
            <Button
              key={category}
              variant="ghost"
              className={`${currentCategory === category ? 'bg-blue-500 text-white' : 'text-blue-500'}`}
              onClick={() => {
                setCurrentCategory(category);
                setCurrentIndex(0);
                setIsFlipped(false);
              }}
            >
              {category}
            </Button>
          ))}
        </div>

        <div className="w-full mb-4">
          <ProgressBar progress={progress} />
          <p className="text-sm text-center mt-2">{isReviewing ? "Review Mode" : `${progress}% Complete`}</p>
        </div>

        {isComplete ? (
          <div className="text-center flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-4">All Done! 🎉</h2>
            <p className="mb-6">You've completed all the vocabulary flashcards.</p>
            <Button onClick={resetCards} className="flex items-center gap-2">
              <RefreshCcw className="h-4 w-4" />
              Start Again
            </Button>
          </div>
        ) : (
          <>
            {categoryVocab[currentIndex] && (
              <VocabCard
                vocabData={{
                  Romaji: categoryVocab[currentIndex][0],
                  Kanji: categoryVocab[currentIndex][1],
                  Furigana: categoryVocab[currentIndex][1].match(/\((.*?)\)/)?.[1] || '',
                  Meaning: categoryVocab[currentIndex][0]
                }}
                isFlipped={isFlipped}
                onSwipeLeft={moveToPrevious}
                onSwipeRight={moveToNext}
                onClick={toggleFlip}
              />
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
                disabled={isComplete}
              >
                Next
              </Button>
            </div>

            <div className="mt-4 text-center">
              <Button variant="ghost" size="sm" onClick={toggleFlip}>
                {isFlipped ? "Show Japanese" : "Show English"}
              </Button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}