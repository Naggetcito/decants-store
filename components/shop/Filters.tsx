"use client";

import { m } from "framer-motion";
import { Search, X } from "lucide-react";
import { GENDER_LABELS, type Gender } from "@/data/products";
import { cn } from "@/lib/utils";

export type GenderFilter = "todos" | Gender;

export const GENDER_FILTERS: { value: GenderFilter; label: string }[] = [
  { value: "todos", label: "Todos" },
  { value: "hombre", label: GENDER_LABELS.hombre },
  { value: "mujer", label: GENDER_LABELS.mujer },
  { value: "unisex", label: GENDER_LABELS.unisex },
];

interface FiltersProps {
  gender: GenderFilter;
  onGenderChange: (gender: GenderFilter) => void;
  query: string;
  onQueryChange: (query: string) => void;
  /** Cantidad de perfumes por filtro (respetando la búsqueda actual). */
  counts: Record<GenderFilter, number>;
}

export function Filters({
  gender,
  onGenderChange,
  query,
  onQueryChange,
  counts,
}: FiltersProps) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div role="group" aria-label="Filtrar por género" className="flex flex-wrap gap-1.5 sm:gap-2">
        {GENDER_FILTERS.map((filter) => {
          const active = gender === filter.value;
          return (
            <button
              key={filter.value}
              type="button"
              aria-pressed={active}
              onClick={() => onGenderChange(filter.value)}
              className={cn(
                "relative inline-flex h-11 items-center gap-2 rounded-full border px-2.5 text-sm min-[360px]:px-3 sm:px-4 transition-transform duration-press ease-out-strong active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                active
                  ? "border-gold text-ink"
                  : "border-input text-foreground hover:border-gold/60"
              )}
            >
              {/* La píldora dorada viaja al filtro activo */}
              {active && (
                <m.span
                  layoutId="filtro-genero"
                  aria-hidden="true"
                  className="absolute -inset-px rounded-full bg-gold"
                  transition={{ type: "spring", duration: 0.4, bounce: 0.15 }}
                />
              )}
              <span className="relative">{filter.label}</span>
              <span
                className={cn(
                  "relative hidden text-xs tabular-nums sm:inline",
                  active ? "text-ink/70" : "text-muted-foreground"
                )}
              >
                {counts[filter.value]}
              </span>
            </button>
          );
        })}
      </div>

      <div className="relative sm:max-w-md lg:w-96">
        <label htmlFor="buscar-perfume" className="sr-only">
          Buscar por perfume, marca o nota
        </label>
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
        />
        <input
          id="buscar-perfume"
          type="search"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Perfume, marca o nota"
          autoComplete="off"
          className="h-11 w-full rounded-full border border-input bg-transparent pl-11 pr-12 text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring [&::-webkit-search-cancel-button]:hidden"
        />
        {query && (
          <button
            type="button"
            onClick={() => onQueryChange("")}
            aria-label="Borrar búsqueda"
            className="absolute right-0 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <X aria-hidden="true" className="size-4" />
          </button>
        )}
      </div>
    </div>
  );
}
