"use client";

import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  Pagination,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Checkbox,
  Select,
  SelectItem,
} from "@heroui/react";
import { FiSearch, FiChevronUp, FiChevronDown, FiSettings, FiX } from "react-icons/fi";

/** Column definition for the DataTable */
export type ColumnDef<T> = {
  key: keyof T & string;           // unique key & default accessor (row[key])
  header: React.ReactNode;         // header label/content
  visible?: boolean;               // default visibility (true unless set false)
  sortable?: boolean;              // if false, disables sort on this column
  cell?: (row: T) => React.ReactNode; // custom cell render
  sortValue?: (row: T) => string | number | Date | null | undefined; // precise sort basis
  className?: string;              // optional classes for header & cells
};

export type DataTableProps<T extends Record<string, any>> = {
  data: T[];
  columns: ColumnDef<T>[];

  /** optional search (default: true) */
  enableSearch?: boolean;
  /** custom search predicate; default searches visible columns’ text */
  onSearchPredicate?: (row: T, q: string) => boolean;

  /** optional sorting (default: true) */
  enableSort?: boolean;

  /** pagination */
  initialPageSize?: number;
  pageSizeOptions?: number[];

  /** override initial visible columns by key */
  defaultVisibleKeys?: string[];
  onVisibleChange?: (keys: string[]) => void;

  /** a11y */
  ariaLabel?: string;

  /** extra right-side toolbar content */
  toolbarExtra?: React.ReactNode;

  /** stable key for each row (RECOMMENDED: return row.id) */
  getRowKey?: (row: T, index: number) => React.Key;
};

/* ================================
   Helpers
================================== */
function defaultSortCompare(a: any, b: any) {
  const va = a instanceof Date ? a.getTime() : a;
  const vb = b instanceof Date ? b.getTime() : b;
  if (va == null && vb == null) return 0;
  if (va == null) return -1;
  if (vb == null) return 1;
  if (typeof va === "number" && typeof vb === "number") return va - vb;
  return String(va).localeCompare(String(vb), undefined, { numeric: true, sensitivity: "base" });
}

function getDefaultVisibility<T>(cols: ColumnDef<T>[], override?: string[]) {
  if (override?.length) return new Set<string>(override);
  return new Set<string>(cols.filter((c) => c.visible !== false).map((c) => c.key));
}

/* ================================
   DataTable
================================== */
export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  enableSearch = true,
  onSearchPredicate,
  enableSort = true,
  initialPageSize = 10,
  pageSizeOptions = [5, 10, 20, 50],
  defaultVisibleKeys,
  onVisibleChange,
  ariaLabel = "Data table",
  toolbarExtra,
  getRowKey,
}: DataTableProps<T>) {
  const [query, setQuery] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(initialPageSize);

  // Column visibility
  const [visibleKeys, setVisibleKeys] = React.useState<Set<string>>(
    getDefaultVisibility(columns, defaultVisibleKeys)
  );
  React.useEffect(() => {
    onVisibleChange?.(Array.from(visibleKeys));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibleKeys]);

  // Sorting
  const [sortKey, setSortKey] = React.useState<string | null>(null);
  const [sortDir, setSortDir] = React.useState<"asc" | "desc">("asc");

  const visibleColumns = React.useMemo(
    () => columns.filter((c) => visibleKeys.has(c.key)),
    [columns, visibleKeys]
  );

  // Search
  const filtered = React.useMemo(() => {
    if (!enableSearch || !query.trim()) return data;
    const q = query.toLowerCase();

    if (onSearchPredicate) return data.filter((row) => onSearchPredicate(row, q));

    return data.filter((row) =>
      visibleColumns.some((col) => {
        let raw: unknown;
        if (col.cell) {
          const rendered = col.cell(row);
          raw = typeof rendered === "string" ? rendered : row[col.key];
        } else {
          raw = row[col.key];
        }
        if (raw == null) return false;
        return String(raw).toLowerCase().includes(q);
      })
    );
  }, [data, enableSearch, onSearchPredicate, query, visibleColumns]);

  // Sort
  const sorted = React.useMemo(() => {
    if (!enableSort || !sortKey) return filtered;
    const col = columns.find((c) => c.key === sortKey);
    if (!col || col.sortable === false) return filtered;

    const arr = [...filtered];
    arr.sort((r1, r2) => {
      const v1 = col.sortValue ? col.sortValue(r1) : (r1[col.key] as any);
      const v2 = col.sortValue ? col.sortValue(r2) : (r2[col.key] as any);
      const cmp = defaultSortCompare(v1, v2);
      return sortDir === "asc" ? cmp : -cmp;
    });
    return arr;
  }, [columns, filtered, sortDir, sortKey, enableSort]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * pageSize;
  const end = start + pageSize;
  const pageRows = sorted.slice(start, end);

  React.useEffect(() => {
    setPage(1);
  }, [query, pageSize, sortKey, sortDir, visibleKeys]);

  const toggleSort = (key: string, canSort: boolean) => {
    if (!enableSort || !canSort) return;
    setSortKey((prev) => {
      if (prev !== key) {
        setSortDir("asc");
        return key;
      }
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
      return key;
    });
  };

  const resetVisible = () => setVisibleKeys(getDefaultVisibility(columns, defaultVisibleKeys));

  const defaultGetRowKey = React.useCallback(
    (row: T, i: number) =>
      (row as any).id ?? (row as any).key ?? `${JSON.stringify(row)}::${i}`,
    []
  );
  const rowKeyFn = getRowKey ?? defaultGetRowKey;

  return (
    <div className="w-full space-y-3">
      {/* Toolbar */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          {enableSearch && (
            <Input
              aria-label="Search"
              placeholder="Search…"
              startContent={<FiSearch className="h-4 w-4" />}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              variant="faded"
              size="sm"
              className="w-64"
            />
          )}
          <Select
            aria-label="Rows per page"
            variant="faded"
            size="sm"
            className="w-36"
            selectedKeys={new Set([String(pageSize)])}
            onSelectionChange={(keys) => {
              const k = Array.from(keys as Set<string>)[0];
              if (k) setPageSize(Number(k));
            }}
          >
            {pageSizeOptions.map((n) => (
              <SelectItem key={String(n)}>{n} / page</SelectItem>
            ))}
          </Select>
        </div>

        <div className="flex items-center gap-2">
          {toolbarExtra}
          {/* Column customization */}
          <Popover placement="bottom-end" offset={6}>
            <PopoverTrigger>
              <Button variant="flat" size="sm" startContent={<FiSettings className="h-4 w-4" />}>
                Columns
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-3 min-w-[220px]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Show / Hide</span>
                <Button size="sm" variant="light" onPress={resetVisible}>
                  Reset
                </Button>
              </div>
              <div className="max-h-64 overflow-auto pr-1 space-y-1">
                {columns.map((c) => (
                  <Checkbox
                    key={c.key}
                    isSelected={visibleKeys.has(c.key)}
                    onValueChange={(checked) =>
                      setVisibleKeys((prev) => {
                        const next = new Set(prev);
                        checked ? next.add(c.key) : next.delete(c.key);
                        return next;
                      })
                    }
                    size="sm"
                  >
                    {typeof c.header === "string" ? c.header : c.key}
                  </Checkbox>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Table */}
      <Table aria-label={ariaLabel} removeWrapper classNames={{ th: "bg-transparent", td: "bg-transparent" }}>
        <TableHeader>
          {visibleColumns.map((col) => {
            const active = sortKey === col.key;
            const canSort = enableSort && col.sortable !== false;
            const ariaSort = !canSort ? undefined : active ? (sortDir === "asc" ? "ascending" : "descending") : "none";

            return (
              <TableColumn
                key={col.key}
                className={col.className}
                aria-sort={ariaSort as any}
                onClick={() => toggleSort(col.key, canSort)}
              >
                <div className={`flex items-center gap-1 ${canSort ? "cursor-pointer select-none" : ""}`}>
                  <span>{col.header}</span>
                  {canSort && (
                    active ? (
                      sortDir === "asc" ? <FiChevronUp className="h-4 w-4 opacity-70" /> : <FiChevronDown className="h-4 w-4 opacity-70" />
                    ) : (
                      <span className="inline-flex h-4 w-4 items-center justify-center opacity-30">—</span>
                    )
                  )}
                </div>
              </TableColumn>
            );
          })}
        </TableHeader>

        <TableBody emptyContent="No rows found">
          {pageRows.map((row, i) => (
            <TableRow key={rowKeyFn(row, i)}>
              {visibleColumns.map((col) => (
                <TableCell key={col.key} className={col.className}>
                  {col.cell ? col.cell(row) : (row[col.key] as any)?.toString?.() ?? ""}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Footer */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-default-500">
          Showing <b>{sorted.length === 0 ? 0 : start + 1}</b>–<b>{Math.min(end, sorted.length)}</b> of <b>{sorted.length}</b>
        </div>

        <div className="flex items-center gap-2">
          {query && (
            <Button size="sm" variant="light" startContent={<FiX className="h-4 w-4" />} onPress={() => setQuery("")}>
              Clear search
            </Button>
          )}
          <Pagination page={safePage} total={totalPages} onChange={setPage} showControls size="sm" isCompact />
        </div>
      </div>
    </div>
  );
}

export default DataTable;
