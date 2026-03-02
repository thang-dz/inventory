import Image from "next/image";
import Link from "next/link";
import inventory from "../public/inventory.jpg";
import { getCurrentUser } from "./lib/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await getCurrentUser();

  if (user) redirect("/dashboard");
  return (
    <div className=" min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className=" min-h-screen w-full flex   items-center justify-between py-32 px-16 bg-gradient-to-r from-yellow-200 via-yellow-300 to-yellow-200 dark:bg-black sm:items-start">
        <div className=" flex flex-col items-start justify-center pt-20  gap-10 pl-60     ">
          <p className="text-4xl font-bold  w-[630px]">
            Manage inventory and fulfill orders{" "}
            <span className="text-red-500"> - the right way</span>
          </p>
          <p className="text-2xl w-[530px] ">
            The most success way relies on successful inventory management.
            Automate your inventory operations and sell more with less effort
          </p>
          <div className="flex gap-10 mt-25">
            <Link
              href="/sign-in"
              className="bg-amber-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-amber-700  transition-colors duration-200"
            >
              Sign In
            </Link>
            <Link
              href="/#"
              className="bg-white text-black px-8 py-3 rounded-lg font-semibold hover:bg-mauve-200  transition-colors duration-200"
            >
              Learn More
            </Link>
          </div>
        </div>
        <Image
          src={inventory}
          alt="Inventory management"
          className="w-[700px] mr-40 mt-20 animate-bounce delay-150"
          priority
        />
      </main>
    </div>
  );
}
