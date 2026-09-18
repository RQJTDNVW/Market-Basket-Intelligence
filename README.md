# Market Basket Intelligence

> **Discover the hidden relationships inside customer purchases.**  
> A production-quality, highly interactive data-intelligence platform for Market Basket Analysis, Association Rule Mining, and Retail Behavioral Analytics.

---

## Overview

**Market Basket Intelligence** transforms transaction-level retail records into an analytical experience, visualizing purchasing relationships discovered by the Apriori algorithm and association rule mining.

Rather than a generic administrative template, this system is engineered as an analytical data product for data scientists, ML engineers, and retail category planners.

---

## Key Metrics & Pipeline Results

All metrics and statistics in the frontend are dynamically computed from actual retail transaction data without any fabricated values:

- **Raw Ingested Records**: `522,064` transactions
- **Cleaned & Normalized Rows**: `520,136` purchase lines (cancellations and invalid quantities eliminated)
- **Customer Baskets**: `19,737` unique `BillNo` invoices across `30` countries
- **Catalog SKUs**: `4,051` unique products
- **Average Basket Size**: `26.35` items per basket
- **Frequent Itemsets**: `378` itemsets mined at $\text{Support} \ge 0.02$
- **Association Rules**: `59` elite rules discovered at $\text{Confidence} \ge 0.50$ and $\text{Lift} > 1.00$
- **Peak Observed Lift**: `18.89x` (`GREEN REGENCY TEACUP & ROSES TEACUP ➔ PINK TEACUP`)
- **Peak Confidence**: `90.35%` (`PINK TEACUP & ROSES TEACUP ➔ GREEN TEACUP`)

---

## Application Architecture

```
Raw Online Retail Data (522,064 records)
                 ↓
      Vectorized Data Cleaning (520,136 rows)
                 ↓
      Transaction Grouping by BillNo (19,737 baskets)
                 ↓
      Binary Basket Incidence Matrix (19,737 × 4,051)
                 ↓
      Apriori Algorithm (Level-wise downward closure, min_support = 0.02)
                 ↓
      Frequent Itemsets Discovery (378 itemsets)
                 ↓
      Association Rules Mining (mlxtend, min_confidence = 0.30)
                 ↓
      Quality Filtering (Confidence ≥ 0.50 & Lift > 1.00 → 59 rules)
                 ↓
      Interactive Visualization & Merchandising Playbook (React + D3 + Tailwind)
```

---

## 8 Dedicated Analytical Pages

1. **Overview / Hero**:
   - Headline: *"Find the products that move together."*
   - Interactive HTML5 Canvas physics network graph with gentle floating nodes, pulsing glowing bezier links, and travelling data packets.
   - Animated KPI cards with count-up animations for Transactions, Products, Frequent Itemsets, and Rules.
   - Top high-affinity rules ticker and architecture overview.

2. **Transaction Explorer**:
   - Filterable, searchable, and sortable table covering `Bill No`, `Product`, `Quantity`, `Date`, `Price`, `Customer ID`, and `Country`.
   - **Customer Basket Drawer**: Clicking any invoice opens a side panel displaying the complete basket, quantities, line totals, and highlights whether the basket triggered any mined association rules.

3. **Frequent Itemsets**:
   - Real-time interactive **Support Threshold Slider** ($2.0\% - 12.0\%$).
   - Dual **Card View** and **Table View** showing combination chips, horizontal frequency bars, and transaction counts.
   - Filtering by 1-item anchors, 2-item pairs, and 3-item multi-bundles.

4. **Association Rules**:
   - High-density analytical cards displaying Antecedents $\rightarrow$ Consequent, Confidence progress bar, Lift intensity badge, and Support metrics.
   - Dual **Cards / Table** toggle.
   - Sliders for Minimum Confidence ($30\% - 95\%$), Minimum Lift ($1.0\text{x} - 18\text{x}$), category affinity dropdown, and product search.
   - **Rule Detail Drawer**: Slide-in panel featuring an animated purchasing flow diagram, metric cards, plain-language explanations of Support/Confidence/Lift, and strategic retail bundling actions.

5. **Business Insights**:
   - Translates mathematical rule outputs into actionable retail strategy:
     - **Highest Lift Rule** ($18.89\text{x}$ affinity in Regency teacup sets)
     - **Highest Confidence Rule** ($90.35\%$ complementary conversion)
     - **Highest Support Anchor** ($4.15\%$ volume leader, 819 transactions)
     - **Most Frequent Product** (`WHITE HANGING HEART T-LIGHT HOLDER`, $11.16\%$ reach)
     - **Most Connected Node** (centrality hub of customer journeys)
   - Category affinity clustering and an **Operational Merchandising Playbook**.

6. **Visualization Engine**:
   - **Support vs. Confidence Scatter Bubble Plot**: Interactive D3 SVG plot where X = Support, Y = Confidence, bubble radius = Lift, and color = Lift intensity. Features interactive zoom, pan, hover tooltips, and click-to-drawer inspection.
   - **Force-Directed Association Network Graph**: Drag and explore product nodes with directed arrows; hovering over any SKU illuminates its 1-hop affinity cluster.

7. **Pipeline Architecture**:
   - Visual timeline tracing the 9 data science stages.
   - **Code Inspector Modal**: Hover and click any stage to review inputs, outputs, transformation rationale, and the underlying Python code from `preprocessing.py` and `market_basket.py`.

8. **Dataset & Mission (About)**:
   - Mathematical primer defining Support $P(A \cap B)$, Confidence $P(B|A)$, and Lift $\frac{P(A \cap B)}{P(A)P(B)}$.
   - Author narrative (*"Why I built this"*) explaining the vision of converting raw logs into predictive decision-support software.
   - Audit trail of data cleansing rules and technology stack badges.

---

## Technology Stack

- **Analytics Engine**: Python 3.12, Pandas, mlxtend, NumPy, Matplotlib
- **API Server**: FastAPI, Uvicorn, Pydantic
- **Frontend Core**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS (custom dark-mode tokens `#05070A`, `#35E0B5`, `#5B8CFF`, etc.)
- **Visualizations**: D3.js, HTML5 Canvas physics simulations, SVG
- **Icons**: Lucide React

---

## Quick Start

### Option 1: Run Full-Stack Server (Recommended)

Hosts both the REST API and the compiled frontend application on a single port:

```bash
# From project root
python server.py
```
Open **http://localhost:8000** in your browser.  
Interactive API docs are available at **http://localhost:8000/docs**.

### Option 2: Run Frontend in Vite Development Mode

```bash
cd frontend
npm run dev
```
Open **http://localhost:3000** in your browser.

### Recompiling Frontend Build

```bash
cd frontend
npm run build
```

---

## Design Tokens

- **Primary Background**: `#05070A`
- **Secondary Background**: `#0A0F14`
- **Cards**: `#0D141B`
- **Elevated Cards**: `#111A22`
- **Primary Accent**: `#35E0B5` (Teal)
- **Secondary Accent**: `#5B8CFF` (Blue)
- **Highlight**: `#A78BFA` (Purple)
- **Warning**: `#F5C451` (Amber)
- **Danger**: `#FF647C` (Coral)
- **Borders**: `rgba(255, 255, 255, 0.08)`
