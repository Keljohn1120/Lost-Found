// app/report/page.tsx
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createItem, getCategories } from "@/app/actions"
import { redirect } from "next/navigation"
import { Category } from "@/types"

export default async function ReportPage() {
  const { categories, error } = await getCategories()
  
  async function handleSubmit(formData: FormData) {
    'use server'
    const result = await createItem(formData)
    if (result.success) {
      redirect('/search')
    }
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Report an Item</h1>

      <Card className="max-w-2xl mx-auto">
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
                  {error ? (
                    <SelectItem value="error">Error loading categories</SelectItem>
                  ) : (
                    categories?.map((category: Category) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Rest of the form remains the same */}
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
              <Textarea id="description" name="description" placeholder="Provide a detailed description of the item..." rows={4} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Upload Image (optional)</Label>
              <Input id="image" name="image" type="file" accept="image/*" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact">Contact Information</Label>
              <Input id="contact" name="contact" placeholder="Email or phone number" />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full bg-[#932e1d] hover:bg-[#7a2617]">Submit Report</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}