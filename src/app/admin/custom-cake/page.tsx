import { getCustomConfig, getCustomOptions, getCustomOptionGroups, isCustomCakeReady } from '@/lib/custom-cake';
import CustomCakeAdminClient from './CustomCakeAdminClient';

export default async function AdminCustomCakePage() {
  const ready = await isCustomCakeReady();
  if (!ready) {
    return (
      <div className="p-4 sm:p-8">
        <h1 className="font-display text-2xl font-bold text-stone-900 mb-4">Custom Cake</h1>
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
          <p className="font-semibold text-amber-800 text-sm">Setup required</p>
          <p className="text-amber-700 text-sm mt-1">
            Run <code className="bg-amber-100 px-1.5 py-0.5 rounded">supabase/custom-options-migration.sql</code> in your
            Supabase SQL editor to enable the custom cake configurator.
          </p>
        </div>
      </div>
    );
  }

  const [config, options, groups] = await Promise.all([
    getCustomConfig(),
    getCustomOptions(true),
    getCustomOptionGroups(),
  ]);
  return <CustomCakeAdminClient config={config} options={options} groups={groups} />;
}
