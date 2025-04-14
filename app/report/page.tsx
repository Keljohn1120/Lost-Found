import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ReportPage() {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Report an Item</h1>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Item Information</CardTitle>
          <CardDescription>Please provide details about the item you want to report.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="item-type">Item Type</Label>
            <RadioGroup defaultValue="lost" id="item-type" className="flex gap-4">
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
            <Input id="item-name" placeholder="e.g., Backpack, Phone, ID Card" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select>
              <SelectTrigger id="category">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="electronics">Electronics</SelectItem>
                <SelectItem value="clothing">Clothing</SelectItem>
                <SelectItem value="accessories">Accessories</SelectItem>
                <SelectItem value="documents">Documents</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input id="date" type="date" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input id="location" placeholder="Where was the item lost/found?" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" placeholder="Provide a detailed description of the item..." rows={4} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Upload Image (optional)</Label>
            <Input id="image" type="file" accept="image/*" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact">Contact Information</Label>
            <Input id="contact" placeholder="Email or phone number" />
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full bg-[#932e1d] hover:bg-[#7a2617]">Submit Report</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
