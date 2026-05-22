"use server";

import { redirect } from "next/navigation";
import { GearCategory } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireOnboardedUser } from "@/lib/current-user";

const categories = new Set(Object.values(GearCategory));

type GearInput = {
  category: GearCategory;
  brand: string;
  model: string;
  serialNumber: string | null;
  year: number | null;
  purchaseDate: Date | null;
  purchasePrice: number | null;
  currency: string | null;
  estimatedValue: number | null;
  condition: string | null;
  description: string | null;
  tags: string[];
  isPublic: boolean;
};

const clean = (value: FormDataEntryValue | null) =>
  typeof value === "string" ? value.trim() : "";

const toNullable = (value: string) => (value ? value : null);

const toNullableNumber = (value: string) => {
  if (!value) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const toNullableDate = (value: string) => {
  if (!value) return null;
  return new Date(`${value}T00:00:00.000Z`);
};

const parseGearInput = (formData: FormData): GearInput => {
  const categoryRaw = clean(formData.get("category")).toUpperCase();
  const brand = clean(formData.get("brand"));
  const model = clean(formData.get("model"));
  const serialNumber = clean(formData.get("serialNumber"));
  const yearRaw = clean(formData.get("year"));
  const purchaseDateRaw = clean(formData.get("purchaseDate"));
  const purchasePriceRaw = clean(formData.get("purchasePrice"));
  const currencyRaw = clean(formData.get("currency")).toUpperCase();
  const estimatedValueRaw = clean(formData.get("estimatedValue"));
  const condition = clean(formData.get("condition"));
  const description = clean(formData.get("description"));
  const tagsRaw = clean(formData.get("tags"));
  const isPublic = formData.get("isPublic") === "on";

  if (!brand || !model) {
    throw new Error("Brand and model are required.");
  }

  const category = categories.has(categoryRaw as GearCategory)
    ? (categoryRaw as GearCategory)
    : GearCategory.OTHER;

  const year = toNullableNumber(yearRaw);
  if (yearRaw && (!year || year < 1900 || year > new Date().getFullYear() + 1)) {
    throw new Error("Year must be a valid 4-digit year.");
  }

  const purchasePrice = toNullableNumber(purchasePriceRaw);
  if (purchasePriceRaw && purchasePrice === null) {
    throw new Error("Purchase price must be a number.");
  }

  const estimatedValue = toNullableNumber(estimatedValueRaw);
  if (estimatedValueRaw && estimatedValue === null) {
    throw new Error("Estimated value must be a number.");
  }

  const purchaseDate = toNullableDate(purchaseDateRaw);

  const tags = tagsRaw
    ? tagsRaw
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
        .slice(0, 20)
    : [];

  return {
    category,
    brand,
    model,
    serialNumber: toNullable(serialNumber),
    year,
    purchaseDate,
    purchasePrice,
    currency: toNullable(currencyRaw),
    estimatedValue,
    condition: toNullable(condition),
    description: toNullable(description),
    tags,
    isPublic,
  };
};

const redirectWithError = (path: string, message: string): never => {
  redirect(`${path}?error=${encodeURIComponent(message)}`);
};

const parseGearInputOrRedirect = (formData: FormData, path: string): GearInput => {
  try {
    return parseGearInput(formData);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid gear item values.";
    redirectWithError(path, message);
  }

  throw new Error("Unexpected parsing flow.");
};

export async function createGearItem(formData: FormData) {
  const user = await requireOnboardedUser();
  const data = parseGearInputOrRedirect(formData, "/gear/new");

  await prisma.gearItem.create({
    data: {
      ...data,
      ownerId: user.id,
    },
  });

  redirect("/profile");
}

export async function updateGearItem(formData: FormData) {
  const user = await requireOnboardedUser();
  const id = clean(formData.get("id"));

  if (!id) {
    redirect("/profile");
  }

  const existing = await prisma.gearItem.findFirst({
    where: {
      id,
      ownerId: user.id,
      deletedAt: null,
    },
    select: { id: true },
  });

  if (!existing) {
    redirect("/profile");
  }

  const data = parseGearInputOrRedirect(formData, `/gear/${id}/edit`);

  await prisma.gearItem.update({
    where: { id },
    data,
  });

  redirect("/profile");
}
