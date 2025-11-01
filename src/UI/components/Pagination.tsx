'use client';

import React, { useCallback, useMemo } from 'react';
import { Pagination as HeroPagination } from '@heroui/react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

interface Props {
    totalPages: number;
    onPageChange?: (page: number) => void;
    scroll?: boolean;
    isDisabled?: boolean;

}

const Pagination: React.FC<Props> = ({ totalPages, onPageChange,isDisabled=false, scroll = false }) => {
    const router = useRouter();
    const pathname = usePathname();
    const params = useSearchParams();
    const page = useMemo(() => {
        const raw = params.get('page');
        const n = Number.parseInt(raw ?? '1', 10);
        const initial = Number.isNaN(n) ? 1 : n;
        return Math.min(Math.max(initial, 1), Math.max(totalPages, 1));
    }, [params, totalPages]);

    const handleChange = useCallback(
        (nextPage: number) => {
            const sp = new URLSearchParams(params.toString());
            sp.set('page', String(nextPage));
            router.push(`${pathname}?${sp.toString()}`, { scroll });
            onPageChange?.(nextPage);
        },
        [params, pathname, router, onPageChange, scroll]
    );

    if (totalPages <= 1) return null;

    return (
        <div className="flex justify-center">
            <HeroPagination
                showControls
                total={totalPages}
                page={page}
                onChange={handleChange}
                aria-label="Pagination"
                isDisabled={isDisabled}
            />
        </div>
    );
};

export default Pagination;
