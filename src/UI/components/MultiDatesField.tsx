import {
  Button,
  Chip,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Calendar,
} from "@heroui/react";
import React from "react";
import { parseDate, parseTime, DateValue } from "@internationalized/date";

export default function MultiDatesField({
    label = "Dates (multiple)",
    values,
    onChange,
    error,
}: {
    label?: string;
    values: string[];
    onChange: (next: string[]) => void;
    error?: string;
}) {
    const [open, setOpen] = React.useState(false);
    const [calVal, setCalVal] = React.useState<DateValue | null>(null);

    const add = (d: DateValue | null) => {
        if (!d) return;
        const str = d.toString();
        if (values.includes(str)) return; // prevent duplicates
        onChange([...values, str]);
        setCalVal(null);
    };

    const remove = (dateStr: string) => onChange(values.filter((v) => v !== dateStr));

    return (
        <section className="grid gap-3">
            <label className="text-sm font-medium">{label}</label>

            <div className="flex items-center gap-3 multi-dates">
                <Popover isOpen={open} onOpenChange={setOpen}>
                    <PopoverTrigger>
                        <Button
                            variant="faded"
                            radius="lg"
                            className={`w-full min-h-[44px] rounded-lg border border-default-200 px-3 py-2 bg-transparent text-left ${values.length ? "" : "text-default-400"}`}
                        >
                            {values.length ? "Add more dates" : "Pick dates"}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-3">
                        <div className="flex flex-col gap-3">
                            <Calendar
                                aria-label="Pick date"
                                value={calVal}
                                onChange={(v) => {
                                    setCalVal(v);
                                    add(v);
                                }}
                                className="shadow-none"
                            />
                            <div className="flex justify-end">
                                <Button size="sm" variant="light" onPress={() => setOpen(false)}>
                                    Done
                                </Button>
                            </div>
                        </div>
                    </PopoverContent>
                </Popover>

                {error && <p className="text-sm text-danger-500">{error}</p>}
            </div>

            <div className="flex flex-wrap gap-2">
                {values.map((d) => (
                    <Chip key={d} onClose={() => remove(d)} variant="flat" radius="sm" className="text-sm">
                        {d}
                    </Chip>
                ))}
            </div>
        </section>
    );
}