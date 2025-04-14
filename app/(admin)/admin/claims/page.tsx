import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { prisma } from "@/lib/db"
import Link from "next/link"
import { revalidatePath } from "next/cache"

export default async function VerifyClaimsPage() {
  const pendingClaims = await getPendingClaims()

  async function handleClaimAction(formData: FormData) {
    "use server"

    const claimId = Number(formData.get("claimId"))
    const action = formData.get("action") as string
    const status = action === "approve" ? "approved" : "rejected"

    try {
      // Update the claim status
      await prisma.claim.update({
        where: { id: claimId },
        data: { status },
      })

      // Get the claim with item and user details
      const claim = await prisma.claim.findUnique({
        where: { id: claimId },
        include: { item: true, user: true },
      })

      if (claim) {
        // If approved, update the item status
        if (status === "approved") {
          await prisma.item.update({
            where: { id: claim.itemId },
            data: { status: "resolved" },
          })
        }

        // Create notification for the user
        await prisma.notification.create({
          data: {
            userId: claim.userId,
            message: `Your claim for "${claim.item.title}" has been ${status}.`,
            isRead: false,
            relatedItemId: claim.itemId,
            relatedClaimId: claim.id,
          },
        })
      }

      revalidatePath("/admin/claims")
    } catch (error: any) {
      console.error("Error processing claim:", error)
    }
  }

  return (
    <div className="p-6">
      <div className="bg-[#932e1d] text-white p-4 rounded-t-lg flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Verify Claims</h1>
        <Link href="/">
          <Button variant="outline" className="text-white border-white hover:bg-[#7a2617] hover:text-white">
            Log out
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {pendingClaims.length > 0 ? (
          pendingClaims.map((claim) => (
            <Card key={claim.id}>
              <CardHeader>
                <CardTitle className="text-lg">
                  {claim.user.name} wants to claim your {claim.item.type} item.
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium">Item Details:</h3>
                    <p className="text-sm text-muted-foreground">
                      {claim.item.title} - {claim.item.description}
                    </p>
                    <p className="text-sm text-muted-foreground">Location: {claim.item.location || "N/A"}</p>
                    <p className="text-sm text-muted-foreground">
                      Date: {new Date(claim.item.dateReported).toLocaleDateString()}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-medium">Security Question:</h3>
                    <p className="text-sm">What unique identifying features does the item have?</p>
                    <p className="text-sm bg-muted p-2 rounded mt-1">{claim.proofDescription}</p>
                  </div>

                  <div>
                    <h3 className="font-medium">Contact Information:</h3>
                    <p className="text-sm text-muted-foreground">{claim.contactInfo}</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <form action={handleClaimAction}>
                  <input type="hidden" name="claimId" value={claim.id} />
                  <Button
                    type="submit"
                    name="action"
                    value="reject"
                    variant="outline"
                    className="text-red-500 border-red-200 hover:bg-red-50"
                  >
                    Reject
                  </Button>
                  <Button type="submit" name="action" value="approve" className="ml-2 bg-[#932e1d] hover:bg-[#7a2617]">
                    Accept
                  </Button>
                </form>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <h2 className="text-xl font-medium text-muted-foreground">No pending claims to verify</h2>
            <p className="text-muted-foreground mt-2">
              When users make claims, they will appear here for verification.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

async function getPendingClaims() {
  try {
    const claims = await prisma.claim.findMany({
      where: { status: "pending" },
      orderBy: { claimDate: "desc" },
      include: {
        user: true,
        item: true,
      },
    })

    return claims
  } catch (error: any) {
    console.error("Error fetching pending claims:", error)
    return []
  }
}
