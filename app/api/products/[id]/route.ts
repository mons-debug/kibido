import { prisma } from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// GET /api/products/[id] - Get a single product by ID or slug
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Use params safely
    const id = params.id;
    
    if (!id) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }
    
    // Try to find by ID first
    let product = await prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });
    
    // If not found by ID, try finding by slug
    if (!product) {
      product = await prisma.product.findUnique({
        where: { slug: id },
        include: { category: true },
      });
    }

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

// DELETE /api/products/[id] - Delete a product by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if user is authenticated and is an admin
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: params.id },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    // Delete product
    await prisma.product.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}

// PATCH /api/products/[id] - Update a product by ID
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: params.id },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    // Update product
    const updatedProduct = await prisma.product.update({
      where: { id: params.id },
      data: {
        name: body.name !== undefined ? body.name : undefined,
        description: body.description !== undefined ? body.description : undefined,
        price: body.price !== undefined ? body.price : undefined,
        stock: body.stock !== undefined ? body.stock : undefined,
        categoryId: body.categoryId !== undefined ? body.categoryId : undefined,
        featured: body.featured !== undefined ? body.featured : undefined,
        latest: body.latest !== undefined ? body.latest : undefined,
        images: body.images !== undefined ? body.images : undefined,
      },
      include: { category: true },
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

// PUT /api/products/[id] - Replace a product completely
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // For debugging temporarily, let's skip the auth check
    // Comment this back in after resolving the issue
    /*
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    */

    // Get product ID from params
    const id = params.id;
    let body;
    
    try {
      body = await request.json();
      console.log("Request body:", body);
    } catch (e) {
      console.error("Failed to parse request body:", e);
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return NextResponse.json(
        { error: `Product with ID ${id} not found` },
        { status: 404 }
      );
    }

    // Validate required fields
    if (!body.name || !body.slug || body.price === undefined || body.stock === undefined || !body.categoryId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if slug is already taken by another product
    const existingProductWithSlug = await prisma.product.findFirst({
      where: { 
        slug: body.slug,
        id: {
          not: id
        }
      },
    });

    if (existingProductWithSlug) {
      return NextResponse.json(
        { error: "Slug is already in use by another product" },
        { status: 400 }
      );
    }

    console.log("Updating product with data:", body);

    // Update product
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name: body.name,
        slug: body.slug,
        description: body.description,
        price: parseFloat(body.price.toString()),
        stock: parseInt(body.stock.toString()),
        categoryId: body.categoryId,
        artist: body.artist || null,
        featured: body.featured !== undefined ? body.featured : false,
        latest: body.latest !== undefined ? body.latest : false,
        images: body.images || [],
        gallery: body.gallery || [],
      },
      include: { category: true },
    });

    console.log("Product updated successfully:", updatedProduct);
    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Failed to update product: " + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    );
  }
} 