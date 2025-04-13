// app/actions.ts
'use server'

import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { Item, Category } from '@/types'

export async function getItems(type?: string): Promise<{ items?: Item[], error?: string }> {
  try {
    const where: any = {}
    
    if (type) {
      where.type = type
    }
    
    const items = await prisma.item.findMany({
      where,
      include: {
        category: true,
      },
      orderBy: {
        dateReported: 'desc',
      },
    })

    return { items }
  } catch (error) {
    console.error('Error fetching items:', error)
    return { error: 'Failed to fetch items' }
  }
}

export async function getItemById(id: number): Promise<{ item?: Item, error?: string }> {
  try {
    const item = await prisma.item.findUnique({
      where: { id },
      include: {
        category: true,
      },
    })

    if (!item) {
      return { error: 'Item not found' }
    }

    return { item }
  } catch (error) {
    console.error('Error fetching item:', error)
    return { error: 'Failed to fetch item' }
  }
}

export async function createItem(formData: FormData): Promise<{ success?: boolean, item?: Item, error?: string }> {
  try {
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const type = formData.get('type') as string
    const location = formData.get('location') as string
    const dateLostOrFound = formData.get('date') as string
    const categoryId = parseInt(formData.get('category') as string)
    const contactInfo = formData.get('contact') as string
    
    // Validate required fields
    if (!title || !type) {
      return { error: 'Title and type are required' }
    }

    const item = await prisma.item.create({
      data: {
        title,
        description,
        type,
        location,
        dateLostOrFound: dateLostOrFound ? new Date(dateLostOrFound) : new Date(),
        categoryId: isNaN(categoryId) ? null : categoryId,
        contactInfo,
      },
    })

    revalidatePath('/search')
    return { success: true, item }
  } catch (error) {
    console.error('Error creating item:', error)
    return { error: 'Failed to create item' }
  }
}

export async function getCategories(): Promise<{ categories?: Category[], error?: string }> {
  try {
    const categories = await prisma.category.findMany()
    return { categories }
  } catch (error) {
    console.error('Error fetching categories:', error)
    return { error: 'Failed to fetch categories' }
  }
}