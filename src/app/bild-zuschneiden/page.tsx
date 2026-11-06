import type { Metadata } from "next";
import ToolPage from "@/components/site/ToolPage";
import ToolLink from "@/components/site/ToolLink";
import { Note, Steps, TrustList } from "@/components/site/content";
import CropTool from "@/components/tools/CropTool";
import { buildMetadata, type FaqItem } from "@/lib/seo";

const TITLE = "Bild zuschneiden – Fotos online kostenlos beschneiden";
const DESCRIPTION =
  "Bild zuschneiden online: Ausschnitt frei wählen oder Vorlagen wie 1:1 und 16:9 nutzen, gerade ausrichten, Ränder entfernen. Kostenlos, ohne Anmeldung.";
const PATH = "/bild-zuschneiden/";

export const metadata: Metadata = buildMetadata({ title: TITLE, description: DESCRIPTION, path: PATH });

const FAQS: FaqItem[] = [
  {
    q: "Wie schneide ich ein Bild online zu?",
    a: "Laden Sie das Foto in das Tool, ziehen Sie den Rahmen an den Griffen auf den gewünschten Ausschnitt oder wählen Sie eine Vorlage wie 1:1 oder 16:9. Verschieben Sie den Rahmen bei Bedarf mit der Maus, dem Finger oder den Pfeiltasten. Anschließend wählen Sie das Ausgabeformat und speichern das zugeschnittene Bild – ohne Anmeldung und direkt im Browser.",
  },
  {
    q: "Verliert das Bild durch Zuschneiden an Qualität?",
    a: "Die verbleibenden Pixel werden nicht skaliert, sondern unverändert übernommen. Speichern Sie als PNG, ist das Ergebnis verlustfrei. Ein JPG wird beim Speichern dagegen neu kodiert, und zwar mit hoher Qualitätsstufe (MozJPEG, Stufe 92). Ein Unterschied ist dabei normalerweise nicht sichtbar, ein völlig verlustfreier JPEG-Zuschnitt ist im Browser aber nicht möglich.",
  },
  {
    q: "Kann ich PNGs mit Transparenz zuschneiden?",
    a: "Ja. Wenn Sie ein PNG hochladen, wird es standardmäßig wieder als PNG gespeichert, und transparente Bereiche bleiben erhalten. Auch WebP unterstützt Transparenz. Wählen Sie dagegen JPG als Ausgabeformat, werden transparente Flächen mit einer Hintergrundfarbe gefüllt, weil JPG keine Transparenz kennt.",
  },
  {
    q: "Wie schneide ich ein Bild auf eine exakte Größe zu?",
    a: "Nutzen Sie die Eingabe für die exakte Größe: Tragen Sie Breite und Höhe in Pixel ein oder wechseln Sie auf Zentimeter und geben Sie zusätzlich die Auflösung in dpi an, standardmäßig 300 dpi. Der Rahmen nimmt dann genau diese Maße an und lässt sich anschließend noch über das Motiv verschieben.",
  },
  {
    q: "Kann ich das Bild beim Zuschneiden gerade ausrichten?",
    a: "Ja. Mit dem Drehregler richten Sie schiefe Horizonte oder Gebäudekanten stufenlos zwischen −45° und +45° aus. Der Zuschnitt wird dabei automatisch so vergrößert, dass keine leeren Ecken entstehen. Zusätzlich können Sie das Bild in 90°-Schritten drehen sowie horizontal oder vertikal spiegeln.",
  },
];

export default function Page() {
  return (
    <ToolPage
      toolId="P51"
      h1="Bild zuschneiden – Fotos online beschneiden"
      lead={
        <>
          Bild zuschneiden im Browser: Ausschnitt frei wählen oder per Vorlage festlegen, gerade ausrichten und speichern –
          kostenlos, ohne Anmeldung und ohne Upload.
        </>
      }
      widget={<CropTool />}
      appName="Bild zuschneiden – Online-Zuschnitt"
      description={DESCRIPTION}
      faqTitle="Häufige Fragen zum Thema Bild zuschneiden"
      faqs={FAQS}
      related={["P25", "P52", "P53", "P55", "P21", "P54"]}
    >
      <p>
        Ein störender Rand, ein schiefer Horizont oder ein Format, das nicht ins Profilbild passt: Wer ein Bild zuschneiden
        möchte, will den Blick auf das Wesentliche lenken. Mit diesem Werkzeug legen Sie den Ausschnitt frei mit der Maus
        oder dem Finger fest oder wählen eine Vorlage wie 1:1, 4:5 oder 16:9. Ein Drittel-Raster hilft bei der Komposition,
        der Drehregler richtet schiefe Fotos aus, und einfarbige Ränder lassen sich automatisch entfernen. Die Bearbeitung
        findet vollständig in Ihrem Browser statt.
      </p>

      <h2>Bild online zuschneiden – so geht’s</h2>
      <p>Für einen sauberen Zuschnitt brauchen Sie nur drei Schritte:</p>
      <Steps
        items={[
          {
            title: "Foto hochladen",
            body: (
              <p>
                Ziehen Sie ein Bild per Drag &amp; Drop in das Feld oder wählen Sie es aus der Mediathek Ihres Geräts aus.
                JPG, PNG und WebP werden unterstützt.
              </p>
            ),
          },
          {
            title: "Ausschnitt festlegen",
            body: (
              <p>
                Ziehen Sie den Rahmen an den Griffen auf, verschieben Sie ihn oder wählen Sie eine Vorlage. Mit den
                Pfeiltasten justieren Sie pixelgenau nach.
              </p>
            ),
          },
          {
            title: "Zugeschnittenes Bild speichern",
            body: (
              <p>
                Wählen Sie JPG, PNG oder WebP – standardmäßig bleibt das Originalformat erhalten – und laden Sie das
                Ergebnis herunter.
              </p>
            ),
          },
        ]}
      />

      <h2>Freier Zuschnitt oder Vorlage?</h2>
      <p>
        Je nach Ziel eignet sich eine andere Arbeitsweise. Das Tool bietet drei Wege, die Sie jederzeit kombinieren können.
      </p>
      <h3>Freihand</h3>
      <p>
        Im Modus „Frei“ bestimmen Sie Breite und Höhe des Rahmens unabhängig voneinander. Das ist ideal, wenn Sie nur einen
        störenden Bildteil abschneiden oder ein Detail hervorheben möchten. Die Griffe an Ecken und Kanten lassen sich mit
        der Maus und auf dem Smartphone mit dem Finger bedienen.
      </p>
      <h3>Seitenverhältnis-Vorlagen</h3>
      <p>
        Für feste Formate wählen Sie eine Vorlage: „Original“ behält das Verhältnis Ihres Fotos, 1:1 eignet sich für
        quadratische Profilbilder, 4:5 für Hochformat-Beiträge in sozialen Netzwerken, 4:3 und 3:2 für klassische
        Fotoabzüge, 16:9 für Präsentationen und Bildschirme und 9:16 für Storys. Der Rahmen behält das gewählte Verhältnis,
        während Sie ihn vergrößern oder verschieben. Wenn Sie das Format ändern möchten, ohne Bildteile abzuschneiden, ist
        das Werkzeug <ToolLink id="P25">Seitenverhältnis ändern</ToolLink> mit Auffüllen die passende Alternative.
      </p>
      <h3>Exakte Pixel und Zentimeter</h3>
      <p>
        Benötigen Sie genaue Maße, geben Sie Breite und Höhe direkt in Pixel ein. Für den Druck wechseln Sie auf Zentimeter
        und legen die Auflösung fest – voreingestellt sind 300 dpi. Das Tool rechnet die Werte in Pixel um. Für
        wiederkehrende feste Formate gibt es zusätzlich die Spezialseite{" "}
        <ToolLink id="P53">Bild auf bestimmte Größe zuschneiden</ToolLink>.
      </p>

      <h2>Bildkomposition verbessern</h2>
      <p>
        Ein guter Zuschnitt macht aus einem durchschnittlichen Schnappschuss oft ein deutlich stärkeres Foto. Zwei
        Techniken helfen dabei besonders.
      </p>
      <h3>Drittel-Regel</h3>
      <p>
        Während Sie den Rahmen bewegen, blendet das Tool ein Raster ein, das den Ausschnitt in neun gleich große Felder
        teilt. Platzieren Sie wichtige Elemente – etwa Augen in einem Porträt oder den Horizont einer Landschaft – auf oder
        nahe den Linien und Schnittpunkten. Das wirkt meist lebendiger als eine streng mittige Anordnung. Schiefe Linien
        korrigieren Sie mit dem Drehregler zwischen −45° und +45°; der Rahmen zoomt dabei automatisch so weit hinein, dass
        keine leeren Ecken entstehen.
      </p>
      <h3>Störende Ränder entfernen</h3>
      <p>
        Gescannte Dokumente und Screenshots haben oft weiße oder schwarze Ränder. Die Funktion „Ränder automatisch
        entfernen“ erkennt einfarbige Randflächen und setzt den Rahmen direkt an die Kante des Inhalts. Bei Fotos mit
        unruhigem Hintergrund greift sie bewusst nicht – hier schneiden Sie von Hand. Für Profilbilder mit kreisrunder
        Form ist das Werkzeug <ToolLink id="P52">Bild rund ausschneiden</ToolLink> gedacht.
      </p>

      <h2>JPG und PNG zuschneiden</h2>
      <p>
        Das Format beeinflusst, wie das Ergebnis gespeichert wird. Ein PNG wird verlustfrei geschrieben; die Pixel
        innerhalb des Ausschnitts sind identisch mit dem Original, und Transparenz bleibt erhalten. Gleiches gilt für
        Transparenz bei WebP. Beim JPG zuschneiden muss die Datei dagegen neu kodiert werden, denn ein verlustfreier
        JPEG-Zuschnitt ist im Browser nicht möglich. Das Tool verwendet dafür den Encoder MozJPEG mit der hohen
        Qualitätsstufe 92 – in der Praxis ist kein Unterschied zum Original zu erkennen. Wenn Sie das Foto vorher drehen
        oder spiegeln möchten, nutzen Sie die Schaltflächen für 90°-Drehungen sowie horizontales und vertikales Spiegeln
        direkt im Werkzeug.
      </p>
      <p>
        Beachten Sie außerdem: Zuschneiden verringert die Pixelmaße, weil Bildteile wegfallen – das Motiv selbst wird
        aber nicht verkleinert oder vergrößert. Wer ein Bild nur auf eine kleinere Breite und Höhe bringen möchte, ohne
        etwas abzuschneiden, skaliert stattdessen das ganze Bild mit „Bildgröße ändern“. Für den Druck gilt: Ein starker
        Zuschnitt reduziert die verfügbare Auflösung. Ein Ausschnitt von 1.200 × 800 Pixeln ergibt bei 300 dpi nur rund
        10 × 6,8 cm. Prüfen Sie deshalb im Zentimeter-Modus, ob genug Pixel für das gewünschte Druckformat übrig bleiben.
      </p>
      <table>
        <thead>
          <tr>
            <th scope="col">Vorlage</th>
            <th scope="col">Typische Verwendung</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1:1</td>
            <td>Profilbilder, quadratische Beiträge</td>
          </tr>
          <tr>
            <td>4:5</td>
            <td>Hochformat-Beiträge in sozialen Netzwerken</td>
          </tr>
          <tr>
            <td>3:2 und 4:3</td>
            <td>Fotoabzüge, Kameraformate</td>
          </tr>
          <tr>
            <td>16:9 und 9:16</td>
            <td>Präsentationen, Bildschirme, Storys</td>
          </tr>
        </tbody>
      </table>

      <TrustList
        items={[
          "Kostenlos, ohne Anmeldung und ohne Wasserzeichen",
          "Foto bleibt auf Ihrem Gerät – kein Upload auf einen Server",
          "Zuschnitt per Maus, Touch oder Pfeiltasten",
          "JPG, PNG und WebP; Transparenz bleibt bei PNG und WebP erhalten",
        ]}
      />
      <Note>
        Auf iPhone und iPad begrenzt Safari die Größe von Zeichenflächen. Fotos über rund 16 Megapixel werden dort vor
        der Verarbeitung entsprechend verkleinert; das Tool weist darauf hin.
      </Note>
    </ToolPage>
  );
}
