```
file_path = "data-v3.csv"
df = pd.read_csv(file_path)

df = df[~((df["PT"] == "N1") | (df["F"] == "F13"))]


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


dummy_data = {
    "F": ["F1", "F2", "F3", "F4", "F5"],
    "PT": ["P1", "P2", "P1", "P2", "P3"],
    "D": [11390, 12748, 8000, 12000, 13000]  # Example values
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


import numpy as np

def haversine(lat1, lon1, lat2, lon2, radius=6371):
    lat1, lon1, lat2, lon2 = map(np.radians, [lat1, lon1, lat2, lon2])
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = np.sin(dlat/2)**2 + np.cos(lat1)*np.cos(lat2)*np.sin(dlon/2)**2
    c = 2 * np.arcsin(np.sqrt(a))
    return radius * c

def add_nearest_from_success(df_source, df_target, lat_col="LT", lon_col="LG"):

    # Filter only successful points from source
    successful = df_source[df_source["S"] == 1]
    src_coords = successful[[lat_col, lon_col]].to_numpy()
    tgt_coords = df_target[[lat_col, lon_col]].to_numpy()

    nearest_distances = []

    for lat_tgt, lon_tgt in tgt_coords:
        distances = [haversine(lat_tgt, lon_tgt, lat_src, lon_src) for lat_src, lon_src in src_coords]
        min_dist = min(distances) if distances else np.nan
        nearest_distances.append(round(min_dist, 2))

    df_target["nearest_distance_km"] = nearest_distances
    return df_target


def count_success_within_radii(df_source, df_target, lat_col="LT", lon_col="LG", radii=[25, 50, 75]):
    """
    For each point in df_target, count how many S==1 points in df_source are within given radii (in km).
    
    Parameters:
    - df_source: DataFrame with source points (must contain 'S' column)
    - df_target: DataFrame to annotate with counts
    - lat_col, lon_col: column names for latitude and longitude
    - radii: list of radii in kilometers (default: [25, 50, 75])
    
    Returns:
    - df_target with new columns: 'near_25km', 'near_50km', ...
    """
    successful = df_source[df_source["S"] == 1]
    src_coords = successful[[lat_col, lon_col]].to_numpy()
    tgt_coords = df_target[[lat_col, lon_col]].to_numpy()

    result = {f"near_{r}km": [] for r in radii}

    for lat_tgt, lon_tgt in tgt_coords:
        counts = {r: 0 for r in radii}
        for lat_src, lon_src in src_coords:
            dist = haversine(lat_tgt, lon_tgt, lat_src, lon_src)
            for r in radii:
                if dist <= r:
                    counts[r] += 1
        for r in radii:
            result[f"near_{r}km"].append(counts[r])

    # Add result columns to df_target
    for col in result:
        df_target[col] = result[col]

    return df_target

```

### 1.1 Success Ratio by F, PT, (F,PT), ...

```
group_k_pairs = [
    (["F"], 5, False),
    #(["F", "PT"], 3, False),
    (["F", "SHR"], 5, False),
    (["F", "HT"], 2, False),
    (["PT"], 10, False),
    (["PT", "SHR"], 5, False),
    (["PT", "HT"], 5, False),
]



#group by categroy
df_ratios = df.copy(deep=True)
df_ratios = apply_success_ratios(df_ratios, group_k_pairs)

post_group_k_pairs = [
    (["F(S)_bin", "PT(S)_bin"], 2, False),
    (["F(S)_bin", "D_bin"], 2, False),
]


#group by bin
df_ratios["F(S)_bin"] = pd.qcut(df_ratios["F(S)_ratio"], q=4)
df_ratios["PT(S)_bin"] = pd.qcut(df_ratios["PT(S)_ratio"], q=4)
df_ratios["D_bin"] = pd.qcut(df_ratios["D"], q=4)


df_ratios = apply_success_ratios(df_ratios, post_group_k_pairs)


#multi divide
df_ratios["F(S)*PT(S)"] = df_ratios["F(S)_ratio"]/df_ratios["PT(S)_ratio"]
display(df_ratios)
```

### PLOT Boxplot for all generated ratios 

```
import matplotlib.pyplot as plt
import seaborn as sns

# List of all ratio columns to plot
ratio_columns = generate_ratio_column_names(group_k_pairs)
post_ration_columns = generate_ratio_column_names(post_group_k_pairs)
all_columns = ratio_columns + post_ration_columns + [ "F(S)*PT(S)", "nearest_distance_km", "near_25km", "near_50km", "near_75km"]

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
```
