import Link from "next/link";
import { redirect } from "next/navigation";
import { updateGearItem } from "@/app/gear/actions";
import GearItemForm from "@/components/GearItemForm";
import { requireOnboardedUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";

type EditGearPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function EditGearPage({ params, searchParams }: EditGearPageProps) {
  const { id } = await params;
  const user = await requireOnboardedUser();

  const item = await prisma.gearItem.findFirst({
    where: {
      id,
      ownerId: user.id,
      deletedAt: null,
    },
  });

  if (!item) {
    redirect("/profile");
  }

  const query = await searchParams;
  const errorParam = query.error;
  const error = typeof errorParam === "string" ? errorParam : undefined;

  return (
    <main className="container section">
      <Link href="/profile">← Back to profile</Link>
      <div className="card" style={{ marginTop: 24, maxWidth: 700 }}>
        <h1 style={{ fontSize: 32 }}>Edit gear item</h1>
        <p style={{ color: "var(--muted)", marginTop: 8 }}>
          Update details as your gear value or condition changes.
        </p>

        <GearItemForm action={updateGearItem} submitLabel="Save changes" values={item} error={error} />
      </div>
    </main>
  );
}
