import { Card, CardContent } from "@/components/ui/card"
import { prisma } from "@/lib/db"

export async function StatsSection() {
  // Fetch stats
  const stats = await getStats()

  return (
    <section className="py-12 bg-white">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-[#932e1d]">Our Impact</h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              See how our platform has helped the Mapua community.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 w-full">
            <Card>
              <CardContent className="p-6 flex flex-col items-center justify-center">
                <p className="text-3xl font-bold text-[#932e1d]">{stats.totalItems}</p>
                <p className="text-sm font-medium">Total Items</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 flex flex-col items-center justify-center">
                <p className="text-3xl font-bold text-[#932e1d]">{stats.lostItems}</p>
                <p className="text-sm font-medium">Lost Items</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 flex flex-col items-center justify-center">
                <p className="text-3xl font-bold text-[#932e1d]">{stats.foundItems}</p>
                <p className="text-sm font-medium">Found Items</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 flex flex-col items-center justify-center">
                <p className="text-3xl font-bold text-[#932e1d]">{stats.itemsReturned}</p>
                <p className="text-sm font-medium">Items Returned</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}

async function getStats() {
  try {
    const totalItems = await prisma.item.count()
    const lostItems = await prisma.item.count({ where: { type: "lost" } })
    const foundItems = await prisma.item.count({ where: { type: "found" } })
    const itemsReturned = await prisma.item.count({ where: { status: "resolved" } })

    return {
      totalItems,
      lostItems,
      foundItems,
      itemsReturned,
    }
  } catch (error) {
    console.error("Error fetching stats:", error)
    return {
      totalItems: 0,
      lostItems: 0,
      foundItems: 0,
      itemsReturned: 0,
    }
  }
}
