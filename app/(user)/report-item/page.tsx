import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Category } from "@/types"
import { prisma } from "@/lib/db"

export default async function ReportItemPage() {
  const session = await getServerSession()
  const userId = Number.parseInt(session?.user?.id || "0")
  const categories = await getItemCategories()

  async function handleSubmit(formData: FormData) {
    "use server"

    // Add the user ID to the form data
    formData.append("userId", userId.toString())

    const result = await createItemAction(formData)

    if (result.success) {
      // Create a notification for the user
      await prisma.notification.create({
        data: {
          userId,
          message: `Your ${formData.get("type")} item "${formData.get("title")}" has been reported successfully.`,
          isRead: false,
          relatedItemId: result.itemId,
        },
      })

      redirect("/my-reports")
    }
  }

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold">Report Item</h1>

      <Card>
        <CardHeader>
          <CardTitle>Item Information</CardTitle>
          <CardDescription>Please provide details about the item you want to report.</CardDescription>
        </CardHeader>
        <form action={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="item-type">Item Type</Label>
              <RadioGroup defaultValue="lost" id="item-type" name="type" className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="lost" id="lost" />
                  <Label htmlFor="lost" className="font-normal">
                    Lost Item
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="found" id="found" />
                  <Label htmlFor="found" className="font-normal">
                    Found Item
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="item-name">Item Name</Label>
              <Input id="item-name" name="title" placeholder="e.g., Backpack, Phone, ID Card" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select name="category">
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input id="date" name="date" type="date" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" name="location" placeholder="Where was the item lost/found?" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Provide a detailed description of the item..."
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Upload Image (optional)</Label>
              <Input id="image" name="image" type="file" accept="image/*" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact">Contact Information</Label>
              <Input
                id="contact"
                name="contact"
                placeholder="Email or phone number"
                defaultValue={session?.user?.email || ""}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full bg-[#932e1d] hover:bg-[#7a2617]">
              Submit Report
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

async function getItemCategories() {
  try {
    const categories = await prisma.category.findMany()
    return categories as Category[]
  } catch (error) {
    console.error("Error fetching categories:", error)
    return []
  }
}

async function createItemAction(formData: FormData) {
  try {
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const type = formData.get("type") as string
    const location = formData.get("location") as string
    const dateLostOrFound = formData.get("date") as string
    const categoryId = Number.parseInt(formData.get("category") as string)
    const contactInfo = formData.get("contact") as string
    const userId = Number.parseInt(formData.get("userId") as string)

    // Validate required fields
    if (!title || !type) {
      return { error: "Title and type are required" }
    }

    const item = await prisma.item.create({
      data: {
        title,
        description,
        type,
        location,
        dateLostOrFound: dateLostOrFound ? new Date(dateLostOrFound) : new Date(),
        categoryId: isNaN(categoryId) ? null : categoryId,
        contactInfo,
        userId,
        status: "pending",
      },
    })

    return { success: true, itemId: item.id }
  } catch (error) {
    console.error("Error creating item:", error)
    return { error: "Failed to create item" }
  }
}
