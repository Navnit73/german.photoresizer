import type { Metadata } from "next";
import ToolPage from "@/components/site/ToolPage";
import ToolLink from "@/components/site/ToolLink";
import { Note, Steps, TrustList } from "@/components/site/content";
import BackgroundRemover from "@/components/tools/BackgroundRemover";
import { buildMetadata, type FaqItem } from "@/lib/seo";

const TITLE = "Hintergrund entfernen – automatisch & kostenlos online";
const DESCRIPTION =
  "Hintergrund entfernen mit KI: Bildhintergrund in Sekunden automatisch löschen, als transparentes PNG speichern oder neuen Hintergrund wählen. Kostenlos.";
const PATH = "/hintergrund-entfernen/";

export const metadata: Metadata = buildMetadata({ title: TITLE, description: DESCRIPTION, path: PATH });

const FAQS: FaqItem[] = [
  {
    q: "Wie entferne ich den Hintergrund eines Bildes?",
    a: "Laden Sie das Foto in das Tool. Die KI (ISNet) erkennt das Hauptmotiv – egal ob Porträt, Tier oder Produkt – und entfernt den Hintergrund automatisch. Kleine Fehler korrigieren Sie bei Bedarf mit dem Radierer oder dem Wiederherstellen-Pinsel, danach speichern Sie das Ergebnis als PNG, WebP oder JPG.",
  },
  {
    q: "In welchem Format wird das Bild ohne Hintergrund gespeichert?",
    a: "Für einen transparenten Hintergrund speichern Sie als PNG oder WebP – beide Formate unterstützen einen Alphakanal. Haben Sie einen neuen Hintergrund gewählt, etwa eine Farbe, eine unscharfe Version des Originals oder ein eigenes Bild, ist zusätzlich JPG möglich. Die Ausgabe erfolgt in der Auflösung des Originals.",
  },
  {
    q: "Funktioniert das auch bei Haaren?",
    a: "Meist ja, mit Einschränkungen. Die Modelle trennen auch feine Kanten wie Haare oder Fell oft überzeugend, das Ergebnis hängt aber stark vom Kontrast zwischen Motiv und Hintergrund ab. Einzelne Strähnen vor unruhigem Hintergrund können fehlen oder Reste behalten. Mit Pinsel und Kantenglättung lassen sich solche Stellen nacharbeiten.",
  },
  {
    q: "Ist das Entfernen des Hintergrunds kostenlos?",
    a: "Ja. Sie können den Hintergrund ohne Anmeldung, ohne Wasserzeichen und in der Auflösung des Originals entfernen. Es gibt keine kostenpflichtige Pro-Version mit besserer Qualität. Da die Berechnung auf Ihrem eigenen Gerät stattfindet, entstehen uns keine Serverkosten pro Bild, die wir weitergeben müssten.",
  },
  {
    q: "Brauche ich dafür eine App?",
    a: "Nein. Das Tool läuft in jedem aktuellen Browser auf Computer, Tablet und Smartphone. Sie benötigen weder eine App aus dem App Store noch ein Programm. Lediglich das KI-Modell wird beim ersten Einsatz heruntergeladen und anschließend vom Browser zwischengespeichert, sodass es beim nächsten Besuch schneller bereitsteht.",
  },
  {
    q: "Werden meine Bilder gespeichert?",
    a: "Nein. Ihr Foto wird ausschließlich in Ihrem Browser verarbeitet und weder an unsere noch an fremde Server übertragen. Es gibt keine serverseitige Verarbeitung und keine Speicherung. Von unserem Server geladen werden nur die Modelldateien und die ONNX-Laufzeitumgebung – Ihre Bilddaten sind darin nicht enthalten.",
  },
];

export default function Page() {
  return (
    <ToolPage
      toolId="P40"
      h1="Hintergrund entfernen – automatisch mit KI"
      lead={
        <>
          Hintergrund entfernen per Künstlicher Intelligenz, die direkt in Ihrem Browser läuft – kostenlos, ohne Anmeldung
          und ohne dass Ihr Foto hochgeladen wird.
        </>
      }
      widget={<BackgroundRemover />}
      appName="Hintergrund-Entferner"
      description={DESCRIPTION}
      faqTitle="Häufige Fragen zum Thema Hintergrund entfernen"
      faqs={FAQS}
      related={["P41", "P42", "P44", "P45", "P46", "P48", "P47", "P69"]}
    >
      <p>
        Ein Produktfoto für den Onlineshop, ein Profilbild ohne unruhige Wohnzimmerwand oder ein Porträt für eine
        Collage: Oft soll nur das Motiv bleiben. Mit diesem Werkzeug können Sie den Hintergrund entfernen, ohne
        mühsam Konturen nachzuzeichnen. Ein KI-Modell erkennt das Hauptmotiv automatisch und blendet alles andere aus. Das
        Ergebnis speichern Sie als Bild ohne Hintergrund mit Transparenz oder setzen das Motiv direkt auf eine neue
        Fläche. Die gesamte Berechnung erfolgt lokal auf Ihrem Gerät.
      </p>

      <h2>Bildhintergrund in drei Schritten entfernen</h2>
      <p>Vom Originalfoto zum freigestellten Motiv gelangen Sie mit wenigen Klicks:</p>
      <Steps
        items={[
          {
            title: "Foto hochladen",
            body: (
              <p>
                Ziehen Sie ein JPG, PNG oder WebP in das Feld oder wählen Sie es aus. Das Bild wird nur in Ihrem Browser
                geöffnet.
              </p>
            ),
          },
          {
            title: "KI entfernt den Hintergrund automatisch",
            body: (
              <p>
                Die KI trennt Motiv und Hintergrund automatisch mit dem hochpräzisen ISNet-Modell – je nach Gerät in wenigen Sekunden.
              </p>
            ),
          },
          {
            title: "Als PNG speichern oder Hintergrund ersetzen",
            body: (
              <p>
                Laden Sie das Motiv transparent als PNG oder WebP herunter oder wählen Sie Farbe, Unschärfe oder ein eigenes
                Bild als neuen Hintergrund.
              </p>
            ),
          },
        ]}
      />
      <p>
        Das Werkzeug nutzt das hochpräzise ISNet-Modell (von IMG.LY), das auf Dichotomous Image Segmentation (DIS) basiert
        und Personen, Haare, Tiere, Produkte und komplexe Objekte gleichermaßen meistert. Das Modell wird beim ersten Einsatz
        automatisch heruntergeladen und im Browser zwischengespeichert. Unterstützt Ihr Gerät WebGPU, erfolgt die Berechnung
        beschleunigt über Ihre Grafikkarte; andernfalls läuft sie über WebAssembly auf dem Prozessor.
      </p>

      <h2>Feinarbeit: Kanten und Details korrigieren</h2>
      <p>
        Keine KI liegt immer richtig. Deshalb lässt sich die automatisch erzeugte Maske anschließend von Hand verbessern.
        Jeder Schritt kann rückgängig gemacht werden.
      </p>
      <h3>Radierer und Wiederherstellen-Pinsel</h3>
      <p>
        Mit dem Radierer entfernen Sie Reste des Hintergrunds, die stehen geblieben sind, etwa einen Stuhlrücken hinter der
        Schulter. Der Wiederherstellen-Pinsel holt versehentlich entfernte Bereiche des Motivs zurück. Pinselgröße und
        Härte sind einstellbar: Ein harter Pinsel eignet sich für klare Produktkanten, ein weicher für organische Übergänge.
      </p>
      <h3>Haare und feine Kanten</h3>
      <p>
        Haare, Fell und transparente Materialien sind die schwierigsten Bereiche. Die Modelle erzeugen hier weiche
        Übergänge statt harter Schnitte, was meist natürlich wirkt. Bei geringem Kontrast zum Hintergrund können dennoch
        Säume bleiben. Der Regler für die Kantenglättung macht den Übergang weicher; besonders störende Stellen bearbeiten
        Sie mit einem kleinen, weichen Pinsel.
      </p>

      <h2>Hintergrund entfernen für jeden Zweck</h2>
      <h3>Produktfotos für Onlineshops</h3>
      <p>
        Viele Marktplätze und Shopsysteme bevorzugen Produktbilder vor einheitlichem, hellem Hintergrund. Entfernen Sie
        den Hintergrund einfach per KI und wählen Sie anschließend Weiß als neue Farbe. Prüfen Sie
        dabei die aktuellen Bildrichtlinien Ihrer Plattform. Wenn Sie nur bestimmte Teile eines Produkts genau auswählen
        möchten, ist <ToolLink id="P41">Bild freistellen</ToolLink> mit Lasso und Pinsel die passendere Wahl.
      </p>
      <h3>Porträts und Profilbilder</h3>
      <p>
        Für Bewerbungsfotos, Teamseiten oder Profilbilder liefert das Porträtmodell in der Regel schnell ein sauberes
        Ergebnis. Ein leicht unscharfer Originalhintergrund wirkt oft natürlicher als eine reine Farbfläche.
      </p>
      <h3>Logos und Grafiken</h3>
      <p>
        Bei Logos auf einfarbigem Grund ist eine KI oft gar nicht nötig. Hier genügt es meist, eine Farbe gezielt
        auszublenden – dafür ist <ToolLink id="P42">Hintergrund transparent machen</ToolLink> vorgesehen. Bei Logos auf
        Fotos oder Verläufen hilft dagegen das Objektmodell.
      </p>

      <h2>Hintergrund entfernen am Handy</h2>
      <p>
        Das Tool funktioniert auch im mobilen Browser auf iPhone und Android. Wählen Sie das Foto direkt aus der
        Mediathek, korrigieren Sie die Maske mit dem Finger und speichern Sie das Ergebnis. Beachten Sie: Das große
        Objektmodell benötigt auf dem Smartphone spürbar mehr Zeit und Datenvolumen – laden Sie es am besten im WLAN. Auf
        iPhone und iPad werden Fotos über rund 16 Megapixel vor der Verarbeitung verkleinert, weil Safari die Größe von
        Zeichenflächen begrenzt.
      </p>

      <h2>Datenschutz bei der Hintergrundentfernung</h2>
      <p>
        Viele Online-Dienste schicken Ihr Foto zur Berechnung auf einen Server. Hier ist das nicht der Fall: Das KI-Modell
        läuft vollständig in Ihrem Browser, Ihr Bild verlässt das Gerät zu keinem Zeitpunkt. Die Modelldateien und die
        ONNX-Laufzeitumgebung liefern wir selbst aus – es werden keine Drittanbieter wie Hugging Face oder ein externes
        Content-Delivery-Netzwerk kontaktiert. Das entspricht dem Grundgedanken von DSGVO und revDSG: Daten, die gar nicht
        erst übertragen werden, können auch nicht in falsche Hände geraten. Details finden Sie in unserer
        Datenschutzerklärung.
      </p>

      <TrustList
        items={[
          "KI läuft lokal – Ihr Foto wird nicht hochgeladen oder gespeichert",
          "Kostenlos, ohne Anmeldung, ohne Wasserzeichen",
          "Export in Originalauflösung als PNG, WebP oder JPG",
          "Hochpräzises ISNet-Modell für Personen, Produkte & beliebige Motive",
        ]}
      />
      <Note>
        Das Tool bearbeitet jeweils ein Bild. Die Rechenzeit hängt von Gerät, Browser und gewähltem Modell ab und reicht
        von wenigen Sekunden bis etwa einer Minute.
      </Note>
    </ToolPage>
  );
}
