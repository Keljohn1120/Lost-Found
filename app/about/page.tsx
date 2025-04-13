import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AboutPage() {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">About Mapua Lost & Found System</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div>
          <p className="text-lg mb-4">
            The Mapua Lost & Found System is a platform designed to help students, faculty, and staff report and search
            for lost items within the university campus.
          </p>
          <p className="text-lg mb-4">
            Our mission is to reunite people with their lost belongings efficiently and securely, making the process as
            simple as possible for everyone involved.
          </p>
          <p className="text-lg">
            The system was developed by the Computer Science Department as part of a student project and has been
            serving the Mapua community since 2022.
          </p>
        </div>
        <div className="relative h-[300px] rounded-lg overflow-hidden">
          <Image src="/campus.jpg" alt="Mapua University Campus" fill className="object-cover" />
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-6">How It Works</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card>
          <CardHeader>
            <CardTitle>Report</CardTitle>
            <CardDescription>Lost or found an item?</CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Submit a detailed report with information about the item, including when and where it was lost or found.
              Adding photos helps increase the chances of a match.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Search</CardTitle>
            <CardDescription>Looking for your item?</CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Browse through the database of reported items or use the search function to find items matching your
              description. Filter by category, date, or location.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Claim</CardTitle>
            <CardDescription>Found a match?</CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Contact the administrator through the platform to arrange for verification and collection of your item.
              You'll need to provide proof of ownership.
            </p>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-2xl font-bold mb-6">Contact Information</h2>

      <Card className="mb-12">
        <CardContent className="pt-6">
          <p className="mb-2">
            <strong>Location:</strong> Student Services Office, Ground Floor, Main Building
          </p>
          <p className="mb-2">
            <strong>Office Hours:</strong> Monday to Friday, 8:00 AM to 5:00 PM
          </p>
          <p className="mb-2">
            <strong>Email:</strong> lostandfound@mapua.edu.ph
          </p>
          <p>
            <strong>Phone:</strong> (02) 8123-4567
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
