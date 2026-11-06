import type { Metadata } from "next";
import ToolPage from "@/components/site/ToolPage";
import ToolLink from "@/components/site/ToolLink";
import { Steps, TrustList } from "@/components/site/content";
import ImageCompressor from "@/components/tools/ImageCompressor";
import { buildMetadata, type FaqItem } from "@/lib/seo";

const TITLE = "Bilder komprimieren – Dateigröße online reduzieren";
const DESCRIPTION =
  "Bilder komprimieren ohne sichtbaren Qualitätsverlust: JPG, PNG, WebP & GIF bis zu deutlich kleiner machen. Kostenlos, ohne Anmeldung, im Browser.";
const PATH = "/bilder-komprimieren/";

export const metadata: Metadata = buildMetadata({ title: TITLE, description: DESCRIPTION, path: PATH });

const FAQS: FaqItem[] = [
  {
    q: "Wie stark kann ich ein Bild komprimieren?",
    a: "Das hängt vom Motiv und vom Format ab. Fotos im JPG- oder WebP-Format lassen sich meist deutlich verkleinern, bevor Unterschiede sichtbar werden, während flächige Grafiken als PNG oft weniger Spielraum bieten. Eine feste Prozentzahl gibt es nicht – der Vorher-nachher-Regler zeigt Ihnen direkt, ab wann Details leiden.",
  },
  {
    q: "Ändert die Komprimierung die Pixelmaße meines Bildes?",
    a: "Nein. Beim Komprimieren bleiben Breite und Höhe exakt gleich, ein Foto mit 4.000 × 3.000 Pixeln behält diese Abmessungen. Es sinkt ausschließlich der Speicherbedarf der Datei. Wenn Sie zusätzlich die Abmessungen reduzieren möchten, verwenden Sie dafür ein Werkzeug zum Verkleinern der Pixelmaße.",
  },
  {
    q: "Was bedeutet verlustfreie Komprimierung?",
    a: "Bei der verlustfreien Komprimierung werden die Bilddaten nur effizienter gespeichert, ohne dass ein einziges Pixel verändert wird. Das Bild lässt sich jederzeit exakt rekonstruieren. Der Nachteil: Die Ersparnis fällt deutlich kleiner aus als bei verlustbehafteten Verfahren, die nicht wahrnehmbare Details gezielt vereinfachen.",
  },
  {
    q: "Kann ich komprimierte Bilder wieder in Originalqualität zurückverwandeln?",
    a: "Nein. Details, die bei verlustbehafteter Komprimierung entfernt wurden, lassen sich nachträglich nicht wiederherstellen – auch nicht durch erneutes Speichern mit hoher Qualität. Bewahren Sie deshalb immer Ihre Originaldatei auf und komprimieren Sie nur eine Kopie für den jeweiligen Verwendungszweck.",
  },
  {
    q: "Werden meine Bilder auf einen Server hochgeladen?",
    a: "Nein. Die Komprimierung läuft vollständig in Ihrem Browser. Die nötigen Programmbausteine werden beim ersten Einsatz geladen, Ihre Bilder verlassen dabei aber nie Ihr Gerät. Nach dem Schließen des Tabs sind alle Zwischenergebnisse aus dem Arbeitsspeicher verschwunden.",
  },
];

export default function Page() {
  return (
    <ToolPage
      toolId="P2"
      h1="Bilder komprimieren: Dateigröße reduzieren, Qualität behalten"
      lead={
        <>
          Bilder komprimieren und die Dateigröße senken, während Breite und Höhe gleich bleiben – kostenlos, ohne
          Anmeldung und lokal in Ihrem Browser.
        </>
      }
      widget={<ImageCompressor />}
      appName="Bildkomprimierer"
      description={DESCRIPTION}
      faqTitle="Häufige Fragen zum Thema Bilder komprimieren"
      faqs={FAQS}
      related={["P1", "P3", "P4", "P10", "P8", "P5", "P7", "P17"]}
    >
      <p>
        Speicher voll, Upload abgelehnt, Webseite zu langsam – meist liegt es an zu großen Bilddateien. Wenn Sie Bilder
        komprimieren, schrumpft der Speicherbedarf in KB oder MB, ohne dass sich die Abmessungen in Pixeln ändern. Dieses
        Werkzeug verarbeitet JPG, PNG, WebP und animierte GIFs und wählt für jedes Format die passende Methode. Sie
        bestimmen, ob Ihnen eine möglichst kleine Datei oder möglichst hohe Bildqualität wichtiger ist, und sehen das
        Ergebnis sofort im direkten Vergleich mit dem Original.
      </p>
      <p>
        Wer eine Bild-Dateigröße ändern möchte, sucht oft auch nach Begriffen wie „Bildgröße komprimieren“ – gemeint
        ist fast immer dasselbe: weniger Kilobyte bei unveränderter Auflösung. Genau das leistet dieser Bildkomprimierer,
        online und kostenlos, ohne dass Sie ein Programm installieren müssen.
      </p>

      <h2>So komprimieren Sie Bilder online</h2>
      <p>Ob ein einzelnes Foto oder ein ganzer Ordner: Der Ablauf ist immer gleich.</p>
      <Steps
        items={[
          {
            title: "Dateien auswählen",
            body: (
              <p>
                Legen Sie bis zu 50 Bilddateien per Drag &amp; Drop ab oder wählen Sie sie über den Dateidialog aus –
                Formate dürfen gemischt sein.
              </p>
            ),
          },
          {
            title: "Komprimierungsstufe wählen",
            body: (
              <p>
                Wählen Sie „Stark“, „Ausgewogen“ oder „Hohe Qualität“. Für JPG und WebP lässt sich die Qualität zusätzlich
                per Regler zwischen 10 und 100 feinjustieren.
              </p>
            ),
          },
          {
            title: "Ergebnis vergleichen und speichern",
            body: (
              <p>
                Prüfen Sie Details mit dem Vergleichsregler, lesen Sie die Ersparnis in Prozent ab und speichern Sie
                einzeln oder als ZIP-Archiv.
              </p>
            ),
          },
        ]}
      />

      <h2>Verlustbehaftet oder verlustfrei komprimieren?</h2>
      <p>
        Grundsätzlich gibt es zwei Wege, eine Bilddatei zu verkleinern: Entweder werden Informationen weggelassen, die
        das Auge kaum bemerkt, oder die vorhandenen Informationen werden lediglich geschickter gespeichert. Welcher Weg
        sinnvoll ist, entscheidet in erster Linie das Format.
      </p>
      <h3>Verlustbehaftete Komprimierung (JPG, WebP)</h3>
      <p>
        JPG und WebP vereinfachen feine Strukturen und speichern Farbinformationen gröber als Helligkeit. Dadurch sinkt
        der Speicherbedarf von Fotos erheblich. Für JPG nutzt das Tool den Encoder MozJPEG, für WebP die Bibliothek
        libwebp. Je niedriger die Qualitätsstufe, desto kleiner die Datei – und desto eher zeigen sich Artefakte an
        Kanten oder in gleichmäßigen Flächen wie Himmel.
      </p>
      <h3>Verlustfreie Komprimierung (PNG)</h3>
      <p>
        PNG speichert jedes Pixel exakt. Im Modus „Verlustfrei“ optimiert OxiPNG die interne Kodierung, sodass die Datei
        kleiner wird, das Bild aber identisch bleibt. Reicht das nicht, reduziert der Modus „Farbreduzierung“ die Palette
        auf höchstens 256 Farben und optimiert anschließend erneut – das spart oft viel mehr, verändert aber feine
        Farbverläufe.
      </p>
      <h4>Welche Methode für welches Bild?</h4>
      <ul>
        <li>Fotos mit vielen Farbnuancen: verlustbehaftet als JPG oder WebP.</li>
        <li>Logos, Icons, Screenshots mit Text: PNG verlustfrei, bei wenigen Farben mit Farbreduzierung.</li>
        <li>Grafiken mit Transparenz: PNG oder WebP – beide erhalten den Alphakanal.</li>
      </ul>
      <p>
        Im Zweifel starten Sie mit „Ausgewogen“ und vergleichen das Ergebnis mit dem Original. Sehen Sie in der
        Vergrößerung keine Unterschiede, können Sie eine Stufe stärker gehen. Erscheinen Treppen an schrägen Kanten,
        Farbsäume um Schrift oder fleckige Flächen im Himmel, kehren Sie zur höheren Stufe zurück. Bei PNG-Grafiken
        lohnt sich der Test, ob die Farbreduzierung sichtbare Abstufungen in Verläufen erzeugt.
      </p>

      <h2>Warum Bilder komprimieren?</h2>
      <h3>Schnellere Ladezeiten für Websites</h3>
      <p>
        Bilder machen auf vielen Webseiten den größten Teil der übertragenen Daten aus. Kleinere Dateien laden schneller,
        besonders unterwegs im Mobilfunknetz, und verbessern Kennzahlen wie die Ladezeit des größten sichtbaren Elements.
        Sind die Fotos zudem viel größer als ihr Anzeigebereich, lohnt es sich, vorher das{" "}
        <ToolLink id="P1">Bild verkleinern</ToolLink> zu lassen und erst danach zu komprimieren.
      </p>
      <h3>Weniger Speicherplatz auf Handy und Cloud</h3>
      <p>
        Smartphone-Fotos belegen schnell mehrere Megabyte pro Aufnahme. Wer Urlaubsbilder, Belege oder Scans dauerhaft
        aufbewahrt, kann mit einer komprimierten Kopie Speicherplatz im Cloud-Abo sparen. Wichtige Originale sollten Sie
        trotzdem unverändert sichern.
      </p>
      <h3>Upload-Limits von Portalen einhalten</h3>
      <p>
        Bewerbungsportale, Behördenseiten und Kleinanzeigen-Plattformen begrenzen häufig die zulässige Dateigröße. Statt
        das Foto zu beschneiden, genügt es oft, die Bilddatei zu verkleinern, indem Sie eine stärkere Stufe wählen.
        Welche Grenze gilt, steht in den Hinweisen des jeweiligen Portals.
      </p>
      <p>
        Der Vorteil gegenüber dem Verkleinern von Bilddateien über die Pixelmaße: Ein Scan oder Ausweisdokument bleibt
        in voller Auflösung lesbar, nur der Speicher wird kleiner. Reicht auch die Stufe „Stark“ nicht aus, ist meist
        eine Kombination mit geringeren Abmessungen der nächste Schritt – etwa mit{" "}
        <ToolLink id="P8">Bild auf 1 MB verkleinern</ToolLink>.
      </p>

      <h2>Komprimierung nach Format</h2>
      <h3>JPG komprimieren</h3>
      <p>
        Für Fotos im JPEG-Format reicht die Stufe „Ausgewogen“ in den meisten Fällen. Wer Optionen wie progressives JPG,
        Farbunterabtastung oder das gezielte Behalten von EXIF-Daten benötigt, findet sie im Spezialwerkzeug{" "}
        <ToolLink id="P3">JPG komprimieren</ToolLink>. Hier werden Metadaten grundsätzlich entfernt.
      </p>
      <h3>PNG komprimieren</h3>
      <p>
        PNG-Dateien behalten ihre Transparenz in beiden Modi. Ausführliche Erklärungen zu PNG-8, PNG-24 und dem
        Alphakanal bietet die Seite <ToolLink id="P4">PNG komprimieren</ToolLink>.
      </p>
      <h3>GIF und WebP komprimieren</h3>
      <p>
        Animierte GIFs bleiben animiert: Das Tool reduziert die Farben und speichert nur die Bildbereiche neu, die sich
        von Frame zu Frame ändern. WebP-Bilder werden mit der gewählten Qualitätsstufe neu kodiert und bleiben im
        WebP-Format. Mehr Stellschrauben wie Frame-Reduzierung bietet <ToolLink id="P5">GIF komprimieren</ToolLink>.
      </p>

      <TrustList
        items={[
          "Ohne Anmeldung, ohne Wasserzeichen, ohne Kosten",
          "Dateien bleiben auf Ihrem Gerät – Verarbeitung im Browser",
          "JPG, PNG, WebP und GIF, bis zu 50 Bilder auf einmal",
          "Format und Pixelmaße bleiben erhalten, EXIF-Daten werden entfernt",
        ]}
      />
    </ToolPage>
  );
}
