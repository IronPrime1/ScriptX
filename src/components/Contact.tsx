
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
  const [email, setEmail] = useState<string>("")
  const [name, setName] = useState<string>("")
  const [message, setMessage] = useState<string>("")

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      setIsSubmitting(true)
  
      toast({
        title: "Form submitted",
        description: "Thank you for contacting us!",
      })
  
      // Reset form
      setEmail("")
      setName("")
      setMessage("")
      setIsSubmitting(false)
  }

  return (
    <Card className="w-full max-w-lg mx-auto shadow-md font-inter font-medium">
      <form onSubmit={handleSubmit} action="https://formspree.io/f/xqapvdae" method="POST">
      <CardHeader>
        <CardTitle className="text-xl md:text-2xl">Contact Us</CardTitle>
        <CardDescription>Fill out the form and we'll get back to you soon.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" placeholder="Your name" required onChange={(e) => setName(e.target.value)}/>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" name="email" placeholder="your.email@example.com" required onChange={(e) => setEmail(e.target.value)}/>
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" name="message" placeholder="Your message" className="resize-none" required onChange={(e) => setMessage(e.target.value)}/>
          </div>

          <Button type="submit" className="w-full" disabled={email === "" || isSubmitting}>
            {isSubmitting ? "Sending..." : "Send Message"}
          </Button>
        
      </CardContent>
      </form>
    </Card>
  )
}
