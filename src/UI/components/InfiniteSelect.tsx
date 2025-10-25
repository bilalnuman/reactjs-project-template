import { usePaginatedOptions } from "@/hooks/usePaginatedOptions";
import React from "react";
import {
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Listbox,
  ListboxItem,
  Spinner
} from "@heroui/react";

export default function InfiniteSelect({
  label,
  placeholder,
  value,
  onChange,
  isInvalid,
  errorMessage,
}: {
  label: string;
  placeholder?: string;
  value?: string;
  onChange: (val: string) => void;
  isInvalid?: boolean;
  errorMessage?: string;
}) {
  const { items, loadMore, isLoading, hasMore } = usePaginatedOptions();
  const [isOpen, setIsOpen] = React.useState(false);
  const selected = React.useMemo(() => items.find((i) => i.key === value)?.label ?? "", [items, value]);

  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-default-500">{label}</span>
      <Popover isOpen={isOpen} onOpenChange={setIsOpen} placement="bottom-start" offset={6}>
        <PopoverTrigger>
          <Button
            variant="faded"
            size="lg"
            radius="lg"
            className={`justify-between w-full bg-transparent ${isInvalid ? "border-danger text-danger" : ""}`}
          >
            <div className="flex flex-col items-start">

              <span className={selected ? "" : "text-default-400"}>{selected || placeholder || "Select an option"}</span>
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-[min(420px,92vw)]">
          <div
            className="max-h-72 overflow-auto w-full"
            onScroll={(e) => {
              const el = e.currentTarget;
              if (el.scrollTop + el.clientHeight >= el.scrollHeight - 24) loadMore();
            }}
          >
            <Listbox
              aria-label={label}
              selectionMode="single"
              selectedKeys={value ? new Set([value]) : new Set<string>()}
              onSelectionChange={(keys) => {
                const k = Array.from(keys as Set<string>)[0] ?? "";
                onChange(k);
                setIsOpen(false);
              }}
            >
              {items.map((item) => (
                <ListboxItem key={item.key}>{item.label}</ListboxItem>
              ))}
            </Listbox>

            <div className="flex items-center justify-center py-2">
              {isLoading ? (
                <Spinner size="sm" />
              ) : hasMore ? (
                <Button size="sm" variant="light" onPress={loadMore}>
                  Load more
                </Button>
              ) : (
                <span className="text-xs text-default-400">No more items</span>
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>
      {isInvalid && <p className="text-sm text-danger-500 mt-1">{errorMessage}</p>}
    </div>
  );
}