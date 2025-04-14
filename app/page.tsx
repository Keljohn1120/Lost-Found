import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { StatsSection } from "@/components/stats-section"
import { ItemsShowcase } from "@/components/items-showcase"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-[#fafafa] to-white">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-[#932e1d]">
                Mapua Lost & Found System
              </h1>
              <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                A centralized platform for reporting and finding lost items at Mapua University. Report your lost items
                or help others find their belongings.
              </p>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/search">
                  <Button className="bg-[#932e1d] hover:bg-[#7a2617]">Search Items</Button>
                </Link>
                <Link href="/login?redirect=/report">
                  <Button variant="outline">Report Lost Item</Button>
                </Link>
              </div>
            </div>
            <div className="mx-auto lg:mr-0 relative">
              <Image
                src="/campus.jpg"
                alt="Mapua University Campus"
                width={600}
                height={400}
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <StatsSection />

      {/* Recent Items */}
      <ItemsShowcase />

      {/* How It Works */}
      <section className="py-12 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-[#932e1d]">How It Works</h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Our platform makes it easy to report lost items and find what you've lost.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
              <div className="flex flex-col items-center space-y-2 border rounded-lg p-6 bg-white shadow-sm">
                <div className="p-2 bg-[#932e1d]/10 rounded-full">
                  <div className="rounded-full bg-[#932e1d] w-10 h-10 flex items-center justify-center text-white font-bold">
                    1
                  </div>
                </div>
                <h3 className="text-xl font-bold">Report</h3>
                <p className="text-gray-500 text-center">Report your lost item or an item you found on campus</p>
              </div>
              <div className="flex flex-col items-center space-y-2 border rounded-lg p-6 bg-white shadow-sm">
                <div className="p-2 bg-[#932e1d]/10 rounded-full">
                  <div className="rounded-full bg-[#932e1d] w-10 h-10 flex items-center justify-center text-white font-bold">
                    2
                  </div>
                </div>
                <h3 className="text-xl font-bold">Connect</h3>
                <p className="text-gray-500 text-center">Connect with the person who found your item or lost an item</p>
              </div>
              <div className="flex flex-col items-center space-y-2 border rounded-lg p-6 bg-white shadow-sm">
                <div className="p-2 bg-[#932e1d]/10 rounded-full">
                  <div className="rounded-full bg-[#932e1d] w-10 h-10 flex items-center justify-center text-white font-bold">
                    3
                  </div>
                </div>
                <h3 className="text-xl font-bold">Retrieve</h3>
                <p className="text-gray-500 text-center">Arrange to meet and retrieve your lost item</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
