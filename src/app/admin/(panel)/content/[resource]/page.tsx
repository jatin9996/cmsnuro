import { notFound } from "next/navigation";
import { ResourceManager } from "@/components/admin/resource-manager";
import { getResource } from "@/lib/admin/resources";
import { listResource } from "@/lib/queries";
import { toPlain } from "@/lib/utils";

export default async function ContentPage({ params }: { params: Promise<{ resource: string }> }) {
  const { resource } = await params;
  const config = getResource(resource);
  if (!config) notFound();
  const items = await listResource(config.model);
  return (
    <ResourceManager
      resource={config.slug}
      title={config.title}
      description={config.description}
      fields={config.fields}
      columns={config.columns}
      defaults={config.defaults}
      items={toPlain(items)}
    />
  );
}
