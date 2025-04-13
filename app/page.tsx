import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Search, MapPin, Calendar, ArrowRight } from "lucide-react"
import { StatsSection } from "@/components/stats-section"

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="container py-12 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">Mapua Lost & Found System</h1>
            <p className="mt-4 text-xl text-muted-foreground">
              A platform to report and search for lost and found items
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link href="/report">
                <Button size="lg" className="bg-[#932e1d] hover:bg-[#7a2617]">
                  Report a Lost Item
                </Button>
              </Link>
              <Link href="/search">
                <Button size="lg" variant="outline">
                  Browse Found Items
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative h-[300px] md:h-[400px] rounded-lg overflow-hidden">
            <Image src="/campus.jpg" alt="Mapua University Campus" fill className="object-cover" />
          </div>
        </div>
      </section>

      {/* Tabs Section */}
      <section className="container py-12 border-t">
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
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <Card key={item}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Blue Backpack</span>
                      <Badge variant="outline" className="text-[#932e1d] border-[#932e1d]">
                        Lost
                      </Badge>
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> Reported on April 5, 2023
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="relative h-48 w-full mb-4 rounded-md overflow-hidden">
                      <Image
                        src={`/placeholder.svg?height=200&width=300&text=Backpack ${item}`}
                        alt="Lost item"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Blue backpack with laptop and books inside. Last seen in the library.
                    </p>
                    <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" /> Main Building, 2nd Floor
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" className="w-full">
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
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
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <Card key={item}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Student ID Card</span>
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        Found
                      </Badge>
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> Found on April 8, 2023
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="relative h-48 w-full mb-4 rounded-md overflow-hidden">
                      <Image
                        src={`/placeholder.svg?height=200&width=300&text=ID Card ${item}`}
                        alt="Found item"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Student ID card for John Doe. Found near the cafeteria entrance.
                    </p>
                    <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" /> Cafeteria Building
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" className="w-full">
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            <div className="flex justify-center mt-8">
              <Button variant="outline" className="gap-2">
                Load More <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </section>

      {/* Stats Section */}
      <StatsSection />
    </>
  )
}
