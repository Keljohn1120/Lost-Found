import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { prisma } from "@/lib/db"
import Link from "next/link"
import { UserPlus } from "lucide-react"

export default async function UserManagementPage() {
  const users = await getAllUsers()

  return (
    <div className="p-6">
      <div className="bg-[#932e1d] text-white p-4 rounded-t-lg flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">User Management</h1>
        <Link href="/">
          <Button variant="outline" className="text-white border-white hover:bg-[#7a2617] hover:text-white">
            Log out
          </Button>
        </Link>
      </div>

      <div className="flex justify-between mb-6">
        <div className="flex gap-2">
          <Button className="flex items-center gap-2 bg-[#932e1d] hover:bg-[#7a2617]">
            <UserPlus className="h-4 w-4" />
            Add User
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Role
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Reports
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3 text-sm">{user.name}</td>
                  <td className="px-4 py-3 text-sm">{user.email}</td>
                  <td className="px-4 py-3 text-sm">
                    <Badge
                      variant="outline"
                      className={
                        user.role === "admin" ? "text-purple-600 border-purple-300" : "text-blue-600 border-blue-300"
                      }
                    >
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-sm">{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-sm">{user.reportCount}</td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex gap-2">
                      <Link href={`/admin/messages?user=${user.id}`}>
                        <Button variant="outline" size="sm">
                          Message
                        </Button>
                      </Link>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

async function getAllUsers() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
    })

    // Get report count for each user
    const usersWithReportCount = await Promise.all(
      users.map(async (user) => {
        const reportCount = await prisma.item.count({
          where: { userId: user.id },
        })

        return {
          ...user,
          reportCount,
        }
      }),
    )

    return usersWithReportCount
  } catch (error: any) {
    console.error("Error fetching users:", error)
    return []
  }
}
