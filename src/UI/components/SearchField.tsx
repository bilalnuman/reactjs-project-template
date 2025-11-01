// src/UI/components/SearchField.tsx
'use client';

import React, {
  forwardRef,
  memo,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from 'react';
import { Input } from '@heroui/react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

type IconProps = React.SVGProps<SVGSVGElement> & { size?: number; strokeWidth?: number };

export const SearchIcon = ({ size = 24, strokeWidth = 1.5, width, height, ...props }: IconProps) => (
  <svg
    aria-hidden="true"
    fill="none"
    focusable="false"
    height={height ?? size}
    role="presentation"
    viewBox="0 0 24 24"
    width={width ?? size}
    {...props}
  >
    <path
      d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
    />
    <path
      d="M22 22L20 20"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
    />
  </svg>
);

interface SearchFieldProps {
  /** Query string key to sync with (default "q") */
  paramKey?: string;
  /** Debounce ms (default 300) */
  delay?: number;
  /** Call after debounce */
  onSearch?: (value: string) => void;
  /** Keep scroll position (default true) */
  scroll?: boolean;
  /** Autofocus (default false) */
  autoFocus?: boolean;
   isDisabled?: boolean;
  /** Minimum characters before syncing (default 0) */
  minLength?: number;
  /** Trim & collapse internal whitespace before syncing (default true) */
  normalize?: boolean;
  /** Placeholder (default "Type to search…") */
  placeholder?: string;
  size?: 'sm' | 'md' | 'lg';
  classNames?: Partial<NonNullable<React.ComponentProps<typeof Input>['classNames']>>;
}

const _SearchField = forwardRef<HTMLInputElement, SearchFieldProps>(
  (
    {
      paramKey = 'q',
      delay = 300,
      onSearch,
      scroll = true,
      autoFocus = false,
      minLength = 0,
      normalize = true,
      isDisabled=false,
      placeholder = 'Type to search…',
      size = 'sm',
      classNames,
    },
    ref
  ) => {
    const router = useRouter();
    const pathname = usePathname();
    const params = useSearchParams();
    const [isPending, startTransition] = useTransition();

    const initial = useMemo(() => params.get(paramKey) ?? '', [params, paramKey]);
    const [value, setValue] = useState(initial);
    const [isComposing, setIsComposing] = useState(false);
    const lastAppliedRef = useRef<string>(initial);
    const timerRef = useRef<number | null>(null);

    // Keep local state in sync if URL changes from outside
    useEffect(() => {
      setValue(initial);
      lastAppliedRef.current = initial;
    }, [initial]);

    // Debounced apply to URL + callback
    useEffect(() => {
      if (isComposing) return; // wait for IME composition to finish
      if (timerRef.current) window.clearTimeout(timerRef.current);

      timerRef.current = window.setTimeout(() => {
        const raw = value;
        const next = normalize
          ? raw.trim().replace(/\s+/g, ' ')
          : raw;

        // Enforce min length
        const shouldSync = next.length >= minLength || next.length === 0;

        if (!shouldSync) return;

        // Skip if nothing actually changed
        if (next === lastAppliedRef.current) return;

        const sp = new URLSearchParams(params.toString());
        if (next) sp.set(paramKey, next);
        else sp.delete(paramKey);

        startTransition(() => {
          router.replace(`${pathname}?${sp.toString()}`, { scroll });
        });

        lastAppliedRef.current = next;
        onSearch?.(next);
      }, delay) as unknown as number;

      return () => {
        if (timerRef.current) window.clearTimeout(timerRef.current);
      };
    }, [value, delay, params, paramKey, pathname, router, scroll, onSearch, isComposing, minLength, normalize]);

    return (
      <Input
        ref={ref}
        value={value}
        onValueChange={setValue}
        type="search"
        name={paramKey}
        aria-label="Search"
        inputMode="search"
        autoFocus={autoFocus}
        autoComplete="off"
        isClearable
        onClear={() => setValue('')}
        onCompositionStart={() => setIsComposing(true)}
        onCompositionEnd={() => setIsComposing(false)}
        placeholder={placeholder}
        size={size}
        startContent={<SearchIcon size={18} />}
        classNames={{
          base: 'h-11 bg-transparent data-[hover=true]:bg-transparent',
          mainWrapper: 'h-full',
          input: 'text-small ',
          inputWrapper: 'bg-transparent data-[hover=true]:bg-transparent h-full w-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20',
          ...classNames,
        }}
        // Optional: visually indicate background work
        disabled={isDisabled??isPending}
      />
    );
  }
);

_SearchField.displayName = 'SearchField';
export const SearchField = memo(_SearchField);
