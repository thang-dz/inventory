import { SignIn } from "@stackframe/stack";
import Link from "next/link";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex  items-center justify-center bg-gradient-to-r from-yellow-100 via-yellow-200 to-yellow-100  ">
      <div className="w-110 bg-yellow-100 flex flex-col  justify-center rounded-xl  p-10  ">
        <div>
          <SignIn />
          <Link href="/" > Go back to home </Link>
        </div>
      </div>
    </div>
  );
}
