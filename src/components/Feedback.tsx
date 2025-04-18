"use client"

import type React from "react"

import { useState } from "react"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { useIsMobile } from "@/hooks/use-mobile"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export default function FeedbackForm() {
  const [rating, setRating] = useState<number>(0)
  const [comment, setComment] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const { toast } = useToast()
  const isMobile = useIsMobile()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Show success toast here
    toast({
      title: "Feedback submitted",
      description: "Thank you for your feedback!",
    })

    // Reset form
    setRating(0)
    setComment("")
    setIsSubmitting(false)
  }

  return (
    <Card className="w-full max-w-lg mx-auto shadow-md font-inter font-medium">
      <form
      action="https://formspree.io/f/xkgjarej"
      method="POST"
      onSubmit={handleSubmit}
      >
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl">Share your feedback</CardTitle>
          <CardDescription>We'd love to hear what you think about our service</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
        <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" name="email" placeholder="your.email@example.com" required />
          </div>
          <div className="space-y-2 pt-1">
            <p className="text-sm font-medium">How would you rate your experience?</p>
            <div className="flex items-center justify-center md:justify-start gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="focus:outline-none transition-transform hover:scale-110"
                  aria-label={`Rate ${star} stars`}
                >
                  <Star
                    className={`w-8 h-8 md:w-10 md:h-10 ${
                      rating >= star ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="comment" className="text-sm font-medium">
              Your feedback
            </label>
            <Textarea
              id="comment"
              placeholder="Tell us what you think..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="resize-none"
            />
          </div>
          <Button type="submit" className="w-full" disabled={rating === 0 || isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Feedback"}
          </Button>
        </CardContent>
      </form>
    </Card>
  )
}
