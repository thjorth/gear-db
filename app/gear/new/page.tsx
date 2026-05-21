import Link from "next/link";
import { createGearItem } from "@/app/gear/actions";
import GearItemForm from "@/components/GearItemForm";
import { requireOnboardedUser } from "@/lib/current-user";

type NewGearPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function NewGearPage({ searchParams }: NewGearPageProps) {
  await requireOnboardedUser();

  const params = await searchParams;
  const errorParam = params.error;
  const error = typeof errorParam === "string" ? errorParam : undefined;

  return (
    <main className="container section">
      <Link href="/profile">← Back to profile</Link>
      <div className="card" style={{ marginTop: 24, maxWidth: 700 }}>
        <h1 style={{ fontSize: 32 }}>Add gear item</h1>
        <p style={{ color: "var(--muted)", marginTop: 8 }}>
          Add insurance-friendly details for this item. You can edit everything later.
        </p>

        <GearItemForm action={createGearItem} submitLabel="Create item" error={error} />
      </div>
    </main>
  );
}
