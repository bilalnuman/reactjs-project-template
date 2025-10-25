import { inputLikeWrapper } from "@/styles/resuableClasses";
import clsx from "clsx";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
export type PhoneFieldProps = {
  label?: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  defaultCountry?: string; // e.g., "pk"
};
export default function PhoneField({ label = "Phone", value, onChange, error, defaultCountry = "pk" }: PhoneFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-default-500">{label}</span>
      <div className={clsx(inputLikeWrapper,"!py-[5px]")}>
        <PhoneInput
          defaultCountry={defaultCountry as any}
          value={value}
          onChange={onChange}
          className="w-full"
          inputClassName="!bg-transparent !border-0 !shadow-none !outline-none !px-0"
          countrySelectorStyleProps={{ buttonClassName: "!bg-transparent !border-0 !shadow-none" }}
        />
      </div>
      {error && <p className="text-sm text-danger-500 mt-1">{error}</p>}
    </div>
  );
}