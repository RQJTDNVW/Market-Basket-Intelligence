
"""
Market Basket Analysis - Data Preprocessing

Expected dataset columns:
    BillNo
    Itemname
    Quantity
    Date
    Price
    CustomerID
    Country

Pipeline:
    Raw CSV
       ↓
    Load data
       ↓
    Clean data
       ↓
    Remove cancelled transactions
       ↓
    Remove invalid quantities
       ↓
    Clean product names
       ↓
    Create binary basket matrix
"""

from pathlib import Path
from typing import Tuple

import pandas as pd


# ============================================================
# CONFIGURATION
# ============================================================

REQUIRED_COLUMNS = [
    "BillNo",
    "Itemname",
    "Quantity",
]


# ============================================================
# 1. LOAD DATA
# ============================================================

def load_data(file_path: str | Path) -> pd.DataFrame:
    """
    Load the Online Retail CSV file.

    The project dataset uses ';' as the separator.
    """

    file_path = Path(file_path)

    if not file_path.exists():
        raise FileNotFoundError(
            f"Dataset not found:\n{file_path}"
        )

    print("\nLoading dataset...")
    print(f"File: {file_path}")

    df = pd.read_csv(
        file_path,
        sep=";"
    )

    print(f"Original dataset shape: {df.shape}")

    # Check required columns
    missing_columns = [
        column
        for column in REQUIRED_COLUMNS
        if column not in df.columns
    ]

    if missing_columns:
        raise ValueError(
            "Missing required columns: "
            + ", ".join(missing_columns)
        )

    return df


# ============================================================
# 2. CONVERT PRICE
# ============================================================

def convert_price(df: pd.DataFrame) -> pd.DataFrame:
    """
    Convert European decimal prices.

    Example:
        2,55 -> 2.55
        3,39 -> 3.39

    Price is optional for Market Basket Analysis,
    but converted when available.
    """

    data = df.copy()

    if "Price" in data.columns:

        data["Price"] = (
            data["Price"]
            .astype(str)
            .str.replace(
                ",",
                ".",
                regex=False
            )
        )

        data["Price"] = pd.to_numeric(
            data["Price"],
            errors="coerce"
        )

    return data


# ============================================================
# 3. HANDLE MISSING VALUES
# ============================================================

def remove_missing_values(
    df: pd.DataFrame
) -> pd.DataFrame:
    """
    Remove rows missing the columns required
    for Market Basket Analysis.
    """

    data = df.copy()

    before = len(data)

    data = data.dropna(
        subset=[
            "BillNo",
            "Itemname",
            "Quantity"
        ]
    )

    removed = before - len(data)

    print(
        f"Removed rows with missing required values: "
        f"{removed:,}"
    )

    return data


# ============================================================
# 4. REMOVE CANCELLED TRANSACTIONS
# ============================================================

def remove_cancelled_transactions(
    df: pd.DataFrame
) -> pd.DataFrame:
    """
    Remove cancelled invoices.

    In the Online Retail dataset,
    cancelled invoices begin with 'C'.

    Example:
        C536379
    """

    data = df.copy()

    before = len(data)

    invoice_numbers = (
        data["BillNo"]
        .astype(str)
        .str.strip()
        .str.upper()
    )

    data = data[
        ~invoice_numbers.str.startswith("C")
    ]

    removed = before - len(data)

    print(
        f"Removed cancelled transaction rows: "
        f"{removed:,}"
    )

    return data


# ============================================================
# 5. REMOVE INVALID QUANTITIES
# ============================================================

def remove_invalid_quantities(
    df: pd.DataFrame
) -> pd.DataFrame:
    """
    Keep only transactions with Quantity > 0.
    """

    data = df.copy()

    # Convert Quantity to numeric
    data["Quantity"] = pd.to_numeric(
        data["Quantity"],
        errors="coerce"
    )

    # Remove values that cannot be converted
    data = data.dropna(
        subset=["Quantity"]
    )

    before = len(data)

    data = data[
        data["Quantity"] > 0
    ]

    removed = before - len(data)

    print(
        f"Removed invalid quantity rows: "
        f"{removed:,}"
    )

    return data


# ============================================================
# 6. CLEAN PRODUCT NAMES
# ============================================================

def clean_product_names(
    df: pd.DataFrame
) -> pd.DataFrame:
    """
    Normalize product names.

    Operations:
        - Convert to string
        - Remove leading/trailing spaces
        - Convert to uppercase
        - Remove empty names
    """

    data = df.copy()

    data["Itemname"] = (
        data["Itemname"]
        .astype(str)
        .str.strip()
        .str.upper()
    )

    # Remove empty product names
    data = data[
        data["Itemname"] != ""
    ]

    return data


# ============================================================
# 7. CLEAN INVOICE NUMBERS
# ============================================================

def clean_invoice_numbers(
    df: pd.DataFrame
) -> pd.DataFrame:
    """
    Normalize invoice numbers.
    """

    data = df.copy()

    data["BillNo"] = (
        data["BillNo"]
        .astype(str)
        .str.strip()
    )

    return data


# ============================================================
# 8. COMPLETE CLEANING PIPELINE
# ============================================================

def clean_data(
    df: pd.DataFrame
) -> pd.DataFrame:
    """
    Execute the complete cleaning process.
    """

    print("\n" + "=" * 60)
    print("DATA CLEANING")
    print("=" * 60)

    data = df.copy()

    print(
        f"Starting rows: {len(data):,}"
    )

    # Price conversion
    data = convert_price(data)

    # Missing values
    data = remove_missing_values(data)

    # Cancelled transactions
    data = remove_cancelled_transactions(data)

    # Invalid quantities
    data = remove_invalid_quantities(data)

    # Clean product names
    data = clean_product_names(data)

    # Clean invoice numbers
    data = clean_invoice_numbers(data)

    data = data.reset_index(
        drop=True
    )

    print(
        f"\nFinal cleaned rows: "
        f"{len(data):,}"
    )

    return data


# ============================================================
# 9. CREATE BASKET
# ============================================================

def create_basket(
    df: pd.DataFrame
) -> pd.DataFrame:
    """
    Convert transaction-line data into
    a binary transaction basket.

    Example:

        BillNo     Product A    Product B    Product C

        536365          1            1            1
        536366          0            1            1
        536367          1            0            1

    1 = product purchased
    0 = product not purchased
    """

    if df.empty:
        raise ValueError(
            "Cannot create basket: "
            "cleaned dataset is empty."
        )

    print("\n" + "=" * 60)
    print("CREATING BASKET MATRIX")
    print("=" * 60)

    # Group transaction lines by invoice and product.
    #
    # crosstab creates a transaction × product matrix.
    basket = pd.crosstab(
        df["BillNo"],
        df["Itemname"]
    )

    # Convert quantities/counts to binary presence.
    basket = (
        basket > 0
    ).astype(int)

    print(
        f"Number of baskets : "
        f"{basket.shape[0]:,}"
    )

    print(
        f"Number of products: "
        f"{basket.shape[1]:,}"
    )

    print(
        f"Basket shape      : "
        f"{basket.shape}"
    )

    return basket


# ============================================================
# 10. COMPLETE PREPROCESSING PIPELINE
# ============================================================

def preprocess(
    file_path: str | Path
) -> Tuple[pd.DataFrame, pd.DataFrame]:
    """
    Run the complete preprocessing pipeline.

    Returns:
        cleaned_data
        basket_matrix
    """

    # Load
    df = load_data(
        file_path
    )

    # Clean
    cleaned_df = clean_data(
        df
    )

    # Create basket
    basket = create_basket(
        cleaned_df
    )

    return cleaned_df, basket


# ============================================================
# 11. SAVE PREPROCESSED DATA
# ============================================================

def save_preprocessed_data(
    cleaned_df: pd.DataFrame,
    basket: pd.DataFrame,
    output_dir: str | Path = "outputs"
) -> None:
    """
    Save cleaned transaction data and
    basket matrix.
    """

    output_dir = Path(
        output_dir
    )

    output_dir.mkdir(
        parents=True,
        exist_ok=True
    )

    cleaned_path = (
        output_dir /
        "cleaned_transactions.csv"
    )

    basket_path = (
        output_dir /
        "basket_matrix.csv"
    )

    cleaned_df.to_csv(
        cleaned_path,
        index=False
    )

    basket.to_csv(
        basket_path
    )

    print("\n" + "=" * 60)
    print("PREPROCESSED DATA SAVED")
    print("=" * 60)

    print(
        f"Cleaned data : {cleaned_path}"
    )

    print(
        f"Basket matrix: {basket_path}"
    )


# ============================================================
# 12. SCRIPT ENTRY POINT
# ============================================================

if __name__ == "__main__":

    import argparse

    parser = argparse.ArgumentParser(
        description=(
            "Preprocess Online Retail "
            "data for Market Basket Analysis."
        )
    )

    parser.add_argument(
        "--input",
        default="data/online_retail_500.csv",
        help=(
            "Path to the raw Online Retail CSV."
        )
    )

    parser.add_argument(
        "--output",
        default="outputs",
        help=(
            "Directory for preprocessed outputs."
        )
    )

    args = parser.parse_args()

    # Run preprocessing
    cleaned_df, basket = preprocess(
        args.input
    )

    # Save outputs
    save_preprocessed_data(
        cleaned_df,
        basket,
        args.output
    )

    # Summary
    print("\n" + "=" * 60)
    print("PREPROCESSING COMPLETE")
    print("=" * 60)

    print(
        f"Cleaned transaction rows: "
        f"{len(cleaned_df):,}"
    )

    print(
        f"Unique baskets: "
        f"{basket.shape[0]:,}"
    )

    print(
        f"Unique products: "
        f"{basket.shape[1]:,}"
    )