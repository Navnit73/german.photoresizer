import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Building2, Mail, ShieldAlert } from "lucide-react";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Impressum",
  description:
    "Anbieterkennzeichnung gemäß § 5 DDG (Deutschland), § 5 ECG und § 25 MedienG (Österreich) sowie Art. 3 Abs. 1 lit. s UWG (Schweiz).",
  path: "/impressum/",
});

export default function ImpressumPage() {
  return (
    <main id="main" className="flex-1 py-12 sm:py-16 bg-white">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-lime-700 hover:underline mb-8"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Zurück zur Startseite
        </Link>

        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-950 sm:text-4xl">
          Impressum
        </h1>
        <p className="mt-2 text-sm text-zinc-600">
          Anbieterkennzeichnung für Deutschland (DE), Österreich (AT) und die Schweiz (CH).
        </p>

        <div className="mt-10 space-y-8 text-sm leading-relaxed text-zinc-700">
          {/* Angaben gemäß DDG */}
          <section className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6">
            <div className="flex items-center gap-2 font-bold text-zinc-900 text-base mb-3">
              <Building2 className="h-5 w-5 text-lime-700" />
              <span>Angaben gemäß § 5 Digitale-Dienste-Gesetz (DDG)</span>
            </div>
            <p className="text-zinc-800">
              {/* TODO (launch blocker, § 5 DDG): replace all placeholders with the operator's real data. */}
              <strong>FotoWerkzeuge</strong><br />
              Diensteanbieter / Betreiber der Website:<br />
              [Name des Betreibers / Firma]<br />
              [Straße und Hausnummer]<br />
              [PLZ und Ort, z. B. Berlin, Deutschland]
            </p>

            <div className="mt-4 pt-4 border-t border-zinc-200">
              <div className="flex items-center gap-2 font-semibold text-zinc-900 mb-1">
                <Mail className="h-4 w-4 text-lime-700" /> Kontakt
              </div>
              <p>
                E-Mail: <span className="font-mono text-lime-800 font-semibold">kontakt@fotowerkzeuge.online</span><br />
                Website: <span className="font-mono">https://fotowerkzeuge.online</span>
              </p>
            </div>
          </section>

          {/* AT & CH Hinweise */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-zinc-950">
              Zusätzliche Angaben für Österreich &amp; die Schweiz
            </h2>
            <p>
              <strong>Für Nutzer in Österreich:</strong> Angaben gemäß § 5 E-Commerce-Gesetz (ECG) und Offenlegung nach § 25 Mediengesetz (MedienG). Grundlegende Richtung der Website (Blattlinie): Bereitstellung von kostenlosen digitalen Werkzeugen zur Online-Bildbearbeitung und Information über Grafikformate.
            </p>
            <p>
              <strong>Für Nutzer in der Schweiz:</strong> Angaben gemäß Art. 3 Abs. 1 lit. s des Bundesgesetzes gegen den unlauteren Wettbewerb (UWG). Kontaktadresse und verantwortliche Stelle wie oben angegeben.
            </p>
          </section>

          {/* Haftung für Inhalte */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-zinc-950">
              Haftung für Inhalte
            </h2>
            <p>
              Als Diensteanbieter sind wir gemäß den allgemeinen Gesetzen für eigene Inhalte auf diesen Seiten verantwortlich. Wir sind jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
            </p>
            <p>
              Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich.
            </p>
          </section>

          {/* Haftung für Links */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-zinc-950">
              Haftung für externe Links
            </h2>
            <p>
              Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.
            </p>
          </section>

          {/* Urheberrecht */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-zinc-950">
              Urheberrecht &amp; Schutzrechte
            </h2>
            <p>
              Die durch die Seitenbetreiber erstellten Inhalte, Texte und Benutzeroberflächen auf diesen Seiten unterliegen dem deutschen und europäischen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Erstellers.
            </p>
            <p>
              Adobe Photoshop®, GIMP, Apple iPhone®, Windows® und andere genannte Software- und Markennamen sind Warenzeichen oder eingetragene Warenzeichen ihrer jeweiligen Inhaber und dienen ausschließlich illustrativen und beschreibenden Zwecken.
            </p>
          </section>

          {/* Hinweis Passbilder / amtliche Richtlinien */}
          <section className="rounded-xl border border-lime-700/20 bg-lime-50/40 p-4 text-xs text-zinc-700">
            <div className="flex items-center gap-2 font-semibold text-lime-900 mb-1">
              <ShieldAlert className="h-4 w-4 text-lime-700" /> Wichtiger Hinweis zu amtlichen Passbild-Zuschnitten
            </div>
            <p>
              Sofern unsere Zuschnitt-Werkzeuge Standardmaße (z. B. 35 × 45 mm) anbieten, dienen diese nur zur Unterstützung. Es wird keine Gewähr oder Rechtsberatung für die amtliche Anerkennung von biometrischen Passfotos übernommen. Bitte prüfen Sie stets die Richtlinien Ihrer zuständigen Passbehörde (Bundesdruckerei / BMI in Deutschland, oesterreich.gv.at in Österreich, fedpol in der Schweiz).
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
