import { prisma } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type')
  const category = searchParams.get('category')
  const query = searchParams.get('query')

  const where: any = {}
  
  if (type) {
    where.type = type
  }
  
  if (category) {
    where.categoryId = parseInt(category)
  }
  
  if (query) {
    where.OR = [
      { title: { contains: query, mode: 'insensitive' } },
      { description: { contains: query, mode: 'insensitive' } },
      { location: { contains: query, mode: 'insensitive' } },
    ]
  }

  try {
    const items = await prisma.item.findMany({
      where,
      include: {
        category: true,
      },
      orderBy: {
        dateReported: 'desc',
      },
    })

    return NextResponse.json(items)
  } catch (error) {
    console.error('Error fetching items:', error)
    return NextResponse.json({ error: 'Failed to fetch items' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    const item = await prisma.item.create({
      data: {
        title: data.title,
        description: data.description,
        type: data.type,
        location: data.location,
        dateLostOrFound: data.dateLostOrFound ? new Date(data.dateLostOrFound) : new Date(),
        categoryId: data.categoryId ? parseInt(data.categoryId) : null,
        userId: data.userId ? parseInt(data.userId) : null,
        contactInfo: data.contactInfo,
        imageUrl: data.imageUrl,
      },
    })

    return NextResponse.json(item, { status: 201 })
  } catch (error) {
    console.error('Error creating item:', error)
    return NextResponse.json({ error: 'Failed to create item' }, { status: 500 })
  }
}