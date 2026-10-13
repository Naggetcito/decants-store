import Image from "next/image";
import Link from "next/link";
import { Fragment, type CSSProperties } from "react";
import { Button } from "@/components/ui/button";
import { LiquidGold } from "@/components/fx/LiquidGold";
import { WhatsAppIcon } from "@/components/layout/WhatsAppIcon";
import { formatPrice, products } from "@/data/products";
import { buildWhatsAppUrl, generalMessage } from "@/lib/whatsapp";

const HEADLINE = "Perfumes de diseñador, sin pagar la botella completa";
const WORDS = HEADLINE.split(" ");

// TODO: reemplazar por la foto IA de una mano aplicando el atomizador (public/images/hero.jpg).
const HERO_IMAGE = {
  src: "/images/products/paco-rabanne-one-million-elixir.jpg",
  alt: "Decant de Paco Rabanne One Million Elixir junto a su botella original, con luz dorada",
};

const lowestPrice5ml = Math.min(...products.map((p) => p.price5ml));

// El reveal es CSS puro: arranca en el primer pintado, sin esperar a que cargue JS.
const delay = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;
const AFTER_WORDS = 120 + WORDS.length * 50 + 200;

export function Hero() {
  return (
    <section
      aria-labelledby="hero-titulo"
      className="relative isolate overflow-hidden border-b border-border"
    >
      {/* Foto: fondo completo en móvil, mitad derecha en desktop */}
      <div className="absolute inset-0 -z-10 md:left-auto md:w-[58%]">
        <Image
          src={HERO_IMAGE.src}
          alt={HERO_IMAGE.alt}
          fill
          priority
          fetchPriority="high"
          quality={80}
          sizes="(min-width: 768px) 58vw, 100vw"
          className="hero-zoom object-cover object-[72%_center]"
        />
        {/* Oro líquido: en móvil queda bajo el degradado para que el titular se lea siempre */}
        <LiquidGold className="absolute inset-0 size-full [mask-image:linear-gradient(to_bottom,#000_45%,transparent_92%)] md:z-10 md:[mask-image:linear-gradient(to_right,transparent,#000_18%,#000_85%,transparent)]" />
        {/* Degradado ink → gold/20: el texto siempre se lee sobre ink */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-ink from-25% via-ink/70 to-gold/20 md:bg-gradient-to-r md:from-ink md:from-0% md:via-ink/45 md:to-gold/20"
        />
      </div>

      <div className="container flex min-h-[calc(100svh-4rem)] flex-col justify-end gap-7 pb-24 pt-56 md:min-h-[min(46rem,calc(100svh-4rem))] md:justify-center md:gap-8 md:py-24">
        <h1
          id="hero-titulo"
          aria-label={HEADLINE}
          // Ancho en em (no ch): el ch cambia entre la fuente de respaldo y Playfair y movía los saltos de línea (CLS).
          className="max-w-[6.75em] text-5xl leading-[1.02] tracking-tight sm:text-6xl md:max-w-[7.4em] lg:text-7xl"
        >
          {WORDS.map((word, i) => (
            <Fragment key={i}>
              <span
                aria-hidden="true"
                className="inline-block overflow-hidden pb-[0.12em] align-bottom"
              >
                <span
                  className="hero-word"
                  style={{ "--i": i } as CSSProperties}
                >
                  {word}
                </span>
              </span>
              {/* El espacio va fuera del inline-block para que no colapse */}
              {i < WORDS.length - 1 && " "}
            </Fragment>
          ))}
        </h1>

        <p
          className="hero-rise max-w-sm text-base leading-relaxed text-cream/80 sm:text-lg md:max-w-md"
          style={delay(AFTER_WORDS)}
        >
          Decants originales de 5ml y 10ml. Prueba la fragancia y pide por
          WhatsApp.
        </p>

        <div
          className="hero-rise grid grid-cols-2 gap-3 sm:flex sm:flex-wrap"
          style={delay(AFTER_WORDS + 100)}
        >
          <Button asChild size="lg" className="h-12 px-4 text-base sm:px-8">
            <Link href="#catalogo">Ver catálogo</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="h-12 gap-2 border-gold/50 bg-ink/40 px-4 text-base text-gold backdrop-blur-sm hover:text-gold sm:px-6"
          >
            <a
              href={buildWhatsAppUrl(generalMessage())}
              target="_blank"
              rel="noopener noreferrer"
            >
              <WhatsAppIcon className="!size-5" />
              WhatsApp
            </a>
          </Button>
        </div>

        <p
          className="hero-rise text-sm text-muted-foreground"
          style={delay(AFTER_WORDS + 200)}
        >
          {products.length} fragancias, desde {formatPrice(lowestPrice5ml)} el
          decant de 5ml.
        </p>
      </div>
    </section>
  );
}
