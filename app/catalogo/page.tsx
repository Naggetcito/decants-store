import { redirect } from "next/navigation";

// El catálogo vive en el Home; /catalogo lleva directo a esa sección.
export default function CatalogoIndex() {
  redirect("/#catalogo");
}
