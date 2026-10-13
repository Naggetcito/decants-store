import Link from "next/link";
import { WhatsAppIcon } from "@/components/layout/WhatsAppIcon";
import { NAV_LINKS } from "@/components/layout/nav-links";
import {
  WHATSAPP_DISPLAY,
  buildWhatsAppUrl,
  generalMessage,
} from "@/lib/whatsapp";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container grid grid-cols-1 gap-10 pb-10 pt-14 sm:grid-cols-2 md:grid-cols-[1.4fr_1fr_1fr] md:pb-14">
        <div className="max-w-sm space-y-3">
          <p className="font-display text-2xl">Decants Store</p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Decants originales de perfumes de diseñador en 5ml y 10ml. Prueba la
            fragancia antes de comprar la botella.
          </p>
        </div>

        <nav aria-label="Secciones" className="space-y-3">
          <p className="text-sm text-foreground">Explora</p>
          <ul className="md:space-y-2">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="inline-flex min-h-11 items-center text-sm text-muted-foreground hover:text-gold md:min-h-0"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="space-y-3">
          <p className="text-sm text-foreground">Pedidos</p>
          <a
            href={buildWhatsAppUrl(generalMessage())}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center gap-2 text-sm text-muted-foreground hover:text-gold"
          >
            <WhatsAppIcon className="size-4" />
            {WHATSAPP_DISPLAY}
          </a>
          <p className="text-sm text-muted-foreground">
            Escríbenos y te respondemos por WhatsApp.
          </p>
        </div>
      </div>

      {/* Firma: el nombre ocupa todo el ancho, recortado por abajo. Va en ::before porque es decorativo. */}
      <div aria-hidden="true" className="container overflow-hidden">
        <p
          data-firma="Decants Store"
          className="translate-y-[18%] select-none whitespace-nowrap text-center font-display text-[17.5vw] leading-none tracking-tight text-gold/[0.12] before:content-[attr(data-firma)] 2xl:text-[14rem]"
        />
      </div>

      <div className="border-t border-border">
        <div className="container pb-28 pt-6 text-xs leading-relaxed text-muted-foreground md:pb-6">
          <p>
            © {new Date().getFullYear()} Decants Store. Las marcas mencionadas
            pertenecen a sus respectivos dueños y no están afiliadas a esta
            tienda.
          </p>
        </div>
      </div>
    </footer>
  );
}
