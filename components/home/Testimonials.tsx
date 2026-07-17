'use client'
import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { TESTIMONIALS } from '@/lib/utils'
import { useScrollReveal } from '@/hooks/useScrollReveal'

export default function Testimonials() {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const ref = useScrollReveal()

  const next = useCallback(() => {
    setIndex(i => (i + 1) % TESTIMONIALS.length)
  }, [])

  const prev = useCallback(() => {
    setIndex(i => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)
  }, [])

  // Auto advance every 7 seconds
  useEffect(() => {
    if (paused) return
    const timer = setTimeout(next, 7000)
    return () => clearTimeout(timer)
  }, [index, paused, next])

  const current = TESTIMONIALS[index]

  return (
    <section
      className="py-20 bg-cgc-ink"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="max-w-3xl mx-auto px-4 lg:px-8 text-center">

        {/* Header */}
        <div ref={ref} className="reveal mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="w-6 h-px bg-cgc-red" />
            <span className="font-mono text-cgc-red text-xs tracking-widest uppercase">
              What customers say
            </span>
            <span className="w-6 h-px bg-cgc-red" />
          </div>
        </div>

        {/* Testimonial — pure crossfade, no sliding */}
        <div className="relative min-h-[180px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
              className="text-center"
            >
              {/* Stars */}
              <div className="flex justify-center gap-1 mb-6">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={16} className="fill-cgc-red text-cgc-red" />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-lg md:text-xl text-white/85 leading-relaxed font-light italic mb-6 max-w-2xl mx-auto">
                "{current.quote}"
              </blockquote>

              {/* Name */}
              <div>
                <p className="font-semibold text-white">{current.name}</p>
                <p className="text-sm text-white/40 mt-1">{current.location}</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4 mt-10">
          <button
            onClick={prev}
            aria-label="Previous testimonial"
            className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:border-white/50 hover:text-white transition-colors"
          >
            <ChevronLeft size={16} />
          </button>

          {/* Dots */}
          <div className="flex gap-2 items-center">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Go to testimonial ${i + 1}`}
                className="transition-all duration-300"
              >
                <span
                  className={`block rounded-pill transition-all duration-300 ${
                    i === index
                      ? 'w-6 h-1.5 bg-cgc-red'
                      : 'w-1.5 h-1.5 bg-white/25 hover:bg-white/40'
                  }`}
                />
              </button>
            ))}
          </div>

          <button
            onClick={next}
            aria-label="Next testimonial"
            className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:border-white/50 hover:text-white transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </section>
  )
}
