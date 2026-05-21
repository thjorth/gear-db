import { completeProfile } from "@/app/onboarding/actions";

type ProfileOnboardingFormProps = {
  email: string;
  fullName: string;
  defaultScreenName: string;
  defaultCountry: string;
  defaultCity: string;
  error?: string;
};

export default function ProfileOnboardingForm({
  email,
  fullName,
  defaultScreenName,
  defaultCountry,
  defaultCity,
  error,
}: ProfileOnboardingFormProps) {
  return (
    <form action={completeProfile} className="form-stack" style={{ marginTop: 20 }}>
      <label className="label" htmlFor="email">
        Email (from Google)
      </label>
      <input id="email" className="input" value={email} readOnly />

      <label className="label" htmlFor="fullName">
        Full name (from Google)
      </label>
      <input id="fullName" className="input" value={fullName} readOnly />

      <label className="label" htmlFor="screenName">
        Screen name
      </label>
      <input
        id="screenName"
        name="screenName"
        className="input"
        defaultValue={defaultScreenName}
        minLength={3}
        maxLength={40}
        required
      />

      <label className="label" htmlFor="country">
        Country
      </label>
      <input
        id="country"
        name="country"
        className="input"
        defaultValue={defaultCountry}
        required
      />

      <label className="label" htmlFor="city">
        City
      </label>
      <input
        id="city"
        name="city"
        className="input"
        defaultValue={defaultCity}
        required
      />

      {error ? <p style={{ color: "#b91c1c" }}>{error}</p> : null}

      <button className="button primary" type="submit">
        Save profile
      </button>
    </form>
  );
}
