import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Calendar, ArrowLeft, User, Clock } from 'lucide-react'
import { getItemById } from "@/app/actions"
import { notFound } from "next/navigation"

export default async function ItemDetailPage({ params }: { params: { id: string } }) {
  const { item, error } = await getItemById(parseInt(params.id))
  
  if (error || !item) {
    notFound()
  }

  const formattedDate = item.dateLostOrFound 
    ? new Date(item.dateLostOrFound).toLocaleDateString() 
    : 'Unknown date'

  return (
    <div className="container py-8">
      <Link href="/search" className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to search
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative h-[400px] rounded-lg overflow-hidden">
          <Image 
            src={item.imageUrl || `/placeholder.svg?height=400&width=600&text=${encodeURIComponent(item.title)}`} 
            alt={item.title} 
            fill 
            className="object-cover" 
          />
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
                  {item.type === "lost" ? "Reported on" : "Found on"} {formattedDate}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>Status: {item.status}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>Location: {item.location || 'Unknown location'}</span>
              </div>
              {item.category && (
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>Category: {item.category.name}</span>
                </div>
              )}
            </CardContent>
          </Card>

          <h2 className="text-xl font-semibold mb-2">Description</h2>
          <p className="text-muted-foreground mb-6">{item.description || 'No description provided'}</p>

          <Button className="w-full bg-[#932e1d] hover:bg-[#7a2617]">
            {item.type === "lost" ? "I Found This Item" : "This Is My Item"}
          </Button>
        </div>
      </div>
    </div>
  )
}