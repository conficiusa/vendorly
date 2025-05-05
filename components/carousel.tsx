"use client"

import { useState, useEffect } from "react"

interface CarouselProps {
  slides: {
    title: string
    description: string
  }[]
}

export function Carousel({ slides }: CarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0)

  // Auto-advance slides
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1))
    }, 5000)
    return () => clearInterval(interval)
  }, [slides.length])

  return (
    <div className="space-y-8 w-full">
      {/* Carousel content */}
      <div className="relative h-[400px] overflow-hidden w-full">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-500 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="space-y-6 text-left w-full">
              <h2 className="text-3xl font-bold">{slide.title}</h2>
              <p className="text-rose-100 text-lg leading-relaxed">{slide.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Carousel indicators */}
      <div className="flex items-center justify-center space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-1 rounded-full transition-all ${
              index === currentSlide ? "w-12 bg-white" : "w-8 bg-white/30"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
