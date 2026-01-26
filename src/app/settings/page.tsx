import { getSettings } from "@/actions/settings-actions";
import SettingsForm from "@/components/settings/SettingsForm";

export default async function SettingsPage() {
    const settings = await getSettings();

    return (
        <div className="p-4 md:p-8">
            <SettingsForm settings={settings} />
        </div>
    );
}
