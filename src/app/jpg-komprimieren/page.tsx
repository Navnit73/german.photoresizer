import type { Metadata } from "next";
import ToolPage from "@/components/site/ToolPage";
import ToolLink from "@/components/site/ToolLink";
import { Note, Steps, TrustList } from "@/components/site/content";
import JpgCompressor from "@/components/tools/JpgCompressor";
import { buildMetadata, type FaqItem } from "@/lib/seo";

const TITLE = "JPG komprimieren – JPEG-Dateien online verkleinern";
const DESCRIPTION =
  "JPG komprimieren mit einstellbarer Qualität: JPEG-Dateien online verkleinern, Vorher-nachher-Vergleich, Stapelverarbeitung. Kostenlos & ohne Anmeldung.";
const PATH = "/jpg-komprimieren/";

export const metadata: Metadata = buildMetadata({ title: TITLE, description: DESCRIPTION, path: PATH });

const FAQS: FaqItem[] = [
  {
    q: "Welche Qualitätsstufe ist beim JPG komprimieren ideal?",
    a: "Für Webseiten und Blogs genügt meist eine mittlere bis hohe Stufe zwischen etwa 70 und 80. Für Archiv und Druck sollten Sie eine hohe Stufe ab etwa 90 wählen. Da jedes Motiv anders reagiert, prüfen Sie das Ergebnis am besten im Vorher-nachher-Vergleich, bevor Sie die Datei speichern.",
  },
  {
    q: "Ist JPEG dasselbe wie JPG?",
    a: "Ja. Beide Endungen bezeichnen exakt dasselbe Bildformat der Joint Photographic Experts Group. Die Kurzform „.jpg“ entstand, weil ältere Windows-Versionen Dateiendungen auf drei Zeichen begrenzten. Unser Tool akzeptiert beide Endungen und behandelt sie identisch.",
  },
  {
    q: "Warum wird mein JPG nach mehrfachem Speichern schlechter?",
    a: "JPEG komprimiert verlustbehaftet: Bei jedem erneuten Speichern werden die Bilddaten noch einmal vereinfacht, und kleine Fehler summieren sich zu sichtbaren Artefakten. Arbeiten Sie deshalb immer mit dem Original und komprimieren Sie nur die endgültige Version einmal mit der passenden Qualitätsstufe.",
  },
  {
    q: "Kann ich EXIF-Daten beim Komprimieren entfernen?",
    a: "Ja. Standardmäßig entfernt das Tool alle Metadaten wie Kameramodell, Aufnahmedatum und GPS-Standort. Das spart zusätzlich einige Kilobyte und schützt Ihre Privatsphäre. Wenn Sie die Metadaten behalten möchten, deaktivieren Sie die Option – das Tool weist Sie dann auf enthaltene Standortdaten hin.",
  },
  {
    q: "Wie viele JPG-Dateien kann ich gleichzeitig komprimieren?",
    a: "Sie können bis zu 50 JPG-Dateien auf einmal auswählen oder per Drag & Drop ablegen. Alle Bilder werden mit denselben Einstellungen nacheinander in Ihrem Browser verarbeitet. Anschließend laden Sie jede Datei einzeln oder alle gesammelt als ZIP-Archiv herunter.",
  },
];

export default function Page() {
  return (
    <ToolPage
      toolId="P3"
      h1="JPG komprimieren – JPEG-Dateien online verkleinern"
      lead={
        <>
          JPG komprimieren mit einstellbarer Qualitätsstufe: Fotos werden direkt in Ihrem Browser kleiner – kostenlos, ohne
          Anmeldung und ohne Upload auf einen Server.
        </>
      }
      widget={<JpgCompressor />}
      appName="JPG-Komprimierer"
      description={DESCRIPTION}
      faqTitle="Häufige Fragen zum Thema JPG komprimieren"
      faqs={FAQS}
      related={["P2", "P1", "P31", "P37", "P9", "P8"]}
    >
      <p>
        Wer ein JPG komprimieren möchte, will meist eines: eine kleinere Datei, ohne dass man dem Foto den Unterschied
        ansieht. Genau darauf ist dieses Werkzeug spezialisiert. Es arbeitet ausschließlich mit JPEG-Dateien und nutzt den
        Encoder MozJPEG, der Fotos bei gleicher Qualitätsstufe häufig kompakter speichert als die Standard-Speicherfunktion
        vieler Programme. Sie bestimmen die Qualitätsstufe, wählen zwischen progressivem und klassischem JPG und
        entscheiden, ob EXIF-Metadaten erhalten bleiben. Die Pixelmaße ändern sich dabei nicht.
      </p>

      <h2>JPG online komprimieren – so geht’s</h2>
      <p>Die Bedienung ist bewusst einfach gehalten. Drei Schritte genügen, um eine oder viele JPEG-Dateien zu verkleinern:</p>
      <Steps
        items={[
          {
            title: "JPG oder JPEG hochladen",
            body: (
              <p>
                Ziehen Sie Ihre Fotos per Drag &amp; Drop in das Feld oder wählen Sie sie über „Dateien auswählen“ aus –
                auch mehrere auf einmal. Die Dateien bleiben auf Ihrem Gerät.
              </p>
            ),
          },
          {
            title: "Qualitätsstufe einstellen",
            body: (
              <p>
                Wählen Sie mit dem Regler eine Stufe zwischen 10 und 100. Die neue Dateigröße und die Ersparnis in Prozent
                werden nach jeder Änderung neu berechnet.
              </p>
            ),
          },
          {
            title: "Komprimierte JPG speichern",
            body: (
              <p>
                Vergleichen Sie Vorher und Nachher mit dem Schieberegler und laden Sie die Datei einzeln oder alle Bilder
                als ZIP-Archiv herunter.
              </p>
            ),
          },
        ]}
      />

      <h2>Wie funktioniert die JPEG-Komprimierung?</h2>
      <p>
        JPEG zerlegt ein Foto in kleine Blöcke von 8 × 8 Pixeln und beschreibt jeden Block nicht Pixel für Pixel, sondern
        als Mischung aus groben und feinen Mustern. Feine Details, die das Auge kaum wahrnimmt, werden dabei vereinfacht
        oder weggelassen. Deshalb ist JPEG verlustbehaftet – und deshalb lassen sich Fotos so stark verkleinern.
        Zusätzlich trennt das Format Helligkeit und Farbe: Die Farbinformation darf gröber gespeichert werden, weil unser
        Sehsinn Helligkeitsunterschiede deutlich genauer wahrnimmt als Farbunterschiede.
      </p>

      <h3>Die Qualitätsstufe von 0 bis 100</h3>
      <p>
        Die Qualitätsstufe steuert, wie stark die feinen Details vereinfacht werden. Hohe Werte erhalten mehr Zeichnung,
        niedrige Werte sparen mehr Speicher. Der Zusammenhang ist nicht linear: Zwischen 100 und 90 sinkt die Dateigröße
        oft spürbar, während das Bild nahezu gleich aussieht. Unterhalb von etwa 60 werden Blockmuster und Farbsäume an
        Kanten sichtbar. Wichtig: Die Skala ist nicht standardisiert – „80“ in einem Programm entspricht nicht
        zwangsläufig „80“ in einem anderen. Vertrauen Sie deshalb dem Vorher-nachher-Vergleich statt einer festen Zahl.
      </p>

      <h3>Progressives JPG für schnellere Websites</h3>
      <p>
        Ein klassisches (Baseline-)JPG wird beim Laden Zeile für Zeile von oben nach unten aufgebaut. Ein progressives JPG
        erscheint zuerst als unscharfe Vorschau des ganzen Bildes und wird dann schrittweise schärfer. Auf langsamen
        Verbindungen wirkt das angenehmer, und bei größeren Fotos ist die progressive Variante oft etwas kleiner. Unser
        Tool speichert standardmäßig progressiv; für ältere Spezialsoftware können Sie die Option abschalten.
      </p>
      <p>
        Für Fortgeschrittene steht außerdem die Farbunterabtastung zur Wahl: <strong>4:2:0</strong> speichert die
        Farbinformation in halber Auflösung und spart deutlich Platz – für Fotos die übliche Wahl. <strong>4:4:4</strong>{" "}
        behält die volle Farbauflösung und lohnt sich bei Screenshots, Grafiken oder roter Schrift auf farbigem Grund, wo
        sonst Farbsäume entstehen.
      </p>

      <h4>Metadaten (EXIF) entfernen und Datenschutz</h4>
      <p>
        Smartphone-Fotos enthalten EXIF-Daten: Kameramodell, Aufnahmezeit und oft den exakten GPS-Standort. Beim Teilen
        verraten diese Angaben unter Umständen, wo Sie wohnen oder sich aufgehalten haben. Das Tool entfernt die
        Metadaten deshalb standardmäßig. Möchten Sie sie behalten – etwa für die Sortierung im Fotoarchiv –, schalten Sie
        die Option ab. Enthält ein Bild GPS-Koordinaten, erhalten Sie einen deutlichen Hinweis.
      </p>

      <h2>Die richtige Qualitätsstufe für Ihren Zweck</h2>
      <p>
        Welche Einstellung passt, hängt davon ab, wo das Bild landet. Die folgenden Werte sind Ausgangspunkte, keine
        festen Regeln – prüfen Sie das Ergebnis immer in der Vorschau.
      </p>
      <h3>Website und Blog</h3>
      <p>
        Für Webseiten zählt jede Kilobyte-Einsparung, weil kleinere Bilder schneller laden. Eine Qualitätsstufe um 70 bis
        80 mit progressivem JPG und 4:2:0 ist für die meisten Fotos ein guter Kompromiss. Sind die Bilder zusätzlich viel
        größer als der Bereich, in dem sie angezeigt werden, sollten Sie sie vorher auf passende Pixelmaße{" "}
        <ToolLink id="P1">Bild verkleinern</ToolLink> – das spart oft mehr als jede Qualitätsstufe.
      </p>
      <h3>E-Mail und Messenger</h3>
      <p>
        Für Anhänge und Chats reicht häufig eine Stufe von 60 bis 75. Viele Messenger komprimieren Bilder beim Versand
        ohnehin selbst; wer vorher komprimiert, behält die Kontrolle darüber, wie das Foto beim Empfänger aussieht.
      </p>
      <h3>Druck und Archiv</h3>
      <p>
        Für Fotobücher, Abzüge und die Langzeitarchivierung wählen Sie 90 oder höher und bei Bedarf 4:4:4. Komprimieren
        Sie archivierte Bilder nur einmal und bewahren Sie die Originaldatei zusätzlich auf.
      </p>
      <table>
        <thead>
          <tr>
            <th scope="col">Verwendung</th>
            <th scope="col">Qualitätsstufe</th>
            <th scope="col">Empfehlung</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Website, Blog, Onlineshop</td>
            <td>70–80</td>
            <td>progressiv, 4:2:0</td>
          </tr>
          <tr>
            <td>E-Mail, Messenger</td>
            <td>60–75</td>
            <td>progressiv, 4:2:0</td>
          </tr>
          <tr>
            <td>Druck, Archiv</td>
            <td>90–95</td>
            <td>4:4:4 bei Grafiken</td>
          </tr>
        </tbody>
      </table>

      <h2>JPG und JPEG: Gibt es einen Unterschied?</h2>
      <p>
        Nein. „.jpg“ und „.jpeg“ sind zwei Endungen für dasselbe Format. Die dreistellige Variante stammt aus der Zeit, in
        der Windows Dateiendungen auf drei Buchstaben begrenzte; macOS und Linux nutzten von Anfang an häufig „.jpeg“. Sie
        können beide Varianten verkleinern, und das Ergebnis behält die ursprüngliche Endung. Sollen PNG-, WebP- oder
        GIF-Dateien kleiner werden, nutzen Sie stattdessen <ToolLink id="P2">Bilder komprimieren</ToolLink> – dort wird
        jedes Format mit der jeweils passenden Methode optimiert.
      </p>

      <TrustList
        items={[
          "Kostenlos und ohne Anmeldung – ohne Wasserzeichen",
          "Verarbeitung lokal im Browser, kein Upload auf einen Server",
          "JPG und JPEG, bis zu 50 Dateien pro Durchgang",
          "Pixelmaße bleiben unverändert, nur die Dateigröße sinkt",
        ]}
      />
      <Note>
        Auf iPhone und iPad begrenzt Safari die Größe von Zeichenflächen. Fotos über rund 16 Megapixel werden dort vor
        der Verarbeitung entsprechend verkleinert; das Tool weist an der betroffenen Datei darauf hin.
      </Note>
    </ToolPage>
  );
}
