import type { Product } from "@/data/products";

const LEVELS = [
  { key: "salida", title: "Salida", hint: "Lo primero que hueles" },
  { key: "corazon", title: "Corazón", hint: "El carácter, a los pocos minutos" },
  { key: "fondo", title: "Fondo", hint: "Lo que queda en la piel" },
] as const;

/** Salida, corazón y fondo son una secuencia en el tiempo: se dibuja como línea de tiempo. */
export function NotesPyramid({ notes }: { notes: Product["notes"] }) {
  return (
    <ol className="relative space-y-5 border-l border-border pl-6">
      {LEVELS.map((level) => (
        <li key={level.key} className="relative">
          <span
            aria-hidden="true"
            className="absolute -left-[1.9rem] top-[0.45rem] size-2.5 rounded-full border border-gold bg-background"
          />
          <p className="text-sm text-foreground">
            {level.title}
            <span className="ml-2 text-xs text-muted-foreground">
              {level.hint}
            </span>
          </p>
          <p className="mt-1 font-display text-lg leading-snug">
            {notes[level.key].join(", ")}
          </p>
        </li>
      ))}
    </ol>
  );
}
