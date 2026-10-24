import { SettingsForm } from "@/components/admin/settings-form";
import { getSettings } from "@/lib/queries";
import { SetupScreen } from "@/components/setup-screen";

export default async function SettingsPage() {
  const settings = await getSettings();
  if (!settings) return <SetupScreen />;
  const { id: _id, updatedAt: _updatedAt, ...values } = settings;
  return (
    <div>
      <h1 className="text-2xl font-semibold text-navy">Site settings</h1>
      <p className="mt-1 mb-6 max-w-2xl text-sm text-muted">Name, phone, homepage wording, search details, social links, and the appointment diary.</p>
      <SettingsForm settings={values} />
    </div>
  );
}
