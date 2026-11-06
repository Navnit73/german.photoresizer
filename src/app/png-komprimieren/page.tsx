import type { Metadata } from "next";
import ToolPage from "@/components/site/ToolPage";
import ToolLink from "@/components/site/ToolLink";
import { Note, Steps, TrustList } from "@/components/site/content";
import PngCompressor from "@/components/tools/PngCompressor";
import { buildMetadata, type FaqItem } from "@/lib/seo";

const TITLE = "PNG komprimieren – PNG verkleinern mit Transparenz";
const DESCRIPTION =
  "PNG komprimieren und verkleinern, ohne die Transparenz zu verlieren. Verlustfreie oder farbreduzierte Optimierung – kostenlos, online, ohne Anmeldung.";
const PATH = "/png-komprimieren/";

export const metadata: Metadata = buildMetadata({ title: TITLE, description: DESCRIPTION, path: PATH });

const FAQS: FaqItem[] = [
  {
    q: "Bleibt die Transparenz beim PNG komprimieren erhalten?",
    a: "Ja. In beiden Modi bleibt der Alphakanal erhalten – auch halbtransparente Bereiche wie weiche Schatten oder geglättete Kanten. Im Vorher-nachher-Vergleich zeigt ein Schachbrettmuster, welche Flächen durchsichtig sind, sodass Sie das Ergebnis vor dem Herunterladen prüfen können.",
  },
  {
    q: "Warum wird mein PNG kaum kleiner?",
    a: "PNG speichert verlustfrei. Wurde die Datei bereits gut optimiert, bleibt im Modus „Verlustfrei“ nur wenig Spielraum. Deutlich kleinere Dateien erreichen Sie mit der Farbreduzierung. Bei Fotos lohnt sich oft ein anderes Format: Das Tool weist bei geringer Ersparnis darauf hin, dass eine Umwandlung in WebP oder JPG mehr bringen kann.",
  },
  {
    q: "Was ist der Unterschied zwischen PNG-8 und PNG-24?",
    a: "PNG-8 verwendet eine Farbpalette mit höchstens 256 Farben und ist dadurch meist deutlich kleiner. PNG-24 – mit Transparenz oft PNG-32 genannt – speichert jeden Pixel mit voller Farbtiefe, also Millionen möglicher Farben. Das eignet sich für Verläufe und Fotos, erzeugt aber größere Dateien.",
  },
  {
    q: "Eignet sich PNG für Fotos?",
    a: "Nur bedingt. Weil PNG verlustfrei arbeitet, werden Fotos mit vielen feinen Farbabstufungen sehr groß. JPG oder WebP sind dafür meist effizienter. PNG spielt seine Stärken bei Grafiken, Logos, Screenshots und Bildern mit Transparenz aus, also überall dort, wo scharfe Kanten und exakte Farben zählen.",
  },
  {
    q: "Kann ich mehrere PNG-Dateien auf einmal verkleinern?",
    a: "Ja. Wählen Sie bis zu 50 PNG-Dateien gleichzeitig aus oder legen Sie sie per Drag & Drop ab. Alle Dateien werden mit denselben Einstellungen nacheinander in Ihrem Browser optimiert. Danach laden Sie jedes Bild einzeln oder alle zusammen als ZIP-Archiv herunter.",
  },
];

export default function Page() {
  return (
    <ToolPage
      toolId="P4"
      h1="PNG komprimieren und verkleinern – Transparenz bleibt erhalten"
      lead={
        <>
          PNG komprimieren, ohne den transparenten Hintergrund zu verlieren: verlustfrei oder mit Farbreduzierung, direkt
          im Browser, kostenlos und ohne Anmeldung.
        </>
      }
      widget={<PngCompressor />}
      appName="PNG-Komprimierer"
      description={DESCRIPTION}
      faqTitle="Häufige Fragen zum Thema PNG komprimieren"
      faqs={FAQS}
      related={["P2", "P31", "P36", "P42", "P1"]}
    >
      <p>
        Logos, Icons und Screenshots liegen fast immer als PNG vor – und sind oft größer als nötig. Wenn Sie eine PNG
        komprimieren, haben Sie zwei Möglichkeiten: Die verlustfreie Optimierung speichert dieselben Pixel effizienter, die
        Farbreduzierung beschränkt das Bild auf eine Palette und spart dadurch deutlich mehr. In beiden Fällen bleibt der
        Alphakanal erhalten, transparente Hintergründe sind also auch nach dem Verkleinern durchsichtig. Die Verarbeitung
        läuft vollständig in Ihrem Browser.
      </p>

      <h2>PNG online verkleinern in drei Schritten</h2>
      <p>So machen Sie eine oder viele PNG-Dateien kleiner:</p>
      <Steps
        items={[
          {
            title: "PNG-Datei hochladen",
            body: (
              <p>
                Legen Sie bis zu 50 PNG-Dateien per Drag &amp; Drop ab oder wählen Sie sie aus. Andere Formate verweist das
                Tool an den passenden Komprimierer.
              </p>
            ),
          },
          {
            title: "Optimierungsmodus wählen",
            body: (
              <p>
                „Verlustfrei“ behält jedes Pixel bei. „Farbreduzierung“ spart mehr; die Farbanzahl stellen Sie zwischen 2
                und 256 ein.
              </p>
            ),
          },
          {
            title: "Optimierte PNG herunterladen",
            body: (
              <p>
                Prüfen Sie das Ergebnis im Vergleich auf dem Schachbrettmuster und speichern Sie einzeln oder als
                ZIP-Archiv.
              </p>
            ),
          },
        ]}
      />

      <h2>Warum sind PNG-Dateien so groß?</h2>
      <p>
        Die Größe einer PNG-Datei hängt weniger von den Pixelmaßen als vom Inhalt ab. Zwei Eigenschaften des Formats
        treiben sie in die Höhe.
      </p>
      <h3>Verlustfreie Speicherung</h3>
      <p>
        PNG verwirft keine Bildinformation. Jeder Pixel wird exakt gespeichert und anschließend mit dem Deflate-Verfahren
        gepackt, das auch ZIP-Archive nutzen. Bei Flächen in einer Farbe funktioniert das hervorragend, bei Fotos mit
        Rauschen und feinen Verläufen kaum. Viele Programme speichern außerdem mit schnellen Standardeinstellungen. Der
        verlustfreie Modus nutzt OxiPNG: Es probiert verschiedene Zeilenfilter und Kompressionsstrategien aus und wählt die
        kleinste Variante – die Pixel bleiben dabei identisch.
      </p>
      <h3>Alphakanal und Transparenz</h3>
      <p>
        Transparenz benötigt einen vierten Kanal neben Rot, Grün und Blau. Er speichert für jeden Pixel, wie durchsichtig
        er ist. Das ist die Grundlage für Logos auf beliebigem Hintergrund, kostet aber zusätzlichen Speicher. Beim
        Optimieren bleibt dieser Kanal erhalten, auch bei der Farbreduzierung.
      </p>
      <h4>PNG-8 vs. PNG-24 einfach erklärt</h4>
      <p>
        PNG-24 speichert pro Pixel die volle Farbinformation. PNG-8 arbeitet mit einer Palette von höchstens 256 Farben,
        und jeder Pixel verweist nur auf einen Eintrag darin – das ist erheblich kompakter. Genau das macht die
        Farbreduzierung: Sie ermittelt eine passende Palette und ordnet jeden Pixel der nächstgelegenen Farbe zu. Für Logos
        und Screenshots ist der Unterschied meist nicht zu sehen. Da das Tool ohne Dithering arbeitet, können weiche
        Verläufe bei sehr wenigen Farben jedoch stufig wirken – erhöhen Sie dann die Farbanzahl.
      </p>

      <h2>PNG komprimieren für Logos, Screenshots und Grafiken</h2>
      <p>
        Je nach Motiv lohnt sich ein anderer Modus. Als Faustregel gilt: Je weniger Farben ein Bild tatsächlich enthält,
        desto mehr spart die Farbreduzierung.
      </p>
      <h3>Logos mit transparentem Hintergrund</h3>
      <p>
        Logos bestehen meist aus wenigen Farben und klaren Kanten. Hier können Sie die Farbanzahl oft auf 64 oder weniger
        senken, ohne dass sich das Erscheinungsbild ändert. Achten Sie im Vergleich auf die geglätteten Ränder, damit sie
        auf dunklem wie hellem Untergrund sauber bleiben. Soll ein Logo erst einen transparenten Hintergrund erhalten, ist
        dafür das Werkzeug <ToolLink id="P42">Hintergrund transparent machen</ToolLink> gedacht.
      </p>
      <h3>Screenshots für Anleitungen</h3>
      <p>
        Screenshots von Programmoberflächen enthalten viele einfarbige Flächen und Text. Für sie ist PNG ideal, weil
        Schrift gestochen scharf bleibt. Starten Sie mit dem verlustfreien Modus; reicht die Ersparnis nicht, testen Sie
        die Farbreduzierung mit 128 oder 256 Farben. Sollen die Bildschirmfotos zusätzlich schmaler werden, können Sie
        anschließend die Pixelmaße mit „Bild verkleinern“ reduzieren.
      </p>

      <h2>Wann ist PNG in JPG oder WebP sinnvoller?</h2>
      <p>
        Bei Fotos stößt jede PNG-Optimierung an Grenzen. Bleibt die Ersparnis gering, zeigt das Tool einen entsprechenden
        Hinweis. Ohne Transparenz ist JPG für Fotos fast immer die kleinere Wahl – dafür eignet sich{" "}
        <ToolLink id="P31">PNG in JPG umwandeln</ToolLink>. Wird Transparenz benötigt, kann WebP Alphakanal und kleine
        Dateien verbinden. Möchten Sie Fotos und Grafiken in verschiedenen Formaten in einem Durchgang optimieren, nutzen
        Sie <ToolLink id="P2">Bilder komprimieren</ToolLink>.
      </p>
      <table>
        <thead>
          <tr>
            <th scope="col">Bildinhalt</th>
            <th scope="col">Empfohlener Weg</th>
            <th scope="col">Hinweis</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Logo, Icon, Grafik</td>
            <td>PNG mit Farbreduzierung</td>
            <td>Transparenz bleibt erhalten</td>
          </tr>
          <tr>
            <td>Screenshot mit Text</td>
            <td>PNG verlustfrei oder 128–256 Farben</td>
            <td>Schrift bleibt scharf</td>
          </tr>
          <tr>
            <td>Foto ohne Transparenz</td>
            <td>JPG</td>
            <td>meist deutlich kleiner als PNG</td>
          </tr>
          <tr>
            <td>Foto mit Transparenz</td>
            <td>WebP</td>
            <td>Alphakanal und verlustbehaftete Kompression</td>
          </tr>
        </tbody>
      </table>
      <p>
        Ein praktischer Tipp zum Schluss: Komprimieren Sie zuerst verlustfrei und vergleichen Sie die Ersparnis. Reicht sie
        nicht aus, wechseln Sie zur Farbreduzierung und senken die Farbanzahl schrittweise, bis im Vergleich erste
        Unterschiede an Kanten oder Verläufen auftauchen – und gehen Sie dann eine Stufe zurück. So finden Sie für jede
        Grafik die kleinste Datei, die noch sauber aussieht. Bewahren Sie das Original auf, falls Sie die Grafik später in
        größerer Darstellung oder mit mehr Farben benötigen.
      </p>

      <TrustList
        items={[
          "Transparenz bleibt in beiden Modi vollständig erhalten",
          "Kostenlos, ohne Anmeldung und ohne Wasserzeichen",
          "Optimierung lokal im Browser – Ihre Grafiken verlassen das Gerät nicht",
          "Bis zu 50 PNG-Dateien pro Durchgang, ZIP-Download",
        ]}
      />
      <Note>
        Pixelmaße ändern sich beim PNG komprimieren nicht. Im Modus „Verlustfrei“ ist das Ergebnis pixelgenau identisch
        mit dem Original.
      </Note>
    </ToolPage>
  );
}
