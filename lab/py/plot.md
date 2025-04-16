df = pd.read_csv(file_path)

df_s = df[df["S"] == 1].copy()
df_f = df[df["S"] == 0].copy()


# Define the function
def find_nearest_point(df_s, df_t, not_matching=["INDX"], matching_on=[]):
    # Ensure latitude and longitude are in radians for haversine
    df_s_rad = df_s.copy()
    df_t_rad = df_t.copy()
    df_s_rad[["LT", "LG"]] = np.radians(df_s[["LT", "LG"]])
    df_t_rad[["LT", "LG"]] = np.radians(df_t[["LT", "LG"]])

    nearest_index = []
    nearest_distance = []

    for _, t_row in df_t.iterrows():
        # Filter out rows with matching values in not_matching
        filtered_df = df_s.copy()
        for col in not_matching:
            filtered_df = filtered_df[filtered_df[col] != t_row[col]]

        # Further filter by matching_on if provided
        for col in matching_on:
            filtered_df = filtered_df[filtered_df[col] == t_row[col]]

        if filtered_df.empty:
            nearest_index.append(None)
            nearest_distance.append(None)
            continue

        # Compute haversine distance
        t_coords = np.radians([[t_row["LT"], t_row["LG"]]])
        s_coords = np.radians(filtered_df[["LT", "LG"]])
        dists = haversine_distances(t_coords, s_coords)[0] * 6371  # Radius of Earth in km

        min_idx = np.argmin(dists)
        nearest_index.append(filtered_df.iloc[min_idx]["INDX"])
        nearest_distance.append(dists[min_idx])

    df_t["NEAREST_POINT"] = nearest_index
    df_t["NEAREST_DIST_1"] = nearest_distance
    return df_t

df = find_nearest_point(df_s, df_t, not_matching=["INDX"], matching_on=[])

df.head()
---------------------
def find_n_nearest_points(df_s, df_t, n=5, not_matching=["INDX"], matching_on=[]):
    from sklearn.metrics.pairwise import haversine_distances
    import numpy as np

    # Convert to radians
    df_s_rad = df_s.copy()
    df_t_rad = df_t.copy()
    df_s_rad[["LT", "LG"]] = np.radians(df_s[["LT", "LG"]])
    df_t_rad[["LT", "LG"]] = np.radians(df_t[["LT", "LG"]])

    nearest_ids_list = []

    for _, t_row in df_t.iterrows():
        # Filter based on not_matching and matching_on
        filtered_df = df_s.copy()
        for col in not_matching:
            filtered_df = filtered_df[filtered_df[col] != t_row[col]]
        for col in matching_on:
            filtered_df = filtered_df[filtered_df[col] == t_row[col]]

        if filtered_df.empty:
            nearest_ids_list.append("")
            continue

        # Calculate haversine distances
        t_coords = np.radians([[t_row["LT"], t_row["LG"]]])
        s_coords = np.radians(filtered_df[["LT", "LG"]])
        dists = haversine_distances(t_coords, s_coords)[0] * 6371  # in km

        # Get top-n nearest indices
        nearest_indices = filtered_df.iloc[np.argsort(dists)[:n]]["INDX"].astype(int).tolist()
        nearest_ids_list.append(",".join(map(str, nearest_indices)))

    df_t[f"NEAREST_{n}_POINTS"] = nearest_ids_list
    return df_t


# Example: find 5 nearest success points for each point
df = find_n_nearest_points(df, df.copy(), n=5)

df.head()

df_5_s = find_n_nearest_points(df_s, df.copy(), n=5)

df_5_s.head()

---------------------
def plot_point_closeby_centered_buffered(df, indx=1, r=10, buffer_scale=1.5):
    import matplotlib.pyplot as plt
    from sklearn.metrics.pairwise import haversine_distances
    import numpy as np

    # Get the target row and its nearest point
    target_row = df[df["INDX"] == indx].iloc[0]
    nearest_idx = int(target_row["NEAREST_POINT"])
    nearest_row = df[df["INDX"] == nearest_idx].iloc[0]

    # Convert to radians for distance calculation
    coords_rad = np.radians(df[["LT", "LG"]])
    target_coords_rad = np.radians([[target_row["LT"], target_row["LG"]]])

    # Compute distances to all points
    distances = haversine_distances(target_coords_rad, coords_rad)[0] * 6371  # in km
    df["DIST_TO_TARGET"] = distances
    df_nearby = df[distances <= r]

    # Plotting
    plt.figure(figsize=(10, 8))

    # Plot nearby points with 'x' marker
    for _, row in df_nearby.iterrows():
        if row["INDX"] == indx or row["INDX"] == nearest_idx:
            continue
        color = 'green' if row["S"] == 1 else 'red'
        plt.scatter(row["LG"], row["LT"], c=color, marker='x', s=50, alpha=0.7)
        plt.text(row["LG"] + 0.02, row["LT"], f"{row['DIST_TO_TARGET']:.1f} km", fontsize=10)

    # Plot target point with large circle
    target_color = 'green' if target_row["S"] == 1 else 'red'
    plt.scatter(target_row["LG"], target_row["LT"], c=target_color, marker='o', s=150, label='Target Point')

    # Plot nearest success point
    plt.scatter(nearest_row["LG"], nearest_row["LT"], c='green', marker='o', s=80, label='Nearest Success')
    plt.text(nearest_row["LG"] + 0.02, nearest_row["LT"], f"{target_row['NEAREST_DIST_1']:.1f} km", fontsize=10)

    # Apply buffer to view limits
    lat_buffer = buffer_scale * abs(target_row["LT"] - nearest_row["LT"])
    lon_buffer = buffer_scale * abs(target_row["LG"] - nearest_row["LG"])
    lat_buffer = max(lat_buffer, 0.2)
    lon_buffer = max(lon_buffer, 0.2)

    plt.xlim(target_row["LG"] - lon_buffer, target_row["LG"] + lon_buffer)
    plt.ylim(target_row["LT"] - lat_buffer, target_row["LT"] + lat_buffer)

    plt.xlabel("Longitude (LG)")
    plt.ylabel("Latitude (LT)")
    plt.title(f"Nearby Points within {r} km of Point {indx} (Centered + Buffer)")
    plt.legend()
    plt.grid(True, linestyle='--', alpha=0.5)
    plt.tight_layout()
    plt.show()


------------------------
def plot_point_nearest_centered_buffered(df, indx=1, buffer_scale=1.5, nc="NEAREST_5_POINTS"):
    import matplotlib.pyplot as plt
    import numpy as np

    # Get target row
    target_row = df[df["INDX"] == indx].iloc[0]
    nearest_ids_str = target_row[nc]
    if pd.isna(nearest_ids_str) or nearest_ids_str == "":
        print("No nearest points found.")
        return

    nearest_ids = list(map(int, nearest_ids_str.split(',')))
    df_nearest = df[df["INDX"].isin(nearest_ids)]

    # Plot setup
    plt.figure(figsize=(10, 8))

    # Plot all nearest points
    for _, row in df_nearest.iterrows():
        target_color = 'green' if row["S"] == 1 else 'red'
        plt.scatter(row["LG"], row["LT"], c=target_color, marker='o', s=80)
        # Show distance from target point
        dist = haversine_distances(
            [np.radians([target_row["LT"], target_row["LG"]])],
            [np.radians([row["LT"], row["LG"]])]
        )[0][0] * 6371
        plt.text(row["LG"] + 0.02, row["LT"], f"{dist:.1f} km", fontsize=9)

    # Plot target point with larger marker
    target_color = 'green' if target_row["S"] == 1 else 'red'
    plt.scatter(target_row["LG"], target_row["LT"], c=target_color, marker='o', s=150, label='Target Point')

    # Plot boundary points around for context
    df_context = df[~df["INDX"].isin([indx] + nearest_ids)]
    for _, row in df_context.iterrows():
        color = 'green' if row["S"] == 1 else 'red'
        plt.scatter(row["LG"], row["LT"], c=color, marker='x', s=40, alpha=0.5)

    # Set axis limits with buffer
    lats = [target_row["LT"]] + df_nearest["LT"].tolist()
    lons = [target_row["LG"]] + df_nearest["LG"].tolist()
    lat_min, lat_max = min(lats), max(lats)
    lon_min, lon_max = min(lons), max(lons)

    lat_range = (lat_max - lat_min) * buffer_scale
    lon_range = (lon_max - lon_min) * buffer_scale

    lat_center = target_row["LT"]
    lon_center = target_row["LG"]

    plt.xlim(lon_center - lon_range/2, lon_center + lon_range/2)
    plt.ylim(lat_center - lat_range/2, lat_center + lat_range/2)

    plt.xlabel("Longitude (LG)")
    plt.ylabel("Latitude (LT)")
    plt.title(f"{nc} of Point {indx} (Centered + Buffer)")
    plt.legend()
    plt.grid(True, linestyle='--', alpha=0.5)
    plt.tight_layout()
    plt.show()

------------------

plt.figure(figsize=(12, 9))

# Plot failure points (S=0) as red filled circles
plt.scatter(df_f["LG"], df_f["LT"], c='red', label='Failure (S=0)', alpha=0.6, s=50, marker='o')

# Plot success points (S=1) as green filled circles
plt.scatter(df_s["LG"], df_s["LT"], c='green', label='Success (S=1)', alpha=0.6, s=60, marker='o')

# Labels and legend
plt.xlabel("Longitude (LG)", fontsize=12)
plt.ylabel("Latitude (LT)", fontsize=12)
plt.title("Spatial Distribution of Success and Failure Points", fontsize=14)
plt.legend()
plt.grid(True, linestyle='--', alpha=0.5)
plt.tight_layout()
plt.show()


-----------

plot_point_closeby_centered_buffered(df, indx=1, r=20)
plot_point_nearest_centered_buffered(df, indx=1, buffer_scale=2.5, nc="NEAREST_5_POINTS")
plot_point_nearest_centered_buffered(df_5_s, indx=1, buffer_scale=2.5, nc="NEAREST_5_POINTS")
