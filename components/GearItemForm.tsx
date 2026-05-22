import { GearCategory } from "@prisma/client";
import GearImageUploader from "@/components/GearImageUploader";

type GearItemFormValues = {
  id?: string;
  category?: GearCategory;
  brand?: string;
  model?: string;
  serialNumber?: string | null;
  year?: number | null;
  purchaseDate?: Date | null;
  purchasePrice?: number | null;
  currency?: string | null;
  estimatedValue?: number | null;
  condition?: string | null;
  description?: string | null;
  tags?: string[];
};

type GearItemFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  submitLabel: string;
  values?: GearItemFormValues;
  error?: string;
};

const categories = [
  { value: GearCategory.GUITAR, label: "Guitar" },
  { value: GearCategory.SYNTH, label: "Synth" },
  { value: GearCategory.AMP, label: "Amp" },
  { value: GearCategory.PEDAL, label: "Pedal" },
  { value: GearCategory.MIC, label: "Mic" },
  { value: GearCategory.INTERFACE, label: "Interface" },
  { value: GearCategory.OTHER, label: "Other" },
];

const formatDate = (value?: Date | null) => {
  if (!value) return "";
  return value.toISOString().slice(0, 10);
};

export default function GearItemForm({
  action,
  submitLabel,
  values,
  error,
}: GearItemFormProps) {
  return (
    <form action={action} className="form-stack" style={{ marginTop: 20 }}>
      {values?.id ? <input type="hidden" name="id" value={values.id} /> : null}

      <label className="label" htmlFor="category">
        Category
      </label>
      <select
        id="category"
        name="category"
        className="input"
        defaultValue={values?.category ?? GearCategory.OTHER}
      >
        {categories.map((category) => (
          <option key={category.value} value={category.value}>
            {category.label}
          </option>
        ))}
      </select>

      <label className="label" htmlFor="brand">
        Brand
      </label>
      <input id="brand" name="brand" className="input" defaultValue={values?.brand ?? ""} required />

      <label className="label" htmlFor="model">
        Model
      </label>
      <input id="model" name="model" className="input" defaultValue={values?.model ?? ""} required />

      <label className="label" htmlFor="serialNumber">
        Serial number
      </label>
      <input
        id="serialNumber"
        name="serialNumber"
        className="input"
        defaultValue={values?.serialNumber ?? ""}
      />

      <label className="label" htmlFor="year">
        Year
      </label>
      <input id="year" name="year" type="number" className="input" defaultValue={values?.year ?? ""} />

      <label className="label" htmlFor="purchaseDate">
        Purchase date
      </label>
      <input
        id="purchaseDate"
        name="purchaseDate"
        type="date"
        className="input"
        defaultValue={formatDate(values?.purchaseDate)}
      />

      <label className="label" htmlFor="purchasePrice">
        Purchase price
      </label>
      <input
        id="purchasePrice"
        name="purchasePrice"
        type="number"
        step="0.01"
        className="input"
        defaultValue={values?.purchasePrice ?? ""}
      />

      <label className="label" htmlFor="currency">
        Currency
      </label>
      <input
        id="currency"
        name="currency"
        className="input"
        defaultValue={values?.currency ?? ""}
        maxLength={3}
      />

      <label className="label" htmlFor="estimatedValue">
        Estimated value
      </label>
      <input
        id="estimatedValue"
        name="estimatedValue"
        type="number"
        step="0.01"
        className="input"
        defaultValue={values?.estimatedValue ?? ""}
      />

      <label className="label" htmlFor="condition">
        Condition
      </label>
      <input
        id="condition"
        name="condition"
        className="input"
        defaultValue={values?.condition ?? ""}
      />

      <label className="label" htmlFor="tags">
        Tags (comma separated)
      </label>
      <input
        id="tags"
        name="tags"
        className="input"
        defaultValue={values?.tags?.join(", ") ?? ""}
      />

      <label className="label" htmlFor="description">
        Notes
      </label>
      <textarea
        id="description"
        name="description"
        className="input"
        rows={4}
        defaultValue={values?.description ?? ""}
      />

      {values?.id ? (
        <GearImageUploader gearItemId={values.id} />
      ) : (
        <p style={{ fontSize: 13, color: "#6b7280" }}>
          Save this item to upload photos.
        </p>
      )}

      {error ? <p style={{ color: "#b91c1c" }}>{error}</p> : null}

      <button className="button primary" type="submit">
        {submitLabel}
      </button>
    </form>
  );
}
