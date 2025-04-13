// components/item-card.tsx
import Image from "next/image"
import Link from "next/link"
import { MapPin, Calendar } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface ItemCardProps {
  id: number
  title: string
  type: "lost" | "found"
  date: string
  location: string
  description: string
  imageSrc: string
}

export function ItemCard({ id, title, type, date, location, description, imageSrc }: ItemCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{title}</span>
          <Badge
            variant="outline"
            className={type === "lost" ? "text-[#932e1d] border-[#932e1d]" : "text-green-600 border-green-600"}
          >
            {type === "lost" ? "Lost" : "Found"}
          </Badge>
        </CardTitle>
        <CardDescription className="flex items-center gap-1">
          <Calendar className="h-3 w-3" /> {type === "lost" ? "Reported on" : "Found on"} {date}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative h-48 w-full mb-4 rounded-md overflow-hidden">
          <Image
            src={imageSrc || "/placeholder.svg"}
            alt={`${type === "lost" ? "Lost" : "Found"} item`}
            fill
            className="object-cover"
          />
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
        <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
          <MapPin className="h-3 w-3" /> {location}
        </div>
      </CardContent>
      <CardFooter>
        <Link href={`/items/${id}`} className="w-full">
          <Button variant="outline" size="sm" className="w-full">
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}