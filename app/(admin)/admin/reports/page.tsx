import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { prisma } from "@/lib/db"
import Link from "next/link"
import { FileDown, Plus, Trash2 } from "lucide-react"

export default async function ManageReportsPage() {
  const reports = await getAllReports()

  return (
    <div className="p-6">
      <div className="bg-[#932e1d] text-white p-4 rounded-t-lg flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Reports</h1>
        <Link href="/">
          <Button variant="outline" className="text-white border-white hover:bg-[#7a2617] hover:text-white">
            Log out
          </Button>
        </Link>
      </div>

      <div className="flex justify-between mb-6">
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <FileDown className="h-4 w-4" />
            Export Report
          </Button>
          <Button className="flex items-center gap-2 bg-[#932e1d] hover:bg-[#7a2617]">
            <Plus className="h-4 w-4" />
            Add Report
          </Button>
          <Button variant="outline" className="flex items-center gap-2 text-red-500 border-red-200 hover:bg-red-50">
            <Trash2 className="h-4 w-4" />
            Delete Report
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Location
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Name/Description
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Ref. No.
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Date Found
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {reports.map((report) => (
                <tr key={report.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3 text-sm">{report.location || "N/A"}</td>
                  <td className="px-4 py-3 text-sm">{report.title}</td>
                  <td className="px-4 py-3 text-sm">M-{report.id.toString().padStart(4, "0")}</td>
                  <td className="px-4 py-3 text-sm">
                    {report.dateLostOrFound
                      ? new Date(report.dateLostOrFound).toLocaleDateString()
                      : new Date(report.dateReported).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-sm">
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
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex gap-2">
                      <Link href={`/admin/reports/${report.id}`}>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </Link>
                      <Button variant="outline" size="sm" className="text-red-500 border-red-200 hover:bg-red-50">
                        Delete
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

async function getAllReports() {
  try {
    const reports = await prisma.item.findMany({
      orderBy: { dateReported: "desc" },
      include: { category: true },
    })

    return reports
  } catch (error: any) {
    console.error("Error fetching reports:", error)
    return []
  }
}
