import type { Metadata } from "next";
import ToolPage from "@/components/site/ToolPage";
import ToolLink from "@/components/site/ToolLink";
import { Note, Steps, TrustList } from "@/components/site/content";
import GifCompressor from "@/components/tools/GifCompressor";
import { buildMetadata, type FaqItem } from "@/lib/seo";

const TITLE = "GIF komprimieren – animierte GIFs online verkleinern";
const DESCRIPTION =
  "GIF komprimieren und verkleinern: animierte GIFs mit weniger Farben, Frames oder Pixeln kleiner machen. Animation bleibt erhalten. Kostenlos & online.";
const PATH = "/gif-komprimieren/";

export const metadata: Metadata = buildMetadata({ title: TITLE, description: DESCRIPTION, path: PATH });

const FAQS: FaqItem[] = [
  {
    q: "Bleibt die Animation beim GIF komprimieren erhalten?",
    a: "Ja. Solange Sie unter „Frames“ die Einstellung „Alle“ behalten, werden sämtliche Einzelbilder übernommen. Lassen Sie jeden zweiten oder dritten Frame weg, addiert das Tool die Anzeigedauer der entfernten Bilder zum verbleibenden Frame. Die Animation läuft dadurch etwas weniger flüssig, aber in derselben Geschwindigkeit wie das Original.",
  },
  {
    q: "Wie kann ich ein GIF auf eine bestimmte Dateigröße bringen?",
    a: "Kombinieren Sie die Stellschrauben schrittweise: Senken Sie zuerst die Größe in Prozent, reduzieren Sie dann die Farbanzahl und erhöhen Sie bei Bedarf die verlustbehaftete Optimierung. Erst danach sollten Sie Frames weglassen. Die Dateigröße und die Ersparnis werden nach jeder Änderung neu berechnet, sodass Sie Ihr Ziel gezielt ansteuern können.",
  },
  {
    q: "Warum sind GIF-Dateien so groß?",
    a: "Das Format stammt aus dem Jahr 1987. Es speichert jeden Frame als eigenes Bild, ist auf 256 Farben pro Frame begrenzt und nutzt eine einfache LZW-Kompression. Für Fotos und gefilmte Szenen mit Rauschen ist das sehr ineffizient – eine kurze Bildschirmaufnahme kann so schnell mehrere Megabyte erreichen.",
  },
  {
    q: "Kann ich GIFs ohne Qualitätsverlust verkleinern?",
    a: "Teilweise. Mit 256 Farben, allen Frames, 100 % Größe und einer Toleranz von 0 speichert das Tool unveränderte Bildbereiche effizienter, ohne die sichtbaren Pixel zu verändern. Die Ersparnis fällt dann allerdings meist gering aus. Für deutlich kleinere Dateien ist ein leichter, oft kaum sichtbarer Qualitätsverlust nötig.",
  },
  {
    q: "Ist animiertes WebP eine Alternative zu GIF?",
    a: "Ja. Animiertes WebP unterstützt Millionen Farben und eine moderne Kompression und ist bei gleichem Inhalt meist deutlich kleiner als ein GIF. Alle aktuellen Browser zeigen es an. Einige Messenger, E-Mail-Programme und ältere Anwendungen akzeptieren jedoch nur GIF – prüfen Sie daher vorher, wo die Animation eingesetzt wird.",
  },
];

export default function Page() {
  return (
    <ToolPage
      toolId="P5"
      h1="GIF komprimieren – animierte GIFs verkleinern"
      lead={
        <>
          GIF komprimieren, ohne die Animation zu verlieren: Farben, Frames und Abmessungen reduzieren – kostenlos, ohne
          Anmeldung und direkt in Ihrem Browser.
        </>
      }
      widget={<GifCompressor />}
      appName="GIF-Komprimierer"
      description={DESCRIPTION}
      faqTitle="Häufige Fragen zum Thema GIF komprimieren"
      faqs={FAQS}
      related={["P2", "P6", "P9", "P1", "P12"]}
    >
      <p>
        Animierte GIFs sind beliebt für Reaktionen im Chat, kurze Produktdemos oder Bildschirmaufnahmen in Anleitungen –
        aber sie werden schnell mehrere Megabyte groß. Wenn Sie ein GIF komprimieren, stehen vier Stellschrauben zur
        Verfügung: Farbanzahl, Anzahl der Frames, Abmessungen und eine verlustbehaftete Optimierung zwischen den Frames.
        Dieses Werkzeug kombiniert alle vier, zeigt die Animation als Vorschau und berechnet die neue Dateigröße nach jeder
        Änderung. Die Verarbeitung findet vollständig auf Ihrem Gerät statt.
      </p>

      <h2>GIF verkleinern – Schritt für Schritt</h2>
      <p>So machen Sie eine animierte Datei in wenigen Schritten kleiner:</p>
      <Steps
        items={[
          {
            title: "GIF hochladen",
            body: (
              <p>
                Ziehen Sie bis zu 20 GIF-Dateien per Drag &amp; Drop in das Feld oder wählen Sie sie aus. Alle Frames
                werden lokal eingelesen.
              </p>
            ),
          },
          {
            title: "Komprimierungsoptionen wählen",
            body: (
              <p>
                Legen Sie Farbanzahl, Frames, Größe in Prozent und die Stärke der verlustbehafteten Optimierung fest.
              </p>
            ),
          },
          {
            title: "Animation prüfen und speichern",
            body: (
              <p>
                Die Vorschau spielt das Ergebnis ab. Passt es, laden Sie das GIF einzeln oder alle Dateien als ZIP-Archiv
                herunter.
              </p>
            ),
          },
        ]}
      />

      <h2>Drei Stellschrauben für kleinere GIFs</h2>
      <p>
        Die Größe eines GIFs ergibt sich im Wesentlichen aus Farbtiefe, Frame-Anzahl und Pixelmaßen. Jede dieser Größen
        lässt sich unabhängig verändern.
      </p>
      <h3>Farbanzahl reduzieren</h3>
      <p>
        Ein GIF kann pro Frame bis zu 256 Farben enthalten. Zur Wahl stehen 256, 128, 64, 32 und 16 Farben. Weniger Farben
        bedeuten kürzere Farbindizes und längere gleichförmige Bereiche, die sich besser packen lassen. Bei Grafiken,
        Cartoons und Bildschirmaufnahmen fällt der Schritt auf 64 Farben meist kaum auf; bei Filmszenen mit Hauttönen und
        Verläufen sollten Sie eher bei 128 oder 256 bleiben.
      </p>
      <h3>Frames entfernen oder Bildrate senken</h3>
      <p>
        Mit „Jeden 2. Frame“ oder „Jeden 3. Frame“ halbieren beziehungsweise dritteln Sie die Zahl der Einzelbilder. Die
        Anzeigedauer der ausgelassenen Frames wird dem verbleibenden Bild zugeschlagen, sodass die Animation genauso lange
        dauert wie zuvor. Bei ruhigen Bewegungen ist das kaum zu merken, bei schnellen Szenen wirkt die Animation etwas
        ruckeliger.
      </p>
      <h3>Abmessungen verringern</h3>
      <p>
        Die Größe lässt sich zwischen 10 und 100 % einstellen. Weil die Pixelfläche quadratisch mit der Kantenlänge wächst,
        hat ein GIF mit 50 % Breite und Höhe nur noch ein Viertel der Pixel. Das ist oft der wirksamste Hebel, besonders
        bei großen Bildschirmaufnahmen, die später ohnehin klein angezeigt werden.
      </p>
      <h4>Lossy-Komprimierung für GIFs</h4>
      <p>
        Als „Lossy GIF“ bezeichnet man Verfahren, die kleine Bildfehler in Kauf nehmen, damit die LZW-Kompression besser
        greift. Unser Tool setzt dafür die Option „Verlustbehaftete Optimierung“ ein: Pixel, die sich von einem Frame zum
        nächsten nur minimal verändern, werden aus dem vorherigen Frame übernommen und als transparent markiert. Solche
        Flächen lassen sich sehr effizient speichern. Die Toleranz stellen Sie von 0 bis 100 ein – höhere Werte sparen
        mehr, können aber leichte Schlieren erzeugen. Bei GIFs mit transparentem Hintergrund ist diese Optimierung nur
        eingeschränkt möglich.
      </p>
      <table>
        <thead>
          <tr>
            <th scope="col">Einstellung</th>
            <th scope="col">Wirkung auf die Datei</th>
            <th scope="col">Sichtbarer Effekt</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Größe 50 %</td>
            <td>nur noch ein Viertel der Pixel</td>
            <td>kleinere Darstellung</td>
          </tr>
          <tr>
            <td>64 statt 256 Farben</td>
            <td>kompaktere Farbindizes</td>
            <td>leichte Stufen in Verläufen</td>
          </tr>
          <tr>
            <td>Jeden 2. Frame</td>
            <td>halb so viele Einzelbilder</td>
            <td>weniger flüssige Bewegung</td>
          </tr>
          <tr>
            <td>Höhere Toleranz</td>
            <td>mehr wiederverwendete Pixel</td>
            <td>mögliche Schlieren</td>
          </tr>
        </tbody>
      </table>
      <p>
        Welche Kombination am meisten bringt, hängt vom Motiv ab. Bildschirmaufnahmen mit wenig Bewegung profitieren stark
        von der verlustbehafteten Optimierung, weil große Teile des Bildes zwischen den Frames gleich bleiben. Gefilmte
        Szenen mit Kameraschwenks reagieren dagegen besser auf kleinere Abmessungen und weniger Frames. Probieren Sie die
        Einstellungen nacheinander aus und beobachten Sie dabei die Vorschau und die angezeigte Ersparnis.
      </p>

      <h2>GIF-Größe für Messenger, Foren und E-Mail</h2>
      <p>
        Viele Plattformen begrenzen die Größe von Uploads oder skalieren Animationen beim Hochladen selbst. Die genauen
        Grenzen ändern sich regelmäßig; prüfen Sie daher die aktuellen Angaben des jeweiligen Dienstes. Für E-Mail-Signaturen
        und Newsletter gilt: Je kleiner, desto besser, denn große Animationen verlangsamen das Öffnen der Nachricht. Ein
        kurzes GIF mit 64 Farben und reduzierter Breite ist hier meist ausreichend. Für Foren und Präsentationen lohnt es
        sich, die Abmessungen an die tatsächliche Anzeigegröße anzupassen. Müssen Sie ein festes Limit in Kilobyte
        einhalten, ist das Werkzeug <ToolLink id="P9">Bild auf KB verkleinern</ToolLink> für Einzelbilder gedacht.
      </p>

      <h2>Alternative: GIF in Video oder WebP umwandeln</h2>
      <p>
        Wenn auch die stärkste Komprimierung nicht ausreicht, lohnt ein Blick auf moderne Formate. Ein kurzes MP4-Video ist
        bei gleichem Inhalt meist erheblich kleiner als ein GIF und bietet volle Farbtiefe; viele Plattformen wandeln
        hochgeladene GIFs intern ohnehin in Videos um. Animiertes WebP wird von allen aktuellen Browsern angezeigt und ist
        ebenfalls deutlich kompakter. Dieses Tool speichert ausschließlich GIF – für die Umwandlung in Video oder WebP
        benötigen Sie ein anderes Programm. Für statische Bilder in anderen Formaten nutzen Sie{" "}
        <ToolLink id="P2">Bilder komprimieren</ToolLink> oder das geplante Werkzeug{" "}
        <ToolLink id="P6">WebP komprimieren</ToolLink>.
      </p>

      <TrustList
        items={[
          "Animation bleibt erhalten, Abspielgeschwindigkeit unverändert",
          "Kostenlos, ohne Anmeldung und ohne Wasserzeichen",
          "GIFs werden lokal im Browser verarbeitet, kein Server-Upload",
          "Bis zu 20 GIFs pro Durchgang, einzeln oder als ZIP",
        ]}
      />
      <Note>
        Sehr lange oder großformatige GIFs mit vielen Frames benötigen beim Verarbeiten viel Arbeitsspeicher. Auf älteren
        Smartphones kann die Berechnung daher einige Sekunden dauern.
      </Note>
    </ToolPage>
  );
}
