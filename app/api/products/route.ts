import { prisma } from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// GET /api/products - Get all products
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');
    const limit = searchParams.get('limit');
    const featured = searchParams.get('featured') === 'true';
    const latest = searchParams.get('latest') === 'true';
    const sortBy = searchParams.get('sortBy');
    
    // Build query options
    let queryOptions: any = {
      include: {
        category: true
      }
    };
    
    // Add filters if provided
    if (categoryId) {
      queryOptions.where = {
        ...queryOptions.where,
        categoryId: categoryId
      };
    }
    
    if (featured) {
      queryOptions.where = {
        ...queryOptions.where,
        featured: true
      };
    }
    
    // Use the latest field for latest products
    if (latest) {
      queryOptions.where = {
        ...queryOptions.where,
        latest: true
      };
      
      // If no latest products are marked, fall back to most recent
      const latestProducts = await prisma.product.findMany({
        where: { latest: true },
        take: 1
      });
      
      if (latestProducts.length === 0) {
        // No products marked as 'latest', fallback to createdAt sorting
        delete queryOptions.where?.latest;
        queryOptions.orderBy = {
          createdAt: 'desc'
        };
        
        // Limit to the most recent products (if no specific limit provided)
        if (!limit) {
          queryOptions.take = 8;
        }
      }
    }
    else if (sortBy) {
      // Add sorting if provided and not "latest"
      const [field, order] = sortBy.split(':');
      queryOptions.orderBy = {
        [field]: order.toLowerCase() === 'desc' ? 'desc' : 'asc'
      };
    } else {
      // Default sort by createdAt descending (newest first)
      queryOptions.orderBy = {
        createdAt: 'desc'
      };
    }
    
    // Add limit if provided
    if (limit) {
      queryOptions.take = parseInt(limit);
    }
    
    const products = await prisma.product.findMany(queryOptions);
    
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// POST /api/products - Create a new product
export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated and is an admin
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.price || !body.categoryId || !body.slug) {
      return NextResponse.json(
        { error: "Missing required fields: name, price, categoryId, and slug are required" },
        { status: 400 }
      );
    }

    // Validate slug format
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    if (!slugRegex.test(body.slug)) {
      return NextResponse.json(
        { error: "Invalid slug format. Use only lowercase letters, numbers, and hyphens" },
        { status: 400 }
      );
    }

    // Check if the slug is already in use
    const existingProduct = await prisma.product.findUnique({
      where: { slug: body.slug },
    });

    if (existingProduct) {
      return NextResponse.json(
        { error: "Slug is already in use. Please choose a different one" },
        { status: 400 }
      );
    }

    // Create product
    const product = await prisma.product.create({
      data: {
        name: body.name,
        slug: body.slug,
        description: body.description || "",
        price: body.price,
        stock: body.stock || 0,
        categoryId: body.categoryId,
        artist: body.artist || null,
        featured: body.featured || false,
        latest: body.latest || false,
        images: body.images || [],
        gallery: body.gallery || [],
      },
      include: {
        category: true,
      },
    });
    
    return NextResponse.json(product);
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
} 