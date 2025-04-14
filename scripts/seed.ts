import { prisma } from '../lib/db'

async function main() {
  // Create categories
  const categories = [
    { name: 'Electronics', description: 'Phones, laptops, tablets, etc.' },
    { name: 'Clothing', description: 'Jackets, hats, scarves, etc.' },
    { name: 'Accessories', description: 'Jewelry, watches, glasses, etc.' },
    { name: 'Documents', description: 'IDs, passports, cards, etc.' },
    { name: 'Other', description: 'Miscellaneous items' },
  ]

  for (const category of categories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: category,
    })
  }

  // Create a test user
  const user = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      name: 'Test User',
      passwordHash: '$2a$10$GQH.xZRMWZFTXEyxPGgE5OlCu.YGBQfAzjKr1yp1OwzOklhVINs4i', // password: password123
      role: 'admin',
    },
  })

  // Create sample items
  const items = [
    {
      title: 'Blue Backpack',
      description: 'Blue backpack with laptop and books inside. Last seen in the library.',
      type: 'lost',
      location: 'Main Building, 2nd Floor',
      dateLostOrFound: new Date('2023-04-05'),
      categoryId: 5, // Other
      userId: user.id,
      contactInfo: 'test@example.com',
      imageUrl: '/placeholder.svg?height=200&width=300&text=Backpack',
    },
    {
      title: 'iPhone 13',
      description: 'Black iPhone 13 with a clear case. Last seen during lunch break.',
      type: 'lost',
      location: 'Cafeteria',
      dateLostOrFound: new Date('2023-04-07'),
      categoryId: 1, // Electronics
      userId: user.id,
      contactInfo: 'test@example.com',
      imageUrl: '/placeholder.svg?height=200&width=300&text=iPhone',
    },
    {
      title: 'Student ID Card',
      description: 'Student ID card for John Doe. Found near the cafeteria entrance.',
      type: 'found',
      location: 'Cafeteria Building',
      dateLostOrFound: new Date('2023-04-08'),
      categoryId: 4, // Documents
      userId: user.id,
      contactInfo: 'test@example.com',
      imageUrl: '/placeholder.svg?height=200&width=300&text=ID Card',
    },
  ]

  for (const item of items) {
    await prisma.item.create({
      data: item,
    })
  }

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })