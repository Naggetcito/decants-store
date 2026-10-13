import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Vial } from "@/components/fx/Vial";
import { formatPrice, products } from "@/data/products";

// Todo se calcula desde data/products.ts: si cambian los precios, la tabla se actualiza sola.
const prices5 = products.map((p) => p.price5ml);
const prices10 = products.map((p) => p.price10ml);
const range = (values: number[]) =>
  `${formatPrice(Math.min(...values))} a ${formatPrice(Math.max(...values))}`;

const averageSaving = Math.round(
  (products.reduce(
    (sum, p) => sum + (1 - p.price10ml / 10 / (p.price5ml / 5)),
    0
  ) /
    products.length) *
    100
);

// Referencia: ~0,1 ml por pulverización y 2 pulverizaciones al día.
const ROWS = [
  {
    label: "Ideal para",
    five: "Probar una fragancia nueva",
    ten: "Usarla con frecuencia",
  },
  {
    label: "Pulverizaciones",
    five: "Unas 50",
    ten: "Unas 100",
  },
  {
    label: "Duración con uso diario",
    five: "Unos 25 días",
    ten: "Unos 50 días",
  },
  {
    label: "Precio según el perfume",
    five: range(prices5),
    ten: range(prices10),
  },
  ...(averageSaving > 0
    ? [
        {
          label: "Precio por ml",
          five: "Referencia",
          ten: `Cerca de ${averageSaving}% menos`,
        },
      ]
    : []),
] as const;

export function SizeComparison() {
  return (
    <section
      id="tamanos"
      aria-labelledby="tamanos-titulo"
      className="border-t border-border py-20 md:py-28"
    >
      <div className="container grid grid-cols-1 gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div className="space-y-5">
          <h2 id="tamanos-titulo" className="text-4xl md:text-5xl">
            5ml o 10ml
          </h2>
          <p className="max-w-md text-lg leading-relaxed text-muted-foreground">
            El de 5ml sirve para conocer una fragancia sin gastar mucho. El de
            10ml rinde más{averageSaving > 0 ? " y sale más barato por ml" : ""}.
          </p>
          <Button asChild size="lg" className="mt-2 h-12 px-8 text-base">
            <Link href="#catalogo">Elegir mi decant</Link>
          </Button>
        </div>

        <div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm md:text-base">
              <caption className="sr-only">
                Comparación entre el decant de 5ml y el de 10ml
              </caption>
              <thead>
                <tr className="border-b border-gold/40">
                  <td className="w-1/3 py-4 pr-4" />
                  <th scope="col" className="py-4 pr-4 align-bottom font-display text-3xl font-medium">
                    <Vial ml={5} className="mb-3 w-11 md:w-14" />
                    5ml
                  </th>
                  <th scope="col" className="py-4 align-bottom font-display text-3xl font-medium text-gold">
                    <Vial ml={10} className="mb-3 w-11 md:w-14" />
                    10ml
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {ROWS.map((row) => (
                  <tr key={row.label}>
                    <th
                      scope="row"
                      className="py-4 pr-4 align-top text-sm font-normal text-muted-foreground"
                    >
                      {row.label}
                    </th>
                    <td className="py-4 pr-4 align-top">{row.five}</td>
                    <td className="py-4 align-top">{row.ten}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
            Cálculo aproximado con 2 pulverizaciones al día. Varía según el
            atomizador y cómo lo uses.
          </p>
        </div>
      </div>
    </section>
  );
}
