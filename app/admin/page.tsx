// app/admin/page.tsx
import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/db"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Key, ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from "react"

export default async function AdminDashboard() {
  const session = await getServerSession()
  
  // Check if user is authenticated and is an admin
  if (!session || session.user?.role !== 'admin') {
    redirect('/login')
  }
  
  // Fetch stats
  const totalItems = await prisma.item.count()
  const lostItems = await prisma.item.count({ where: { type: 'lost' } })
  const foundItems = await prisma.item.count({ where: { type: 'found' } })
  const totalUsers = await prisma.user.count()
  
  // Fetch recent items
  const recentItems = await prisma.item.findMany({
    take: 5,
    orderBy: { dateReported: 'desc' },
    include: { category: true }
  })

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalItems}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Lost Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lostItems}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Found Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{foundItems}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Items</CardTitle>
            <CardDescription>Recently reported lost and found items</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentItems.map((item: { id: Key | null | undefined; title: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; type: string; dateReported: string | number | Date }) => (
                <div key={item.id} className="flex justify-between items-center border-b pb-2">
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.type === 'lost' ? 'Lost' : 'Found'} • {new Date(item.dateReported).toLocaleDateString()}
                    </p>
                  </div>
                  <Link href={`/items/${item.id}`}>
                    <Button variant="outline" size="sm">View</Button>
                  </Link>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Admin Actions</CardTitle>
            <CardDescription>Manage the lost and found system</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/admin/users" className="block">
              <Button variant="outline" className="w-full justify-start">
                Manage Users
              </Button>
            </Link>
            <Link href="/admin/categories" className="block">
              <Button variant="outline" className="w-full justify-start">
                Manage Categories
              </Button>
            </Link>
            <Link href="/admin/items" className="block">
              <Button variant="outline" className="w-full justify-start">
                Manage Items
              </Button>
            </Link>
            <Link href="/admin/settings" className="block">
              <Button variant="outline" className="w-full justify-start">
                System Settings
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}