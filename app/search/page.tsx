import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, ArrowRight } from "lucide-react"
import { ItemCard } from "@/components/item-card"

// Mock data for demonstration
const lostItems = [
  {
    id: 1,
    title: "Blue Backpack",
    type: "lost" as const,
    date: "April 5, 2023",
    location: "Main Building, 2nd Floor",
    description: "Blue backpack with laptop and books inside. Last seen in the library.",
    imageSrc: "/placeholder.svg?height=200&width=300&text=Backpack 1",
  },
  {
    id: 2,
    title: "iPhone 13",
    type: "lost" as const,
    date: "April 7, 2023",
    location: "Cafeteria",
    description: "Black iPhone 13 with a clear case. Last seen during lunch break.",
    imageSrc: "/placeholder.svg?height=200&width=300&text=iPhone 2",
  },
  {
    id: 3,
    title: "Calculator",
    type: "lost" as const,
    date: "April 8, 2023",
    location: "Engineering Building, Room 301",
    description: "Scientific calculator (Casio fx-991ES). Lost during the math exam.",
    imageSrc: "/placeholder.svg?height=200&width=300&text=Calculator 3",
  },
  {
    id: 4,
    title: "Glasses",
    type: "lost" as const,
    date: "April 10, 2023",
    location: "Library, 3rd Floor",
    description: "Black-framed reading glasses in a red case.",
    imageSrc: "/placeholder.svg?height=200&width=300&text=Glasses 4",
  },
  {
    id: 5,
    title: "Umbrella",
    type: "lost" as const,
    date: "April 12, 2023",
    location: "Main Entrance",
    description: "Black automatic umbrella with the university logo.",
    imageSrc: "/placeholder.svg?height=200&width=300&text=Umbrella 5",
  },
  {
    id: 6,
    title: "Textbook",
    type: "lost" as const,
    date: "April 15, 2023",
    location: "Student Lounge",
    description: "Engineering Mechanics textbook with notes inside.",
    imageSrc: "/placeholder.svg?height=200&width=300&text=Textbook 6",
  },
]

const foundItems = [
  {
    id: 7,
    title: "Student ID Card",
    type: "found" as const,
    date: "April 8, 2023",
    location: "Cafeteria Building",
    description: "Student ID card for John Doe. Found near the cafeteria entrance.",
    imageSrc: "/placeholder.svg?height=200&width=300&text=ID Card 1",
  },
  {
    id: 8,
    title: "Water Bottle",
    type: "found" as const,
    date: "April 9, 2023",
    location: "Gym",
    description: "Blue Hydro Flask water bottle. Found on the bench.",
    imageSrc: "/placeholder.svg?height=200&width=300&text=Water Bottle 2",
  },
  {
    id: 9,
    title: "USB Drive",
    type: "found" as const,
    date: "April 11, 2023",
    location: "Computer Lab",
    description: "16GB SanDisk USB drive. Found plugged into Computer #12.",
    imageSrc: "/placeholder.svg?height=200&width=300&text=USB Drive 3",
  },
  {
    id: 10,
    title: "Earbuds",
    type: "found" as const,
    date: "April 13, 2023",
    location: "Student Center",
    description: "White wireless earbuds in a charging case.",
    imageSrc: "/placeholder.svg?height=200&width=300&text=Earbuds 4",
  },
  {
    id: 11,
    title: "Wallet",
    type: "found" as const,
    date: "April 14, 2023",
    location: "Bus Stop",
    description: "Brown leather wallet with ID and cards inside.",
    imageSrc: "/placeholder.svg?height=200&width=300&text=Wallet 5",
  },
  {
    id: 12,
    title: "Notebook",
    type: "found" as const,
    date: "April 16, 2023",
    location: "Lecture Hall B",
    description: "Spiral notebook with Physics notes.",
    imageSrc: "/placeholder.svg?height=200&width=300&text=Notebook 6",
  },
]

export default function SearchPage() {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Search Items</h1>

      <Tabs defaultValue="lost" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="lost">Lost Items</TabsTrigger>
          <TabsTrigger value="found">Found Items</TabsTrigger>
        </TabsList>

        <TabsContent value="lost" className="space-y-4">
          <div className="flex items-center gap-2 mb-6">
            <Input placeholder="Search lost items..." className="max-w-sm" />
            <Button size="icon" variant="ghost">
              <Search className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lostItems.map((item) => (
              <ItemCard key={item.id} {...item} />
            ))}
          </div>

          <div className="flex justify-center mt-8">
            <Button variant="outline" className="gap-2">
              Load More <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="found" className="space-y-4">
          <div className="flex items-center gap-2 mb-6">
            <Input placeholder="Search found items..." className="max-w-sm" />
            <Button size="icon" variant="ghost">
              <Search className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {foundItems.map((item) => (
              <ItemCard key={item.id} {...item} />
            ))}
          </div>

          <div className="flex justify-center mt-8">
            <Button variant="outline" className="gap-2">
              Load More <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
