import React from "react";

import {
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import { MIXED_ITEMS } from "@/appData";
import { FiCheck, FiExternalLink } from "react-icons/fi";

export default function MixedDropdown({
  label = "Mixed dropdown",
  value,
  onChange,
}: {
  label?: string;
  value?: string;
  onChange: (val: string) => void;
}) {
  const selectedText = React.useMemo(() => {
    const found = MIXED_ITEMS.find((i) => i.type === "select" && i.value === value);
    return found ? found.label.replace(/^Choose:\s*/i, "") : "";
  }, [value]);

  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-default-500">{label}</span>
      <Dropdown>
        <DropdownTrigger>
          <Button variant="faded" radius="lg" size="lg" className="justify-between w-full bg-transparent hover:border-default-400">
            {selectedText ? (
              <span className="flex items-center gap-2">
                <FiCheck className="h-4 w-4" /> {selectedText}
              </span>
            ) : (
              <span className="text-default-400">Select or open a link</span>
            )}
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          aria-label="Mixed menu"
          onAction={(key) => {
            const item = MIXED_ITEMS.find((i) => i.key === String(key));
            if (!item) return;
            if (item.type === "select") {
              onChange(item.value);
            }
          }}
        >
          {MIXED_ITEMS.map((item) =>
            item.type === "select" ? (
              <DropdownItem key={item.key} description={item.description} startContent={<FiCheck className="h-4 w-4" />}>
                {item.label}
              </DropdownItem>
            ) : (
              <DropdownItem
                key={item.key}
                href={item.href}
                target={item.target ?? "_blank"}
                description={item.description}
                startContent={<FiExternalLink className="h-4 w-4" />}
              >
                {item.label}
              </DropdownItem>
            )
          )}
        </DropdownMenu>
      </Dropdown>
    </div>
  );
}