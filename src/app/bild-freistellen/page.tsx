import type { Metadata } from "next";
import ToolPage from "@/components/site/ToolPage";
import ToolLink from "@/components/site/ToolLink";
import { Steps, TrustList } from "@/components/site/content";
import CutoutTool from "@/components/tools/CutoutTool";
import { buildMetadata, type FaqItem } from "@/lib/seo";

const TITLE = "Bild freistellen online – Objekte präzise ausschneiden";
const DESCRIPTION =
  "Bild online freistellen: Objekte, Produkte und Personen präzise ausschneiden – mit KI, Lasso und Kantenverfeinerung. Kostenlos und ohne Anmeldung.";
const PATH = "/bild-freistellen/";

export const metadata: Metadata = buildMetadata({ title: TITLE, description: DESCRIPTION, path: PATH });

const FAQS: FaqItem[] = [
  {
    q: "Was bedeutet Freistellen?",
    a: "Freistellen ist ein Fachbegriff aus Grafikdesign und Fotografie. Gemeint ist, ein Motiv – etwa ein Produkt, eine Person oder einen Gegenstand – vom umgebenden Hintergrund zu trennen. Das freigestellte Objekt lässt sich anschließend einzeln weiterverwenden, zum Beispiel auf einem neuen Hintergrund, in einer Collage oder als transparentes PNG.",
  },
  {
    q: "Kann ich nur ein bestimmtes Objekt freistellen?",
    a: "Ja. Umranden Sie das gewünschte Objekt mit dem Lasso oder setzen Sie mit dem Polygon-Lasso Punkt für Punkt eine Auswahl. Alternativ lassen Sie die KI das Hauptmotiv vorauswählen und entfernen anschließend mit Lasso oder Pinsel alles, was nicht dazugehören soll. Ein direktes Anklicken beliebiger Einzelobjekte bietet das Tool nicht.",
  },
  {
    q: "Wie stelle ich Produktfotos sauber frei?",
    a: "Starten Sie mit der KI-Vorauswahl oder einer groben Lasso-Auswahl. Gerade Kanten von Verpackungen erfassen Sie präzise mit dem Polygon-Lasso, Rundungen mit dem Pinsel im Modus „Hinzufügen“ oder „Entfernen“. Stellen Sie die Kantenweichheit eher gering ein und setzen Sie das Produkt zum Schluss auf einen weißen Hintergrund.",
  },
  {
    q: "Ist Freistellen dasselbe wie Hintergrund entfernen?",
    a: "Das Ergebnis ist ähnlich: Am Ende steht ein Motiv ohne Hintergrund. Beim automatischen Hintergrundentfernen entscheidet jedoch die KI mit einem Klick, was Motiv ist. Beim Freistellen bestimmen Sie selbst, welche Bereiche zur Auswahl gehören – inklusive einzelner Objekte, Details oder mehrerer Bildteile.",
  },
  {
    q: "Kann ich mehrere Objekte freistellen?",
    a: "Ja. Die Auswahl lässt sich jederzeit erweitern: Fügen Sie mit Lasso, Polygon-Lasso oder Pinsel im Modus „Hinzufügen“ weitere Bereiche hinzu, auch wenn sie nicht zusammenhängen. Mit dem Modus „Entfernen“ schneiden Sie Bereiche wieder heraus. Alle ausgewählten Objekte werden gemeinsam in einer Datei exportiert.",
  },
];

export default function Page() {
  return (
    <ToolPage
      toolId="P41"
      h1="Bild freistellen – Objekte online präzise ausschneiden"
      lead={
        <>
          Bild freistellen mit Lasso, Pinsel und optionaler KI-Vorauswahl: Sie bestimmen genau, was ausgeschnitten wird –
          kostenlos, ohne Anmeldung und lokal im Browser.
        </>
      }
      widget={<CutoutTool />}
      appName="Bild-Freisteller"
      description={DESCRIPTION}
      faqTitle="Häufige Fragen zum Thema Bild freistellen"
      faqs={FAQS}
      related={["P40", "P48", "P44", "P50", "P52"]}
    >
      <p>
        Freistellen gehört zum Handwerkszeug von Grafikern und Fotografen: Ein Motiv wird sauber vom Hintergrund getrennt,
        um es anschließend einzeln einzusetzen. Mit diesem Werkzeug können Sie ein Bild freistellen, ohne ein
        Bildbearbeitungsprogramm zu installieren. Anders als bei einer vollautomatischen Lösung behalten Sie die volle
        Kontrolle: Mit Lasso, Polygon-Lasso und Pinsel legen Sie exakt fest, welche Teile des Fotos zum Motiv gehören. Eine
        KI-Vorauswahl des Hauptmotivs dient auf Wunsch als Ausgangspunkt.
      </p>

      <h2>Bild freistellen in wenigen Schritten</h2>
      <p>Vom Foto zum ausgeschnittenen Objekt führen drei Arbeitsschritte:</p>
      <Steps
        items={[
          {
            title: "Bild laden",
            body: (
              <p>
                Öffnen Sie ein JPG, PNG oder WebP per Drag &amp; Drop oder über die Dateiauswahl. Das Foto bleibt dabei auf
                Ihrem Gerät.
              </p>
            ),
          },
          {
            title: "Objekt auswählen: automatisch oder mit Lasso",
            body: (
              <p>
                Lassen Sie die KI das Hauptmotiv vorauswählen oder umranden Sie das Objekt selbst mit Lasso oder
                Polygon-Lasso. Weitere Bereiche fügen Sie hinzu oder ziehen sie ab.
              </p>
            ),
          },
          {
            title: "Kanten verfeinern und exportieren",
            body: (
              <p>
                Korrigieren Sie Ränder mit dem Pinsel, stellen Sie die Kantenweichheit ein und speichern Sie den Ausschnitt
                als PNG – auf Wunsch eng auf das Motiv zugeschnitten.
              </p>
            ),
          },
        ]}
      />

      <h2>Werkzeuge zum Freistellen</h2>
      <p>
        Jedes Werkzeug hat seine Stärken. In der Praxis kombinieren Sie sie: grob vorauswählen, dann gezielt nacharbeiten.
        Über „Rückgängig“ machen Sie jeden Schritt ungeschehen.
      </p>
      <h3>KI-Objektauswahl</h3>
      <p>
        Die KI-Vorauswahl erkennt das Hauptmotiv eines Fotos und markiert es als Auswahl. Dafür stehen dieselben lokal
        laufenden Modelle zur Verfügung wie beim automatischen Hintergrundentfernen: eines für Personen und eines für
        Produkte und Objekte. Die Modelldateien werden beim ersten Einsatz einmalig geladen. Die Vorauswahl ist ein
        Startpunkt – sie erfasst das auffälligste Motiv, nicht ein beliebiges Objekt Ihrer Wahl.
      </p>
      <h3>Lasso und Polygon-Lasso</h3>
      <p>
        Mit dem freien Lasso zeichnen Sie die Kontur mit Maus, Stift oder Finger nach – ideal für unregelmäßige Formen. Das
        Polygon-Lasso setzt per Klick einzelne Eckpunkte, die mit geraden Linien verbunden werden. So erfassen Sie Kartons,
        Bücher oder Bildschirme besonders exakt. Geschlossen wird die Auswahl durch einen Klick auf den Startpunkt oder
        einen Doppelklick.
      </p>
      <h3>Pinsel zum Verfeinern</h3>
      <p>
        Der Pinsel arbeitet in zwei Modi: „Hinzufügen“ malt Bereiche in die Auswahl hinein, „Entfernen“ nimmt sie heraus.
        Damit korrigieren Sie kleine Lücken an Henkeln, Fingern oder Kabeln. Zur Kontrolle blenden Sie die Auswahl als
        farbige Maske über dem Foto ein oder betrachten den Ausschnitt vor einem Schachbrettmuster.
      </p>
      <h4>Weiche oder harte Kanten</h4>
      <p>
        Über die Kantenweichheit bestimmen Sie, wie abrupt das Motiv in den Hintergrund übergeht. Technische Produkte mit
        klaren Konturen wirken mit harten Kanten am saubersten. Bei Haaren, Fell oder Stoff sorgt ein leicht weicher
        Übergang dafür, dass das Objekt später auf einem neuen Hintergrund nicht ausgeschnitten aussieht.
      </p>

      <h2>Produktfotos freistellen für Onlineshops</h2>
      <p>
        Für Shopbilder ist Präzision wichtiger als Tempo. Ein sauber freigestelltes Produkt lässt sich einheitlich auf
        weißem Grund präsentieren und für Banner oder Kataloge wiederverwenden. Wählen Sie beim Export einen weißen
        Hintergrund und das Format JPG, wenn keine Transparenz benötigt wird. Prüfen Sie dabei die Bildvorgaben Ihres
        Marktplatzes. Achten Sie besonders auf Spiegelungen und Schatten: Ob ein Schlagschatten zum Produkt gehört,
        entscheiden Sie selbst, indem Sie ihn in die Auswahl aufnehmen oder auslassen.
      </p>
      <p>
        Schon bei der Aufnahme können Sie sich das spätere Freistellen erleichtern: Ein ruhiger, gleichmäßig beleuchteter
        Hintergrund mit deutlichem Kontrast zum Produkt sorgt für klare Konturen. Fotografieren Sie dunkle Gegenstände vor
        hellem Grund und helle vor dunklem. Je klarer sich Motiv und Umgebung unterscheiden, desto weniger Nacharbeit mit
        dem Pinsel ist nötig – das gilt für die KI-Vorauswahl ebenso wie für die manuelle Auswahl mit dem Lasso.
      </p>

      <h2>Bilder ausschneiden und weiterverwenden</h2>
      <p>
        Ausgeschnittene Objekte speichern Sie als PNG mit transparentem Hintergrund. Die Option „Auf Motiv zuschneiden“
        entfernt dabei überflüssige leere Fläche rund um die Auswahl. In Browsern, die es unterstützen, kopieren Sie den
        Ausschnitt mit „In Zwischenablage kopieren“ direkt in Präsentationen oder Dokumente. Alternativ setzen Sie das
        Objekt auf einen weißen oder farbigen Hintergrund. Geht es speziell um Menschen, etwa mehrere Personen auf
        einem Gruppenfoto, ist das Thema <ToolLink id="P48">Personen ausschneiden</ToolLink> der passende Schwerpunkt.
      </p>

      <h2>Freistellen vs. Hintergrund entfernen – der Unterschied</h2>
      <p>
        Beide Werkzeuge liefern ein Motiv ohne Hintergrund, verfolgen aber unterschiedliche Ansätze. Wer schnell ein
        Porträt oder ein klar erkennbares Produkt braucht, ist mit <ToolLink id="P40">Hintergrund entfernen</ToolLink> gut
        bedient: Dort erledigt die KI alles automatisch mit einem Klick. Das Freistellen ist die Wahl, wenn Sie
        bestimmen möchten, was ausgeschnitten wird.
      </p>
      <table>
        <thead>
          <tr>
            <th scope="col">Kriterium</th>
            <th scope="col">Bild freistellen</th>
            <th scope="col">Hintergrund entfernen</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Auswahl</td>
            <td>manuell mit Lasso, Polygon und Pinsel, optional KI-Vorauswahl</td>
            <td>vollautomatisch per KI</td>
          </tr>
          <tr>
            <td>Einzelne Objekte</td>
            <td>ja, frei wählbar und kombinierbar</td>
            <td>nur das Hauptmotiv</td>
          </tr>
          <tr>
            <td>Typischer Einsatz</td>
            <td>Produktfotos, Details, Montagen</td>
            <td>Porträts, schnelle Ergebnisse</td>
          </tr>
        </tbody>
      </table>

      <TrustList
        items={[
          "Freistellen lokal im Browser – kein Upload Ihrer Fotos",
          "Kostenlos, ohne Anmeldung und ohne Wasserzeichen",
          "Lasso, Polygon-Lasso, Pinsel und KI-Vorauswahl kombinierbar",
          "Export als transparentes PNG oder auf weißem bzw. farbigem Hintergrund",
        ]}
      />
    </ToolPage>
  );
}
