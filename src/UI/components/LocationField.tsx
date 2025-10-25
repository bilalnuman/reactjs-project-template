import { inputLikeWrapper } from "@/styles/resuableClasses";
import { RCSC_City, RCSC_Country, RCSC_State } from "@/types";
import { CitySelect, CountrySelect, StateSelect } from "react-country-state-city";
import "react-country-state-city/dist/react-country-state-city.css";

type LocationFieldProps = {
  country: RCSC_Country | null;
  state: RCSC_State | null;
  city: RCSC_City | null;
  onCountryChange: (c: RCSC_Country | null) => void;
  onStateChange: (s: RCSC_State | null) => void;
  onCityChange: (c: RCSC_City | null) => void;
  resetKey?: number; // force remount after reset
  errors?: { country?: string; state?: string; city?: string };
};

export default function LocationField({ country, state, city, onCountryChange, onStateChange, onCityChange, resetKey = 0, errors }: LocationFieldProps) {
  const countryId = country?.id;
  const stateId = state?.id;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {/* Country */}
      <div className="flex flex-col gap-1">
        <span className="text-xs text-default-500">Country</span>
        <CountrySelect
          key={`country-${resetKey}`}
          containerClassName="w-full"
          inputClassName={inputLikeWrapper}
          placeHolder="Select Country"
          defaultValue={country as any}
          
          onChange={(c: any) => onCountryChange((c ?? null) as RCSC_Country | null)}
        />
        {errors?.country && <p className="text-sm text-danger-500 mt-1">{errors.country}</p>}
      </div>

      {/* State */}
      <div className={`flex flex-col gap-1 ${!countryId ? "opacity-60 pointer-events-none" : ""}`}>
        <span className="text-xs text-default-500">State / Province</span>
        <StateSelect
          key={`state-${resetKey}-${countryId ?? "none"}`}
          countryid={countryId as number}
          containerClassName="w-full"
          inputClassName={inputLikeWrapper}
          placeHolder={countryId ? "Select State" : "Select a country first"}
          defaultValue={state as any}
          onChange={(s: any) => onStateChange((s ?? null) as RCSC_State | null)}
        />
        {errors?.state && <p className="text-sm text-danger-500 mt-1">{errors.state}</p>}
      </div>

      {/* City */}
      <div className={`flex flex-col gap-1 ${!countryId || !stateId ? "opacity-60 pointer-events-none" : ""}`}>
        <span className="text-xs text-default-500">City</span>
        <CitySelect
          key={`city-${resetKey}-${countryId ?? "none"}-${stateId ?? "none"}`}
          countryid={countryId as number}
          stateid={stateId as number}
          containerClassName="w-full"
          inputClassName={inputLikeWrapper}
          placeHolder={stateId ? "Select City" : "Select a state first"}
          defaultValue={city as any}
          onChange={(ci: any) => onCityChange((ci ?? null) as RCSC_City | null)}
        />
        {errors?.city && <p className="text-sm text-danger-500 mt-1">{errors.city}</p>}
      </div>
    </div>
  );
}