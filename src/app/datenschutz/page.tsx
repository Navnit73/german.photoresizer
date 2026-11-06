import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, EyeOff, ServerOff, Cookie } from "lucide-react";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Datenschutzerklärung",
  description:
    "Datenschutz nach DSGVO und Schweizer revDSG: Bilder werden lokal im Browser verarbeitet und nicht hochgeladen. Informationen zu Logfiles und KI-Modellen.",
  path: "/datenschutz/",
});

export default function DatenschutzPage() {
  return (
    <main id="main" className="flex-1 bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <Link href="/" className="mb-8 inline-flex min-h-10 items-center gap-1.5 text-sm font-semibold text-lime-800 hover:underline">
          <ArrowLeft aria-hidden className="h-4 w-4" /> Zurück zur Startseite
        </Link>

        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-950 sm:text-4xl">Datenschutzerklärung</h1>
        <p className="mt-2 text-sm text-zinc-700">
          Informationen zur Verarbeitung personenbezogener Daten nach der Datenschutz-Grundverordnung (DSGVO) und dem Schweizer
          Datenschutzgesetz (revDSG).
        </p>

        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            { icon: ServerOff, h: "Kein Bild-Upload", p: "Ihre Bilder werden im Browser verarbeitet und nicht an unseren Server übertragen." },
            { icon: EyeOff, h: "Ohne Benutzerkonto", p: "Keine Registrierung, keine E-Mail-Adresse, keine Nutzerprofile." },
            { icon: Cookie, h: "Kein Tracking", p: "Keine Analyse- oder Werbe-Cookies." },
          ].map(({ icon: Icon, h, p }) => (
            <div key={h} className="rounded-2xl border border-lime-700/20 bg-lime-50/50 p-4">
              <Icon aria-hidden className="mb-2 h-6 w-6 text-lime-700" />
              <p className="text-sm font-bold text-zinc-900">{h}</p>
              <p className="mt-1 text-xs leading-snug text-zinc-700">{p}</p>
            </div>
          ))}
        </div>

        <div className="content mt-10">
          <h2>1. Verantwortlicher</h2>
          <p>Verantwortlicher im Sinne von Art. 4 Nr. 7 DSGVO und Art. 5 lit. j revDSG ist der im <Link href="/impressum/">Impressum</Link> genannte Betreiber dieser Website.</p>
          <p>
            E-Mail: <code>kontakt@fotowerkzeuge.online</code>
          </p>

          <h2>2. Bildverarbeitung im Browser</h2>
          <p>
            Alle Foto-Werkzeuge dieser Website arbeiten clientseitig: Bilder werden mit Funktionen Ihres Browsers (HTML Canvas) und mit
            WebAssembly-Programmbausteinen (z. B. MozJPEG, OxiPNG, libwebp, libheif) direkt auf Ihrem Gerät berechnet.
          </p>
          <ul>
            <li>Ihre Bilddateien und deren Metadaten (z. B. EXIF- und GPS-Daten) werden nicht an unseren Server übertragen.</li>
            <li>Wir haben keinen Zugriff auf Ihre Bilder und speichern sie nicht.</li>
            <li>Die Zwischenergebnisse liegen nur im Arbeitsspeicher Ihres Browsers und werden beim Schließen oder Neuladen der Seite verworfen.</li>
          </ul>

          <h2>3. Bereitstellung der Website und Server-Logfiles</h2>
          {/* TODO (owner): name the hosting provider and verify retention/IP handling with it. */}
          <p>
            Beim Aufruf der Website übermittelt Ihr Browser technisch notwendige Daten an den Webserver unseres Hosting-Anbieters
            ([Hosting-Anbieter und Sitz eintragen]). Verarbeitet werden:
          </p>
          <ul>
            <li>IP-Adresse des anfragenden Geräts</li>
            <li>Datum und Uhrzeit des Abrufs</li>
            <li>Name und URL der abgerufenen Datei, übertragene Datenmenge, HTTP-Statuscode</li>
            <li>Browsertyp, Betriebssystem und Referrer-URL</li>
          </ul>
          <p>
            Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO (sicherer und stabiler Betrieb der Website). Die Logdaten werden nach spätestens 14
            Tagen gelöscht und nicht mit anderen Datenquellen zusammengeführt.
          </p>

          <h2>4. KI-Werkzeuge: Nachladen von Modellen und Laufzeitbibliotheken</h2>
          <p>
            Die Werkzeuge „Hintergrund entfernen“ und „Bild freistellen“ nutzen KI-Modelle, die ebenfalls lokal in Ihrem Browser ausgeführt
            werden. Ihr Foto wird dabei <strong>nicht</strong> übertragen. Damit das Modell lokal laufen kann, lädt Ihr Browser beim ersten
            Einsatz folgende Dateien von Drittanbietern:
          </p>
          <ul>
            <li>
              <strong>Modelldateien</strong> von Hugging Face (Hugging Face, Inc., USA) über <code>huggingface.co</code> und dessen
              Content-Delivery-Netzwerk.
            </li>
            <li>
              <strong>ONNX Runtime Web</strong> (WebAssembly-Laufzeit) über das Content-Delivery-Netzwerk <code>cdn.jsdelivr.net</code>.
            </li>
          </ul>
          <p>
            Bei diesen Abrufen erhalten die Anbieter technisch bedingt Ihre IP-Adresse sowie Browser-Informationen; eine Übermittlung in die USA
            ist dabei möglich. Die Abrufe erfolgen erst, wenn Sie in einem KI-Werkzeug aktiv ein Modell auswählen. Rechtsgrundlage ist Art. 6 Abs.
            1 lit. f DSGVO (Bereitstellung der von Ihnen gewünschten Funktion). Die geladenen Dateien speichert Ihr Browser im Cache, damit sie
            nicht erneut heruntergeladen werden müssen; Sie können sie jederzeit über die Browser-Einstellungen löschen.
          </p>
          <p>
            Ebenso lädt das Werkzeug „HEIC in JPG umwandeln“ einen HEIC-Decoder nach – dieser wird von unserem eigenen Server ausgeliefert.
          </p>

          <h2>5. Cookies und lokale Speicherung</h2>
          <p>
            Wir setzen keine Cookies zu Analyse-, Marketing- oder Werbezwecken ein und binden keine Tracking-Dienste ein. Schriftarten werden
            von unserem eigenen Server geladen, nicht von Google.
          </p>
          <p>
            Die unter Ziffer 4 genannte Zwischenspeicherung von KI-Modellen im Browser ist für die von Ihnen ausdrücklich gewünschte Funktion
            unbedingt erforderlich (§ 25 Abs. 2 Nr. 2 TDDDG, § 165 Abs. 3 TKG 2021); eine gesonderte Einwilligung ist dafür nicht notwendig.
          </p>

          <h2>6. Ihre Rechte</h2>
          <p>Sie haben im Rahmen der gesetzlichen Bestimmungen folgende Rechte bezüglich Ihrer personenbezogenen Daten:</p>
          <ul>
            <li>Auskunft (Art. 15 DSGVO, Art. 25 revDSG)</li>
            <li>Berichtigung (Art. 16 DSGVO, Art. 32 revDSG)</li>
            <li>Löschung (Art. 17 DSGVO) und Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
            <li>Widerspruch gegen die Verarbeitung (Art. 21 DSGVO)</li>
            <li>Datenübertragbarkeit (Art. 20 DSGVO, Art. 28 revDSG)</li>
          </ul>
          <p>Sie können sich außerdem bei einer Datenschutz-Aufsichtsbehörde beschweren, zum Beispiel:</p>
          <ul>
            <li>Deutschland: die Datenschutzbehörde Ihres Bundeslandes</li>
            <li>Österreich: Österreichische Datenschutzbehörde (DSB), Barichgasse 40–42, 1030 Wien</li>
            <li>Schweiz: Eidgenössischer Datenschutz- und Öffentlichkeitsbeauftragter (EDÖB), Feldeggweg 1, 3003 Bern</li>
          </ul>

          <h2>7. Datensicherheit</h2>
          <p>
            Diese Website wird ausschließlich verschlüsselt über HTTPS (TLS) ausgeliefert. Eine verschlüsselte Verbindung erkennen Sie an
            „https://“ in der Adresszeile und am Schloss-Symbol Ihres Browsers.
          </p>

          <p className="text-sm text-zinc-600">Stand: November 2026</p>
        </div>
      </div>
    </main>
  );
}
