import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/site/JsonLd";
import Breadcrumbs from "@/components/site/Breadcrumbs";
import { LIVE_TOOLS } from "@/lib/tools";
import { SITE_NAME, absoluteUrl } from "@/lib/site";
import { breadcrumbSchema, buildMetadata, graph, organizationSchema } from "@/lib/seo";

const TITLE = "Über uns – so funktionieren unsere Foto-Tools";
const DESCRIPTION =
  "Wer hinter FotoFixer steht, wie die Foto-Tools technisch arbeiten, warum Ihre Bilder Ihr Gerät nicht verlassen und welche Open-Source-Bausteine wir nutzen.";
const PATH = "/ueber-uns/";

export const metadata: Metadata = buildMetadata({ title: TITLE, description: DESCRIPTION, path: PATH });

const CREDITS: { name: string; use: string; license: string; url: string }[] = [
  { name: "MozJPEG (via jSquash)", use: "JPG-Kodierung", license: "BSD / IJG, Apache-2.0", url: "https://github.com/jamsinclair/jSquash" },
  { name: "libwebp (via jSquash)", use: "WebP-Kodierung", license: "BSD-3-Clause, Apache-2.0", url: "https://github.com/jamsinclair/jSquash" },
  { name: "OxiPNG (via jSquash)", use: "verlustfreie PNG-Optimierung", license: "MIT, Apache-2.0", url: "https://github.com/jamsinclair/jSquash" },
  { name: "UPNG.js", use: "PNG-Farbreduzierung", license: "MIT", url: "https://github.com/photopea/UPNG.js" },
  { name: "libheif (via heic-to)", use: "HEIC/HEIF-Dekodierung", license: "LGPL-3.0", url: "https://github.com/hoppergee/heic-to" },
  { name: "gifuct-js", use: "GIF-Dekodierung", license: "MIT", url: "https://github.com/matt-way/gifuct-js" },
  { name: "gifenc", use: "GIF-Kodierung und Farbpaletten", license: "MIT", url: "https://github.com/mattdesl/gifenc" },
  { name: "fflate", use: "ZIP-Archive", license: "MIT", url: "https://github.com/101arrowz/fflate" },
  { name: "@imgly/background-removal", use: "Clientseitige Hintergrundentfernung (ISNet)", license: "AGPL-3.0", url: "https://github.com/imgly/background-removal-js" },
  { name: "ONNX Runtime Web", use: "KI-Laufzeit (WebAssembly/WebGPU)", license: "MIT", url: "https://github.com/microsoft/onnxruntime" },
  { name: "ISNet (DIS)", use: "KI-Modell für Hintergrund-Segmentierung", license: "MIT", url: "https://github.com/xuebinqin/DIS" },
  { name: "Next.js, React", use: "Website-Grundlage", license: "MIT", url: "https://nextjs.org" },
  { name: "Lucide", use: "Symbole", license: "ISC", url: "https://lucide.dev" },
];

export default function AboutPage() {
  const crumbs = [
    { name: "Startseite", path: "/" },
    { name: "Über uns", path: PATH },
  ];
  return (
    <main id="main" className="flex-1 bg-white py-10 sm:py-14">
      <JsonLd
        data={graph(
          { "@type": "AboutPage", "@id": `${absoluteUrl(PATH)}#page`, url: absoluteUrl(PATH), name: TITLE, inLanguage: "de", about: { "@id": `${absoluteUrl("/")}#organization` } },
          organizationSchema(),
          breadcrumbSchema(crumbs),
        )}
      />
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <Breadcrumbs crumbs={crumbs} />
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-zinc-950 sm:text-4xl">Über uns – so funktionieren unsere Foto-Tools</h1>

        <article className="content mt-6">
          <p>
            {SITE_NAME} bietet kostenlose Werkzeuge für alltägliche Bildaufgaben: Fotos verkleinern, komprimieren, zuschneiden, freistellen und
            Formate umwandeln. Die Seite richtet sich an Menschen in Deutschland, Österreich und der Schweiz, die schnell ein Ergebnis brauchen –
            ohne Programm, ohne Konto und ohne ihre Bilder einem fremden Server anzuvertrauen. Verantwortlich für das Angebot ist der im{" "}
            <Link href="/impressum/">Impressum</Link> genannte Betreiber.
          </p>

          <h2>Unser Grundsatz: Ihre Bilder bleiben auf Ihrem Gerät</h2>
          <p>
            Viele Online-Dienste laden Fotos zur Bearbeitung auf einen Server. Wir gehen den umgekehrten Weg: Die gesamte Bildverarbeitung läuft
            in Ihrem Browser. Unser Server liefert nur die Website und die nötigen Programmbausteine aus – Ihre Dateien erreichen ihn nie. Das
            gilt auch für die KI-Werkzeuge: Die Modelle werden von unserem eigenen Server geladen und anschließend lokal auf Ihrem Gerät
            ausgeführt. Drittanbieter werden dabei nicht kontaktiert.
          </p>

          <h2>Wie die Werkzeuge technisch arbeiten</h2>
          <h3>Bewährte Encoder statt Browser-Standard</h3>
          <p>
            Zum Speichern nutzen wir etablierte Open-Source-Encoder, die als WebAssembly im Browser laufen: MozJPEG für JPG, libwebp für WebP und
            OxiPNG für PNG. Sie werden erst geladen, wenn ein Werkzeug sie braucht. Die Berechnung erfolgt in einem separaten Hintergrundprozess
            (Web Worker), damit die Seite auch bei vielen Dateien bedienbar bleibt.
          </p>
          <h3>Vorschau entspricht dem Ergebnis</h3>
          <p>
            Angezeigte Dateigrößen sind keine Schätzungen: Das Tool kodiert das Bild tatsächlich und zeigt die echte Größe der Datei, die Sie
            herunterladen. Farbanpassungen im Editor werden in der Vorschau und beim Export mit identischen Formeln berechnet.
          </p>
          <h3>KI lokal im Browser</h3>
          <p>
            Für das Entfernen von Hintergründen setzen wir auf das hochpräzise ISNet-Modell (über @imgly/background-removal). Es läuft vollständig clientseitig im Browser über WebAssembly und WebGPU, lädt sich automatisch beim ersten Einsatz herunter und speichert sich lokal im Browser-Cache.
          </p>
          <h3>Grenzen, die wir offen nennen</h3>
          <p>
            Browser haben Grenzen. Auf iPhone und iPad begrenzt Safari die Größe von Zeichenflächen, sehr große Fotos werden dort vorab verkleinert
            – das Tool weist darauf hin. Beim Zuschneiden wird ein JPG neu gespeichert, nicht verlustfrei beschnitten. Solche Einschränkungen
            beschreiben wir auf den jeweiligen Seiten, statt sie zu verschweigen.
          </p>

          <h2>Wie wir Inhalte erstellen und prüfen</h2>
          <ul>
            <li>Jede Funktion, die auf einer Seite beschrieben wird, ist im Werkzeug auch tatsächlich vorhanden.</li>
            <li>Wir verzichten auf erfundene Zahlen und Superlative wie „das beste Tool“.</li>
            <li>Jedes Werkzeug wird vor der Veröffentlichung mit echten Testdateien geprüft – darunter JPG mit GPS-Daten, transparente PNGs, animierte GIFs und HEIC-Fotos.</li>
            <li>Angaben zu Plattformen und Software prüfen wir vor der Veröffentlichung und aktualisieren sie bei Änderungen.</li>
          </ul>

          <h2>Unsere Werkzeuge</h2>
          <p>Aktuell verfügbar:</p>
          <ul>
            {LIVE_TOOLS.map((t) => (
              <li key={t.id}>
                <Link href={t.path}>{t.name}</Link> – {t.desc}
              </li>
            ))}
          </ul>

          <h2>Open-Source-Bausteine und Lizenzen</h2>
          <p>Unsere Werkzeuge bauen auf hervorragender freier Software auf. Wir danken den Entwicklerinnen und Entwicklern:</p>
          <table>
            <thead>
              <tr>
                <th scope="col">Projekt</th>
                <th scope="col">Einsatz</th>
                <th scope="col">Lizenz</th>
              </tr>
            </thead>
            <tbody>
              {CREDITS.map((c) => (
                <tr key={c.name}>
                  <td>
                    <a href={c.url} rel="noopener noreferrer" target="_blank">
                      {c.name}
                    </a>
                  </td>
                  <td>{c.use}</td>
                  <td>{c.license}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p>
            Der Quelltext der LGPL-lizenzierten Bibliothek libheif ist über das verlinkte Projekt frei erhältlich; die Bibliothek wird als
            eigenständige, austauschbare Datei geladen.
          </p>

          <h2>Kontakt</h2>
          <p>
            Fragen, Fehlerhinweise oder Verbesserungsvorschläge? Schreiben Sie uns an <code>kontakt@fotofixer.de</code>. Die vollständigen
            Anbieterangaben finden Sie im <Link href="/impressum/">Impressum</Link>, Informationen zum Datenschutz in der{" "}
            <Link href="/datenschutz/">Datenschutzerklärung</Link>.
          </p>
        </article>
      </div>
    </main>
  );
}
