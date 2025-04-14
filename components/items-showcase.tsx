import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Item } from "@/types"
import { prisma } from "@/lib/db"

export async function ItemsShowcase() {
  const items = await getRecentItems()

  return (
    <section className="py-12">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-[#932e1d]">Recent Items</h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Browse the most recently reported lost and found items.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {items.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <div className="relative h-48 w-full">
                  <Image
                    src={
                      item.imageUrl || `/placeholder.svg?height=200&width=300&text=${encodeURIComponent(item.title)}`
                    }
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                  <Badge
                    className={`absolute top-2 right-2 ${
                      item.type === "lost"
                        ? "bg-red-100 text-red-800 hover:bg-red-100"
                        : "bg-green-100 text-green-800 hover:bg-green-100"
                    }`}
                  >
                    {item.type === "lost" ? "Lost" : "Found"}
                  </Badge>
                </div>
                <CardContent className="p-4">
                  <h3 className="text-lg font-bold">{item.title}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2 mt-1">{item.description}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    {item.location && `${item.location} • `}
                    {item.dateLostOrFound ? new Date(item.dateLostOrFound).toLocaleDateString() : "Unknown date"}
                  </p>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Link href={`/login?redirect=/items/${item.id}`} className="w-full">
                    <Button variant="outline" className="w-full">
                      View Details
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
          <div className="mt-8">
            <Link href="/search">
              <Button variant="outline">View All Items</Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

async function getRecentItems() {
  try {
    const items = await prisma.item.findMany({
      take: 6,
      orderBy: {
        dateReported: "desc",
      },
      include: {
        category: true,
      },
    })

    return items as Item[]
  } catch (error) {
    console.error("Error fetching recent items:", error)
    return []
  }
}
