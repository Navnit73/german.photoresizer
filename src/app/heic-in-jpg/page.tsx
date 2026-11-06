import type { Metadata } from "next";
import ToolPage from "@/components/site/ToolPage";
import ToolLink from "@/components/site/ToolLink";
import { Note, Steps, TrustList } from "@/components/site/content";
import HeicConverter from "@/components/tools/HeicConverter";
import { buildMetadata, type FaqItem } from "@/lib/seo";

const TITLE = "HEIC in JPG umwandeln – kostenlos online & ohne Upload";
const DESCRIPTION =
  "HEIC in JPG umwandeln: iPhone-Fotos in Sekunden ins JPG-Format konvertieren, mehrere Dateien gleichzeitig, ohne Upload. Kostenlos und ohne Anmeldung.";
const PATH = "/heic-in-jpg/";

export const metadata: Metadata = buildMetadata({ title: TITLE, description: DESCRIPTION, path: PATH });

const FAQS: FaqItem[] = [
  {
    q: "Wie wandle ich HEIC in JPG um?",
    a: "Ziehen Sie Ihre HEIC- oder HEIF-Dateien in das Feld oben oder wählen Sie sie über den Dateidialog aus. Stellen Sie anschließend die gewünschte JPG-Qualität ein und legen Sie fest, welche Metadaten erhalten bleiben sollen. Danach laden Sie die fertigen JPGs einzeln oder gesammelt als ZIP-Archiv herunter – alles direkt im Browser.",
  },
  {
    q: "Verliere ich beim Umwandeln Qualität?",
    a: "JPG ist ein verlustbehaftetes Format, daher wird das Foto beim Umwandeln neu komprimiert. Mit einer hohen Qualitätsstufe ist in der Regel kein sichtbarer Unterschied zum HEIC-Original zu erwarten, die Datei wird aber meist etwas größer. Wer jeden Bildpunkt unverändert speichern möchte, wählt stattdessen PNG als Zielformat.",
  },
  {
    q: "Kann ich viele HEIC-Dateien gleichzeitig konvertieren?",
    a: "Ja. Pro Durchgang können Sie bis zu 50 HEIC-Dateien auswählen. Das Tool wandelt sie nacheinander mit denselben Einstellungen um und zeigt für jede Datei den Fortschritt an. Am Ende speichern Sie alle Ergebnisse mit einem Klick als ZIP-Datei oder laden einzelne JPGs separat herunter.",
  },
  {
    q: "Was ist der Unterschied zwischen HEIC und HEIF?",
    a: "HEIF (High Efficiency Image File Format) ist der übergeordnete Containerstandard für Bilder. HEIC bezeichnet die Variante, in der die Bilddaten mit dem Videocodec HEVC kodiert sind – genau diese nutzt Apple auf iPhone und iPad. Unser Konverter verarbeitet Dateien mit den Endungen .heic und .heif gleichermaßen.",
  },
  {
    q: "Bleiben Aufnahmedatum und Ort erhalten?",
    a: "Das entscheiden Sie selbst. Mit „Alle behalten“ übernimmt das JPG Aufnahmedatum, Kameradaten und GPS-Standort. „Ohne Standort (GPS)“ behält Datum und Kameradaten, entfernt aber die Ortsangabe. „Alle entfernen“ löscht sämtliche Metadaten. Die Ausrichtung des Fotos wird in jedem Fall korrekt übernommen.",
  },
  {
    q: "Werden meine Fotos hochgeladen?",
    a: "Nein. Die Umwandlung findet vollständig in Ihrem Browser statt, Ihre Fotos verlassen Ihr Gerät nicht. Lediglich der HEIC-Decoder wird beim ersten Gebrauch als Programmdatei geladen, sofern Ihr Browser HEIC nicht selbst lesen kann. Ihre Bilddaten werden dabei nicht übertragen und von uns nicht gespeichert.",
  },
];

export default function Page() {
  return (
    <ToolPage
      toolId="P27"
      h1="HEIC in JPG umwandeln – iPhone-Fotos kostenlos konvertieren"
      lead={
        <>
          HEIC in JPG umwandeln, direkt in Ihrem Browser: iPhone-Fotos werden lokal konvertiert – kostenlos, ohne Anmeldung
          und ohne dass eine Datei Ihr Gerät verlässt.
        </>
      }
      widget={<HeicConverter />}
      appName="HEIC-in-JPG-Konverter"
      description={DESCRIPTION}
      faqTitle="Häufige Fragen zum Thema HEIC in JPG umwandeln"
      faqs={FAQS}
      related={["P30", "P28", "P29", "P37", "P3", "P16"]}
    >
      <p>
        Sie haben Fotos vom iPhone auf den Rechner kopiert und plötzlich lassen sie sich nicht öffnen, nicht hochladen oder
        nicht per E-Mail verschicken? Dann liegt das meist am HEIC-Format. Mit diesem Konverter können Sie HEIC in JPG
        umwandeln, ohne Software zu installieren: Die Dateien werden direkt im Browser dekodiert und als JPG oder PNG
        gespeichert. Sie bestimmen die Qualität, wählen, welche Metadaten erhalten bleiben, und verarbeiten auf Wunsch
        dutzende Bilder in einem Durchgang.
      </p>

      <h2>HEIC-Dateien in JPG konvertieren</h2>
      <p>Die Umwandlung erfolgt in drei kurzen Schritten – unabhängig davon, ob Sie ein Foto oder ein ganzes Album haben:</p>
      <Steps
        items={[
          {
            title: "HEIC-Fotos hochladen",
            body: (
              <p>
                Legen Sie Dateien mit der Endung .heic oder .heif per Drag &amp; Drop ab oder wählen Sie sie aus. Andere
                Formate weist das Tool mit einem Hinweis zurück.
              </p>
            ),
          },
          {
            title: "JPG-Qualität wählen",
            body: (
              <p>
                Bestimmen Sie per Regler, wie stark komprimiert wird, und legen Sie fest, ob Datum, Kameradaten und Standort
                im JPG bleiben sollen. Alternativ speichern Sie verlustfrei als PNG.
              </p>
            ),
          },
          {
            title: "JPGs herunterladen",
            body: (
              <p>
                Speichern Sie jedes Ergebnis einzeln oder alle Bilder gebündelt als ZIP-Archiv. Die Ausrichtung des Fotos
                wird dabei korrekt übernommen.
              </p>
            ),
          },
        ]}
      />

      <h2>Was ist das HEIC-Format?</h2>
      <p>
        HEIC steht für „High Efficiency Image Container“. Das Format speichert Fotos mit dem Codec HEVC, der ursprünglich
        für Videos entwickelt wurde. Bei vergleichbarer Bildqualität benötigt ein HEIC-Foto deutlich weniger Speicherplatz
        als ein klassisches JPG. Außerdem kann der Container mehr als ein einzelnes Bild aufnehmen, etwa Serienaufnahmen
        oder Zusatzinformationen.
      </p>

      <h3>Warum das iPhone HEIC verwendet</h3>
      <p>
        Apple hat HEIC mit iOS 11 als Standardformat der Kamera eingeführt. Der Grund ist vor allem Speicherplatz:
        Smartphone-Kameras liefern immer mehr Megapixel, und ein effizienteres Format sorgt dafür, dass mehr Fotos auf das
        Gerät und in die iCloud passen. Innerhalb der Apple-Welt fällt das kaum auf, weil iPhone, iPad und Mac HEIC
        problemlos anzeigen.
      </p>

      <h3>Vorteile und Nachteile von HEIC</h3>
      <p>
        Den kleinen Dateien und der guten Bildqualität steht ein entscheidender Nachteil gegenüber: die eingeschränkte
        Kompatibilität. Viele Webportale, Bewerbungsformulare, ältere Windows-Programme und Fotodruckdienste akzeptieren
        nur JPG oder PNG. JPG dagegen lässt sich praktisch überall öffnen, bearbeiten und hochladen. Wer Fotos weitergeben
        möchte, fährt deshalb mit JPG meist besser.
      </p>
      <h4>HEIC und HEIF – der Unterschied</h4>
      <p>
        HEIF ist der allgemeine Containerstandard, HEIC die konkrete Ausprägung mit HEVC-Kodierung. Im Alltag werden beide
        Begriffe oft gleichbedeutend verwendet. Der Konverter akzeptiert beide Endungen.
      </p>

      <h2>Mehrere HEIC-Dateien auf einmal umwandeln</h2>
      <p>
        Gerade nach dem Urlaub kommen schnell hunderte Fotos zusammen. Statt jede Datei einzeln zu öffnen, können Sie pro
        Durchgang bis zu 50 HEIC-Dateien auswählen. Der Konverter arbeitet sie nacheinander ab, zeigt den Fortschritt je
        Datei an und bündelt die Ergebnisse auf Wunsch in einer ZIP-Datei. Bei Live Photos wird das Standbild umgewandelt;
        der Videoteil liegt als separate MOV-Datei vor und wird nicht verarbeitet. Enthält eine HEIC-Datei mehrere Bilder,
        etwa bei Serienaufnahmen, wird das Hauptbild konvertiert.
      </p>
      <p>
        Die Dekodierung übernimmt die Bibliothek libheif, die als WebAssembly direkt im Browser läuft. Sie wird erst
        geladen, wenn Sie die erste Datei hinzufügen – einmalig rund 3 MB. Safari kann HEIC bereits selbst lesen; dort
        entfällt dieser Schritt.
      </p>

      <h2>HEIC unter Windows und Mac öffnen</h2>
      <p>
        Auf dem Mac öffnen Vorschau und Fotos-App HEIC-Bilder ohne Zusatzsoftware, und über „Exportieren“ lassen sich
        einzelne Dateien als JPG sichern. Unter Windows fehlt je nach Version und installierten Erweiterungen die
        Unterstützung, sodass Fotos nicht angezeigt werden. Ausführliche Schritt-für-Schritt-Anleitungen finden Sie in den
        Ratgebern <ToolLink id="P28">HEIC unter Windows in JPG umwandeln</ToolLink> und{" "}
        <ToolLink id="P29">HEIC am Mac in JPG umwandeln</ToolLink>. Möchten Sie direkt am iPhone einstellen, dass Fotos
        kompatibel gespeichert werden, hilft die Anleitung <ToolLink id="P30">iPhone-Fotos in JPG umwandeln</ToolLink>.
        Der Online-Konverter hier funktioniert dagegen auf jedem System mit aktuellem Browser gleich.
      </p>

      <h2>Metadaten beim Umwandeln behalten oder entfernen</h2>
      <p>
        iPhone-Fotos enthalten EXIF-Daten wie Aufnahmezeitpunkt, Kameramodell, Belichtungswerte und häufig den genauen
        Standort. Für das eigene Fotoarchiv sind diese Angaben wertvoll, beim Weitergeben können sie dagegen mehr verraten
        als gewünscht. Deshalb haben Sie drei Optionen:
      </p>
      <ul>
        <li>
          <strong>Alle behalten:</strong> Datum, Kameradaten und GPS-Standort werden ins JPG übernommen.
        </li>
        <li>
          <strong>Ohne Standort (GPS):</strong> Datum und Kameradaten bleiben, die Ortsangabe wird entfernt.
        </li>
        <li>
          <strong>Alle entfernen:</strong> Das JPG enthält keine EXIF-Metadaten mehr.
        </li>
      </ul>
      <p>
        Die Bildausrichtung wird unabhängig davon korrekt angewendet, sodass Hochformatfotos nicht plötzlich quer
        erscheinen.
      </p>

      <TrustList
        items={[
          "Umwandlung lokal im Browser – Ihre Fotos werden nicht hochgeladen",
          "Kostenlos, ohne Anmeldung und ohne Wasserzeichen",
          ".heic und .heif, bis zu 50 Dateien pro Durchgang",
          "Ausgabe als JPG mit wählbarer Qualität oder als PNG",
        ]}
      />
      <Note>
        Auf iPhone und iPad begrenzt Safari die Größe von Zeichenflächen. Fotos über rund 16 Megapixel werden dort vor
        der Verarbeitung entsprechend verkleinert; das Tool weist an der betroffenen Datei darauf hin.
      </Note>
    </ToolPage>
  );
}
