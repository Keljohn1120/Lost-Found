// types/index.ts

export interface User {
    id: number;
    email: string;
    name: string;
    passwordHash: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface Category {
    id: number;
    name: string;
    description: string | null;
  }
  
  export interface Item {
    id: number;
    title: string;
    description: string | null;
    type: 'lost' | 'found';
    status: string;
    dateReported: Date;
    dateLostOrFound: Date | null;
    location: string | null;
    imageUrl: string | null;
    categoryId: number | null;
    userId: number | null;
    contactInfo: string | null;
    createdAt: Date;
    updatedAt: Date;
    category?: Category;
    user?: User;
  }