# Product Import Tool

This tool allows you to import products from a CSV file into the Kibido e-commerce database using Prisma.

## Prerequisites

- Node.js and npm installed
- Kibido project set up with a PostgreSQL database
- CSV file with product data in the root directory (`products.csv`)
- Images already present in the `/public/images/products/` directory

## CSV Format

The CSV file should have the following columns:
- `id`: Unique identifier for the product (not used for the database ID)
- `name`: Product name
- `slug`: URL-friendly slug (must be unique)
- `category`: Category name (will be created if it doesn't exist)
- `price`: Price as a decimal number
- `description`: Product description (optional)
- `artist`: Artist name (optional)
- `image`: Path to the main product image
- `featured`: Whether the product should be featured ('true' or 'false')
- `createdAt`: Creation date (optional)
- `updatedAt`: Last update date (optional)

## Image Paths

The CSV can contain image paths in two formats:
1. Relative path: `filename.jpg` or `filename.png` (will be prefixed with `/images/products/`)
2. Full path: `/images/products/filename.jpg` (used as-is)

The script will check if the images exist in the `/public/images/products/` directory.

## Running the Import

1. Make sure your database is set up and running
2. Place your `products.csv` file in the root directory of the project
3. Ensure your product images are in the `/public/images/products/` directory
4. Run the import script:

```bash
npm run import-products
```

## How It Works

The script:
1. Reads and parses the CSV file
2. Creates categories if they don't exist
3. Checks if the product already exists (by slug) and skips if it does
4. Validates image paths and checks if the files exist
5. Creates products in the database with all the provided information

## Troubleshooting

If you encounter issues:

- Check that your CSV format matches the expected format
- Verify that image paths are correct and files exist in the specified locations
- Make sure your database connection is properly configured
- Check the console output for specific error messages 