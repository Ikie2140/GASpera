import { useState } from "react"
import { Bar } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from "chart.js"

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

// --- CONSTANTS ---
const VEHICLE_PRESETS = {
  tricycle: { label: "Tricycle",      efficiency: 35, defaultFare: 13,  defaultTrips: 80, defaultDistance: 1.5 },
  jeepney:  { label: "Jeepney",       efficiency: 8,  defaultFare: 14,  defaultTrips: 20, defaultDistance: 15  },
  grab:     { label: "Grab / Angkas", efficiency: 20, defaultFare: 120, defaultTrips: 15, defaultDistance: 8   },
}
const PRICE_2021 = 49.00
const MIN_WAGE   = 645

// --- APA REFERENCES ---
const REFERENCES = [
  {
    citation: "GMA News Online. (2026, March 9). Double-digit pump price hike set Tuesday, March 10, 2026. GMA News Online.",
    url: "https://www.gmanetwork.com/news/money/companies/979276/oil-price-hike-march-10-2026/story/"
  },
  {
    citation: "Manila Bulletin. (2026, March 7). Ultra oil price hike coming: Diesel up ₱19.62, gasoline up ₱10.43. Manila Bulletin.",
    url: "https://mb.com.ph/2026/03/07/ultra-fuel-price-hike-coming-diesel-up-1962-gasoline-up-1043"
  },
  {
    citation: "Philippine News Agency. (2026, March 16). Fuel prices up by as much as ₱23.90 per liter this week. Philippine News Agency.",
    url: "https://www.pna.gov.ph/articles/1271157"
  },
  {
    citation: "Philippine Information Agency. (2026). DOE sets new fuel price caps through March 9. Philippine Information Agency.",
    url: "https://pia.gov.ph/news/doe-sets-new-fuel-price-caps-through-march-9/"
  },
  {
    citation: "Philstar. (2026, March 24). Double-digit hikes: Pump prices soar past ₱100 per liter. Philstar.com.",
    url: "https://www.philstar.com/business/2026/03/24/2516484/double-digit-hikes-pump-prices-soar-past-p100-liter"
  },
  {
    citation: "Top Gear Philippines. (2026, March 24). PH fuel prices: March 24 to 30, 2026. Top Gear Philippines.",
    url: "https://www.topgear.com.ph/news/industry-news/ph-fuel-prices-march-24-30-2026-a2619-20260324"
  },
  {
    citation: "CEIC Data. (2026). Philippines retail price: Petroleum: NCR: Common price: Average: RON 91 [Data sourced from Department of Energy]. CEIC Data.",
    url: "https://www.ceicdata.com/en/philippines/retail-price-petroleum/retail-price-petroleum-ncr-common-price-average-ron-91"
  },
  {
    citation: "Rappler. (2026, March 24). DOE's Garin says PH has average 45 days of fuel supply, down by 10 days since war began. Rappler.",
    url: "https://www.rappler.com/business/philippines-average-fuel-supply-march-20-2026/"
  },
]

// --- FAQ DATA (Tagalog) ---
const FAQS = [
  {
    q: "Ano ang fuel efficiency (km/L)?",
    a: "Ang fuel efficiency ay kung gaano karaming kilometro ang kayang takasin ng iyong sasakyan gamit ang isang litro ng gasolina. Ang isang karaniwang tricycle ay nakakarating ng humigit-kumulang 35 km sa isang litro. Ang jeepney naman, dahil mas malaki at mas mabigat, ay mga 8 km lang sa isang litro. Habang mas mataas ang numero, mas kaunti ang nagagastos mo sa gasolina."
  },
  {
    q: "Saan ko mahahanap ang presyo ng gasolina ngayon?",
    a: "Maaari mong tingnan ang presyong naka-post sa pinakamalapit na gasolinahan sa iyo — Petron, Shell, Caltex, o anumang lokal na gasolinahan. Inilalabas din ng DOE (Department of Energy) ang lingguhang presyo sa doe.gov.ph. Ginagamit ng app ang ₱85.00/L bilang default base sa datos ng Marso 2026, ngunit dapat mo itong baguhin ayon sa aktwal na presyo sa pump ngayon para sa pinaka-tumpak na resulta."
  },
  {
    q: "Bakit ikinukumpara ng app ang presyo sa 2021?",
    a: "Ginagamit ang 2021 bilang basehan dahil ito ang huling 'normal' na taon bago sumabog ang pandaigdigang krisis sa presyo ng langis. Noong Enero 2021, ang RON 91 na gasolina ay ₱49.00/L sa Pilipinas. Ang pagkukumpara noon at ngayon ay nagpapakita kung magkano talaga ang kinuha ng pagtaas ng presyo ng langis mula sa mga drayber — kahit na magkapareho ang kanilang biyahe."
  },
  {
    q: "Ano ang Survival Fare?",
    a: "Ang Survival Fare ay ang pinakamababang bayad sa bawat biyahe na kailangan mong singlin para kumita ng hindi bababa sa minimum wage ng Central Luzon na ₱645 kada araw — pagkatapos mabayaran ang gasolina. Kung mas mababa ang iyong kasalukuyang pamasahe kaysa sa survival fare, ikaw ay kumikita ng mas mababa sa minimum wage para sa iyong oras ng trabaho."
  },
  {
    q: "Paano ko malalaman ang distansya ng bawat biyahe ko?",
    a: "Maaari kang mag-tantya base sa iyong karaniwang ruta. Ang isang karaniwang maikling ruta ng tricycle sa loob ng bayan ay mga 1–2 km. Ang mas mahabang ruta sa pagitan ng barangay ay maaaring 3–5 km. Kung hindi ka sigurado, gamitin ang Google Maps para suriin ang distansya ng iyong pinaka-karaniwang ruta, at ilagay ang numerong iyon. Kahit ang tinatayang distansya ay nagbibigay ng kapaki-pakinabang na resulta."
  },
  {
    q: "Paano kinukwenta ang Daily Take-Home?",
    a: "Simpleng pagbabawas lang ito: Gross Earnings (bilang ng biyahe × pamasahe) minus ang Fuel Cost (kabuuang km ÷ fuel efficiency × presyo ng gasolina). Ang natitira ay ang iyong take-home. Awtomatikong ginagawa ito ng app — kailangan mo lang ilagay ang iyong mga numero."
  },
  {
    q: "Maaari ko bang gamitin ito para sa ibang uri ng sasakyan?",
    a: "Oo! Piliin ang pinakamalapit na uri ng sasakyan at baguhin ang fuel efficiency para tumugma sa iyong aktwal na sasakyan. Halimbawa, kung nagmamaneho ka ng modernong e-jeep, maaari mong itakda ang mas mataas na fuel efficiency dahil ito ay gumagamit ng kuryente, hindi gasolina."
  },
]

// --- TOOLTIP CONTENT (Tagalog) ---
const TOOLTIPS = {
  trips:      "Ilang biyahe ang iyong natapos sa isang buong araw ng trabaho?",
  fare:       "Magkano ang iyong sinisingil sa bawat biyahe sa piso (₱)? Gamitin ang iyong kasalukuyang LGU-approved o aktwal na pamasahe.",
  distance:   "Ang average na distansya sa kilometro ng isang biyahe. Ang maikling ruta sa bayan ay mga 1.5 km. Ang mas mahabang ruta ay maaaring 3–5 km.",
  efficiency: "Ilang km ang kayang takasin ng iyong sasakyan gamit ang 1 litro ng gasolina? Tricycle ≈ 35, Jeepney ≈ 8, Motorsiklo ≈ 20.",
  gasPrice:   "Ang presyo ng RON 91 na gasolina ngayon kada litro. Tingnan ang presyong naka-post sa iyong pinakamalapit na gasolinahan.",
}

// --- AI NARRATIVE GENERATOR (Tagalog) ---
function generateNarrative({ gross, fuelCost, takeHome, takeHome2021, dailyLoss, survivalFare, fare, hourlyWage, vehicle, fuelPercent }) {
  const vehicleLabel = VEHICLE_PRESETS[vehicle]?.label ?? "sasakyan"
  const monthlyLoss  = Math.round(dailyLoss * 22)
  const yearlyLoss   = Math.round(dailyLoss * 264)
  const isAboveWage  = takeHome >= MIN_WAGE
  const gapPerTrip   = (survivalFare - fare).toFixed(2)

  let opening = ""
  if (fuelPercent >= 50) {
    opening = `Mahigit kalahati ng lahat ng iyong nakolekta ngayon ay napunta agad sa gasolinahan — hindi sa iyong pamilya, hindi sa iyong ipon, kundi sa gasolina.`
  } else if (fuelPercent >= 35) {
    opening = `Mahigit isang katlo ng iyong gross earnings ngayon ay kinain ng gastos sa gasolina bago ka pa man makauwi.`
  } else {
    opening = `Ang iyong gastos sa gasolina ay kumukuha ng malaking bahagi ng iyong pang-araw-araw na kita — pera na sana ay nanatili sa iyong bulsa.`
  }

  let comparison = ""
  if (dailyLoss > 0) {
    comparison = ` Noong 2021, ang parehong ${vehicleLabel} na may parehong bilang ng biyahe ay kumikita ng ₱${Math.round(takeHome2021).toLocaleString()} — iyon ay ₱${Math.round(dailyLoss).toLocaleString()} na mas marami kada araw kaysa sa kinikita mo ngayon. Sa isang buwan, ang agwat na iyon ay umabot sa ₱${monthlyLoss.toLocaleString()}. Sa isang taon, ₱${yearlyLoss.toLocaleString()} — dahil lang sa pagtaas ng presyo ng gasolina, hindi dahil nag-trabaho ka ng mas kaunti.`
  }

  let wageComment = ""
  if (!isAboveWage) {
    wageComment = ` Ang iyong kasalukuyang take-home na ₱${Math.round(takeHome).toLocaleString()}/araw ay mas mababa sa minimum wage ng Central Luzon na ₱${MIN_WAGE}/araw. Para maabot ang minimum wage, kailangan mong singilin ng ₱${survivalFare.toFixed(2)} kada biyahe — ₱${gapPerTrip} na mas mataas kaysa sa iyong kasalukuyang pamasahe na ₱${fare}.`
  } else {
    wageComment = ` Ang iyong kasalukuyang take-home na ₱${Math.round(takeHome).toLocaleString()}/araw ay nasa itaas ng minimum wage ng Central Luzon na ₱${MIN_WAGE}/araw. Nakakaraos ka — ngunit ang agwat sa pagitan ng iyong kita noong 2021 at ngayon ay nagpapakita kung gaano karaming lupa ang tahimik na nawala sa pagtaas ng presyo ng gasolina.`
  }

  let closing = ` Sa ₱${hourlyWage.toFixed(2)} kada epektibong oras, ang bawat pisong matitipid sa gasolina ay direktang nagdadagdag sa iyong take-home. Tingnan ang mga tips sa ibaba para sa mga praktikal na paraan ng pagbabawas ng gastos sa gasolina.`

  return opening + comparison + wageComment + closing
}

// --- TOOLTIP COMPONENT ---
function TooltipIcon({ text }) {
  const [show, setShow] = useState(false)
  return (
    <span className="relative inline-block ml-1">
      <button
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onFocus={() => setShow(true)}
        onBlur={() => setShow(false)}
        onClick={() => setShow(!show)}
        className="w-4 h-4 rounded-full text-xs flex items-center justify-center border border-gray-300 text-gray-400 hover:border-yellow-400 hover:text-yellow-500 transition-colors"
        style={{ fontSize: "10px", lineHeight: 1 }}
        aria-label="Karagdagang impormasyon"
      >ⓘ</button>
      {show && (
        <div className="absolute z-50 bottom-6 left-0 w-56 bg-gray-800 text-white text-xs rounded-lg p-3 shadow-lg leading-relaxed">
          {text}
          <div
            className="absolute bottom-0 left-3 translate-y-full w-0 h-0"
            style={{ borderLeft: "5px solid transparent", borderRight: "5px solid transparent", borderTop: "5px solid #1f2937" }}
          />
        </div>
      )}
    </span>
  )
}

// --- FAQ ITEM COMPONENT ---
function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-gray-100 last:border-none">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left py-3 px-4 flex justify-between items-center gap-3 hover:bg-gray-50 transition-colors"
      >
        <span className="text-sm text-gray-700 font-medium">{q}</span>
        <span className="text-gray-400 text-lg flex-shrink-0">{open ? "−" : "+"}</span>
      </button>
      {open && (
        <div className="px-4 pb-4 text-sm text-gray-500 leading-relaxed">{a}</div>
      )}
    </div>
  )
}

// --- MAIN APP ---
export default function App() {
  const [vehicle,    setVehicle]    = useState("tricycle")
  const [trips,      setTrips]      = useState(80)
  const [fare,       setFare]       = useState(13)
  const [distance,   setDistance]   = useState(1.5)
  const [efficiency, setEfficiency] = useState(35)
  const [gasPrice,   setGasPrice]   = useState(85.00)
  const [showRefs,   setShowRefs]   = useState(false)

  const handleVehicleChange = (v) => {
    setVehicle(v)
    const p = VEHICLE_PRESETS[v]
    setEfficiency(p.efficiency)
    setFare(p.defaultFare)
    setTrips(p.defaultTrips)
    setDistance(p.defaultDistance)
  }

  // --- CALCULATIONS ---
  const totalKm      = trips * distance
  const litersUsed   = totalKm / efficiency
  const fuelCost     = litersUsed * gasPrice
  const gross        = trips * fare
  const takeHome     = gross - fuelCost
  const hourlyWage   = takeHome / 8
  const fuelPercent  = Math.min(100, Math.round((fuelCost / gross) * 100))
  const fuelCost2021 = litersUsed * PRICE_2021
  const takeHome2021 = gross - fuelCost2021
  const dailyLoss    = takeHome2021 - takeHome
  const survivalFare = (MIN_WAGE + fuelCost) / trips
  const monthlyLoss  = Math.round(dailyLoss * 22)
  const yearlyLoss   = Math.round(dailyLoss * 264)

  const narrative = generateNarrative({
    gross, fuelCost, takeHome, takeHome2021, dailyLoss,
    survivalFare, fare, hourlyWage, vehicle, fuelPercent
  })

  // --- CHART ---
  const comparisonData = {
    labels: ["2021 (Bago ang Krisis)", "Ngayon (2026)"],
    datasets: [{
      label: "Araw-araw na Take-Home (₱)",
      data: [Math.round(takeHome2021), Math.round(takeHome)],
      backgroundColor: ["#FFBD59", "#ef4444"],
      borderRadius: 8,
    }],
  }
  const chartOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { callback: (v) => `₱${v}` },
      },
    },
  }

  const handlePrint = () => window.print()

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── HEADER ── */}
      <div className="px-6 py-5 text-white" style={{ background: "#243144" }}>
        <h1 className="text-2xl font-semibold">⛽ GasPera</h1>
        <p className="text-sm mt-1 opacity-70">Alamin kung saan napupunta ang pera mo</p>
      </div>

      {/* ── CONTEXT BANNER ── */}
      <div className="px-4 py-4" style={{ background: "#1a2535" }}>
        <div className="max-w-2xl mx-auto grid grid-cols-3 gap-3">
          {[
            { num: "73%",   label: "Pagtaas ng presyo ng gasolina mula 2021" },
            { num: "3.5M+", label: "Mga manggagawa sa transportasyon na apektado" },
            { num: "₱25K",  label: "Tinatayang taunang kita na nawala sa gasolina" },
          ].map(({ num, label }) => (
            <div key={label} className="text-center">
              <div className="text-xl font-semibold" style={{ color: "#FFBD59" }}>{num}</div>
              <div className="text-xs mt-1 opacity-60 text-white leading-tight">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── ABOUT / CONTEXT SECTION ── */}
      <div className="bg-white border-b border-gray-100 px-4 py-6">
        <div className="max-w-2xl mx-auto">

          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">
            Tungkol sa GasPera
          </p>

          {/* Purpose */}
          <div className="mb-4">
            <h2 className="text-base font-semibold text-gray-800 mb-2">Ano ang GasPera?</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              Ang GasPera ay isang libreng web app para sa mga Filipino na drayber tricycle operators,
              jeepney drivers, at Grab/Angkas riders. Tinutulungan nito ang mga drayber na makita kung
              magkano talaga ang kanilang naiuwi sa bahay pagkatapos bayaran ang gasolina at kung magkano
              ang nawala sa kanila dahil sa patuloy na pagtaas ng presyo ng langis mula pa noong 2021.
            </p>
          </div>

          {/* The Issue */}
          <div className="rounded-xl p-4 mb-4" style={{ background: "#FFF8EC", border: "1px solid #FFBD59" }}>
            <h3 className="text-sm font-semibold mb-2" style={{ color: "#243144" }}>
              Ang Problemang Tinutugunan
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed mb-2">
              Noong Enero 2021, ang RON 91 na gasolina sa Pilipinas ay nagkakahalaga ng humigit-kumulang
              <strong className="font-semibold"> ₱49.00 kada litro</strong>. Ngayong Marso 2026, ang parehong
              gasolina ay umabot na sa <strong className="font-semibold">₱75 hanggang ₱103 kada litro</strong> depende
              sa brand at lokasyon — isang pagtaas ng halos <strong className="font-semibold">73%</strong> sa loob
              lamang ng limang taon.
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">
              Samantala, ang mga LGU-approved na pamasahe ng tricycle ay tumaas lamang mula ₱10 hanggang
              ₱13–₱14 — isang pagtaas na 20–40% lamang. Ibig sabihin, ang mga drayber ay gumagawa ng
              parehong trabaho ngunit mas kaunti na ang naiuuwi sa kanilang pamilya — at karamisan sa kanila
              ay hindi nila alam kung magkano talaga ang nawala sa kanila.
            </p>
          </div>

          {/* Why is there a crisis */}
          <div className="rounded-xl p-4 mb-4 bg-red-50 border border-red-100">
            <h3 className="text-sm font-semibold text-red-700 mb-2">
              Bakit Tumataas ang Presyo ng Gasolina Ngayon?
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Ang kasalukuyang pagtaas ng presyo ng langis ay pangunahing dulot ng{" "}
              <strong className="font-semibold">patuloy na armed conflict sa Middle East noong 2026</strong> na
              nagdulot ng malaking abala sa pandaigdigang supply ng krudo. Dahil ang Pilipinas ay umaangkat
              ng halos lahat ng kanyang petrolyo, agad itong naapektuhan ng anumang pagbabago sa pandaigdigang
              presyo. Sa loob lamang ng Marso 2026, tatlong magkakasunod na price hike ang ipinatupad — ang
              ilan ay nagdulot ng pagtaas ng hanggang ₱16.60 kada litro sa iisang linggo. Ayon sa DOE, ang
              Pilipinas ay may natitirang average na <strong className="font-semibold">45 araw na suplay ng langis
              lamang</strong> — mas mababa kaysa sa 55–57 araw nang magsimula ang krisis.
            </p>
          </div>

          {/* Gas price timeline */}
          <div className="rounded-xl border border-gray-200 overflow-hidden mb-4">
            <div className="px-4 py-2 bg-gray-50 border-b border-gray-100">
              <p className="text-xs font-medium text-gray-500">
                Presyo ng RON 91 Gasoline — Kasaysayan
              </p>
            </div>
            <div className="divide-y divide-gray-100">
              {[
                { period: "Enero 2021",     price: "₱49.00/L",        note: "Basehan (bago ang krisis)"                },
                { period: "Hunyo 2022",     price: "₱82.00/L",        note: "Pinakamataas sa kasaysayan noon"           },
                { period: "Simula 2025",    price: "₱55–₱65/L",       note: "Bahagyang bumaba pagkatapos ng 2022 peak"  },
                { period: "Marso 5, 2026",  price: "₱49–₱65/L",       note: "Bago ang sunud-sunod na price hikes"      },
                { period: "Marso 10, 2026", price: "+₱7–₱13/L",       note: "Unang malaking hike ng Marso 2026"        },
                { period: "Marso 17, 2026", price: "+₱12.90–₱16.60/L",note: "Ikalawang malaking hike"                 },
                { period: "Marso 24, 2026", price: "+₱8–₱12/L",       note: "Ilang brand ay umabot na sa ₱100+/L"     },
              ].map(({ period, price, note }) => (
                <div key={period} className="px-4 py-3 flex justify-between items-center gap-3">
                  <div>
                    <div className="text-xs font-medium text-gray-700">{period}</div>
                    <div className="text-xs text-gray-400">{note}</div>
                  </div>
                  <div className="text-sm font-semibold text-right flex-shrink-0" style={{ color: "#243144" }}>
                    {price}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* References toggle */}
          <button
            onClick={() => setShowRefs(!showRefs)}
            className="w-full text-left flex justify-between items-center py-2 px-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <span className="text-xs font-medium text-gray-500">📚 Mga Sanggunian (APA Format)</span>
            <span className="text-gray-400">{showRefs ? "−" : "+"}</span>
          </button>

          {showRefs && (
            <div className="mt-3 space-y-3">
              {REFERENCES.map((ref, i) => (
                <div key={i} className="text-xs text-gray-500 leading-relaxed pl-4 border-l-2 border-gray-200">
                  <p className="mb-1">{ref.citation}</p>
                  <a
                    href={ref.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="break-all text-blue-500 hover:underline"
                  >
                    {ref.url}
                  </a>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>

      {/* ── HOW TO USE ── */}
      <div className="bg-white border-b border-gray-100 px-4 py-5">
        <div className="max-w-2xl mx-auto">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-4 text-center">
            Paano Gamitin ang GasPera
          </p>
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: "🚗", title: "Piliin ang sasakyan",            desc: "Pumili ng tricycle, jeepney, o Grab — awtomatikong maglo-load ang mga preset" },
              { icon: "📝", title: "Ilagay ang iyong mga numero",    desc: "Ilagay ang iyong aktwal na araw-araw na biyahe, pamasahe, distansya, at presyo ng gasolina ngayon" },
              { icon: "📊", title: "Makita ang katotohanan",         desc: "Ang iyong tunay na take-home, kung magkano ang kinuha ng gasolina, at kung magkano ang nawala mula 2021" },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="text-center">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 text-xl"
                  style={{ background: "#FFBD59" }}
                >
                  {icon}
                </div>
                <div className="text-xs font-medium text-gray-700 mb-1">{title}</div>
                <div className="text-xs text-gray-400 leading-relaxed">{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">

        {/* ── VEHICLE SELECTOR ── */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">Uri ng Sasakyan</p>
          <div className="grid grid-cols-3 gap-2">
            {Object.entries(VEHICLE_PRESETS).map(([key, val]) => (
              <button
                key={key}
                onClick={() => handleVehicleChange(key)}
                className={`py-2 px-3 rounded-lg border text-sm font-medium transition-all ${
                  vehicle === key
                    ? "border-yellow-400 bg-yellow-50 text-yellow-700"
                    : "border-gray-200 text-gray-500 hover:border-gray-300"
                }`}
              >
                {val.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── INPUTS ── */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-4">
            Ang Iyong Araw-araw na mga Numero
          </p>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Bilang ng biyahe sa isang araw",         value: trips,      set: setTrips,      tip: TOOLTIPS.trips      },
              { label: "Pamasahe bawat biyahe (₱)",              value: fare,       set: setFare,       tip: TOOLTIPS.fare       },
              { label: "Average na distansya bawat biyahe (km)", value: distance,   set: setDistance,   tip: TOOLTIPS.distance   },
              { label: "Fuel efficiency (km/L)",                  value: efficiency, set: setEfficiency, tip: TOOLTIPS.efficiency },
            ].map(({ label, value, set, tip }) => (
              <div key={label}>
                <label className="text-xs text-gray-500 flex items-center mb-1">
                  {label}
                  <TooltipIcon text={tip} />
                </label>
                <input
                  type="number"
                  value={value}
                  onChange={(e) => set(Number(e.target.value))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-yellow-400"
                />
              </div>
            ))}
            <div className="col-span-2">
              <label className="text-xs text-gray-500 flex items-center mb-1">
                Presyo ng gasolina ngayon (₱/L)
                <TooltipIcon text={TOOLTIPS.gasPrice} />
              </label>
              <input
                type="number"
                value={gasPrice}
                onChange={(e) => setGasPrice(Number(e.target.value))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-yellow-400"
              />
            </div>
          </div>
        </div>

        {/* ── DAILY BREAKDOWN ── */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-4">
            Araw-araw na Breakdown
          </p>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <div className="text-xs text-gray-400 mb-1">Gross</div>
              <div className="text-lg font-medium text-gray-800">₱{Math.round(gross).toLocaleString()}</div>
            </div>
            <div className="bg-red-50 rounded-lg p-3 text-center">
              <div className="text-xs text-gray-400 mb-1">Gastos sa Gasolina</div>
              <div className="text-lg font-medium text-red-500">₱{Math.round(fuelCost).toLocaleString()}</div>
            </div>
            <div className={`rounded-lg p-3 text-center ${takeHome >= MIN_WAGE ? "bg-green-50" : "bg-orange-50"}`}>
              <div className="text-xs text-gray-400 mb-1">Take-Home</div>
              <div className={`text-lg font-medium ${takeHome >= MIN_WAGE ? "text-green-600" : "text-orange-500"}`}>
                ₱{Math.round(takeHome).toLocaleString()}
              </div>
            </div>
          </div>

          {/* Fuel bar */}
          <div className="mb-3">
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>Gasolina ({fuelPercent}%)</span>
              <span>Take-home ({100 - fuelPercent}%)</span>
            </div>
            <div className="h-4 bg-gray-100 rounded-full overflow-hidden flex">
              <div className="bg-red-500 h-full transition-all duration-500" style={{ width: `${fuelPercent}%` }} />
              <div className="bg-green-500 h-full transition-all duration-500" style={{ width: `${100 - fuelPercent}%` }} />
            </div>
          </div>

          <div className="text-xs text-gray-400 text-center">
            Epektibong sahod bawat oras:{" "}
            <span className="font-medium text-gray-600">₱{hourlyWage.toFixed(2)}/oras</span>{" "}
            (8-oras na araw ng trabaho)
          </div>
        </div>

        {/* ── MONTHLY & YEARLY LOSS ── */}
        {dailyLoss > 0 && (
          <div className="rounded-xl border overflow-hidden" style={{ borderColor: "#FFBD59" }}>
            <div className="px-4 py-2 text-xs font-medium" style={{ background: "#FFBD59", color: "#243144" }}>
              Kita na Nawala Dahil sa Pagtaas ng Presyo ng Gasolina
            </div>
            <div className="bg-white p-5">
              <div className="grid grid-cols-3 gap-3">
                {[
                  { period: "Bawat Araw",  amount: Math.round(dailyLoss) },
                  { period: "Bawat Buwan", amount: monthlyLoss            },
                  { period: "Bawat Taon",  amount: yearlyLoss             },
                ].map(({ period, amount }) => (
                  <div key={period} className="text-center">
                    <div className="text-xs text-gray-400 mb-1">{period}</div>
                    <div className="text-lg font-semibold text-red-500">₱{amount.toLocaleString()}</div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-400 text-center mt-3 leading-relaxed">
                Ito ang halaga ng mas mababa mong kinita kumpara sa 2021 — na may parehong trabaho,
                parehong bilang ng biyahe, at parehong ruta.
              </p>
            </div>
          </div>
        )}

        {/* ── THEN VS NOW ── */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">
            Noon Kumpara sa Ngayon
          </p>
          <p className="text-xs text-gray-400 mb-4">
            Parehong biyahe, parehong pamasahe — magkaibang presyo ng gasolina
          </p>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="rounded-lg p-3 text-center" style={{ background: "#FFFBEB", border: "1px solid #FFBD59" }}>
              <div className="text-xs text-gray-400 mb-1">Take-Home noong 2021</div>
              <div className="text-xl font-medium" style={{ color: "#243144" }}>₱{Math.round(takeHome2021).toLocaleString()}</div>
              <div className="text-xs text-gray-400 mt-1">Gasolina: ₱{PRICE_2021}/L</div>
            </div>
            <div className="bg-red-50 rounded-lg p-3 text-center border border-red-100">
              <div className="text-xs text-gray-400 mb-1">Take-Home Ngayon</div>
              <div className="text-xl font-medium text-red-500">₱{Math.round(takeHome).toLocaleString()}</div>
              <div className="text-xs text-gray-400 mt-1">Gasolina: ₱{gasPrice}/L</div>
            </div>
          </div>
          {dailyLoss > 0 && (
            <div className="rounded-lg p-4 text-center" style={{ background: "#243144" }}>
              <p className="text-white text-sm">
                Nawalan ka ng{" "}
                <span className="font-semibold" style={{ color: "#FFBD59" }}>
                  ₱{Math.round(dailyLoss).toLocaleString()}/araw
                </span>{" "}
                dahil sa presyo ng gasolina.
              </p>
              <p className="text-white text-xs opacity-50 mt-1">
                ₱{monthlyLoss.toLocaleString()}/buwan · ₱{yearlyLoss.toLocaleString()}/taon
              </p>
            </div>
          )}
        </div>

        {/* ── SURVIVAL FARE ── */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">Survival Fare</p>
          <p className="text-xs text-gray-400 mb-4">
            Pinakamababang pamasahe na kailangan para maabot ang minimum wage ng Central Luzon (₱{MIN_WAGE}/araw)
          </p>
          <div className="rounded-xl p-4 flex items-center justify-between" style={{ background: "#243144" }}>
            <div>
              <div className="text-white text-xs opacity-50 mb-1">Kailangan mong singilin ng</div>
              <div className="text-4xl font-semibold" style={{ color: "#FFBD59" }}>₱{survivalFare.toFixed(2)}</div>
              <div className="text-white text-xs opacity-50">bawat biyahe</div>
            </div>
            <div className="text-right">
              <div className="text-white text-xs opacity-50 mb-1">Kasalukuyang pamasahe mo</div>
              <div className="text-3xl font-medium text-white">₱{fare}</div>
              <div className={`text-xs mt-1 font-medium ${survivalFare <= fare ? "text-green-400" : "text-red-400"}`}>
                {survivalFare <= fare
                  ? "✓ Nasa itaas ng minimum wage"
                  : `Agwat: ₱${(survivalFare - fare).toFixed(2)}/biyahe`}
              </div>
            </div>
          </div>
        </div>

        {/* ── CHART ── */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-4">
            Paghahambing ng Take-Home
          </p>
          <Bar data={comparisonData} options={chartOptions} />
        </div>

        {/* ── AI NARRATIVE ── */}
        <div className="rounded-xl border border-blue-100 overflow-hidden">
          <div className="px-4 py-2 bg-blue-50 flex items-center gap-2">
            <span className="text-base">🤖</span>
            <span className="text-xs font-medium text-blue-600 uppercase tracking-wide">
              Pagsusuri ng GasPera
            </span>
          </div>
          <div className="bg-white p-5">
            <p className="text-sm text-gray-600 leading-relaxed">{narrative}</p>
          </div>
        </div>

        {/* ── WHAT CAN I DO ── */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-4">
            Ano ang Maaari Kong Gawin?
          </p>
          <div className="space-y-3">
            {[
              {
                icon: "💳",
                title: "Mag-apply ng fuel discount card",
                desc: "Ang Petron Value Card at Shell Go+ ay nagbibigay ng regular na diskwento bawat litro. Kahit ₱2–₱3 na diskwento bawat litro ay malaki ang epekto sa isang buwan ng araw-araw na pagpupunan."
              },
              {
                icon: "🏛️",
                title: "Mag-file ng fare adjustment sa pamamagitan ng iyong kooperatiba",
                desc: "Ang LTFRB (Land Transportation Franchising and Regulatory Board) at ang iyong LGU ay tumatanggap ng petisyon para sa pagsasaayos ng pamasahe. Makipagtulungan sa iyong kooperatiba ng mga drayber o transport group para mag-file nang sama-sama."
              },
              {
                icon: "🔧",
                title: "Ipagawa ang iyong makina nang regular",
                desc: "Ang maayos na makina ay gumagamit ng mas kaunting gasolina. Ang isang marumihang air filter lamang ay maaaring magpababa ng fuel efficiency ng 10–15%. Ang regular na tune-up ay maaaring makabuluhang magpababa ng iyong araw-araw na gastos sa gasolina."
              },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                <span className="text-xl flex-shrink-0">{icon}</span>
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-1">{title}</div>
                  <div className="text-xs text-gray-500 leading-relaxed">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── PRINT BUTTON ── */}
        <div className="flex justify-center">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-6 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all"
          >
            🖨️ I-print / I-save ang Aking mga Resulta
          </button>
        </div>
        <p className="text-xs text-gray-400 text-center -mt-3">
          Gamitin ito para ipakita sa iyong kooperatiba o LGU kapag humihiling ng pagsasaayos ng pamasahe
        </p>

        {/* ── FAQ / HELP CENTER ── */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">
              Tulong — Mga Madalas na Tanong
            </p>
          </div>
          {FAQS.map((faq) => (
            <FaqItem key={faq.q} q={faq.q} a={faq.a} />
          ))}
        </div>


        {/* ── FOOTER ── */}
        <div className="text-center text-xs text-gray-400 pb-6 space-y-1">
          <p>GasPera · BulSU CompSciety Data & AI in Finance Challenge 2026</p>
          <p>Datos sa gasolina: DOE weekly oil price monitoring · Datos sa sahod: DOLE Central Luzon</p>
        </div>

      </div>
    </div>
  )
}
