"use client";

import { ChevronDown, ChevronUp, Pencil, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { deleteResource, moveResource, saveResource } from "@/actions/content";
import { MediaField } from "@/components/admin/media-field";
import type { Field, ResourceConfig } from "@/lib/admin/resources";
import { fieldClass } from "@/components/public/ui";
import { todayISO } from "@/lib/utils";

type Row = Record<string, unknown> & { id: string };

function blankValues(fields: Field[], defaults?: Record<string, string | number | boolean>, sortOrder = 0): Record<string, string | number | boolean> {
  const values: Record<string, string | number | boolean> = {};
  for (const field of fields) {
    if (field.type === "checkbox") values[field.name] = field.name === "published";
    else if (field.type === "number") values[field.name] = field.name === "sortOrder" ? sortOrder : 0;
    else if (field.type === "date") values[field.name] = todayISO();
    else values[field.name] = "";
  }
  return { ...values, ...defaults, sortOrder };
}

function valuesFrom(row: Row, fields: Field[]) {
  const values = blankValues(fields);
  for (const field of fields) {
    const raw = row[field.name];
    if (raw == null) continue;
    if (field.type === "checkbox") values[field.name] = Boolean(raw);
    else if (field.type === "number") values[field.name] = Number(raw);
    else if (field.type === "date") values[field.name] = String(raw).slice(0, 10);
    else values[field.name] = String(raw);
  }
  return values;
}

export function ResourceManager({
  resource,
  title,
  description,
  fields,
  columns,
  items,
  defaults,
}: {
  resource: string;
  title: string;
  description: string;
  fields: ResourceConfig["fields"];
  columns: ResourceConfig["columns"];
  items: Row[];
  defaults?: Record<string, string | number | boolean>;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [values, setValues] = useState<Record<string, string | number | boolean>>({});
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [pending, startTransition] = useTransition();

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return items;
    return items.filter((item) => JSON.stringify(item).toLowerCase().includes(needle));
  }, [items, query]);

  function startCreate() {
    setEditingId(null);
    setValues(blankValues(fields, defaults, items.length));
    setError("");
    setOpen(true);
  }

  function startEdit(row: Row) {
    setEditingId(row.id);
    setValues(valuesFrom(row, fields));
    setError("");
    setOpen(true);
  }

  function setValue(name: string, value: string | number | boolean) {
    setValues((current) => ({ ...current, [name]: value }));
  }

  function save() {
    setError("");
    startTransition(async () => {
      const result = await saveResource(resource, editingId ? { ...values, id: editingId } : values);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setOpen(false);
      setNotice("Saved.");
      router.refresh();
    });
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-navy">{title}</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted">{description}</p>
        </div>
        <button type="button" onClick={startCreate} className="inline-flex items-center gap-2 rounded-xl bg-navy px-4 py-2.5 text-sm font-semibold text-white">
          <Plus className="h-4 w-4" /> Add
        </button>
      </div>
      {notice ? <p className="mt-4 rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-800">{notice}</p> : null}
      <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search this list" className={`${fieldClass} mt-4 max-w-sm`} />
      <div className="mt-4 overflow-x-auto rounded-2xl bg-white ring-1 ring-navy/5">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-line text-xs uppercase tracking-wide text-muted">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className="px-4 py-3 font-semibold">{column.label}</th>
              ))}
              <th className="px-4 py-3 font-semibold">Order</th>
              <th className="px-4 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((item) => (
              <tr key={item.id} className="border-b border-line/80 last:border-0">
                {columns.map((column) => {
                  const value = item[column.key];
                  return (
                    <td key={column.key} className="px-4 py-3 align-middle">
                      {column.kind === "image" && typeof value === "string" && value ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={value} alt="" className="h-10 w-10 rounded-lg object-cover" />
                      ) : column.kind === "bool" ? (
                        <span className={`rounded-full px-2 py-1 text-xs font-semibold ${value ? "bg-emerald-50 text-emerald-800" : "bg-slate-100 text-slate-600"}`}>
                          {value ? "Yes" : "No"}
                        </span>
                      ) : (
                        <span className="line-clamp-2">{String(value ?? "")}</span>
                      )}
                    </td>
                  );
                })}
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    <button type="button" aria-label="Move up" onClick={() => startTransition(async () => { await moveResource(resource, item.id, "up"); router.refresh(); })} className="rounded-lg p-1 hover:bg-canvas"><ChevronUp className="h-4 w-4" /></button>
                    <button type="button" aria-label="Move down" onClick={() => startTransition(async () => { await moveResource(resource, item.id, "down"); router.refresh(); })} className="rounded-lg p-1 hover:bg-canvas"><ChevronDown className="h-4 w-4" /></button>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    <button type="button" onClick={() => startEdit(item)} className="rounded-lg p-1 text-navy hover:bg-canvas" aria-label="Edit"><Pencil className="h-4 w-4" /></button>
                    <button
                      type="button"
                      aria-label="Delete"
                      className="rounded-lg p-1 text-red-700 hover:bg-red-50"
                      onClick={() => {
                        if (!window.confirm("Delete this item?")) return;
                        startTransition(async () => {
                          await deleteResource(resource, item.id);
                          router.refresh();
                        });
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {visible.length === 0 ? <p className="px-4 py-8 text-sm text-muted">Nothing here yet.</p> : null}
      </div>

      {open ? (
        <div className="fixed inset-0 z-50 flex justify-end bg-navy/40">
          <button className="absolute inset-0" aria-label="Close editor" onClick={() => setOpen(false)} />
          <div className="relative z-10 h-full w-full max-w-2xl overflow-y-auto bg-white p-4 pb-10 shadow-2xl sm:p-6">
            <h2 className="text-xl font-semibold text-navy">{editingId ? "Edit" : "Add"} {title.toLowerCase()}</h2>
            <div className="mt-5 grid gap-4">
              {fields.map((field) => {
                const value = values[field.name];
                if (field.type === "image" || field.type === "video") {
                  return (
                    <MediaField
                      key={field.name}
                      label={field.label}
                      kind={field.type}
                      help={field.help}
                      value={String(value ?? "")}
                      onChange={(next) => setValue(field.name, next)}
                    />
                  );
                }
                if (field.type === "checkbox") {
                  return (
                    <label key={field.name} className="flex items-center gap-2 text-sm font-medium text-navy">
                      <input type="checkbox" checked={Boolean(value)} onChange={(event) => setValue(field.name, event.target.checked)} />
                      {field.label}
                    </label>
                  );
                }
                if (field.type === "select") {
                  return (
                    <label key={field.name} className="grid gap-1.5 text-sm">
                      <span className="font-semibold text-navy">{field.label}</span>
                      <select className={fieldClass} value={String(value ?? "")} onChange={(event) => setValue(field.name, event.target.value)}>
                        <option value="">Select</option>
                        {field.options?.map((option) => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </label>
                  );
                }
                if (field.type === "textarea") {
                  return (
                    <label key={field.name} className="grid gap-1.5 text-sm">
                      <span className="font-semibold text-navy">{field.label}</span>
                      <textarea rows={field.rows ?? 4} className={fieldClass} value={String(value ?? "")} onChange={(event) => setValue(field.name, event.target.value)} />
                      {field.help ? <span className="text-xs text-muted">{field.help}</span> : null}
                    </label>
                  );
                }
                return (
                  <label key={field.name} className="grid gap-1.5 text-sm">
                    <span className="font-semibold text-navy">{field.label}</span>
                    <input
                      type={field.type === "number" ? "number" : field.type === "date" ? "date" : "text"}
                      className={fieldClass}
                      value={String(value ?? "")}
                      placeholder={field.placeholder}
                      onChange={(event) => setValue(field.name, field.type === "number" ? Number(event.target.value) : event.target.value)}
                    />
                    {field.help ? <span className="text-xs text-muted">{field.help}</span> : null}
                  </label>
                );
              })}
            </div>
            {error ? <p className="mt-4 text-sm font-medium text-red-700">{error}</p> : null}
            <div className="mt-6 flex gap-2">
              <button type="button" onClick={save} disabled={pending} className="rounded-xl bg-navy px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60">
                {pending ? "Saving…" : "Save"}
              </button>
              <button type="button" onClick={() => setOpen(false)} className="rounded-xl px-4 py-2.5 text-sm font-semibold text-navy">
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
