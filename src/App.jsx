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
  tricycle: { label: "Tricycle",     efficiency: 35, defaultFare: 13,  defaultTrips: 80, defaultDistance: 1.5 },
  jeepney:  { label: "Jeepney",      efficiency: 8,  defaultFare: 14,  defaultTrips: 20, defaultDistance: 15  },
  grab:     { label: "Grab / Angkas", efficiency: 20, defaultFare: 120, defaultTrips: 15, defaultDistance: 8   },
}
const PRICE_2021 = 47.2
const MIN_WAGE   = 645

// --- FAQ DATA ---
const FAQS = [
  {
    q: "What is fuel efficiency (km/L)?",
    a: "Fuel efficiency is how many kilometers your vehicle can travel using just one liter of gasoline. A typical tricycle travels about 35 km per liter. A jeepney, being bigger and heavier, only travels about 8 km per liter. The higher the number, the less you spend on fuel."
  },
  {
    q: "Where do I find today's gas price?",
    a: "You can check the price posted at any gas station near you — Petron, Shell, Caltex, or your local independent station. The DOE (Department of Energy) also publishes weekly price updates at doe.gov.ph. The app uses ₱75.40/L as a default based on 2025 DOE data, but you should update it to today's actual pump price for the most accurate result."
  },
  {
    q: "Why does the app compare to 2021?",
    a: "2021 is used as the baseline because it was the last 'normal' year before the global oil price crisis caused by the Russia-Ukraine conflict in early 2022. In January 2021, Ron 91 gasoline averaged ₱47.20/L in the Philippines. Comparing then vs. now shows exactly how much the oil price increase has taken from drivers — even when they're doing the exact same work."
  },
  {
    q: "What is the Survival Fare?",
    a: "The Survival Fare is the minimum fare per trip you would need to charge just to earn the Central Luzon minimum wage of ₱645/day — after paying for fuel. If your current fare is lower than the survival fare, you are earning below minimum wage for your hours of work."
  },
  {
    q: "How do I know how many km per trip I travel?",
    a: "You can estimate this based on your usual route. A typical short tricycle route in a town center is about 1–2 km. A longer inter-barangay route might be 3–5 km. If you're unsure, use Google Maps to check the distance of your most common route, then enter that number. Even a rough estimate gives you a useful result."
  },
  {
    q: "How is the Daily Take-Home calculated?",
    a: "It's simple subtraction: Gross Earnings (trips × fare) minus Fuel Cost (total km ÷ efficiency × gas price). What's left is your take-home. The app does this automatically — you just enter your numbers."
  },
  {
    q: "Can I use this if I drive a different vehicle?",
    a: "Yes! Choose the closest vehicle type and then manually adjust the fuel efficiency to match your actual vehicle. For example, if you drive a modern e-jeep, you might set efficiency much higher since it runs on electricity, not gasoline."
  },
]

// --- TOOLTIP CONTENT ---
const TOOLTIPS = {
  trips:      "How many individual trips (biyahe) do you complete in one full day of work?",
  fare:       "How much do you charge per trip in pesos (₱)? Use your current LGU-approved or actual fare.",
  distance:   "The average distance in kilometers of one trip. A short town route is about 1.5 km. A longer route might be 3–5 km.",
  efficiency: "How many km can your vehicle travel on 1 liter of fuel? Tricycle ≈ 35, Jeepney ≈ 8, Motorcycle ≈ 20.",
  gasPrice:   "Today's pump price per liter of Ron 91 gasoline. Check the posted price at your nearest gas station.",
}

// --- AI NARRATIVE GENERATOR ---
function generateNarrative({ gross, fuelCost, takeHome, takeHome2021, dailyLoss, survivalFare, fare, hourlyWage, vehicle, fuelPercent }) {
  const vehicleLabel = VEHICLE_PRESETS[vehicle]?.label ?? "vehicle"
  const monthlyLoss  = Math.round(dailyLoss * 22)
  const yearlyLoss   = Math.round(dailyLoss * 264)
  const isAboveWage  = takeHome >= MIN_WAGE
  const gapPerTrip   = (survivalFare - fare).toFixed(2)

  let opening = ""
  if (fuelPercent >= 50) {
    opening = `More than half of everything you collected today went straight to the gas station — not to your family, not to your savings, but to fuel.`
  } else if (fuelPercent >= 35) {
    opening = `Over a third of your gross earnings today was consumed by fuel costs before you even got home.`
  } else {
    opening = `Your fuel costs are taking a significant portion of your daily earnings — money that could have stayed in your pocket.`
  }

  let comparison = ""
  if (dailyLoss > 0) {
    comparison = ` In 2021, the same ${vehicleLabel} doing the same trips would have taken home ₱${Math.round(takeHome2021).toLocaleString()} — that's ₱${Math.round(dailyLoss).toLocaleString()} more per day than you're earning now. Over a month, that gap adds up to ₱${monthlyLoss.toLocaleString()}. Over a year, ₱${yearlyLoss.toLocaleString()} — simply because of rising gasoline prices, not because you worked less.`
  }

  let wageComment = ""
  if (!isAboveWage) {
    wageComment = ` Your current take-home of ₱${Math.round(takeHome).toLocaleString()}/day is below the Central Luzon minimum wage of ₱${MIN_WAGE}/day. To reach minimum wage, you would need to charge ₱${survivalFare.toFixed(2)} per trip — ₱${gapPerTrip} more than your current fare of ₱${fare}.`
  } else {
    wageComment = ` Your current take-home of ₱${Math.round(takeHome).toLocaleString()}/day is above the Central Luzon minimum wage of ₱${MIN_WAGE}/day. You're surviving — but the gap between your 2021 and today's earnings shows how much ground has been quietly lost to fuel prices.`
  }

  let closing = ` At ₱${hourlyWage.toFixed(2)} per effective hour, every peso saved on fuel directly increases your take-home. Check the tips below for practical ways to reduce your fuel expenses.`

  return opening + comparison + wageComment + closing
}

// --- TOOLTIP COMPONENT ---
function Tooltip2({ text }) {
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
        aria-label="More info"
      >ⓘ</button>
      {show && (
        <div className="absolute z-50 bottom-6 left-0 w-56 bg-gray-800 text-white text-xs rounded-lg p-3 shadow-lg leading-relaxed">
          {text}
          <div className="absolute bottom-0 left-3 translate-y-full w-0 h-0" style={{ borderLeft: "5px solid transparent", borderRight: "5px solid transparent", borderTop: "5px solid #1f2937" }} />
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
        <div className="px-4 pb-4 text-sm text-gray-500 leading-relaxed">
          {a}
        </div>
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
  const [gasPrice,   setGasPrice]   = useState(75.4)

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
    labels: ["2021 (Pre-Crisis)", "Today"],
    datasets: [{
      label: "Daily Take-Home (₱)",
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

  // --- PRINT HANDLER ---
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
            { num: "60%",   label: "Gas price increase since 2021" },
            { num: "3.5M+", label: "Filipino transport workers affected" },
            { num: "₱25K",  label: "Average annual income lost to fuel" },
          ].map(({ num, label }) => (
            <div key={label} className="text-center">
              <div className="text-xl font-semibold" style={{ color: "#FFBD59" }}>{num}</div>
              <div className="text-xs mt-1 opacity-60 text-white leading-tight">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── HOW TO USE ── */}
      <div className="bg-white border-b border-gray-100 px-4 py-5">
        <div className="max-w-2xl mx-auto">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-4 text-center">How to use GasPera</p>
          <div className="grid grid-cols-3 gap-3">
            {[
              { step: "1", icon: "🚗", title: "Pick your vehicle", desc: "Choose tricycle, jeepney, or Grab — presets are loaded automatically" },
              { step: "2", icon: "📝", title: "Enter your numbers", desc: "Input your actual daily trips, fare, distance, and today's gas price" },
              { step: "3", icon: "📊", title: "See the truth", desc: "Your real take-home, how much gas took, and what you've lost since 2021" },
            ].map(({ step, icon, title, desc }) => (
              <div key={step} className="text-center">
                <div className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 text-xl" style={{ background: "#FFBD59" }}>
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
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">Vehicle Type</p>
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
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-4">Your Daily Numbers</p>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Trips per day",               value: trips,      set: setTrips,      tip: TOOLTIPS.trips      },
              { label: "Fare per trip (₱)",            value: fare,       set: setFare,       tip: TOOLTIPS.fare       },
              { label: "Avg. distance per trip (km)",  value: distance,   set: setDistance,   tip: TOOLTIPS.distance   },
              { label: "Fuel efficiency (km/L)",       value: efficiency, set: setEfficiency, tip: TOOLTIPS.efficiency },
            ].map(({ label, value, set, tip }) => (
              <div key={label}>
                <label className="text-xs text-gray-500 flex items-center mb-1">
                  {label}
                  <Tooltip2 text={tip} />
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
                Today's gas price (₱/L)
                <Tooltip2 text={TOOLTIPS.gasPrice} />
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
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-4">Daily Breakdown</p>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <div className="text-xs text-gray-400 mb-1">Gross</div>
              <div className="text-lg font-medium text-gray-800">₱{Math.round(gross).toLocaleString()}</div>
            </div>
            <div className="bg-red-50 rounded-lg p-3 text-center">
              <div className="text-xs text-gray-400 mb-1">Fuel Cost</div>
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
              <span>Fuel ({fuelPercent}%)</span>
              <span>Take-home ({100 - fuelPercent}%)</span>
            </div>
            <div className="h-4 bg-gray-100 rounded-full overflow-hidden flex">
              <div className="bg-red-500 h-full transition-all duration-500" style={{ width: `${fuelPercent}%` }} />
              <div className="bg-green-500 h-full transition-all duration-500" style={{ width: `${100 - fuelPercent}%` }} />
            </div>
          </div>

          <div className="text-xs text-gray-400 text-center">
            Effective hourly rate: <span className="font-medium text-gray-600">₱{hourlyWage.toFixed(2)}/hr</span> (8-hour day)
          </div>
        </div>

        {/* ── MONTHLY & YEARLY LOSS ── */}
        {dailyLoss > 0 && (
          <div className="rounded-xl border overflow-hidden" style={{ borderColor: "#FFBD59" }}>
            <div className="px-4 py-2 text-xs font-medium" style={{ background: "#FFBD59", color: "#243144" }}>
              Income Lost to Fuel Price Increases
            </div>
            <div className="bg-white p-5">
              <div className="grid grid-cols-3 gap-3">
                {[
                  { period: "Per Day",    amount: Math.round(dailyLoss)   },
                  { period: "Per Month",  amount: monthlyLoss              },
                  { period: "Per Year",   amount: yearlyLoss               },
                ].map(({ period, amount }) => (
                  <div key={period} className="text-center">
                    <div className="text-xs text-gray-400 mb-1">{period}</div>
                    <div className="text-lg font-semibold text-red-500">₱{amount.toLocaleString()}</div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-400 text-center mt-3 leading-relaxed">
                This is how much less you earn compared to 2021 — doing the exact same work, the same number of trips, the same routes.
              </p>
            </div>
          </div>
        )}

        {/* ── THEN VS NOW ── */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">Then vs. Now</p>
          <p className="text-xs text-gray-400 mb-4">Same trips, same fare — different gas prices</p>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="rounded-lg p-3 text-center" style={{ background: "#FFFBEB", border: "1px solid #FFBD59" }}>
              <div className="text-xs text-gray-400 mb-1">2021 Take-Home</div>
              <div className="text-xl font-medium" style={{ color: "#243144" }}>₱{Math.round(takeHome2021).toLocaleString()}</div>
              <div className="text-xs text-gray-400 mt-1">Gas: ₱{PRICE_2021}/L</div>
            </div>
            <div className="bg-red-50 rounded-lg p-3 text-center border border-red-100">
              <div className="text-xs text-gray-400 mb-1">Today's Take-Home</div>
              <div className="text-xl font-medium text-red-500">₱{Math.round(takeHome).toLocaleString()}</div>
              <div className="text-xs text-gray-400 mt-1">Gas: ₱{gasPrice}/L</div>
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
                ₱{monthlyLoss.toLocaleString()}/month · ₱{yearlyLoss.toLocaleString()}/year
              </p>
            </div>
          )}
        </div>

        {/* ── SURVIVAL FARE ── */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">Survival Fare</p>
          <p className="text-xs text-gray-400 mb-4">
            Minimum fare needed to reach Central Luzon minimum wage (₱{MIN_WAGE}/day)
          </p>
          <div className="rounded-xl p-4 flex items-center justify-between" style={{ background: "#243144" }}>
            <div>
              <div className="text-white text-xs opacity-50 mb-1">You need to charge</div>
              <div className="text-4xl font-semibold" style={{ color: "#FFBD59" }}>₱{survivalFare.toFixed(2)}</div>
              <div className="text-white text-xs opacity-50">per trip</div>
            </div>
            <div className="text-right">
              <div className="text-white text-xs opacity-50 mb-1">Your current fare</div>
              <div className="text-3xl font-medium text-white">₱{fare}</div>
              <div className={`text-xs mt-1 font-medium ${survivalFare <= fare ? "text-green-400" : "text-red-400"}`}>
                {survivalFare <= fare
                  ? "✓ Above minimum wage"
                  : `Gap: ₱${(survivalFare - fare).toFixed(2)}/trip`}
              </div>
            </div>
          </div>
        </div>

        {/* ── CHART ── */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-4">Take-Home Comparison</p>
          <Bar data={comparisonData} options={chartOptions} />
        </div>

        {/* ── AI NARRATIVE ── */}
        <div className="rounded-xl border border-blue-100 overflow-hidden">
          <div className="px-4 py-2 bg-blue-50 flex items-center gap-2">
            <span className="text-base">🤖</span>
            <span className="text-xs font-medium text-blue-600 uppercase tracking-wide">GasPera Analysis</span>
          </div>
          <div className="bg-white p-5">
            <p className="text-sm text-gray-600 leading-relaxed">{narrative}</p>
          </div>
        </div>

        {/* ── WHAT CAN I DO ABOUT IT ── */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-4">What Can I Do About It?</p>
          <div className="space-y-3">
            {[
              {
                icon: "💳",
                title: "Apply for a fuel discount card",
                desc: "Petron Value Card and Shell Go+ give regular discounts per liter. Even ₱2–₱3 off per liter adds up significantly over a month of daily fill-ups."
              },
              {
                icon: "🏛️",
                title: "File for a fare adjustment through your cooperative",
                desc: "The LTFRB (Land Transportation Franchising and Regulatory Board) and your LGU accept fare adjustment petitions. Coordinate with your drivers' cooperative or transport group to file collectively."
              },
              {
                icon: "🔧",
                title: "Have your engine tuned regularly",
                desc: "A well-maintained engine burns less fuel. A dirty air filter alone can reduce fuel efficiency by 10–15%. Regular tune-ups can meaningfully lower your daily fuel cost."
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
            🖨️ Print / Save My Results
          </button>
        </div>
        <p className="text-xs text-gray-400 text-center -mt-3">
          Use this to show your cooperative or LGU when requesting a fare adjustment
        </p>

        {/* ── FAQ / HELP CENTER ── */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Help Center — Frequently Asked Questions</p>
          </div>
          {FAQS.map((faq) => (
            <FaqItem key={faq.q} q={faq.q} a={faq.a} />
          ))}
        </div>

        {/* ── FOOTER ── */}
        <div className="text-center text-xs text-gray-400 pb-6 space-y-1">
          <p>GasPera · BulSU CompSciety Data & AI in Finance Challenge 2026</p>
          <p>Fuel data: DOE weekly oil price monitoring · Wage data: DOLE Central Luzon</p>
        </div>

      </div>
    </div>
  )
}
