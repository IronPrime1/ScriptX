"use client"

import type React from "react"
import { useState } from "react"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { useIsMobile } from "@/hooks/use-mobile"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export default function FeedbackForm() {
  const [rating, setRating] = useState<number>(0)
  const [comment, setComment] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [email, setEmail] = useState<string>("")
  const { toast } = useToast()
  const isMobile = useIsMobile()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("https://formspree.io/f/xkgjarej", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({
          email,
          rating,
          comment
        })
      })

      if (response.ok) {
        toast({
          title: "Feedback submitted",
          description: "Thank you for your feedback!",
        })
        setRating(0)
        setComment("")
        setEmail("")
      } else {
        toast({
          title: "Submission failed",
          description: "Please try again later.",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong.",
      })
    }

    setIsSubmitting(false)
  }

  return (
    <Card className="w-full max-w-lg mx-auto shadow-md font-inter font-medium">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl">Share your feedback</CardTitle>
          <CardDescription>We'd love to hear what you think about our service</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              name="email"
              placeholder="your.email@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
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
            <Label htmlFor="comment">Your feedback</Label>
            <Textarea
              id="comment"
              placeholder="Tell us what you think..."
              required
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
