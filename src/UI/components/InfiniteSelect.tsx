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
import { debounce } from "lodash";

export type OPTION_TYPE = {
  key: string;
  label: string;
};

interface InfiniteSelectProps {
  label?: string;
  placeholder?: string;
  value?: string | string[];
  onChange?: (val: string | string[]) => void;
  loadMore?: (page: number, q?: string) => void;
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
  onChange = () => {},
  loadMore = () => {},
}: InfiniteSelectProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [displayedOptions, setDisplayedOptions] =
    React.useState<OPTION_TYPE[]>(options);

  const pageRef = React.useRef(1);
  const remoteSearchActiveRef = React.useRef(false);
  const lastRemoteSearchRef = React.useRef<string | null>(null);
  const loadingMoreRef = React.useRef(false);

  // Reset page when popover opens
  useEffect(() => {
    if (isOpen) {
      pageRef.current = 1;
    }
  }, [isOpen]);

  // Debounced remote fetch (page + query)
  const debouncedFetch = React.useMemo(
    () =>
      debounce((page: number, q: string) => {
        loadMore(page, q);
      }, 500),
    [loadMore]
  );

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedFetch.cancel();
    };
  }, [debouncedFetch]);

  // Reset loadingMoreRef when data / loading changes
  useEffect(() => {
    if (!isLoading) {
      loadingMoreRef.current = false;
    }
  }, [options, isLoading]);

  useEffect(() => {
    const q = search.trim().toLowerCase();

    if (!q) {
      setDisplayedOptions(options);
      remoteSearchActiveRef.current = false;
      lastRemoteSearchRef.current = null;
      pageRef.current = 1;
      return;
    }

    // Local search in current options
    const localMatches = options.filter((o) =>
      o.label.toLowerCase().includes(q)
    );

    if (localMatches.length > 0) {
      setDisplayedOptions(localMatches);
      remoteSearchActiveRef.current = false;
      lastRemoteSearchRef.current = null;
      return;
    }

    // No local matches –> call remote search (debounced)
    setDisplayedOptions([]);
    const changedQuery = lastRemoteSearchRef.current !== q;

    if (!remoteSearchActiveRef.current || changedQuery) {
      remoteSearchActiveRef.current = true;
      lastRemoteSearchRef.current = q;
      pageRef.current = 1;
      debouncedFetch(1, q);
    }
  }, [options, search, debouncedFetch]);

  // Normalize value to array
  const selectedValues = React.useMemo<string[]>(() => {
    if (Array.isArray(value)) return value;
    if (typeof value === "string" && value) return [value];
    return [];
  }, [value]);

  // Text in the button
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
    if (!canLoadMore || isLoading || loadingMoreRef.current) return;

    loadingMoreRef.current = true;

    const nextPage = pageRef.current + 1;
    pageRef.current = nextPage;

    const q = remoteSearchActiveRef.current ? search.trim() : undefined;
    loadMore(nextPage, q);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const q = event.target.value;
    setSearch(q);
    pageRef.current = 1;
  };

  return (
    <div className="flex flex-col gap-1">
      {label && <span className="text-xs text-default-500">{label}</span>}

      <Popover
        isOpen={isOpen}
        onOpenChange={(open) => {
          if (selectionMode === "single") {
            // normal open/close behavior
            setIsOpen(open);
          } else {
            // multiple:
            // allow opening but ignore auto-close from internal interactions
            if (open) setIsOpen(true);
          }
        }}
        placement="bottom-start"
        offset={6}
      >
        <PopoverTrigger>
          <Button
            variant="faded"
            size="lg"
            radius="lg"
            className={`justify-between w-full bg-transparent ${
              errorMessage ? "border-danger text-danger" : ""
            }`}
          >
            <div className="flex flex-col items-start">
              <span className={selectedLabel ? "" : "text-default-400"}>
                {selectedLabel || placeholder || "Select an option"}
              </span>
            </div>
          </Button>
        </PopoverTrigger>

        <PopoverContent className="p-0 w-[min(420px,92vw)]">
          <div
            className="max-h-72 overflow-auto w-full"
            onScroll={(e) => {
              const el = e.currentTarget;
              const isScrollable = el.scrollHeight > el.clientHeight + 24;
              if (!isScrollable) return;

              const isNearBottom =
                el.scrollTop + el.clientHeight >= el.scrollHeight - 24;

              if (isNearBottom) {
                handleLoadMore();
              }
            }}
          >
            {/* Search bar pinned at top */}
            <div className="fixed w-[96%] ps-3 start-0 z-10 bg-white pe-1">
              <Input
                placeholder="Search..."
                value={search}
                onChange={handleSearch}
                classNames={{
                  inputWrapper:
                    "border border-default-200 mt-3 bg-transparent",
                }}
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
                  setIsOpen(false); // close only for single
                } else {
                  onChange(arr); // keep open for multiple
                }
              }}
            >
              {displayedOptions.map((item) => (
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
