// User types
export interface User {
  id: number
  email: string
  name: string
  passwordHash: string
  role: "user" | "admin"
  createdAt: Date
  updatedAt: Date
}

// Item types
export interface Category {
  id: number
  name: string
  description: string | null
}

export interface Item {
  id: number
  title: string
  description: string | null
  type: "lost" | "found"
  status: "pending" | "claimed" | "resolved"
  dateReported: Date
  dateLostOrFound: Date | null
  location: string | null
  imageUrl: string | null
  categoryId: number | null
  userId: number | null
  contactInfo: string | null
  createdAt: Date
  updatedAt: Date
  category?: Category
  user?: User
}

// Notification types
export interface Notification {
  id: number
  userId: number
  message: string
  isRead: boolean
  createdAt: Date
  relatedItemId?: number
  relatedClaimId?: number
}

// Message types
export interface Message {
  id: number
  senderId: number
  receiverId: number
  content: string
  isRead: boolean
  createdAt: Date
  sender?: User
  receiver?: User
}

// Claim types
export interface Claim {
  id: number
  itemId: number
  userId: number
  claimDate: Date
  status: "pending" | "approved" | "rejected"
  proofDescription: string | null
  contactInfo: string | null
  createdAt: Date
  updatedAt: Date
  item?: Item
  user?: User
}
