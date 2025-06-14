"use client";

import { useState, useMemo } from "react";
import { Controller, Control } from "react-hook-form";
import {
  ChevronDown,
  ChevronRight,
  Loader2,
  ChevronsUpDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";

export interface CategoryTreeNode {
  id: string;
  name: string;
  children?: CategoryTreeNode[];
}

type CategoryTreeSelectProps = {
  label?: string;
  name: string;
  control: Control<any>;
  categories: CategoryTreeNode[] | undefined;
  isLoading?: boolean;
  error?: string;
};

export function CategoryTreeSelect({
  label,
  name,
  control,
  categories,
  isLoading,
  error,
}: CategoryTreeSelectProps) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const selectedLabel = getLabelById(categories, field.value);

        return (
          <div className="space-y-2">
            {label && (
              <Label className={cn(error && "text-destructive")}>{label}</Label>
            )}

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn(
                    "w-full justify-between py-[22px] font-normal rounded-lg bg-background shadow-none",
                    !field.value && "text-muted-foreground",
                    error && "border-destructive border-2"
                  )}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="size-4 animate-spin" />
                      Loading...
                    </div>
                  ) : selectedLabel ? (
                    <span className="truncate text-left">{selectedLabel}</span>
                  ) : (
                    <span className="truncate text-left">
                      Select category...
                    </span>
                  )}
                  <ChevronsUpDown className="size-4 opacity-50 ml-2" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0 w-80" align="start">
                {isLoading ? (
                  <div className="flex items-center gap-2 py-4 px-4">
                    <Loader2 className="size-4 animate-spin" />
                    <span>Loading...</span>
                  </div>
                ) : categories && categories.length ? (
                  <CategoryPopoverContent
                    tree={categories}
                    selectedId={field.value}
                    onSelect={(id) =>
                      field.onChange(id === field.value ? "" : id)
                    }
                  />
                ) : (
                  <p className="text-sm text-muted-foreground px-4 py-2">
                    No categories
                  </p>
                )}
              </PopoverContent>
            </Popover>

            {error && (
              <p className="text-sm text-destructive pt-0.5 px-2">{error}</p>
            )}
          </div>
        );
      }}
    />
  );
}

function Tree({
  nodes,
  selectedId,
  onSelect,
}: {
  nodes: CategoryTreeNode[];
  selectedId?: string;
  onSelect: (id: string) => void;
}) {
  return (
    <ul className="space-y-2 py-2 px-2">
      {nodes.map((node) => (
        <TreeNode
          key={node.id}
          node={node}
          selectedId={selectedId}
          onSelect={onSelect}
        />
      ))}
    </ul>
  );
}

function TreeNode({
  node,
  selectedId,
  onSelect,
}: {
  node: CategoryTreeNode;
  selectedId?: string;
  onSelect: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <li>
      <div
        className={cn(
          "flex items-center gap-1 cursor-pointer select-none rounded px-3 py-2 hover:bg-muted/50",
          selectedId === node.id && "bg-primary/10 text-primary font-medium hover:bg-primary/10"
        )}
        onClick={() => onSelect(node.id)}
      >
        {hasChildren && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-4 p-0 hover:bg-transparent"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(!open);
            }}
          >
            {open ? (
              <ChevronDown className="size-4" />
            ) : (
              <ChevronRight className="size-4" />
            )}
          </Button>
        )}
        <span className="truncate text-sm leading-none">{node.name}</span>
      </div>
      {hasChildren && open && (
        <div className="ml-4">
          <Tree
            nodes={node.children!}
            selectedId={selectedId}
            onSelect={onSelect}
          />
        </div>
      )}
    </li>
  );
}

function getLabelById(
  tree: CategoryTreeNode[] | undefined,
  id?: string
): string | undefined {
  if (!id || !tree) return undefined;
  const stack = [...tree];
  while (stack.length) {
    const node = stack.pop()!;
    if (node.id === id) return node.name;
    if (node.children) stack.push(...node.children);
  }
  return undefined;
}

function CategoryPopoverContent({
  tree,
  selectedId,
  onSelect,
}: {
  tree: CategoryTreeNode[];
  selectedId?: string;
  onSelect: (id: string) => void;
}) {
  const flatList = useMemo(() => flattenTree(tree), [tree]);
  const [search, setSearch] = useState("");

  const showTree = search.trim() === "";

  return (
    <Command shouldFilter={false} className="w-full">
      <CommandInput
        placeholder="Search categories..."
        value={search}
        onValueChange={setSearch}
      />
      {showTree ? (
        <div className="max-h-64 overflow-y-auto relative pt-2 pb-4">
          {/* top fade */}
          <div className="pointer-events-none absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-background to-transparent" />
          <Tree nodes={tree} selectedId={selectedId} onSelect={onSelect} />
          {/* bottom fade */}
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-background to-transparent" />
        </div>
      ) : (
        <CommandList className="max-h-64 overflow-y-auto">
          <CommandEmpty>No results.</CommandEmpty>
          <CommandGroup>
            {flatList
              .filter((item) =>
                item.label.toLowerCase().includes(search.toLowerCase())
              )
              .map((item) => (
                <CommandItem
                  key={item.id}
                  onSelect={() => onSelect(item.id)}
                  value={item.label}
                >
                  {item.label}
                </CommandItem>
              ))}
          </CommandGroup>
        </CommandList>
      )}
    </Command>
  );
}

function flattenTree(
  tree: CategoryTreeNode[],
  path: string[] = []
): { id: string; label: string }[] {
  const acc: { id: string; label: string }[] = [];
  for (const node of tree) {
    const currentPath = [...path, node.name];
    acc.push({ id: node.id, label: currentPath.join(" / ") });
    if (node.children) acc.push(...flattenTree(node.children, currentPath));
  }
  return acc;
}
