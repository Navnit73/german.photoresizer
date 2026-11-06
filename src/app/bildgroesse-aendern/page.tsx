import type { Metadata } from "next";
import ToolPage from "@/components/site/ToolPage";
import ToolLink from "@/components/site/ToolLink";
import { Steps, TrustList } from "@/components/site/content";
import SizeChanger from "@/components/tools/SizeChanger";
import { buildMetadata, type FaqItem } from "@/lib/seo";

const TITLE = "Bildgröße ändern – Pixelmaße online anpassen";
const DESCRIPTION =
  "Bildgröße ändern in Pixel oder Prozent: Breite und Höhe exakt anpassen, Seitenverhältnis sperren, Presets nutzen. Kostenlos online, ohne Anmeldung.";
const PATH = "/bildgroesse-aendern/";

export const metadata: Metadata = buildMetadata({ title: TITLE, description: DESCRIPTION, path: PATH });

const FAQS: FaqItem[] = [
  {
    q: "Wie ändere ich die Bildgröße in Pixel?",
    a: "Laden Sie das Bild hoch und tragen Sie die gewünschte Breite oder Höhe in Pixel ein. Ist das Schloss-Symbol für das Seitenverhältnis aktiv, berechnet das Tool den zweiten Wert automatisch, sodass nichts verzerrt wird. Lösen Sie die Sperre, können Sie beide Werte frei bestimmen und eine Anpassungsart wählen.",
  },
  {
    q: "Was ist der Unterschied zwischen Bildgröße und Dateigröße?",
    a: "Die Bildgröße beschreibt die Pixelmaße, also wie viele Bildpunkte ein Foto in der Breite und Höhe hat, etwa 1920 × 1080. Die Dateigröße gibt dagegen an, wie viel Speicher die Datei belegt, gemessen in KB oder MB. Weniger Pixel führen meist zu einer kleineren Datei, beides ist aber nicht dasselbe.",
  },
  {
    q: "Kann ich ein Bild auf 1080 × 1080 Pixel ändern?",
    a: "Ja. Wählen Sie die Vorlage 1080 × 1080 oder geben Sie die Werte manuell ein. Hat Ihr Foto ein anderes Seitenverhältnis, entscheiden Sie, ob die Ränder abgeschnitten werden („Zuschneiden“), ob ein weißer, schwarzer oder transparenter Rand ergänzt wird („Einpassen mit Rand“) oder ob das Bild gestreckt wird („Verzerren“).",
  },
  {
    q: "Kann ich die Bildgröße auch vergrößern?",
    a: "Ja, Sie können Werte über den Originalmaßen eingeben oder den Prozentregler bis 400 % ziehen. Beim Vergrößern werden jedoch nur Zwischenpixel aus den vorhandenen berechnet – neue Details entstehen dabei nicht, das Bild wirkt dadurch eher weich. Für Pixel-Art erhält die Option „Pixelgenau“ harte Kanten.",
  },
  {
    q: "Welche Formate werden unterstützt?",
    a: "Sie können JPG, PNG, WebP und GIF hochladen; bei GIFs wird das erste Einzelbild verwendet. HEIC-Fotos vom iPhone werden direkt im Browser gelesen. Gespeichert wird wahlweise im Originalformat oder als JPG, PNG oder WebP, bei JPG und WebP mit einstellbarer Qualität.",
  },
];

export default function Page() {
  return (
    <ToolPage
      toolId="P21"
      h1="Bildgröße ändern – Breite und Höhe in Pixel anpassen"
      lead={
        <>
          Bildgröße ändern auf exakte Pixelmaße, per Prozentwert oder mit Vorlagen wie 1920 × 1080 – kostenlos, ohne
          Anmeldung und lokal im Browser.
        </>
      }
      widget={<SizeChanger />}
      appName="Bildgrößen-Rechner"
      description={DESCRIPTION}
      faqTitle="Häufige Fragen zum Thema Bildgröße ändern"
      faqs={FAQS}
      related={["P1", "P22", "P23", "P24", "P25", "P53"]}
    >
      <p>
        Ein Banner braucht genau 1920 × 1080 Pixel, ein Profilbild 1080 × 1080, ein Vorschaubild 800 × 600. Mit diesem
        Werkzeug können Sie die Bildgröße ändern und Breite sowie Höhe pixelgenau festlegen. Sie arbeiten mit exakten
        Werten, skalieren in Prozent oder wählen eine Vorlage. Weicht das Seitenverhältnis ab, bestimmen Sie selbst, ob
        zugeschnitten, mit Rand eingepasst oder gestreckt wird. Mehrere Bilder lassen sich mit denselben Einstellungen
        verarbeiten und als ZIP speichern.
      </p>
      <p>
        Ob Sie Bilder resizen, skalieren oder einfach die Bildgröße anpassen wollen: Gemeint ist immer die Zahl der
        Pixel in Breite und Höhe. Die Originalmaße jedes Bildes sehen Sie nach dem Hochladen, die neuen Maße direkt
        darunter.
      </p>

      <h2>Bildgröße online ändern</h2>
      <Steps
        items={[
          {
            title: "Bild hochladen",
            body: (
              <p>
                Ziehen Sie ein oder mehrere Bilder in das Feld oder wählen Sie sie aus. Die Originalmaße werden sofort
                angezeigt.
              </p>
            ),
          },
          {
            title: "Neue Breite und Höhe eingeben",
            body: (
              <p>
                Tragen Sie Pixelwerte ein, nutzen Sie den Prozentregler oder klicken Sie auf eine Vorlage. Das Schloss hält
                das Seitenverhältnis fest.
              </p>
            ),
          },
          {
            title: "Bild in neuer Größe speichern",
            body: (
              <p>
                Wählen Sie das Ausgabeformat und laden Sie das Ergebnis herunter – einzeln oder gesammelt als ZIP-Archiv.
              </p>
            ),
          },
        ]}
      />

      <h2>Pixel, Prozent oder Vorlage?</h2>
      <p>Für die Größe eines Bildes gibt es drei Eingabewege. Welcher passt, hängt davon ab, was Sie vorgegeben bekommen.</p>
      <h3>Exakte Pixelmaße</h3>
      <p>
        Schreibt eine Plattform eine feste Breite vor, geben Sie diesen Wert direkt ein. Bei aktivem Schloss passt sich
        die Höhe proportional an. Wer beide Maße genau braucht, löst die Sperre und legt fest, wie mit dem
        abweichenden Seitenverhältnis umgegangen wird. So lassen sich Pixel ändern, ohne zu raten.
      </p>
      <h3>Skalieren in Prozent</h3>
      <p>
        Der Prozentregler reicht von 1 bis 400 %. 50 % halbiert Breite und Höhe, 200 % verdoppelt beide. Prozentangaben
        sind praktisch, wenn Sie mehrere Bilder unterschiedlicher Größe gleichmäßig skalieren möchten – jedes behält
        dabei sein eigenes Seitenverhältnis.
      </p>
      <h3>Vorlagen wie 1920 × 1080 und 1080 × 1080</h3>
      <p>
        Vier Vorlagen decken häufige Fälle ab: 1920 × 1080 (Full HD, Präsentationen, Titelbilder), 1280 × 720 (HD,
        Video-Vorschaubilder), 1080 × 1080 (quadratische Beiträge) und 800 × 600 (Vorschaubilder, Anhänge). Plattformen
        ändern ihre Empfehlungen gelegentlich; prüfen Sie im Zweifel die aktuelle Vorgabe des jeweiligen Dienstes.
      </p>
      <table>
        <thead>
          <tr>
            <th scope="col">Vorlage</th>
            <th scope="col">Seitenverhältnis</th>
            <th scope="col">Typischer Einsatz</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1920 × 1080</td>
            <td>16:9</td>
            <td>Präsentationsfolien, Bildschirmhintergründe, Titelbilder</td>
          </tr>
          <tr>
            <td>1280 × 720</td>
            <td>16:9</td>
            <td>Video-Vorschaubilder, Webseiten-Banner</td>
          </tr>
          <tr>
            <td>1080 × 1080</td>
            <td>1:1</td>
            <td>Quadratische Beiträge in sozialen Netzwerken</td>
          </tr>
          <tr>
            <td>800 × 600</td>
            <td>4:3</td>
            <td>Vorschaubilder, Anhänge, ältere Formulare</td>
          </tr>
        </tbody>
      </table>
      <p>
        Nach dem Klick auf eine Vorlage stehen die Werte in den Feldern für Breite und Höhe. Sie können sie dort noch
        anpassen, bevor Sie das Bild speichern – etwa wenn eine Plattform 1200 statt 1080 Pixel verlangt.
      </p>

      <h2>Seitenverhältnis beibehalten oder ändern</h2>
      <p>
        Das Seitenverhältnis ist das Verhältnis von Breite zu Höhe, etwa 4:3 bei vielen Kamerafotos oder 16:9 bei
        Bildschirmen. Soll ein 4:3-Foto in ein 16:9- oder 1:1-Format, passt es nicht ohne Weiteres hinein. Das Tool
        bietet dafür drei Anpassungsarten:
      </p>
      <ul>
        <li>
          <strong>Zuschneiden:</strong> Das Bild füllt den Rahmen vollständig, überstehende Ränder werden abgeschnitten.
        </li>
        <li>
          <strong>Einpassen mit Rand:</strong> Das ganze Bild bleibt sichtbar, freie Flächen werden weiß, schwarz oder
          transparent aufgefüllt.
        </li>
        <li>
          <strong>Verzerren:</strong> Das Bild wird auf die exakten Maße gestreckt oder gestaucht.
        </li>
      </ul>
      <h3>Was passiert beim Verzerren?</h3>
      <p>
        Beim Verzerren werden Breite und Höhe unterschiedlich stark skaliert. Kreise werden zu Ellipsen, Gesichter wirken
        breiter oder schmaler. Für Fotos ist das selten erwünscht – nutzen Sie dort besser „Zuschneiden“ oder „Einpassen
        mit Rand“. Bei abstrakten Mustern oder Hintergrundtexturen fällt eine leichte Verzerrung dagegen kaum auf.
      </p>
      <p>
        Die Vorschau zeigt Ihnen vor dem Speichern, wie das Ergebnis mit der gewählten Anpassungsart aussieht. Bei
        „Einpassen mit Rand“ empfiehlt sich für Logos und Produktbilder ein transparenter Rand mit PNG oder WebP als
        Ausgabe, denn JPG kennt keine Transparenz und würde die freien Flächen weiß füllen.
      </p>

      <h2>Bilder skalieren: kleiner und größer</h2>
      <p>
        Beim Verkleinern fasst das Tool mehrere Pixel zu einem zusammen. Mit der Einstellung „Glatt (hochwertig)“ bleiben
        Kanten sauber und Muster ruhig. Geht es nur darum, ein Foto schnell kleiner zu machen oder eine Dateigröße zu
        erreichen, ist <ToolLink id="P1">Bild verkleinern</ToolLink> die einfachere Wahl.
      </p>
      <p>
        Beim Vergrößern müssen dagegen neue Pixel aus den vorhandenen berechnet werden. Das funktioniert, fügt aber keine
        echten Details hinzu – ein kleines Foto wird größer, nicht schärfer. Für Pixel-Art, Icons und Spielegrafiken
        wählen Sie „Pixelgenau“: Dann wird jeder Bildpunkt einfach vervielfacht und harte Kanten bleiben erhalten.
      </p>
      <p>
        Die Pixelmaße bestimmen übrigens nicht allein die Druckgröße. Wie groß ein Bild auf Papier erscheint, hängt
        zusätzlich von der Auflösung in DPI ab – dafür ist das Thema <ToolLink id="P22">Bildauflösung ändern</ToolLink>{" "}
        relevant. Nutzer in der Schweiz kennen die Aufgabe auch als „Bildgrösse ändern“; gemeint ist dasselbe.
      </p>

      <TrustList
        items={[
          "Kostenlos nutzbar, ohne Registrierung und ohne Wasserzeichen",
          "Bilder werden nur in Ihrem Browser bearbeitet",
          "Pixel, Prozent (1–400 %) oder vier Vorlagen",
          "Ausgabe als Original, JPG, PNG oder WebP – auch als ZIP",
        ]}
      />
    </ToolPage>
  );
}
