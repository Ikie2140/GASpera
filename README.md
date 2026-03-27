# ⛽ GasPera

**Alamin kung saan napupunta ang pera mo.**
*Know where your money actually goes.*

---

## What is GasPera?

GasPera is a web app built for Filipino transport workers — tricycle operators, jeepney drivers, and Grab/Angkas riders. 

It answers one simple but powerful question:

> **"After buying gasoline today, how much money do I actually take home?"**

Most drivers know how much they *collect* in a day. But they rarely sit down to subtract exactly how much of that went straight to the gas station. GasPera does that math for them — instantly, visually, and in plain Filipino context.

It also answers a second question that nobody has ever made visible before:

> **"How much less am I earning today compared to 2021 — even though I'm doing the exact same number of trips?"**

The answer to that question is the heart of GasPera.

---

## The Problem It Solves

### Gasoline prices in the Philippines increased dramatically

In early 2021, gasoline (Ron 91) cost around **₱47 per liter**.  
By 2025, that same liter costs around **₱75**.  
That's an increase of **₱28 per liter — a 60% jump in 4 years.**

### But fares barely moved

Most LGU (Local Government Unit) approved tricycle fares went from **₱10 to ₱13 or ₱14** over the same period.  
That's only a **20–40% increase in income** — while fuel costs jumped 60%.

### The gap is invisible to most drivers

A tricycle driver doesn't think in "percentage increases." He thinks in:
- "Nagkano ang gasolina ngayon?" *(How much is gas today?)*
- "Magkano ang kinita ko?" *(How much did I earn?)*

But nobody adds it all up for him and says:
> *"Kuya, ₱514 out of your ₱1,040 today went to gasoline. You only took home ₱526."*

GasPera does exactly that.

---

## How the Math Works

Don't worry — there are no complicated formulas here. It's all basic arithmetic. Here's every calculation the app does, explained step by step.

---

### Step 1 — Gross Earnings

This is the total money collected before any expenses.

```
Gross = Number of Trips × Fare per Trip
```

**Example:**  
80 trips × ₱13 per trip = **₱1,040 gross**

---

### Step 2 — Total Distance Traveled

To know how much fuel was used, we first need to know how far the driver traveled in total.

```
Total Distance = Number of Trips × Average Distance per Trip (in km)
```

**Example:**  
80 trips × 1.5 km per trip = **120 km traveled**

---

### Step 3 — Liters of Fuel Used

Every vehicle has a fuel efficiency — how many kilometers it can travel per liter of fuel. A typical tricycle travels about **35 km per liter**.

```
Liters Used = Total Distance ÷ Fuel Efficiency (km per liter)
```

**Example:**  
120 km ÷ 35 km/L = **3.43 liters used**

---

### Step 4 — Fuel Cost in Pesos

Now we multiply liters used by today's pump price.

```
Fuel Cost = Liters Used × Gas Price per Liter
```

**Example:**  
3.43 liters × ₱75.40 per liter = **₱258.62 fuel cost**

> Note: The app uses ₱75.40 as the default gas price, based on DOE (Department of Energy) monitoring data. The driver can update this to whatever the pump shows today.

---

### Step 5 — Daily Take-Home

This is the real number — what the driver actually brings home after fuel.

```
Take-Home = Gross − Fuel Cost
```

**Example:**  
₱1,040 − ₱258.62 = **₱781.38 take-home**

---

### Step 6 — Hourly Effective Wage

To put the take-home in perspective, we divide by 8 hours (a standard workday).

```
Hourly Wage = Take-Home ÷ 8 hours
```

**Example:**  
₱781.38 ÷ 8 = **₱97.67 per hour**

This is important because it helps the driver compare his actual earnings to minimum wage, which is measured per day and per hour.

---

### Step 7 — The 2021 Comparison

This is the "aha moment" of GasPera.

We run the exact same calculation — same trips, same fare, same distance, same vehicle — but using the **2021 gas price of ₱47.20 per liter** instead of today's price.

```
2021 Fuel Cost = Liters Used × ₱47.20
2021 Take-Home = Gross − 2021 Fuel Cost
Daily Loss     = 2021 Take-Home − Today's Take-Home
```

**Example:**  
2021 fuel cost = 3.43 × ₱47.20 = ₱161.90  
2021 take-home = ₱1,040 − ₱161.90 = **₱878.10**  
Today's take-home = ₱781.38  
Daily loss = ₱878.10 − ₱781.38 = **₱96.72 less per day**

Multiply that by 22 working days: **₱2,127.84 less per month**  
Multiply by 12 months: **₱25,534 less per year**

The driver is doing the exact same work. He's just earning significantly less because fuel got more expensive — and his fare didn't keep up.

---

### Step 8 — The Survival Fare

This answers: *"What fare do I actually need to charge to earn at least minimum wage?"*

The Central Luzon minimum wage is **₱645 per day**. We back-calculate what fare per trip would make that possible.

```
Survival Fare = (Minimum Wage + Fuel Cost) ÷ Number of Trips
```

**Example:**  
(₱645 + ₱258.62) ÷ 80 trips = **₱11.30 per trip needed**

If that number is *higher* than the current fare, the driver is earning below minimum wage. If the current LGU-approved fare is ₱13 and the survival fare is ₱11.30, the driver is okay — but only barely.

---

## Who Is This For?

| Vehicle | What the app assumes |
|---|---|
| **Tricycle** | 35 km/L efficiency, ₱13 default fare, 80 trips/day, 1.5 km/trip |
| **Jeepney** | 8 km/L efficiency, ₱14 default fare, 20 trips/day, 15 km/trip |
| **Grab / Angkas** | 20 km/L efficiency, ₱120 default fare, 15 trips/day, 8 km/trip |

All of these are presets — the driver can change any number to match their actual situation.

---

## What the App Shows

1. **Three stat cards** — Gross, Fuel Cost, Take-Home at a glance
2. **A fuel bar** — a visual split showing what percentage of gross income went to fuel vs. what came home
3. **Then vs. Now panel** — side-by-side comparison of 2021 take-home vs. today's take-home using the same inputs
4. **A loss summary** — "Nawalan ka ng ₱X/araw dahil sa presyo ng gasolina" with monthly and yearly projections
5. **Survival Fare calculator** — the minimum fare per trip needed to reach minimum wage
6. **A bar chart** — visual comparison of 2021 vs. today take-home

---

## Technical Details

| Item | Detail |
|---|---|
| Framework | React + Vite |
| Styling | Tailwind CSS v3 |
| Charts | Chart.js via react-chartjs-2 |
| Data | All hardcoded — DOE fuel price history, DOLE minimum wage |
| APIs | None — runs fully in the browser |
| Deployment | Vercel (auto-deploys on every GitHub push) |
| Colors | Navy `#243144`, Gold `#FFBD59` |

---

## Data Sources

- **₱47.20/L (2021 baseline)** — DOE Weekly Oil Price Monitoring, January 2021 average
- **₱75.40/L (2025 default)** — DOE Weekly Oil Price Monitoring, 2025 average
- **₱645/day minimum wage** — DOLE Regional Tripartite Wages and Productivity Board, Central Luzon (Region III), 2025
- **Fuel efficiency presets** — LTFRB and industry averages for PH tricycles, jeepneys, and motorcycles

---

## Contest Context

GasPera was built for the **"Data and AI in Finance: Budget. Invest. Build. Challenge"** organized by BulSU CompSciety (Bulacan State University Computer Science Society), March 2026.

It addresses the contest theme of **inflation eroding real purchasing power** — specifically for the 3.5 million+ tricycle, jeepney, and motorcycle-for-hire operators in the Philippines who have no financial tool built for their unique situation.

---

*Built with ❤️ for Mang Pedro and every driver who deserves to know where his money goes.*
