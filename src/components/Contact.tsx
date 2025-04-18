import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

export default function ContactForm() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [message, setMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("https://formspree.io/f/xqapvdae", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({ name, email, message })
      })

      if (response.ok) {
        toast({
          title: "Message Sent!",
          description: "Thank you for contacting us.",
        })
        setName("")
        setEmail("")
        setMessage("")
      } else {
        toast({
          title: "Submission Failed",
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
          <CardTitle className="text-xl md:text-2xl">Contact Us</CardTitle>
          <CardDescription>Fill out the form and we'll get back to you soon.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="Your name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
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
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              name="message"
              placeholder="Your message"
              className="resize-none"
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting || !email}>
            {isSubmitting ? "Sending..." : "Send Message"}
          </Button>
        </CardContent>
      </form>
    </Card>
  )
}
