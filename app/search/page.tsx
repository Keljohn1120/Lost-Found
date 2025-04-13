// app/search/page.tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, ArrowRight } from 'lucide-react'
import { ItemCard } from "@/components/item-card"
import { getItems, getCategories } from "@/app/actions"
import { Item, Category } from "@/types"

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const type = searchParams.type as string | undefined
  const { items: allItems, error: itemsError } = await getItems()
  const { categories, error: categoriesError } = await getCategories()
  
  if (itemsError) {
    return <div className="container py-8">Error loading items: {itemsError}</div>
  }
  
  if (categoriesError) {
    return <div className="container py-8">Error loading categories: {categoriesError}</div>
  }

  const lostItems = allItems?.filter((item: Item) => item.type === 'lost') || []
  const foundItems = allItems?.filter((item: Item) => item.type === 'found') || []

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Search Items</h1>

      <Tabs defaultValue={type || "lost"} className="w-full">
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
            {lostItems.length > 0 ? (
              lostItems.map((item: Item) => (
                <ItemCard
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  type="lost"
                  date={item.dateLostOrFound ? new Date(item.dateLostOrFound).toLocaleDateString() : 'Unknown date'}
                  location={item.location || 'Unknown location'}
                  description={item.description || ''}
                  imageSrc={item.imageUrl || `/placeholder.svg?height=200&width=300&text=${encodeURIComponent(item.title)}`}
                />
              ))
            ) : (
              <div className="col-span-3 text-center py-12">No lost items found</div>
            )}
          </div>

          {lostItems.length > 0 && (
            <div className="flex justify-center mt-8">
              <Button variant="outline" className="gap-2">
                Load More <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="found" className="space-y-4">
          {/* Similar code for found items */}
          <div className="flex items-center gap-2 mb-6">
            <Input placeholder="Search found items..." className="max-w-sm" />
            <Button size="icon" variant="ghost">
              <Search className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {foundItems.length > 0 ? (
              foundItems.map((item: Item) => (
                <ItemCard
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  type="found"
                  date={item.dateLostOrFound ? new Date(item.dateLostOrFound).toLocaleDateString() : 'Unknown date'}
                  location={item.location || 'Unknown location'}
                  description={item.description || ''}
                  imageSrc={item.imageUrl || `/placeholder.svg?height=200&width=300&text=${encodeURIComponent(item.title)}`}
                />
              ))
            ) : (
              <div className="col-span-3 text-center py-12">No found items found</div>
            )}
          </div>

          {foundItems.length > 0 && (
            <div className="flex justify-center mt-8">
              <Button variant="outline" className="gap-2">
                Load More <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}