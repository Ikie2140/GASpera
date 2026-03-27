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

const VEHICLE_PRESETS = {
  tricycle: { label: "Tricycle", efficiency: 35, defaultFare: 13, defaultTrips: 80, defaultDistance: 1.5 },
  jeepney:  { label: "Jeepney", efficiency: 8,  defaultFare: 14, defaultTrips: 20, defaultDistance: 15  },
  grab:     { label: "Grab / Angkas", efficiency: 20, defaultFare: 120, defaultTrips: 15, defaultDistance: 8 },
}

const PRICE_2021 = 47.2
const MIN_WAGE = 645

export default function App() {
  const [vehicle, setVehicle]     = useState("tricycle")
  const [trips, setTrips]         = useState(80)
  const [fare, setFare]           = useState(13)
  const [distance, setDistance]   = useState(1.5)
  const [efficiency, setEfficiency] = useState(35)
  const [gasPrice, setGasPrice]   = useState(75.4)

  const handleVehicleChange = (v) => {
    setVehicle(v)
    const p = VEHICLE_PRESETS[v]
    setEfficiency(p.efficiency)
    setFare(p.defaultFare)
    setTrips(p.defaultTrips)
    setDistance(p.defaultDistance)
  }

  const totalKm     = trips * distance
  const litersUsed  = totalKm / efficiency
  const fuelCost    = litersUsed * gasPrice
  const gross       = trips * fare
  const takeHome    = gross - fuelCost
  const hourlyWage  = takeHome / 8
  const fuelPercent = Math.min(100, Math.round((fuelCost / gross) * 100))

  const fuelCost2021  = litersUsed * PRICE_2021
  const takeHome2021  = gross - fuelCost2021
  const dailyLoss     = takeHome2021 - takeHome
  const survivalFare  = (MIN_WAGE + fuelCost) / trips

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

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="px-6 py-5 text-white" style={{ background: "#243144" }}>
        <h1 className="text-2xl font-semibold">⛽ GasPera</h1>
        <p className="text-sm mt-1 opacity-70">Alamin kung saan napupunta ang pera mo</p>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">

        {/* Vehicle Selector */}
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

        {/* Inputs */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-4">Your Daily Numbers</p>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Trips per day", value: trips, set: setTrips },
              { label: "Fare per trip (₱)", value: fare, set: setFare },
              { label: "Avg. distance per trip (km)", value: distance, set: setDistance },
              { label: "Fuel efficiency (km/L)", value: efficiency, set: setEfficiency },
            ].map(({ label, value, set }) => (
              <div key={label}>
                <label className="text-xs text-gray-500 block mb-1">{label}</label>
                <input
                  type="number"
                  value={value}
                  onChange={(e) => set(Number(e.target.value))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-yellow-400"
                />
              </div>
            ))}
            <div className="col-span-2">
              <label className="text-xs text-gray-500 block mb-1">Today's gas price (₱/L)</label>
              <input
                type="number"
                value={gasPrice}
                onChange={(e) => setGasPrice(Number(e.target.value))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-yellow-400"
              />
            </div>
          </div>
        </div>

        {/* Results */}
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

        {/* 2021 vs Today */}
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
                <span className="font-semibold text-yellow-400">
                  ₱{Math.round(dailyLoss).toLocaleString()}/araw
                </span>{" "}
                dahil sa presyo ng gasolina.
              </p>
              <p className="text-white text-xs opacity-50 mt-1">
                ₱{Math.round(dailyLoss * 22).toLocaleString()}/month · ₱{Math.round(dailyLoss * 264).toLocaleString()}/year
              </p>
            </div>
          )}
        </div>

        {/* Survival Fare */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">Survival Fare</p>
          <p className="text-xs text-gray-400 mb-4">
            Minimum fare needed to reach Central Luzon minimum wage (₱{MIN_WAGE}/day)
          </p>
          <div className="rounded-xl p-4 flex items-center justify-between" style={{ background: "#243144" }}>
            <div>
              <div className="text-white text-xs opacity-50 mb-1">You need to charge</div>
              <div className="text-4xl font-semibold text-yellow-400">₱{survivalFare.toFixed(2)}</div>
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

        {/* Chart */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-4">Take-Home Comparison</p>
          <Bar data={comparisonData} options={chartOptions} />
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-gray-400 pb-6 space-y-1">
          <p>GasPera · BulSU CompSciety Data & AI in Finance Challenge 2026</p>
          <p>Fuel data: DOE weekly oil price monitoring · Wage data: DOLE Central Luzon</p>
        </div>

      </div>
    </div>
  )
}