"""
Market Basket Intelligence - Production API Server
Provides high-performance REST API endpoints for rules, itemsets, metadata,
and full-scale pagination over the 520,136 cleaned transaction rows.
Also serves the compiled frontend from `frontend/dist` when available.
"""

from pathlib import Path
import json
from typing import Optional

from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import pandas as pd

BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"
OUTPUTS_DIR = BASE_DIR / "outputs"
FRONTEND_DIST = BASE_DIR / "frontend" / "dist"
FRONTEND_DATA = BASE_DIR / "frontend" / "src" / "data"

app = FastAPI(
    title="Market Basket Intelligence API",
    description="REST API for Association Rule Mining, Frequent Itemsets, and Retail Transactions",
    version="1.0.0"
)

# Enable CORS for local Vite development server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load cached JSON data
metadata_cache = {}
rules_cache = []
itemsets_cache = []
insights_cache = {}

if (FRONTEND_DATA / "metadata.json").exists():
    with open(FRONTEND_DATA / "metadata.json", "r", encoding="utf-8") as f:
        metadata_cache = json.load(f)

if (FRONTEND_DATA / "rules.json").exists():
    with open(FRONTEND_DATA / "rules.json", "r", encoding="utf-8") as f:
        rules_cache = json.load(f)

if (FRONTEND_DATA / "itemsets.json").exists():
    with open(FRONTEND_DATA / "itemsets.json", "r", encoding="utf-8") as f:
        itemsets_cache = json.load(f)

if (FRONTEND_DATA / "insights.json").exists():
    with open(FRONTEND_DATA / "insights.json", "r", encoding="utf-8") as f:
        insights_cache = json.load(f)

# Lazy-loaded full dataframe
full_tx_df: Optional[pd.DataFrame] = None


def get_full_transactions() -> pd.DataFrame:
    global full_tx_df
    if full_tx_df is None:
        cleaned_file = OUTPUTS_DIR / "cleaned_transactions.csv"
        if cleaned_file.exists():
            full_tx_df = pd.read_csv(cleaned_file, dtype={"BillNo": str, "CustomerID": str})
        else:
            raise HTTPException(status_code=500, detail="cleaned_transactions.csv not found.")
    return full_tx_df


@app.get("/api/metadata")
def get_metadata():
    """Returns dataset metadata, metrics, and pipeline status."""
    return metadata_cache


@app.get("/api/rules")
def get_rules(
    min_confidence: float = Query(0.3, ge=0.0, le=1.0),
    min_lift: float = Query(1.0, ge=0.0),
    min_support: float = Query(0.015, ge=0.0),
    search: Optional[str] = None,
    category: Optional[str] = None,
):
    """Filters association rules by confidence, lift, support, search, and category."""
    filtered = rules_cache

    filtered = [
        r for r in filtered
        if r["confidence"] >= min_confidence
        and r["lift"] >= min_lift
        and r["support"] >= min_support
    ]

    if category and category != "all":
        filtered = [r for r in filtered if r.get("category") == category]

    if search:
        q = search.lower()
        filtered = [
            r for r in filtered
            if q in r["rule"].lower()
            or any(q in a.lower() for a in r["antecedents"])
            or any(q in c.lower() for c in r["consequents"])
        ]

    return {
        "count": len(filtered),
        "total": len(rules_cache),
        "rules": filtered
    }


@app.get("/api/rules/{rule_id}")
def get_rule_by_id(rule_id: str):
    """Returns detailed metrics for a specific rule."""
    for r in rules_cache:
        if r["id"] == rule_id:
            return r
    raise HTTPException(status_code=404, detail="Rule not found.")


@app.get("/api/itemsets")
def get_itemsets(
    min_support: float = Query(0.02, ge=0.0, le=1.0),
    size: Optional[int] = None,
    search: Optional[str] = None
):
    """Returns frequent itemsets filtered by support and size."""
    filtered = [it for it in itemsets_cache if it["support"] >= min_support]

    if size is not None:
        filtered = [it for it in filtered if it["size"] == size]

    if search:
        q = search.lower()
        filtered = [
            it for it in filtered
            if q in it["itemsetString"].lower()
            or any(q in i.lower() for i in it["items"])
        ]

    return {
        "count": len(filtered),
        "total": len(itemsets_cache),
        "itemsets": filtered
    }


@app.get("/api/insights")
def get_insights():
    """Returns dynamic business insights and category affinity rankings."""
    return insights_cache


@app.get("/api/transactions")
def get_transactions(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=5, le=100),
    search: Optional[str] = None,
    country: Optional[str] = None,
    sort_by: str = Query("BillNo"),
    sort_dir: str = Query("asc")
):
    """Paginated queries directly against the 520,136 cleaned transaction rows."""
    df = get_full_transactions()

    filtered = df
    if country and country != "all":
        filtered = filtered[filtered["Country"] == country]

    if search:
        q = search.strip()
        filtered = filtered[
            filtered["BillNo"].astype(str).str.contains(q, case=False, na=False) |
            filtered["Itemname"].astype(str).str.contains(q, case=False, na=False) |
            filtered["CustomerID"].astype(str).str.contains(q, case=False, na=False)
        ]

    total = len(filtered)
    total_pages = (total + page_size - 1) // page_size

    if sort_by in filtered.columns:
        ascending = (sort_dir.lower() == "asc")
        filtered = filtered.sort_values(by=sort_by, ascending=ascending)

    start = (page - 1) * page_size
    page_df = filtered.iloc[start:start + page_size]

    rows = []
    for idx, r in page_df.iterrows():
        rows.append({
            "id": f"tx-{idx}",
            "billNo": str(r["BillNo"]),
            "itemname": str(r["Itemname"]),
            "quantity": int(r["Quantity"]),
            "date": str(r["Date"]),
            "price": float(r["Price"]),
            "customerId": str(r["CustomerID"]) if pd.notna(r["CustomerID"]) else "Guest",
            "country": str(r["Country"]),
        })

    return {
        "page": page,
        "pageSize": page_size,
        "total": total,
        "totalPages": total_pages,
        "rows": rows
    }


@app.get("/api/basket/{bill_no}")
def get_basket(bill_no: str):
    """Retrieves all items for a given invoice BillNo."""
    df = get_full_transactions()
    basket_rows = df[df["BillNo"] == bill_no]

    if basket_rows.empty:
        raise HTTPException(status_code=404, detail="Basket not found.")

    first = basket_rows.iloc[0]
    items = []
    for _, r in basket_rows.iterrows():
        qty = int(r["Quantity"])
        price = float(r["Price"])
        items.append({
            "itemname": str(r["Itemname"]),
            "quantity": qty,
            "price": price,
            "total": round(qty * price, 2)
        })

    total_qty = sum(i["quantity"] for i in items)
    total_spend = round(sum(i["total"] for i in items), 2)

    return {
        "billNo": bill_no,
        "customerId": str(first["CustomerID"]) if pd.notna(first["CustomerID"]) else "Guest",
        "country": str(first["Country"]),
        "date": str(first["Date"]),
        "totalQuantity": total_qty,
        "totalSpend": total_spend,
        "itemCount": len(items),
        "items": items
    }


# Mount built static assets if compiled
if FRONTEND_DIST.exists():
    app.mount("/assets", StaticFiles(directory=FRONTEND_DIST / "assets"), name="assets")

    @app.get("/{full_path:path}")
    def serve_frontend(full_path: str):
        file_path = FRONTEND_DIST / full_path
        if file_path.exists() and file_path.is_file():
            return FileResponse(file_path)
        return FileResponse(FRONTEND_DIST / "index.html")


if __name__ == "__main__":
    import uvicorn
    print("\n" + "=" * 60)
    print("STARTING MARKET BASKET INTELLIGENCE SERVER")
    print("Local UI & API: http://localhost:8000")
    print("Interactive Docs: http://localhost:8000/docs")
    print("=" * 60 + "\n")
    uvicorn.run("server.py:app", host="0.0.0.0", port=8000, reload=True)
