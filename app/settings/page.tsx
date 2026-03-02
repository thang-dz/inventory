import { AccountSettings } from "@stackframe/stack";
import SiderBar from "../components/sidebar";
import { getCurrentUser } from "../lib/auth";

export default async function SettingsPage() {
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen bg-gray-50">
      <SiderBar curentPath="/settings" />
      <main className="ml-64 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-sm  text-gray-600">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="max-w-6xl">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <AccountSettings fullPage />
          </div>
        </div>
      </main>
    </div>
  );
}
