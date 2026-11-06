import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, GraduationCap, Laptop, Lock, ShieldCheck, ShoppingBag, Smartphone, Sparkles, User, Ban } from "lucide-react";
import PhotoEditor from "@/components/PhotoEditor";
import ToolDirectory from "@/components/ToolDirectory";
import Faq from "@/components/site/Faq";
import JsonLd from "@/components/site/JsonLd";
import ToolLink from "@/components/site/ToolLink";
import { LIVE_TOOLS } from "@/lib/tools";
import {
  buildMetadata,
  faqSchema,
  graph,
  itemListSchema,
  organizationSchema,
  webApplicationSchema,
  websiteSchema,
  type FaqItem,
} from "@/lib/seo";

const TITLE = "Bilder kostenlos bearbeiten – online & ohne Anmeldung";
const DESCRIPTION =
  "Bilder kostenlos bearbeiten: verkleinern, komprimieren, Hintergrund entfernen, HEIC in JPG umwandeln und zuschneiden – online, ohne Anmeldung, im Browser.";

export const metadata: Metadata = buildMetadata({ title: TITLE, description: DESCRIPTION, path: "/" });

/** Extra search terms for the hero search (synonyms users type). */


const FAQS: FaqItem[] = [
  {
    q: "Kann ich Bilder wirklich kostenlos bearbeiten?",
    a: "Ja. Alle Werkzeuge auf dieser Website sind kostenlos und ohne Anmeldung nutzbar. Es gibt kein Abo, keine Testphase und kein Wasserzeichen auf Ihren Ergebnissen. Sie laden das bearbeitete Bild in voller Auflösung herunter, so oft Sie möchten.",
  },
  {
    q: "Werden meine Fotos auf einen Server hochgeladen?",
    a: "Nein. Die Bildbearbeitung läuft vollständig in Ihrem Browser auf Ihrem eigenen Gerät. Ihre Fotos werden nicht an unseren Server übertragen und nicht gespeichert. Bei den KI-Werkzeugen wird lediglich das KI-Modell einmalig heruntergeladen – das Foto selbst verlässt Ihr Gerät nicht.",
  },
  {
    q: "Muss ich ein Programm oder eine App installieren?",
    a: "Nein. Sie brauchen nur einen aktuellen Browser wie Chrome, Edge, Firefox oder Safari – auf Windows, Mac, Linux, iPhone, iPad oder Android. Einige Funktionen laden beim ersten Aufruf zusätzliche Programmbausteine nach, die der Browser anschließend zwischenspeichert.",
  },
  {
    q: "Welche Bildformate werden unterstützt?",
    a: "Sie können JPG/JPEG, PNG, WebP und GIF öffnen, außerdem HEIC und HEIF vom iPhone. Gespeichert wird je nach Werkzeug als JPG, PNG, WebP oder GIF. Welche Formate ein Tool genau annimmt, steht direkt im jeweiligen Upload-Feld.",
  },
  {
    q: "Kann ich mehrere Bilder gleichzeitig bearbeiten?",
    a: "Ja. Beim Verkleinern, Komprimieren und beim Umwandeln von HEIC in JPG können Sie mehrere Dateien auf einmal auswählen. Alle Bilder werden mit denselben Einstellungen verarbeitet und lassen sich gesammelt als ZIP-Archiv herunterladen. Der Foto-Editor auf dieser Seite bearbeitet jeweils ein Bild.",
  },
  {
    q: "Funktionieren die Tools auch auf dem iPhone und Android-Handy?",
    a: "Ja. Alle Werkzeuge sind für Touch-Bedienung ausgelegt; Sie wählen Fotos direkt aus der Mediathek. Auf iPhone und iPad begrenzt Safari die Größe von Zeichenflächen – sehr große Fotos über rund 16 Megapixel werden dort vor der Bearbeitung automatisch verkleinert, worauf das Tool hinweist.",
  },
];

export default function HomePage() {

  return (
    <main id="main" className="flex-1 bg-white">
      <JsonLd
        data={graph(
          websiteSchema(),
          organizationSchema(),
          webApplicationSchema("FotoWerkzeuge Foto-Editor", "/", DESCRIPTION),
          itemListSchema(LIVE_TOOLS),
          faqSchema(FAQS, "/"),
        )}
      />

      {/* Hero */}
      <section className="relative border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 pb-10 pt-8 sm:px-6 sm:pt-12 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-lime-800">
              <Sparkles aria-hidden className="h-3.5 w-3.5 text-lime-700" />
              Kostenlos · ohne Anmeldung · ohne Wasserzeichen
            </p>
            <h1 className="mt-4 text-[2rem] font-extrabold leading-[1.1] tracking-tight text-zinc-950 sm:text-5xl">
              Bilder kostenlos bearbeiten – alle Foto-Tools online
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-[15px] leading-relaxed text-zinc-700 sm:mt-4 sm:text-lg">
              Bilder kostenlos bearbeiten, direkt im Browser: verkleinern, komprimieren, zuschneiden oder den Hintergrund entfernen.
              Ihre Bilder bleiben dabei auf Ihrem Gerät.
            </p>
          </div>

          <div className="mx-auto mt-8 max-w-6xl">
            <PhotoEditor />
            <ul className="mt-4 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-zinc-700">
              {["Verarbeitung lokal im Browser", "Kein Wasserzeichen", "Keine Anmeldung"].map((s) => (
                <li key={s} className="inline-flex items-center gap-1.5">
                  <Check aria-hidden className="h-4 w-4 text-lime-700" /> {s}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Tool directory */}
      <section id="tools" className="py-16 sm:py-20" aria-labelledby="tools-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 max-w-3xl">
            <h2 id="tools-heading" className="text-3xl font-extrabold tracking-tight text-zinc-950">
              Beliebte Foto-Tools
            </h2>
            <p className="mt-3 text-base leading-relaxed text-zinc-700">
              Jedes Werkzeug ist auf eine Aufgabe spezialisiert. Wählen Sie das passende Tool – die kostenlose Bildbearbeitung startet
              sofort, ganz ohne Anmeldung.
            </p>
          </div>
          <ToolDirectory />
        </div>
      </section>

      {/* How it works */}
      <section id="anleitung" className="border-y border-zinc-200 bg-zinc-50 py-16 sm:py-20" aria-labelledby="how-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 id="how-heading" className="max-w-3xl text-3xl font-extrabold tracking-tight text-zinc-950">
            So funktioniert die kostenlose Bildbearbeitung im Browser
          </h2>
          <p className="mt-3 max-w-3xl text-base leading-relaxed text-zinc-700">
            Moderne Browser können Bilder selbst berechnen. Deshalb brauchen Sie weder ein Programm noch ein Konto – drei Schritte
            genügen.
          </p>
          <ol className="mt-10 grid gap-x-10 gap-y-8 md:grid-cols-3">
            {[
              {
                h: "1. Tool auswählen",
                p: "Suchen Sie oben nach Ihrer Aufgabe oder wählen Sie ein Werkzeug aus der Übersicht. Für schnelle Korrekturen nutzen Sie den Foto-Editor auf dieser Seite.",
              },
              {
                h: "2. Bild hochladen",
                p: "Ziehen Sie Ihr Foto per Drag & Drop in das Feld oder wählen Sie es aus. „Hochladen“ heißt hier: Der Browser öffnet die Datei lokal – sie wird nicht an einen Server gesendet.",
              },
              {
                h: "3. Ergebnis herunterladen",
                p: "Passen Sie die Einstellungen an und speichern Sie das Ergebnis. Mehrere Dateien fassen die Stapel-Tools auf Wunsch in einem ZIP-Archiv zusammen.",
              },
            ].map((s) => (
              <li key={s.h} className="border-t-2 border-lime-700 pt-5">
                <h3 className="text-lg font-bold text-zinc-950">{s.h}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-zinc-700">{s.p}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Why */}
      <section className="py-16 sm:py-20" aria-labelledby="why-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 id="why-heading" className="max-w-3xl text-3xl font-extrabold tracking-tight text-zinc-950">
            Warum unsere Foto-Tools?
          </h2>
          <div className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Ban,
                h: "Kostenlos und ohne Anmeldung",
                p: "Fotobearbeitung kostenlos und ohne Nutzerkonto: keine E-Mail-Adresse, keine Testphase, keine Begrenzung der Bildanzahl.",
              },
              {
                icon: ShieldCheck,
                h: "Kein Wasserzeichen",
                p: "Ihre Ergebnisse gehören Ihnen. Wir fügen weder Logos noch Markierungen hinzu und verringern die Auflösung nicht künstlich.",
              },
              {
                icon: Lock,
                h: "Datenschutz: Verarbeitung direkt auf Ihrem Gerät",
                p: "Die Berechnung erfolgt im Browser, teils mit WebAssembly-Bausteinen. Ihre Bilder werden nicht übertragen – ein Vorteil im Sinne von DSGVO und revDSG.",
              },
              {
                icon: Laptop,
                h: "Für Computer, Tablet und Smartphone",
                p: "Die Oberfläche passt sich jedem Bildschirm an und lässt sich per Maus, Tastatur oder Touch bedienen – unter Windows, macOS, iOS und Android.",
              },
            ].map(({ icon: Icon, h, p }) => (
              <div key={h} className="border-t border-zinc-200 pt-5">
                <Icon aria-hidden className="h-6 w-6 text-lime-700" />
                <h3 className="mt-4 text-base font-bold text-zinc-950">{h}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-700">{p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Audiences */}
      <section className="border-y border-zinc-200 bg-zinc-50 py-16 sm:py-20" aria-labelledby="audience-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 id="audience-heading" className="max-w-3xl text-3xl font-extrabold tracking-tight text-zinc-950">
            Für wen eignen sich die Tools?
          </h2>
          <div className="mt-10 grid gap-x-10 gap-y-8 md:grid-cols-3">
            <div className="border-t border-zinc-200 pt-5">
              <User aria-hidden className="h-6 w-6 text-lime-700" />
              <h3 className="mt-3 text-lg font-bold text-zinc-950">Privatpersonen</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-zinc-700">
                Fotos kostenlos bearbeiten für den Alltag: Urlaubsbilder für den E-Mail-Versand kleiner machen, iPhone-Fotos im HEIC-Format
                für ältere Geräte umwandeln oder ein Bild für das Profilfoto zuschneiden.
              </p>
              <p className="mt-3 text-sm">
                <ToolLink id="P27" /> · <ToolLink id="P1" />
              </p>
            </div>
            <div className="border-t border-zinc-200 pt-5">
              <ShoppingBag aria-hidden className="h-6 w-6 text-lime-700" />
              <h3 className="mt-3 text-lg font-bold text-zinc-950">Onlineshops und Selbstständige</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-zinc-700">
                Produktfotos freistellen, auf einen ruhigen Hintergrund setzen und für kurze Ladezeiten komprimieren. Viele Marktplätze
                haben eigene Bildrichtlinien – prüfen Sie diese vor dem Hochladen.
              </p>
              <p className="mt-3 text-sm">
                <ToolLink id="P40" /> · <ToolLink id="P2" />
              </p>
            </div>
            <div className="border-t border-zinc-200 pt-5">
              <GraduationCap aria-hidden className="h-6 w-6 text-lime-700" />
              <h3 className="mt-3 text-lg font-bold text-zinc-950">Schulen, Vereine und Behördenkontakte</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-zinc-700">
                Upload-Portale von Hochschulen, Ämtern oder Bewerbungsplattformen begrenzen oft die Dateigröße. Mit der Zielgröße-Funktion
                bringen Sie ein Foto zuverlässig unter ein vorgegebenes Limit.
              </p>
              <p className="mt-3 text-sm">
                <ToolLink id="P1" /> · <ToolLink id="P3" />
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="py-16 sm:py-20" aria-labelledby="compare-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 id="compare-heading" className="max-w-3xl text-3xl font-extrabold tracking-tight text-zinc-950">
            Fotobearbeitung kostenlos: Online-Tool, Programm oder App?
          </h2>
          <p className="mt-3 max-w-3xl text-base leading-relaxed text-zinc-700">
            Kostenlose Bildbearbeitung gibt es in drei Varianten. Welche passt, hängt davon ab, wie oft und wie aufwendig Sie Bilder
            bearbeiten.
          </p>
          <div className="mt-10 grid gap-x-10 gap-y-8 md:grid-cols-3">
            <div className="border-t-2 border-lime-700 pt-5">
              <h3 className="text-lg font-bold text-zinc-950">Online-Tool ohne Installation</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-zinc-700">
                Ideal für klar umrissene Aufgaben wie Verkleinern, Komprimieren, Zuschneiden oder Umwandeln. Bildbearbeitung online kostenlos,
                sofort startklar und auf jedem Gerät gleich.
              </p>
              <ul className="mt-4 space-y-1.5 text-sm text-zinc-800">
                {["Keine Installation, keine Updates", "Auch auf fremden oder Firmen-PCs nutzbar", "Spezialisierte Werkzeuge je Aufgabe"].map((s) => (
                  <li key={s} className="flex items-start gap-2">
                    <Check aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-lime-700" /> {s}
                  </li>
                ))}
              </ul>
            </div>
            <div className="border-t border-zinc-200 pt-5">
              <h3 className="text-lg font-bold text-zinc-950">Kostenlose Bildbearbeitungsprogramme</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-zinc-700">
                Desktop-Programme wie GIMP oder Paint.NET bieten Ebenen, Masken und komplexe Retusche. Dafür brauchen sie eine Installation und
                etwas Einarbeitung. Ein Vergleich folgt im Ratgeber <ToolLink id="P68" />.
              </p>
            </div>
            <div className="border-t border-zinc-200 pt-5">
              <Smartphone aria-hidden className="h-6 w-6 text-lime-700" />
              <h3 className="mt-3 text-lg font-bold text-zinc-950">Bildbearbeitungs-Apps fürs Handy</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-zinc-700">
                Apps sind praktisch für Filter und schnelle Korrekturen unterwegs, belegen aber Speicherplatz und verlangen oft ein Konto.
                Unsere Tools laufen ohne Download direkt im mobilen Browser.
              </p>
            </div>
          </div>
          <p className="mt-8">
            <Link href="#editor" className="inline-flex min-h-12 items-center gap-2 rounded-lg bg-lime-700 px-5 text-sm font-semibold text-white hover:bg-lime-800">
              Jetzt Bilder kostenlos bearbeiten <ArrowRight aria-hidden className="h-4 w-4" />
            </Link>
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-zinc-200 bg-zinc-50 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Faq title="Häufige Fragen zur kostenlosen Bildbearbeitung" items={FAQS} />
        </div>
      </section>
    </main>
  );
}
