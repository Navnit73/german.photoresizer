import type { Metadata } from "next";
import ToolPage from "@/components/site/ToolPage";
import ToolLink from "@/components/site/ToolLink";
import { Note, Steps, TrustList } from "@/components/site/content";
import ImageResizer from "@/components/tools/ImageResizer";
import { buildMetadata, type FaqItem } from "@/lib/seo";

const TITLE = "Bild verkleinern – kostenlos online & ohne Anmeldung";
const DESCRIPTION =
  "Bild verkleinern in Sekunden: Pixelmaße oder Dateigröße reduzieren, JPG, PNG & WebP unterstützt. Kostenlos, ohne Anmeldung, Verarbeitung im Browser.";
const PATH = "/bild-verkleinern/";

export const metadata: Metadata = buildMetadata({ title: TITLE, description: DESCRIPTION, path: PATH });

const FAQS: FaqItem[] = [
  {
    q: "Wie kann ich ein Bild verkleinern, ohne ein Programm zu installieren?",
    a: "Öffnen Sie diese Seite in einem aktuellen Browser, legen Sie das Bild in das Upload-Feld und wählen Sie neue Pixelmaße oder eine Zielgröße in KB bzw. MB. Nach einem Klick auf den Download speichern Sie das Ergebnis. Die Verarbeitung erledigt Ihr Browser selbst – auf Computer, Tablet und Smartphone.",
  },
  {
    q: "Verliert mein Foto beim Verkleinern an Qualität?",
    a: "Beim Reduzieren der Pixelmaße gehen Details verloren, die bei normaler Betrachtungsgröße meist nicht auffallen. Ganz ohne Qualitätsverlust geht es nur, wenn die Abmessungen gleich bleiben und verlustfrei gespeichert wird. Mit der Vorschau sehen Sie vor dem Download, wie das verkleinerte Foto tatsächlich aussieht.",
  },
  {
    q: "Was ist der Unterschied zwischen Bild verkleinern und Bild komprimieren?",
    a: "Verkleinern reduziert in der Regel die Abmessungen in Pixeln, also Breite und Höhe. Komprimieren senkt dagegen den Speicherbedarf, während die Abmessungen gleich bleiben. Unser Tool kann beides kombinieren: Im Modus „Zielgröße“ wird zuerst die Qualität angepasst und nur bei Bedarf zusätzlich die Pixelzahl reduziert.",
  },
  {
    q: "Welche Bildformate kann ich verkleinern?",
    a: "Unterstützt werden JPG/JPEG, PNG, WebP und GIF. Bei GIFs wird in diesem Werkzeug nur das erste Einzelbild verarbeitet. HEIC-Fotos vom iPhone können Sie ebenfalls direkt hochladen, sie werden im Browser dekodiert. Gespeichert wird im Originalformat oder wahlweise als JPG bzw. WebP.",
  },
  {
    q: "Ist das Verkleinern wirklich kostenlos?",
    a: "Ja. Sie benötigen kein Konto, es gibt keine Testphase und kein Wasserzeichen auf den Ergebnissen. Auch die Zahl der Bilder ist nicht künstlich begrenzt – pro Durchgang verarbeiten Sie bis zu 50 Dateien und können anschließend einfach den nächsten Stapel starten.",
  },
  {
    q: "Kann ich mehrere Bilder gleichzeitig verkleinern?",
    a: "Ja. Wählen Sie bis zu 50 Dateien auf einmal aus oder ziehen Sie einen ganzen Stapel in das Upload-Feld. Alle Bilder werden mit denselben Einstellungen verarbeitet. Danach laden Sie jedes Bild einzeln herunter oder speichern alle zusammen in einem ZIP-Archiv.",
  },
];

export default function Page() {
  return (
    <ToolPage
      toolId="P1"
      h1="Bild verkleinern – Fotos online in Sekunden verkleinern"
      lead={
        <>
          Bild verkleinern nach Pixelmaßen oder auf eine Zielgröße in KB oder MB – kostenlos, ohne Anmeldung und direkt
          in Ihrem Browser.
        </>
      }
      widget={<ImageResizer />}
      appName="Bildverkleinerer"
      description={DESCRIPTION}
      faqTitle="Häufige Fragen zum Thema Bild verkleinern"
      faqs={FAQS}
      related={["P2", "P21", "P8", "P10", "P11", "P27", "P51"]}
    >
      <p>
        „Zu groß“ kann zweierlei bedeuten: Das Foto hat zu viele Pixel für den vorgesehenen Platz, oder die Datei
        überschreitet ein Limit in KB oder MB. Mit diesem Werkzeug können Sie ein Bild verkleinern, egal welches der
        beiden Probleme Sie haben. Entweder legen Sie Breite, Höhe oder einen Prozentwert fest, oder Sie geben eine
        Zielgröße vor und das Tool sucht die passende Einstellung. Der Bildverkleinerer läuft vollständig im Browser und
        verarbeitet auch mehrere Fotos in einem Durchgang.
      </p>

      <h2>Bild verkleinern in drei Schritten</h2>
      <Steps
        items={[
          {
            title: "Bild hochladen oder per Drag & Drop ablegen",
            body: (
              <p>
                Wählen Sie ein oder mehrere Fotos aus – JPG, PNG, WebP, GIF oder HEIC. Bis zu 50 Dateien pro Durchgang
                sind möglich.
              </p>
            ),
          },
          {
            title: "Pixelmaße oder Zielgröße festlegen",
            body: (
              <p>
                Im Modus „Pixelmaße“ wählen Sie Breite, Höhe, Prozent oder eine Vorlage. Im Modus „Zielgröße“ geben Sie
                die gewünschte Dateigröße an.
              </p>
            ),
          },
          {
            title: "Verkleinertes Bild herunterladen",
            body: (
              <p>
                Kontrollieren Sie Vorschau und neue Dateigröße und speichern Sie jedes Foto einzeln oder alle als ZIP.
              </p>
            ),
          },
        ]}
      />

      <h2>Pixelmaße oder Dateigröße: Was möchten Sie verkleinern?</h2>
      <p>
        Bevor Sie Bilder kleiner machen, lohnt sich ein kurzer Blick auf das Ziel. Eine Webseite braucht passende
        Abmessungen, ein Upload-Formular dagegen eine bestimmte maximale Dateigröße.
      </p>
      <h3>Abmessungen in Pixel reduzieren</h3>
      <p>
        Moderne Smartphones nehmen Fotos mit 12 Megapixeln und mehr auf – das sind rund 4.000 × 3.000 Pixel. Für einen
        Bildschirm oder eine Webseite genügt meist ein Bruchteil davon. Im Modus „Pixelmaße“ tragen Sie Breite oder Höhe
        ein; bei gesperrtem Seitenverhältnis wird der zweite Wert automatisch berechnet. Alternativ skalieren Sie in
        Prozent oder nutzen die Vorlagen 1920, 1280 und 800 Pixel für die längere Seite. Das Tool vergrößert dabei nie
        ungefragt: Ist ein Foto schon kleiner als die Vorlage, bleibt es unverändert. Wer exakte Formate wie 1080 × 1080
        Pixel mit Zuschnitt oder Rand braucht, ist bei <ToolLink id="P21">Bildgröße ändern</ToolLink> besser aufgehoben.
      </p>
      <h3>Dateigröße in KB oder MB senken</h3>
      <p>
        Im Modus „Zielgröße“ geben Sie einen Wert wie 500 KB oder 2 MB ein. Das Tool probiert verschiedene
        Qualitätsstufen durch und reduziert nur dann zusätzlich die Pixelzahl, wenn die Qualität allein nicht reicht.
        Gespeichert wird in diesem Modus als JPG oder WebP, weil nur diese Formate eine stufenlose Qualitätsregelung
        erlauben. Möchten Sie die Pixelmaße ausdrücklich unverändert lassen, nutzen Sie{" "}
        <ToolLink id="P2">Bilder komprimieren</ToolLink>.
      </p>
      <h4>Warum beides oft zusammenhängt</h4>
      <p>
        Die Dateigröße hängt direkt von der Zahl der Pixel ab: Halbieren Sie Breite und Höhe, bleibt nur ein Viertel der
        Bildpunkte übrig, und die Datei schrumpft entsprechend deutlich. Wer die Bildgröße verkleinern will, erreicht
        deshalb oft schon mit angepassten Pixelmaßen das gewünschte Dateilimit.
      </p>

      <h2>Fotos verkleinern für typische Anlässe</h2>
      <h3>Bilder für Website und Onlineshop</h3>
      <p>
        Produktfotos und Blogbilder sollten nicht wesentlich breiter sein als der Bereich, in dem sie erscheinen. Für
        Vollbreite-Bilder ist 1920 Pixel ein verbreiteter Richtwert, für Inhaltsbilder reichen oft 1280 oder 800 Pixel.
        Speichern Sie Fotos dabei als JPG oder WebP.
      </p>
      <h3>Fotos für Bewerbungen und Behördenportale</h3>
      <p>
        Online-Bewerbungen und Portale von Behörden in Deutschland, Österreich und der Schweiz begrenzen häufig die
        Dateigröße von Anhängen. Prüfen Sie die Vorgabe des jeweiligen Portals und tragen Sie den Wert im Modus
        „Zielgröße“ ein. Für Scans von Dokumenten empfiehlt sich JPG.
      </p>
      <h3>Bilder für Messenger und soziale Netzwerke</h3>
      <p>
        Messenger und Netzwerke verkleinern hochgeladene Fotos meist selbst. Wenn Sie vorher auf 1280 oder 1920 Pixel
        reduzieren, behalten Sie die Kontrolle über Schärfe und Ausschnitt und sparen beim Versand mobile Daten.
        Auch wer ein Bild online verkleinern möchte, um es in einen Chat oder ein Forum zu stellen, kommt mit diesen
        Werten meist gut aus.
      </p>

      <h2>Bilder kostenlos verkleinern – ohne Anmeldung und ohne Wasserzeichen</h2>
      <p>
        Sie können jedes Bild kostenlos verkleinern, ohne Konto und ohne E-Mail-Adresse. Die Ergebnisse tragen kein
        Wasserzeichen und keine Markierung. Ob Sie in Deutschland nach der „Bildgröße“ oder in der Schweiz nach der
        „Bildgrösse“ suchen – das Werkzeug funktioniert überall gleich, in Chrome, Firefox, Safari und Edge.
      </p>
      <TrustList
        items={[
          "Kein Konto, keine Kosten, kein Wasserzeichen",
          "Zwei Modi: Pixelmaße oder Zielgröße in KB/MB",
          "JPG, PNG, WebP, GIF und HEIC als Eingabe",
          "Bis zu 50 Fotos pro Durchgang, Download als ZIP",
        ]}
      />

      <h2>Datenschutz: Ihre Fotos bleiben auf Ihrem Gerät</h2>
      <p>
        Das Verkleinern findet vollständig in Ihrem Browser statt. Ihre Bilder werden nicht auf einen Server übertragen
        und nicht gespeichert. Zusätzlich entfernt die standardmäßig aktive Option „Metadaten entfernen“ EXIF-Angaben wie
        Kameramodell, Aufnahmezeit und GPS-Standort aus den Ergebnissen. Wenn Sie diese Daten für Ihr Fotoarchiv
        benötigen, schalten Sie die Option vor dem Verarbeiten ab.
      </p>
      <Note>
        Auf iPhone und iPad begrenzt Safari die Größe der Zeichenfläche im Browser. Fotos mit mehr als etwa 16 Megapixeln
        werden dort zunächst auf diese Grenze reduziert; die betroffene Datei wird in der Liste gekennzeichnet.
      </Note>
    </ToolPage>
  );
}
