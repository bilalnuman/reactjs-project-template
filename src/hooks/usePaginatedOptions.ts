import { ALL_OPTIONS } from "@/appData";
import { InfiniteOption } from "@/types";
import React from "react";

export function usePaginatedOptions(pageSize = 30) {
  const [items, setItems] = React.useState<InfiniteOption[]>(ALL_OPTIONS.slice(0, pageSize));
  const [isLoading, setIsLoading] = React.useState(false);
  const hasMore = items.length < ALL_OPTIONS.length;

  const loadMore = React.useCallback(() => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);
    setTimeout(() => {
      setItems((prev) => ALL_OPTIONS.slice(0, Math.min(prev.length + pageSize, ALL_OPTIONS.length)));
      setIsLoading(false);
    }, 400);
  }, [isLoading, hasMore, pageSize]);

  return { items, loadMore, isLoading, hasMore };
}