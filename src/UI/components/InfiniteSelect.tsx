import React, { useEffect } from "react";
import {
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Listbox,
  ListboxItem,
  Spinner,
  Input,
} from "@heroui/react";

export type OPTION_TYPE = {
  key: string;
  label: string;
};

interface InfiniteSelectProps {
  label?: string;
  placeholder?: string;
  value?: string | string[];
  onChange?: (val: string | string[]) => void;
  loadMore?: (page: number, q?: string | any) => void;
  onSearch?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isLoading?: boolean;
  errorMessage?: string;
  options: OPTION_TYPE[];
  totalPages?: number;
  selectionMode?: "single" | "multiple";
}

export default function InfiniteSelect({
  label,
  placeholder,
  value,
  errorMessage,
  options = [],
  isLoading = false,
  selectionMode = "multiple",
  totalPages = 1,
  onChange = () => { },
  loadMore = () => { },
  onSearch = () => { },
}: InfiniteSelectProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const pageRef = React.useRef(1);

  useEffect(() => {
    if (isOpen) {
      pageRef.current = 1;
    }
  }, [isOpen]);

  const selectedValues = React.useMemo<string[]>(() => {
    if (Array.isArray(value)) return value;
    if (typeof value === "string" && value) return [value];
    return [];
  }, [value]);

  const selectedLabel = React.useMemo(() => {
    if (selectionMode === "single") {
      const v = typeof value === "string" ? value : selectedValues[0];
      return options.find((i) => i.key === v)?.label ?? "";
    }

    if (selectedValues.length === 0) return "";
    if (selectedValues.length === 1) {
      return options.find((i) => i.key === selectedValues[0])?.label ?? "";
    }
    return `${selectedValues.length} selected`;
  }, [selectionMode, value, selectedValues, options]);

  const selectedKeys = React.useMemo(
    () => new Set<string>(selectedValues),
    [selectedValues]
  );

  const canLoadMore = totalPages > pageRef.current;

  const handleLoadMore = () => {
    if (!canLoadMore || isLoading) return;
    const nextPage = pageRef.current + 1;
    pageRef.current = nextPage;
    loadMore(nextPage);
  };

  return (
    <div className="flex flex-col gap-1">
      {label && <span className="text-xs text-default-500">{label}</span>}

      <Popover
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        placement="bottom-start"
        offset={6}
      >
        <PopoverTrigger>
          <Button
            variant="faded"
            size="lg"
            radius="lg"
            className={`justify-between w-full bg-transparent ${errorMessage ? "border-danger text-danger" : ""
              }`}
          >
            <div className="flex flex-col items-start">
              <span className={selectedLabel ? "" : "text-default-400"}>
                {selectedLabel || placeholder || "Select an option"}
              </span>
            </div>
          </Button>
        </PopoverTrigger>

        <PopoverContent className="p-0 w-[min(420px,92vw)] ">
          <div
            className="max-h-72 overflow-auto w-full"
            onScroll={(e) => {
              const el = e.currentTarget;
              const isNearBottom =
                el.scrollTop + el.clientHeight >= el.scrollHeight - 24;

              if (isNearBottom) {
                handleLoadMore();
              }
            }}
          >
            <div className="fixed w-[96%] ps-3 start-0 z-10 bg-white pe-1">
              <Input placeholder="Search..."
                classNames={{
                  inputWrapper: "border border-default-200  mt-3 bg-transparent"
                }}
                onChange={onSearch}
                autoFocus={isOpen}
              />
            </div>
            <Listbox
              aria-label={label}
              selectionMode={selectionMode}
              selectedKeys={selectedKeys}
              className="pt-14"
              onSelectionChange={(keys) => {
                const arr = Array.from(keys as Set<string>);

                if (selectionMode === "single") {
                  const k = arr[0] ?? "";
                  onChange(k);
                  setIsOpen(false);
                } else {
                  onChange(arr);
                }
              }}

            >
              {options.map((item) => (
                <ListboxItem key={item.key}>{item.label}</ListboxItem>
              ))}
            </Listbox>

            <div className="flex items-center justify-center py-2">
              {isLoading && <Spinner size="sm" />}

              {!isLoading && canLoadMore && (
                <Button size="sm" variant="light" onPress={handleLoadMore}>
                  Load more
                </Button>
              )}

              {!isLoading && !canLoadMore && (
                <span className="text-xs text-default-400">
                  No more options
                </span>
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {errorMessage && (
        <p className="text-sm text-danger-500 mt-1">{errorMessage}</p>
      )}
    </div>
  );
}
