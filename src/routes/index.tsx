import { createFileRoute } from "@tanstack/react-router";
import HeroReveal from "@/components/HeroReveal";
import SecondFold from "@/components/SecondFold";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Marcos Fonseca — Direção de marca e identidade visual" },
      {
        name: "description",
        content:
          "Investigo o que impede marcas e projetos de serem percebidos pelo valor que possuem — e transformo essa descoberta em direção, sistemas e expressão visual.",
      },
      { property: "og:title", content: "Marcos Fonseca — Direção de marca e identidade visual" },
      {
        property: "og:description",
        content:
          "Nem toda marca precisa de um novo design. Algumas precisam ser verdadeiramente compreendidas.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
});

function Index() {
  return (
    <main className="bg-background">
      <HeroReveal />
      <SecondFold />
    </main>
  );
}
