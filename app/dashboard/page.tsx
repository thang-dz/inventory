import { Prisma } from "@prisma/client";
import SiderBar from "../components/sidebar";
import { prisma } from "../lib/prisma";
import { getCurrentUser } from "../lib/auth";
import { Key, TrendingUp } from "lucide-react";
import ProductsChart from "../components/productChar";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/sign-in");
  }
  const userId = user.id;

  const [totalProducts, lowStock, allProducts] = await Promise.all([
    prisma.product.count({ where: { userId } }),
    prisma.product.count({
      where: {
        userId,
        lowStockAt: { not: null },
        quantity: { lte: 5 },
      },
    }),
    prisma.product.findMany({
      where: { userId },
      select: { price: true, quantity: true, createdAt: true },
    }),
  ]);

  const recent = await prisma.product.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const totalValue = allProducts.reduce(
    (sum, product) => sum + Number(product.price) * Number(product.quantity),
    0,
  );

  const now = new Date();

  const weeklyData = [];

  for (let i = 11; i >= 0; i--) {
    const weekStart = new Date(now);
    weekStart.setDate(weekStart.getDate() - i * 7);
    weekStart.setHours(0, 0, 0, 0);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    weekStart.setHours(23, 59, 59, 999);

    const weekLabel = `${String(weekStart.getMonth() + 1).padStart(2, "0")}/${String(weekStart.getDate() + 1).padStart(2, "0")}`;

    const weekProducts = allProducts.filter((product) => {
      const productDate = new Date(product.createdAt);
      return productDate >= weekStart && productDate <= weekEnd;
    });

    weeklyData.push({
      week: weekLabel,
      products: weekProducts.length,
    });
  }

  const inStockCount = allProducts.filter((p) => Number(p.quantity) > 5).length;
  const lowStockCount = allProducts.filter(
    (p) => Number(p.quantity) <= 5 && Number(p.quantity) >= 1,
  ).length;
  const outOfStock = allProducts.filter((p) => Number(p.quantity) === 0).length;
  const inStockPercent =
    totalProducts > 0 ? Math.round((inStockCount / totalProducts) * 100) : 0;
  const lowStockPercent =
    totalProducts > 0 ? Math.round((lowStockCount / totalProducts) * 100) : 0;
  const outStockPercent =
    totalProducts > 0 ? Math.round((outOfStock / totalProducts) * 100) : 0;
  return (
    <div className="min-h-screen bg-orange-50">
      <SiderBar curentPath="/dashboard" />
      <main className="ml-64 p-8  ">
        <div>
          <div>
            <div>
              <h1 className="text-2xl text-gray-900 font-bold">Dashboard</h1>
              <p className="text-gray-500 text-sm">
                Welcom back! Here your inventory.
              </p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10 mt-10">
          <div className="bg-white rounded-lg border border-orange-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Key Metrics
            </h2>
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">
                  {totalProducts}
                </div>
                <div className="text-sm text-gray-600">Total Products</div>
                <div className=" flex items-center justify-center mt-1">
                  <span className="text-xs text-green-600">
                    +{totalProducts}
                  </span>
                  <TrendingUp className="w-3 h-3 text-green-600 ml-1" />
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">
                  ${Number(totalValue).toFixed(0)}
                </div>
                <div className="text-sm text-gray-600">Total Value</div>
                <div className=" flex items-center justify-center mt-1">
                  <span className="text-xs text-green-600">
                    +{Number(totalValue).toFixed(0)}
                  </span>
                  <TrendingUp className="w-3 h-3 text-green-600 ml-1" />
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">
                  {lowStock}
                </div>
                <div className="text-sm text-gray-600">Low Stock</div>
                <div className=" flex items-center justify-center mt-1">
                  <span className="text-xs text-green-600">+{lowStock}</span>
                  <TrendingUp className="w-3 h-3 text-green-600 ml-1" />
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-orange-100 p-6">
            <div className=" flex items-center justify between mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                New products per week
              </h2>
            </div>
            <div>
              <ProductsChart data={weeklyData} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-lg border border-orange-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Stock Level
              </h2>
            </div>
            <div className="space-y-3 ">
              {recent.map((product, key) => {
                const stockLevel =
                  product.quantity === 0
                    ? 0
                    : product.quantity <= (product.lowStockAt || 5)
                      ? 1
                      : 2;
                const bgColor = ["bg-red-600", "bg-yellow-600", "bg-green-600"];
                const textColor = [
                  "text-red-600",
                  "text-yellow-600",
                  "text-green-600",
                ];
                return (
                  <div
                    key={key}
                    className="flex justify-between items-center bg-yellow-50 p-3 rounded-xl "
                  >
                    <div className="flex  items-center">
                      <div
                        className={`w-3 h-3 rounded-full ${bgColor[stockLevel]}`}
                      />
                      <span className="ml-5">{product.name}</span>
                    </div>

                    <div className={` ${textColor[stockLevel]}`}>
                      {product.quantity} units
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="bg-white rounded-lg border border-orange-100 p-6">
            <div className=" flex items-center justify between mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Efficiency
              </h2>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative w-48 h-48">
                <div className="absolute inset-0 rounded-full border-8 border-sky-200" />
                <div
                  className="absolute inset-0 rounded-full border-8 border-sky-600"
                  style={{
                    clipPath:
                      "polygon(50% 50%, 50% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 50%  )",
                  }}
                />
                <div className="asolute inset-0 flex items-center justify-center">
                  <div className="text-center ">
                    <div className="text-xl font-semibold text-gray-700 mt-18">
                      67%
                    </div>
                    <div className="text-sm text-gray-600">In Stock</div>
                  </div>
                </div>
              </div>
            </div>
            <div className=" mt-6 space-y-2">
              <div className="flex items-center gap-5">
                <div className=" w-3 h-3 rounded-full bg-green-200" />
                <p className="text-sm ">
                  In Stock :{" "}
                  <span className="text-green-600 ml-5">{inStockPercent}%</span>
                </p>
              </div>
              <div className="flex items-center gap-5">
                <div className=" w-3 h-3 rounded-full bg-yellow-200" />
                <p className="text-sm ">
                  Low Stock :{" "}
                  <span className="text-yellow-600 ml-5">
                    {lowStockPercent}%
                  </span>
                </p>
              </div>
              <div className="flex items-center gap-5">
                <div className=" w-3 h-3 rounded-full bg-red-200" />
                <p className="text-sm ">
                  Out Of Stock :{" "}
                  <span className="text-red-600 ml-5">{outStockPercent}%</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
