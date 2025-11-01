// src/UI/components/Sidebar.tsx
'use client';

import React, {
    memo,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@heroui/react';

/* ---------- Types & Normalization (supports your keys) ---------- */

type RawItem = {      // tolerated typo
    label?: string;
    icon?: React.ReactNode;   // tolerated typo
    href?: string;
    childrens?: RawItem[]; // tolerated typo
    children?: RawItem[];
};

export type NavItem = {
    label: string;
    href: string;
    icon?: React.ReactNode;
    children?: NavItem[];
};

const normalizeItem = (r: RawItem): NavItem => ({
    label: (r.label?? '').trim(),
    href: (r.href ?? '#').trim() || '#',
    icon: r.icon,
    children: (r.children ?? r.childrens ?? [])?.map(normalizeItem),
});

const normalizeItems = (items: RawItem[] = []): NavItem[] => items.map(normalizeItem);

/* ---------------------- Utilities ---------------------- */

const cleanPath = (p: string) => {
    const [path] = p.split(/[?#]/);
    if (!path) return '/';
    const trimmed = path.replace(/\/+$/, '');
    return trimmed === '' ? '/' : trimmed;
};

const makeIsActive = (pathname: string) => {
    const p = cleanPath(pathname);
    return (href: string) => {
        const h = cleanPath(href);
        if (h === '/') return p === '/';
        return p === h || p.startsWith(h + '/'); // nested routes active
    };
};

const hasActiveDescendant = (node: NavItem, isActive: (href: string) => boolean): boolean =>
    isActive(node.href) || (node.children?.some((c) => hasActiveDescendant(c, isActive)) ?? false);

/* Small helper: track if we’re under 992px */
const useIsBelow992 = () => {
    const [isBelow, setIsBelow] = useState(false);
    useEffect(() => {
        const m = window.matchMedia('(max-width: 991px)');
        const onChange = () => setIsBelow(m.matches);
        onChange();
        m.addEventListener('change', onChange);
        return () => m.removeEventListener('change', onChange);
    }, []);
    return isBelow;
};

/* ---------------------- Item component ---------------------- */

const ItemRow = memo(function ItemRow({
    node,
    depth,
    isActive,
    expanded,
    toggle,
    onNavigate,
}: {
    node: NavItem;
    depth: number;
    isActive: (href: string) => boolean;
    expanded: (href: string) => boolean;
    toggle: (href: string) => void;
    onNavigate: () => void;
}) {
    const activeBranch = hasActiveDescendant(node, isActive);
    const isLeaf = !node.children || node.children.length === 0;
    const open = !isLeaf && (expanded(node.href) || activeBranch);

    const baseRow =
        'flex items-center gap-2 h-10 rounded-lg pr-2 select-none';
    const activeRow =
        'bg-indigo-500/15 text-indigo-400 ring-1 ring-indigo-500/30';
    const hoverRow = 'hover:bg-neutral-800';

    return (
        <li>
            <div
                className={`${baseRow} ${hoverRow} ${activeBranch ? activeRow : ''}`}
                style={{ paddingLeft: 12 + depth * 16 }}
            >
                {node.icon && <span className="w-5 h-5 grid place-items-center opacity-90">{node.icon}</span>}

                {isLeaf ? (
                    <Link
                        href={node.href || '#'}
                        className="flex-1 flex items-center gap-2 h-full text-inherit no-underline"
                        aria-current={isActive(node.href) ? 'page' : undefined}
                        onClick={onNavigate}
                    >
                        <span className="truncate">{node.label}</span>
                    </Link>
                ) : (
                    <>
                        <Link
                            href={node.href || '#'}
                            className="flex-1 flex items-center gap-2 h-full text-inherit no-underline"
                            aria-current={isActive(node.href) ? 'page' : undefined}
                            onClick={onNavigate}
                        >
                            <span className="truncate">{node.label}</span>
                        </Link>
                        <Button
                            size="sm"
                            radius="sm"
                            variant="light"
                            aria-label={open ? 'Collapse section' : 'Expand section'}
                            aria-expanded={open}
                            className="min-w-0 px-2"
                            onPress={() => toggle(node.href)}
                        >
                            <span className={`transition-transform ${open ? 'rotate-90' : ''}`} aria-hidden>
                                ▸
                            </span>
                        </Button>
                    </>
                )}
            </div>

            {!isLeaf && open && (
                <ul className="my-1 ml-0">
                    {node.children!.map((c) => (
                        <ItemRow
                            key={c.href || c.label}
                            node={c}
                            depth={depth + 1}
                            isActive={isActive}
                            expanded={expanded}
                            toggle={toggle}
                            onNavigate={onNavigate}
                        />
                    ))}
                </ul>
            )}
        </li>
    );
});

/* ---------------------- Sidebar ---------------------- */

function Sidebar({
    items,
    width = 260,
    className,
}: {
    items: RawItem[];
    width?: number; // px
    className?: string;
}) {
    const pathname = usePathname() || '/';
    const isMobile = useIsBelow992();

    const navItems = useMemo(() => normalizeItems(items), [items]);
    const isActive = useMemo(() => makeIsActive(pathname), [pathname]);

    // open/close state (off-canvas on mobile; pinned on desktop)
    const [open, setOpen] = useState<boolean>(true);
    useEffect(() => setOpen(!isMobile), [isMobile]);

    // expanded branches: auto-expand ancestors of active route
    const [expandedSet, setExpandedSet] = useState<Set<string>>(new Set());
    useEffect(() => {
        const next = new Set<string>();
        const walk = (n: NavItem) => {
            if (n.children?.length) {
                if (hasActiveDescendant(n, isActive)) next.add(n.href);
                n.children.forEach(walk);
            }
        };
        navItems.forEach(walk);
        setExpandedSet(next);
    }, [navItems, isActive]);

    const expanded = useCallback((href: string) => expandedSet.has(href), [expandedSet]);
    const toggle = useCallback(
        (href: string) =>
            setExpandedSet((prev) => {
                const s = new Set(prev);
                s.has(href) ? s.delete(href) : s.add(href);
                return s;
            }),
        []
    );

    const onNavigate = useCallback(() => {
        if (isMobile) setOpen(false);
    }, [isMobile]);

    return (
        <>
            {/* Hamburger (hidden >=992px) */}
            <Button
                className="fixed top-3 left-3 z-50 min-[992px]:hidden"
                radius="sm"
                onPress={() => setOpen((v) => !v)}
                aria-label="Toggle sidebar"
                aria-expanded={open}
            >
                ☰
            </Button>

            {/* Backdrop on mobile */}
            {isMobile && open && (
                <div
                    className="fixed inset-0 bg-black/50 z-40"
                    onClick={() => setOpen(false)}
                    aria-hidden
                />
            )}

            {/* Sidebar */}
            <nav
                aria-label="Main"
                role="navigation"
                className={[
                    'fixed left-0 top-0 h-dvh z-50 border-r border-neutral-800',
                    'bg-neutral-900 text-neutral-100',
                    'transition-transform duration-200 ease-out',
                    // off-canvas under 992px
                    isMobile ? (open ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0',
                    className || '',
                ].join(' ')}
                style={{ width }}
            >
                <div className="h-full overflow-y-auto p-2">
                    <ul className="m-0 p-0 list-none">
                        {navItems.map((n) => (
                            <ItemRow
                                key={n.href || n.label}
                                node={n}
                                depth={0}
                                isActive={isActive}
                                expanded={expanded}
                                toggle={toggle}
                                onNavigate={onNavigate}
                            />
                        ))}
                    </ul>
                </div>
            </nav>

            {/* Content shim so your page doesn’t sit under the sidebar on desktop */}
            <div style={{ width }} className="hidden min-[992px]:block" aria-hidden />
        </>
    );
}
export default Sidebar;