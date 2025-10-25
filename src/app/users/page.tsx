"use client";

import React from "react";
import DataTable, { ColumnDef } from "@/UI/DataTable";
import { Chip } from "@heroui/react";

type UserRow = {
  id: number;
  name: string;
  email: string;
  role: "Admin" | "Editor" | "Viewer";
  createdAt: string; // ISO date
};

const rows: UserRow[] = Array.from({ length: 73 }).map((_, i) => ({
  id: i + 1,
  name: `User ${i + 1}`,
  email: `user${i + 1}@example.com`,
  role: (["Admin", "Editor", "Viewer"] as const)[i % 3],
  createdAt: new Date(Date.now() - i * 86_400_000).toISOString(),
}));

const columns: ColumnDef<UserRow>[] = [
  { key: "id", header: "ID", sortable: true, sortValue: (r) => r.id, className: "w-16" },
  { key: "name", header: "Name", sortable: true, visible: true },
  { key: "email", header: "Email", sortable: true, visible: true },
  {
    key: "role",
    header: "Role",
    sortable: true,
    sortValue: (r) => r.role,
    cell: (r) => <Chip size="sm" variant="flat">{r.role}</Chip>,
  },
  {
    key: "createdAt",
    header: "Created",
    sortable: true,
    sortValue: (r) => new Date(r.createdAt),
    cell: (r) => new Date(r.createdAt).toLocaleDateString(),
    className: "text-right",
  },
];

export default function UsersPage() {
  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-semibold tracking-tight">Users</h1>
      <DataTable<UserRow>
        data={rows}
        columns={columns}
        enableSearch
        enableSort
        initialPageSize={10}
        pageSizeOptions={[5, 10, 20, 50]}
        ariaLabel="Users table"
        getRowKey={(r) => r.id} // ✅ stable keys for correct sorting DOM updates
        onVisibleChange={(keys) => console.log("Visible columns:", keys)}
        onSearchPredicate={(row, q) =>
          [row.name, row.email, row.role].some((v) => String(v).toLowerCase().includes(q))
        }
      />
    </div>
  );
}
