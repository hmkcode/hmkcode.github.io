import pandas as pd
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.preprocessing import OneHotEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, confusion_matrix
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
import matplotlib.pyplot as plt
import numpy as np
import math



file_path = "data-v3.csv"
df = pd.read_csv(file_path)

df = df[~((df["PT"] == "NF") | (df["F"] == "F13"))]


# Define a function to compute success ratio and Laplace-smoothed ratio for a given group
def compute_success_ratios_by_cols(df, group_cols, k=3, show=False):
    global_avg = df["S"].mean()

    grouped = (
        df.groupby(group_cols, observed=True)["S"]
        .agg(count="count", S="sum")
        .reset_index()
    )

    grouped["ratio"] = (grouped["S"] / grouped["count"]).round(3)
    grouped["laplace_ratio"] = (grouped["S"] + k * global_avg) / (grouped["count"] + k).round(3)

    # Round for clarity
    grouped["ratio"] = grouped["ratio"].round(4)
    grouped["laplace_ratio"] = grouped["laplace_ratio"].round(4)

    if show:
        display(grouped)
         
    return grouped.sort_values(by=["count", "ratio"], ascending=[False, False]).reset_index(drop=True)

def merge_ratios_into_main(main_df, ratio_df, group_cols):
    # Build prefix from group_cols, e.g., "F_PT"
    prefix = "_".join(group_cols)
    raw_col = f"{prefix}(S)_ratio"
    lap_col = f"{prefix}(S)_lap_ratio"
    
    # Rename the ratio columns
    renamed = ratio_df.rename(columns={
        "ratio": raw_col,
        "laplace_ratio": lap_col
    })

    # Merge into main dataframe
    return main_df.merge(renamed[group_cols + [raw_col, lap_col]], on=group_cols, how="left")
    
def apply_success_ratios(df, group_k_pairs):
    for group_cols, k, show in group_k_pairs:
        ratios = compute_success_ratios_by_cols(df, group_cols, k=k, show=show)
        df = merge_ratios_into_main(df, ratios, group_cols)
    return df

def generate_ratio_column_names(group_k_pairs):
    ratio_columns = []
    for group_cols, *_ in group_k_pairs:
        prefix = "_".join(group_cols)
        ratio_columns.append(f"{prefix}(S)_ratio")
        ratio_columns.append(f"{prefix}(S)_lap_ratio")
    return ratio_columns

def map_ratios_to_df(source_df, target_df, group_cols):
    # Build expected column names
    prefix = "_".join(group_cols)
    raw_col = f"{prefix}(S)_ratio"
    lap_col = f"{prefix}(S)_lap_ratio"

    # Select only relevant columns from source
    ratio_df = source_df[group_cols + [raw_col, lap_col]].drop_duplicates()

    # Merge on group_cols
    merged = target_df.merge(ratio_df, on=group_cols, how="left")
    return merged

def merge_on(df_source, df_target, merge=[], on=[]):
    # Create a smaller df_source with only the needed columns
    df_merge = df_source[on + merge].drop_duplicates()

    # Perform the merge
    df_result = df_target.merge(df_merge, on=on, how='left')

    return df_result


------------------


def haversine(lat1, lon1, lat2, lon2, radius=6371):
    lat1, lon1, lat2, lon2 = map(np.radians, [lat1, lon1, lat2, lon2])
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = np.sin(dlat/2)**2 + np.cos(lat1)*np.cos(lat2)*np.sin(dlon/2)**2
    c = 2 * np.arcsin(np.sqrt(a))
    return radius * c

def find_nearest_success_point(
    df_s,
    df_t,
    lat_col="LT",
    lon_col="LG",
    not_matching=["INDX"],
    matching_on=[]
):
    distances = []

    for _, t_row in df_t.iterrows():
        # Exclude self-matching based on `not_matching`
        mask = np.ones(len(df_s), dtype=bool)
        for col in not_matching:
            mask &= df_s[col] != t_row[col]

        # Include only rows that match on `matching_on`
        for col in matching_on:
            mask &= df_s[col] == t_row[col]

        # Filter to successful source rows
        success_rows = df_s[(df_s["S"] == 1) & mask]
        coords = success_rows[[lat_col, lon_col]].to_numpy()
        lat_tgt, lon_tgt = t_row[lat_col], t_row[lon_col]

        if len(coords) > 0:
            dists = [haversine(lat_tgt, lon_tgt, lat_s, lon_s) for lat_s, lon_s in coords]
            min_dist = round(min(dists), 2)
        else:
            min_dist = -1

        distances.append(min_dist)

    # Create dynamic column name
    suffix = "_" + "_".join(matching_on) if matching_on else ""
    col_name = f"NEAREST_1{suffix}"

    df_t[col_name] = distances
    return df_t



def count_success_within_radii(
    df_source,
    df_target,
    lat_col="LT",
    lon_col="LG",
    radii=[25, 50, 75],
    not_matching=["INDX"],
    matching_on=[]
):
    result = {f"WITHIN_{r}km": [] for r in radii}

    for _, target_row in df_target.iterrows():
        # Exclude rows that match on any of the `not_matching` columns
        mask = np.ones(len(df_source), dtype=bool)
        for col in not_matching:
            mask &= df_source[col] != target_row[col]

        # Include only rows that match on all `matching_on` columns
        for col in matching_on:
            mask &= df_source[col] == target_row[col]

        # Filter to success points
        matching = df_source[(df_source["S"] == 1) & mask]
        coords = matching[[lat_col, lon_col]].to_numpy()
        lat_tgt, lon_tgt = target_row[lat_col], target_row[lon_col]

        # Count number of points within each radius
        counts = {r: 0 for r in radii}
        for lat_s, lon_s in coords:
            dist = haversine(lat_tgt, lon_tgt, lat_s, lon_s)
            for r in radii:
                if dist <= r:
                    counts[r] += 1

        for r in radii:
            result[f"WITHIN_{r}km"].append(counts[r])

    for col in result:
        df_target[col] = result[col]

    return df_target


----------------------


df_ratios = df.copy(deep=True)


group_k_pairs = [
    (["F"], 5, False),
    #(["F", "PT"], 3, False),

]

post_group_k_pairs = [
    (["F(S)_bin", "PT(S)_bin"], 2, False),
    (["F(S)_bin", "D_bin"], 2, False),
]

#group by categroy
df_ratios = apply_success_ratios(df_ratios, group_k_pairs)



#group by bin
df_ratios["F(S)_bin"] = pd.qcut(df_ratios["F(S)_ratio"], q=4)
df_ratios["PT(S)_bin"] = pd.qcut(df_ratios["PT(S)_ratio"], q=4)
df_ratios["D_bin"] = pd.qcut(df_ratios["D"], q=4)


df_ratios = apply_success_ratios(df_ratios, post_group_k_pairs)


#multi divide
df_ratios["F(S)*PT(S)"] = df_ratios["F(S)_ratio"]/df_ratios["PT(S)_ratio"]
display(df_ratios)

--------------------
df_ratios = find_nearest_success_point(df_ratios, df_ratios)
df_ratios = find_nearest_success_point(df_ratios, df_ratios, matching_on=["F"])
df_ratios = count_success_within_radii(df_ratios, df_ratios)


----------------------


import matplotlib.pyplot as plt
import seaborn as sns

# List of all ratio columns to plot
ratio_columns = generate_ratio_column_names(group_k_pairs)
post_ration_columns = generate_ratio_column_names(post_group_k_pairs)
all_columns = ratio_columns + post_ration_columns + []

all_columns = ["NEAREST_1", "NEAREST_1_F", "WITHIN_25km","WITHIN_50km","WITHIN_75km"]

# Create subplots
max_per_row = 4
n = len(all_columns)
rows = math.ceil(n / max_per_row)

fig, axes = plt.subplots(rows, max_per_row, figsize=(5 * max_per_row, 5 * rows), sharey=False)
axes = axes.flatten()  # Flatten in case of multi-row grid

# Loop through and plot each
for i, col in enumerate(all_columns):
    sns.boxplot(x="S", y=col, data=df_ratios, ax=axes[i])
    axes[i].set_title(col)
    axes[i].set_xlabel("S")
    axes[i].set_ylabel(col)

for j in range(i + 1, len(axes)):
    fig.delaxes(axes[j])
    
plt.tight_layout()
plt.show()


-----------------

filtered_df = df_ratios[(df_ratios["S"] == 0) & (df_ratios["NEAREST_1"] < 100)][["INDX", "S", "NEAREST_1"]]
display(filtered_df)

--------------

import matplotlib.pyplot as plt

# Separate success and failure points
success = df_ratios[df_ratios["S"] == 1]
failure = df_ratios[df_ratios["S"] == 0]

# Plot
plt.figure(figsize=(10, 6))
plt.scatter(success["LG"], success["LT"], c='green', label='Success (S=1)', alpha=0.6)
plt.scatter(failure["LG"], failure["LT"], c='red', label='Failure (S=0)', alpha=0.6)
plt.xlabel("Longitude (LG)")
plt.ylabel("Latitude (LT)")
plt.title("Scatter Plot of Points (Success vs Failure)")
plt.legend()
plt.grid(True)
plt.tight_layout()
plt.show()

------------

from mpl_toolkits.mplot3d import Axes3D
import matplotlib.pyplot as plt

# Ensure NEAREST_1 exists
if "NEAREST_1" in df_ratios.columns:
    fig = plt.figure(figsize=(12, 8))
    ax = fig.add_subplot(111, projection='3d')

    # Success
    s1 = df_ratios[df_ratios["S"] == 1]
    ax.scatter(s1["LG"], s1["LT"], s1["NEAREST_1"], c='green', label='Success (S=1)', alpha=0.6)

    # Failure
    s0 = df_ratios[df_ratios["S"] == 0]
    ax.scatter(s0["LG"], s0["LT"], s0["NEAREST_1"], c='red', label='Failure (S=0)', alpha=0.6)

    ax.set_xlabel("Longitude (LG)")
    ax.set_ylabel("Latitude (LT)")
    ax.set_zlabel("NEAREST_1 (km)")
    ax.set_title("3D Scatter Plot: Location vs Nearest Success Distance")
    ax.legend()
    plt.tight_layout()
    plt.show()
else:
    print("Column 'NEAREST_1' not found in the dataframe.")

---------------

dummy_data = {
}

dummy_df = pd.DataFrame(dummy_data)
dummy_df = map_ratios_to_df(df_ratios, dummy_df, ["F"])
dummy_df = map_ratios_to_df(df_ratios, dummy_df, ["F", "PT"])

# Extract bin categories from df_ratios
f_bins = df_ratios["F(S)_bin"].cat.categories
d_bins = df_ratios["D_bin"].cat.categories

# Convert IntervalIndex (categories) to bin edges (a list of numbers)
f_bin_edges = [interval.left for interval in f_bins] + [f_bins[-1].right]
d_bin_edges = [interval.left for interval in d_bins] + [d_bins[-1].right]

# Apply to new_df
dummy_df["F(S)_bin"] = pd.cut(dummy_df["F(S)_ratio"], bins=f_bin_edges)
dummy_df["D_bin"] = pd.cut(dummy_df["D"],  bins=d_bin_edges)

display(dummy_df)

-------------------------


categorical_cols = df_ratios.select_dtypes(include=["object", "category"]).columns.tolist()
df_ratios = df_ratios.drop(columns=categorical_cols)

df_numeric = df_ratios.dropna()

display(df_numeric)

X = df_numeric.drop(columns=["S"])
y = df_numeric["S"]

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train Random Forest classifier
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

feature_importance = pd.DataFrame({
    "Feature": X.columns,
    "Importance": model.feature_importances_
}).sort_values(by="Importance", ascending=False).reset_index(drop=True)

display(feature_importance)


--------------------

selected_features = [
    "NEAREST_1",...

]

df_selected = df_ratios.dropna(subset=selected_features + ["S"])

X = df_selected[selected_features]
y = df_selected["S"]

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train Random Forest classifier
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

y_pred = model.predict(X_test)
report = classification_report(y_test, y_pred, output_dict=True)
report_df = pd.DataFrame(report).transpose()
display(report_df)
