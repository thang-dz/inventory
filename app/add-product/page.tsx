import Link from "next/link";
import SiderBar from "../components/sidebar";
import { getCurrentUser } from "../lib/auth";
import { CreateProduct } from "../lib/actions/products";

export default async function AddProductPage() {
  const user = await getCurrentUser();
  return (
    <div className="min-h-screen bg-gray-50">
      <SiderBar curentPath="/add-product" />
      <main className="ml-64 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Add Product</h1>
          <p className="text-sm  text-gray-600">
            Create, read, update, delete products
          </p>
        </div>
        <div className="max-w-2xl">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <form className=" space-y-6" action={CreateProduct}>
              <div >
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Product Name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className=" w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-transparent"
                  placeholder="Enter Product Name"
                />
              </div>
              <div className=" grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 ">
                <div>
                  <label
                    htmlFor="price"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Price <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    id="price"
                    name="price"
                    step="0.01"
                    min="0"
                    required
                    className=" w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-transparent"
                    placeholder="0.0"
                  />
                </div>
                <div>
                  <label
                    htmlFor="quantity"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Quantity <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    id="quantity"
                    name="quantity"
                    min="0"
                    required
                    className=" w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-transparent"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label
                  htmlFor="sku"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  SKU (Optional)
                </label>
                <input
                  type="text"
                  id="sku"
                  name="sku"
                  className=" w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-transparent"
                  placeholder="Enter SKU"
                />
              </div>
              <div className="mt-4">
                <label
                  htmlFor="lowStock"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Low Stock At (optional)
                </label>
                <input
                  type="text"
                  id="lowStock"
                  name="lowStock"
                  min="0"
                  className=" w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-transparent"
                  placeholder="Enter low stock threshold"
                />
              </div>
              <div className="flex gap-5 mt-5">
                <button
                  type="submit"
                  className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
                >
                  Add Product
                </button>
                <Link href="/inventory" className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Cancel</Link>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
