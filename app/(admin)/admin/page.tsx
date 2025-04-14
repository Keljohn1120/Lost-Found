import { Card, CardContent } from "@/components/ui/card"
import { prisma } from "@/lib/db"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default async function AdminDashboard() {
  // Fetch dashboard stats
  const stats = await getDashboardStats()
  const recentReports = await getRecentReports(5)
  const userActivity = await getUserActivity(3)

  return (
    <div className="p-6">
      <div className="bg-[#932e1d] text-white p-4 rounded-t-lg flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <Link href="/">
          <Button variant="outline" className="text-white border-white hover:bg-[#7a2617] hover:text-white">
            Log out
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-6 flex flex-col items-center justify-center">
            <p className="text-4xl font-bold">{stats.totalReports}</p>
            <p className="text-sm font-medium text-muted-foreground">Total Reports</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex flex-col items-center justify-center">
            <p className="text-4xl font-bold">{stats.pendingClaims}</p>
            <p className="text-sm font-medium text-muted-foreground">Pending Claims</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex flex-col items-center justify-center">
            <p className="text-4xl font-bold">{stats.resolvedClaims}</p>
            <p className="text-sm font-medium text-muted-foreground">Resolved Claims</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex flex-col items-center justify-center">
            <p className="text-4xl font-bold">{stats.overdueClaims}</p>
            <p className="text-sm font-medium text-muted-foreground">Overdue Claims</p>
          </CardContent>
        </Card>
      </div>

      {/* User Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-bold mb-4">User Activity</h2>
            <div className="space-y-4">
              {userActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between border-b pb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                      {activity.user.name.charAt(0).toUpperCase()}
                    </div>
                    <span>{activity.user.name}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{activity.action}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Reports */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-bold mb-4">Recent Reports</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-5 text-xs font-medium text-muted-foreground mb-2">
                <div>Location</div>
                <div>Name/Description</div>
                <div>Ref. No.</div>
                <div>Date</div>
                <div>Status</div>
              </div>
              {recentReports.map((report) => (
                <div key={report.id} className="grid grid-cols-5 text-sm border-b pb-2">
                  <div>{report.location}</div>
                  <div>{report.title}</div>
                  <div>M-{report.id.toString().padStart(4, "0")}</div>
                  <div>{new Date(report.dateReported).toLocaleDateString()}</div>
                  <div>
                    <Badge
                      variant="outline"
                      className={
                        report.status === "pending"
                          ? "text-yellow-600 border-yellow-300"
                          : report.status === "claimed"
                            ? "text-blue-600 border-blue-300"
                            : "text-green-600 border-green-300"
                      }
                    >
                      {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-right">
              <Link href="/admin/reports">
                <Button variant="link" className="text-[#932e1d]">
                  View All Reports
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

async function getDashboardStats() {
  try {
    const totalReports = await prisma.item.count()

    const pendingClaims = await prisma.claim.count({
      where: { status: "pending" },
    })

    const resolvedClaims = await prisma.claim.count({
      where: { status: "approved" },
    })

    // Overdue claims (claims older than 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const overdueClaims = await prisma.claim.count({
      where: {
        status: "pending",
        claimDate: {
          lt: thirtyDaysAgo,
        },
      },
    })

    return {
      totalReports,
      pendingClaims,
      resolvedClaims,
      overdueClaims,
    }
  } catch (error: any) {
    console.error("Error fetching dashboard stats:", error)
    return {
      totalReports: 0,
      pendingClaims: 0,
      resolvedClaims: 0,
      overdueClaims: 0,
    }
  }
}

async function getRecentReports(limit: number) {
  try {
    const reports = await prisma.item.findMany({
      take: limit,
      orderBy: { dateReported: "desc" },
      include: { category: true },
    })

    return reports
  } catch (error: any) {
    console.error("Error fetching recent reports:", error)
    return []
  }
}

async function getUserActivity(limit: number) {
  try {
    // Get recent items with user info
    const recentItems = await prisma.item.findMany({
      take: limit,
      orderBy: { dateReported: "desc" },
      include: { user: true },
      where: {
        userId: { not: null },
      },
    })

    // Get recent claims with user info
    const recentClaims = await prisma.claim.findMany({
      take: limit,
      orderBy: { claimDate: "desc" },
      include: { user: true, item: true },
    })

    // Combine and format the activities
    const itemActivities = recentItems.map((item) => ({
      id: `item-${item.id}`,
      user: item.user!,
      action: `Reported ${item.type} item: ${item.title}`,
      date: item.dateReported,
    }))

    const claimActivities = recentClaims.map((claim) => ({
      id: `claim-${claim.id}`,
      user: claim.user,
      action: `Claimed item: ${claim.item.title}`,
      date: claim.claimDate,
    }))

    // Combine, sort by date, and limit
    return [...itemActivities, ...claimActivities].sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, limit)
  } catch (error: any) {
    console.error("Error fetching user activity:", error)
    return []
  }
}
