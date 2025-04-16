"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, UploadCloud, X, Plus } from "lucide-react";

interface Category {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  stock: number;
  categoryId: string;
  artist: string | null;
  featured: boolean;
  latest: boolean;
  images: string[];
  gallery?: string[];
}

export default function EditProductPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const productId = params.id;
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formError, setFormError] = useState("");
  const [mainImage, setMainImage] = useState<string | null>(null);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState({ main: false, gallery: false });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  // Fetch product data and categories when component mounts
  useEffect(() => {
    const fetchProductAndCategories = async () => {
      try {
        setIsLoading(true);
        
        // Fetch product data
        const productResponse = await fetch(`/api/products/${productId}`);
        if (!productResponse.ok) {
          throw new Error("Failed to fetch product");
        }
        const productData = await productResponse.json();
        setProduct(productData);
        
        // Set main image and gallery images
        if (productData.images && productData.images.length > 0) {
          setMainImage(productData.images[0]);
        }
        if (productData.gallery && productData.gallery.length > 0) {
          setGalleryImages(productData.gallery);
        }
        
        // Fetch categories
        const categoriesResponse = await fetch("/api/categories");
        if (!categoriesResponse.ok) {
          throw new Error("Failed to fetch categories");
        }
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setFormError("Failed to load product data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductAndCategories();
  }, [productId]);

  // Generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    const slugInput = document.getElementById('slug') as HTMLInputElement;
    if (slugInput && slugInput.value === '') {
      slugInput.value = generateSlug(name);
    }
  };

  const handleUploadImage = async (file: File, type: 'main' | 'gallery') => {
    if (!file) return null;

    try {
      setUploading({ ...uploading, [type]: true });
      
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error('Error uploading image:', error);
      setFormError('Failed to upload image. Please try again.');
      return null;
    } finally {
      setUploading({ ...uploading, [type]: false });
    }
  };

  const handleMainImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    const imageUrl = await handleUploadImage(file, 'main');
    
    if (imageUrl) {
      setMainImage(imageUrl);
    }
  };

  const handleGalleryImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    const imageUrl = await handleUploadImage(file, 'gallery');
    
    if (imageUrl) {
      setGalleryImages([...galleryImages, imageUrl]);
    }
  };

  const removeGalleryImage = (index: number) => {
    setGalleryImages(galleryImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    setFormError("");

    const formData = new FormData(e.currentTarget);
    
    // Prepare images array
    const images = mainImage ? [mainImage] : [];
    
    const productData = {
      name: formData.get("name") as string,
      slug: formData.get("slug") as string,
      description: formData.get("description") as string,
      price: parseFloat(formData.get("price") as string),
      stock: parseInt(formData.get("stock") as string),
      categoryId: formData.get("categoryId") as string,
      artist: formData.get("artist") as string,
      featured: formData.get("featured") === "on",
      latest: formData.get("latest") === "on",
      images: images,
      gallery: galleryImages,
    };

    // Validate required fields
    if (!productData.slug) {
      setFormError("Slug is required");
      setIsSaving(false);
      return;
    }

    try {
      // Log data being sent to help debugging
      console.log("Sending product data:", JSON.stringify(productData));
      
      const response = await fetch(`/api/products/${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        let errorMessage = "Failed to update product";
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (jsonError) {
          // If JSON parsing fails, use response status text or a generic message
          errorMessage = response.statusText || `Server error: ${response.status}`;
        }
        throw new Error(errorMessage);
      }

      // Only try to parse if the response was OK
      const result = await response.json();
      console.log("Update successful:", result);

      // Navigate after successful update - don't use setTimeout as it can cause issues
      router.push("/dashboard/products");
    } catch (error) {
      console.error("Failed to update product:", error);
      setFormError(error instanceof Error ? error.message : "Failed to update product. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading product data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/products"
          className="flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to products
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Edit Product</h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {formError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {formError}
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                defaultValue={product?.name}
                onChange={handleNameChange}
                className="block w-full rounded-md border-gray-300 shadow-sm px-3 py-2 border focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
                Slug <span className="text-red-500">*</span>
              </label>
              <input
                id="slug"
                name="slug"
                type="text"
                required
                defaultValue={product?.slug}
                className="block w-full rounded-md border-gray-300 shadow-sm px-3 py-2 border focus:border-blue-500 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500">
                URL-friendly name for the product (no spaces or special characters)
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                id="categoryId"
                name="categoryId"
                required
                defaultValue={product?.categoryId}
                className="block w-full rounded-md border-gray-300 shadow-sm px-3 py-2 border focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="artist" className="block text-sm font-medium text-gray-700">
                Artist
              </label>
              <input
                id="artist"
                name="artist"
                type="text"
                defaultValue={product?.artist || ''}
                className="block w-full rounded-md border-gray-300 shadow-sm px-3 py-2 border focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                Price <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  defaultValue={product?.price}
                  className="block w-full pl-8 rounded-md border-gray-300 shadow-sm px-3 py-2 border focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="stock" className="block text-sm font-medium text-gray-700">
                Stock <span className="text-red-500">*</span>
              </label>
              <input
                id="stock"
                name="stock"
                type="number"
                min="0"
                required
                defaultValue={product?.stock}
                className="block w-full rounded-md border-gray-300 shadow-sm px-3 py-2 border focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={6}
                defaultValue={product?.description || ''}
                className="block w-full rounded-md border-gray-300 shadow-sm px-3 py-2 border focus:border-blue-500 focus:ring-blue-500"
              ></textarea>
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Main Product Image
              </label>
              <div className="mt-1 flex items-center">
                {mainImage ? (
                  <div className="relative w-32 h-32 rounded-md border overflow-hidden">
                    <img
                      src={mainImage}
                      alt="Main product"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setMainImage(null)}
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="relative">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleMainImageChange}
                      className="sr-only"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      disabled={uploading.main}
                    >
                      {uploading.main ? (
                        <span className="mr-2">Uploading...</span>
                      ) : (
                        <>
                          <UploadCloud className="mr-2 h-4 w-4" />
                          <span>Upload</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500">
                Upload a high-quality image of your product. Recommended size: 800x800px.
              </p>
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Gallery Images
              </label>
              <div className="mt-1 flex flex-wrap gap-3">
                {galleryImages.map((image, index) => (
                  <div key={index} className="relative w-32 h-32 rounded-md border overflow-hidden">
                    <img
                      src={image}
                      alt={`Gallery ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeGalleryImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <div className="relative">
                  <input
                    ref={galleryInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleGalleryImageChange}
                    className="sr-only"
                  />
                  <button
                    type="button"
                    onClick={() => galleryInputRef.current?.click()}
                    className="inline-flex items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-md text-gray-600 hover:border-gray-400 hover:bg-gray-50"
                    disabled={uploading.gallery}
                  >
                    {uploading.gallery ? (
                      <span>Uploading...</span>
                    ) : (
                      <div className="text-center">
                        <Plus className="mx-auto h-6 w-6" />
                        <span className="mt-1 block text-xs">Add Image</span>
                      </div>
                    )}
                  </button>
                </div>
              </div>
              <p className="text-xs text-gray-500">
                Add additional images to showcase different angles or details of your product.
              </p>
            </div>

            <div className="md:col-span-2">
              <div className="flex items-center">
                <input
                  id="featured"
                  name="featured"
                  type="checkbox"
                  defaultChecked={product?.featured}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="featured" className="ml-2 block text-sm text-gray-700">
                  Featured product (displayed prominently on the homepage)
                </label>
              </div>
            </div>

            <div className="md:col-span-2">
              <div className="flex items-center">
                <input
                  id="latest"
                  name="latest"
                  type="checkbox"
                  defaultChecked={product?.latest}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="latest" className="ml-2 block text-sm text-gray-700">
                  Latest product (displayed in the Latest Artworks section on the homepage)
                </label>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-200 flex justify-end space-x-3">
            <Link
              href="/dashboard/products"
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSaving}
              className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 ${
                isSaving ? "opacity-75 cursor-not-allowed" : ""
              }`}
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 