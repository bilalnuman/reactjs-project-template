"use client";
import { transparentField } from "@/styles/resuableClasses";
import {
    Chip,
    Input,
    Select,
    SelectItem
} from "@heroui/react";
import React, { useState, useRef, useCallback, useEffect } from "react";
import { uniqBy, debounce } from "lodash";

import { ControllerRenderProps } from "react-hook-form";
import clsx from "clsx";

export type dropdownOptionTypes = {
    label: string;
    value: string | number;
};

interface InfiniteScrollProps extends Partial<ControllerRenderProps<any>> {
    initialsOpitions?: dropdownOptionTypes[];
    errorMessage?: string;
    fetchMore: (page: number, search?: string) => void;
    totalPages: number,
    selectionMode?: "single" | "multiple" | "none",
    placeholder?: string,
    label?: string,
    loading?: boolean
}


export const InfiniteScroll = ({
    initialsOpitions = [],
    fetchMore,
    errorMessage,
    totalPages,
    placeholder,
    label,
    selectionMode = "single",
    loading = false,
    ...props
}: InfiniteScrollProps) => {
    const { onChange, value, name } = props;
    const [options, setOptions] = useState(initialsOpitions);
    const [query, setQuery] = useState("");
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const baseRef = useRef(initialsOpitions);

    const handleSearch = useCallback(
        debounce(async (text: string) => {
            const q = text.trim().toLowerCase();
            // if (!q) return options;
            // const res = options.filter((opt) =>
            //     opt.label.toLowerCase().includes(q)
            // );
            // if (res.length) {
            //     setOptions(res)
            //     console.log(res)
            // }
            // if (!options.length) {
            //     console.log(text)
            //     setQuery(text);
            //     setPage(1);
            //     fetchMore(1, text);
            // }
            setQuery(text);
            setPage(1);
            fetchMore(1, text);
        }, 400),
        []
    );

    const loadMore = async () => {
        setQuery("")
        if (loading || !hasMore || totalPages == page) return;

        const nextPage = page + 1;
        fetchMore(nextPage, "");
        if (totalPages == page) setHasMore(false);
        setPage(nextPage);
    };
    useEffect(() => {

        baseRef.current = uniqBy(initialsOpitions?.length && query ? [...initialsOpitions] : [...baseRef.current, ...initialsOpitions], "value");
        setOptions(baseRef.current?.length ? baseRef.current : []);
    }, [initialsOpitions])

    return (
        <Select
            label={label ?? name}
            labelPlacement="outside"
            placeholder={placeholder ?? (loading && page > 1) ? "Loading..." : "Select..."}
            variant="faded"
            size="lg"
            radius="lg"
            selectionMode={selectionMode}
            {...transparentField}
            selectedKeys={new Set(value)}
            onSelectionChange={(keys) => {
                const arr = Array.from(keys as Set<string>);
                onChange?.(arr);
            }}
            isInvalid={!!errorMessage}
            errorMessage={errorMessage}
            renderValue={(items) => {
                if (items.length === 0)
                    return <span className="text-default-400">
                        Select one or more
                    </span>;

                return (
                    <div className="flex flex-wrap gap-2">
                        {items.map((item) => (
                            <Chip key={item.key} size="sm" variant="flat">
                                {item.textValue}
                            </Chip>
                        ))}
                    </div>
                );
            }}
            listboxProps={{
                topContent: (
                    <div className="px-2 pb-2 fixed w-[98%] start-0 z-50 top-0 bg-white">
                        <Input
                            size="lg"
                            variant="faded"
                            radius="lg"
                            placeholder="Search..."
                            className="mt-3"
                            {...transparentField}
                            value={query}
                            onChange={(e) => {
                                const text = e.target.value;
                                setQuery(text);
                                handleSearch(text);
                            }}
                        />
                    </div>
                ),
                className: clsx("max-h-72 overflow-auto"),
                onScroll: (e) => {
                    const el = e.currentTarget;
                    const isBottom =
                        el.scrollTop + el.clientHeight >= el.scrollHeight - 8;

                    if (isBottom) loadMore();
                },
            }}
        >
            <>
                {options.map((el, index) => (
                    <SelectItem className={clsx(index === 0 ? "pt-20" : "")} key={el.value}>{el.label}</SelectItem>
                ))}
            </>
            {options?.length === 0 ? (
                <SelectItem className="pt-20 text-center pb-5" key="no-data" isDisabled>
                    Data not found
                </SelectItem>
            ) : (
                <></>
            )}
        </Select>
    );
};
