import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Calendar, ArrowLeft, User, Clock } from "lucide-react"

// This would normally come from a database
const getItemById = (id: string) => {
  const allItems = [
    {
      id: "1",
      title: "Blue Backpack",
      type: "lost",
      date: "April 5, 2023",
      time: "2:30 PM",
      location: "Main Building, 2nd Floor",
      description:
        "Blue backpack with laptop and books inside. Last seen in the library. It has a small keychain attached to the zipper and a water bottle in the side pocket.",
      imageSrc: "/placeholder.svg?height=400&width=600&text=Backpack",
      reportedBy: "Juan Dela Cruz",
      contactInfo: "j.delacruz@mapua.edu.ph",
    },
    {
      id: "7",
      title: "Student ID Card",
      type: "found",
      date: "April 8, 2023",
      time: "10:15 AM",
      location: "Cafeteria Building",
      description:
        "Student ID card for John Doe. Found near the cafeteria entrance. The ID has a red lanyard attached to it.",
      imageSrc: "/placeholder.svg?height=400&width=600&text=ID Card",
      reportedBy: "Maria Santos",
      contactInfo: "m.santos@mapua.edu.ph",
    },
  ]

  return allItems.find((item) => item.id === id) || allItems[0]
}

export default function ItemDetailPage({ params }: { params: { id: string } }) {
  const item = getItemById(params.id)

  return (
    <div className="container py-8">
      <Link href="/search" className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to search
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative h-[400px] rounded-lg overflow-hidden">
          <Image src={item.imageSrc || "/placeholder.svg"} alt={item.title} fill className="object-cover" />
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold">{item.title}</h1>
            <Badge
              variant="outline"
              className={item.type === "lost" ? "text-[#932e1d] border-[#932e1d]" : "text-green-600 border-green-600"}
            >
              {item.type === "lost" ? "Lost" : "Found"}
            </Badge>
          </div>

          <Card className="mb-6">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>
                  {item.type === "lost" ? "Reported on" : "Found on"} {item.date}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>Time: {item.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>Location: {item.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>
                  {item.type === "lost" ? "Reported by" : "Found by"}: {item.reportedBy}
                </span>
              </div>
            </CardContent>
          </Card>

          <h2 className="text-xl font-semibold mb-2">Description</h2>
          <p className="text-muted-foreground mb-6">{item.description}</p>

          <Button className="w-full bg-[#932e1d] hover:bg-[#7a2617]">
            {item.type === "lost" ? "I Found This Item" : "This Is My Item"}
          </Button>
        </div>
      </div>
    </div>
  )
}
