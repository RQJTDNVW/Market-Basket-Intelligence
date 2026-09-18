"""
Market Basket Analysis - Main Pipeline

Pipeline:
    Raw CSV
       ↓
    Preprocessing
       ↓
    Basket Matrix
       ↓
    Apriori
       ↓
    Association Rules
       ↓
    Rule Filtering
       ↓
    Visualization
"""

from pathlib import Path

from preprocessing import (
    load_data,
    clean_data,
    create_basket,
    save_preprocessed_data,
)

from market_basket import (
    find_frequent_itemsets,
    generate_association_rules,
    filter_rules,
    make_rules_readable,
    format_rules,
    display_top_rules,
    save_results,
)

from visualization import (
    plot_support_confidence,
    plot_top_rules,
)


# ============================================================
# PROJECT PATHS
# ============================================================

BASE_DIR = Path(__file__).resolve().parent

INPUT_FILE = BASE_DIR / "data" / "online_retail_500.csv"
OUTPUT_DIR = BASE_DIR / "outputs"


# ============================================================
# MAIN FUNCTION
# ============================================================

def run_pipeline():
    """
    Run the complete Market Basket Analysis pipeline.
    """

    print()
    print("=" * 70)
    print("MARKET BASKET ANALYSIS")
    print("=" * 70)

    # --------------------------------------------------------
    # 1. LOAD DATA
    # --------------------------------------------------------

    print()
    print("=" * 70)
    print("STEP 1: LOADING DATA")
    print("=" * 70)

    df = load_data(INPUT_FILE)

    # --------------------------------------------------------
    # 2. CLEAN DATA
    # --------------------------------------------------------

    print()
    print("=" * 70)
    print("STEP 2: PREPROCESSING DATA")
    print("=" * 70)

    cleaned_df = clean_data(df)

    # --------------------------------------------------------
    # 3. CREATE BASKET
    # --------------------------------------------------------

    print()
    print("=" * 70)
    print("STEP 3: CREATING BASKET MATRIX")
    print("=" * 70)

    basket = create_basket(cleaned_df)

    # Save preprocessing results
    save_preprocessed_data(
        cleaned_df,
        basket,
        OUTPUT_DIR
    )

    # --------------------------------------------------------
    # 4. APRIORI
    # --------------------------------------------------------

    print()
    print("=" * 70)
    print("STEP 4: APRIORI")
    print("=" * 70)

    frequent_itemsets = find_frequent_itemsets(
        basket=basket,
        min_support=0.02
    )

    if frequent_itemsets.empty:
        print()
        print("No frequent itemsets were found.")
        print("Try lowering the minimum support.")
        return

    # --------------------------------------------------------
    # 5. ASSOCIATION RULES
    # --------------------------------------------------------

    print()
    print("=" * 70)
    print("STEP 5: ASSOCIATION RULES")
    print("=" * 70)

    rules = generate_association_rules(
        frequent_itemsets=frequent_itemsets,
        metric="confidence",
        min_threshold=0.30
    )

    if rules.empty:
        print()
        print("No association rules were generated.")
        return

    # --------------------------------------------------------
    # 6. FILTER RULES
    # --------------------------------------------------------

    print()
    print("=" * 70)
    print("STEP 6: FILTERING RULES")
    print("=" * 70)

    filtered_rules = filter_rules(
        rules=rules,
        min_confidence=0.50,
        min_lift=1.00
    )

    if filtered_rules.empty:
        print()
        print("No rules passed the final filters.")
        print("Try lowering the thresholds.")
        return

    # --------------------------------------------------------
    # 7. MAKE RULES READABLE
    # --------------------------------------------------------

    print()
    print("=" * 70)
    print("STEP 7: FORMATTING RULES")
    print("=" * 70)

    readable_rules = make_rules_readable(
        filtered_rules
    )

    final_rules = format_rules(
        readable_rules
    )

    # --------------------------------------------------------
    # 8. DISPLAY TOP RULES
    # --------------------------------------------------------

    display_top_rules(
        final_rules,
        top_n=20
    )

    # --------------------------------------------------------
    # 9. SAVE RESULTS
    # --------------------------------------------------------

    print()
    print("=" * 70)
    print("STEP 8: SAVING RESULTS")
    print("=" * 70)

    save_results(
        frequent_itemsets,
        final_rules,
        OUTPUT_DIR
    )

    # --------------------------------------------------------
    # 10. VISUALIZATION
    # --------------------------------------------------------

    print()
    print("=" * 70)
    print("STEP 9: VISUALIZATION")
    print("=" * 70)

    plot_support_confidence(
        rules=final_rules,
        output_path=(
            OUTPUT_DIR / "association_rules_plot.png"
        ),
        show_plot=True
    )

    plot_top_rules(
        rules=final_rules,
        top_n=10,
        output_path=(
            OUTPUT_DIR / "top_association_rules.png"
        ),
        show_plot=True
    )

    # --------------------------------------------------------
    # FINAL SUMMARY
    # --------------------------------------------------------

    print()
    print("=" * 70)
    print("MARKET BASKET ANALYSIS COMPLETE")
    print("=" * 70)

    print()
    print(f"Original rows       : {len(df):,}")
    print(f"Cleaned rows        : {len(cleaned_df):,}")
    print(f"Transactions        : {basket.shape[0]:,}")
    print(f"Products            : {basket.shape[1]:,}")
    print(f"Frequent itemsets   : {len(frequent_itemsets):,}")
    print(f"Generated rules     : {len(rules):,}")
    print(f"Final rules         : {len(final_rules):,}")

    print()
    print(f"Results directory:")
    print(OUTPUT_DIR)

    print()
    print("=" * 70)


# ============================================================
# PROGRAM ENTRY POINT
# ============================================================

if __name__ == "__main__":
    run_pipeline()