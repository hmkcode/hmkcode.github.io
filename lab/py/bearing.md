from sklearn.neighbors import NearestNeighbors
from sklearn.cluster import KMeans
import numpy as np

# Haversine distance
def haversine_np(lon1, lat1, lon2, lat2):
    R = 6371.0
    lon1, lat1, lon2, lat2 = map(np.radians, [lon1, lat1, lon2, lat2])
    dlon = lon2 - lon1
    dlat = lat2 - lat1
    a = np.sin(dlat/2)**2 + np.cos(lat1)*np.cos(lat2)*np.sin(dlon/2)**2
    return R * 2 * np.arcsin(np.sqrt(a))

# Bearing angle in degrees from point A to point B
def calculate_bearing(lat1, lon1, lat2, lon2):
    lon1, lat1, lon2, lat2 = map(np.radians, [lon1, lat1, lon2, lat2])
    dlon = lon2 - lon1
    x = np.sin(dlon) * np.cos(lat2)
    y = np.cos(lat1) * np.sin(lat2) - np.sin(lat1) * np.cos(lat2) * np.cos(dlon)
    return (np.degrees(np.arctan2(x, y)) + 360) % 360

# Scan in both opposite directions for max density of nearby success points
def directional_success_density_scan(
    df_s,
    df_t,
    radius_km=20,
    window_angle=30,
    step_angle=15,
    lat_col="LT",
    lon_col="LG",
    id_col="INDX"
):
    results = []
    success_df = df_s[df_s["S"] == 1]

    for _, row in df_t.iterrows():
        lat1, lon1 = row[lat_col], row[lon_col]
        id1 = row[id_col]

        max_count = 0

        for heading in range(0, 360, step_angle):
            count = 0
            forward_dir = heading % 360
            reverse_dir = (heading + 180) % 360

            for _, s_row in success_df.iterrows():
                if s_row[id_col] == id1:
                    continue
                lat2, lon2 = s_row[lat_col], s_row[lon_col]
                dist = haversine_np(lon1, lat1, lon2, lat2)
                if dist <= radius_km:
                    bearing = calculate_bearing(lat1, lon1, lat2, lon2)
                    # Check if bearing falls within either forward or opposite direction
                    delta_forward = abs((bearing - forward_dir + 180) % 360 - 180)
                    delta_reverse = abs((bearing - reverse_dir + 180) % 360 - 180)
                    if delta_forward <= window_angle / 2 or delta_reverse <= window_angle / 2:
                        count += 1
            max_count = max(max_count, count)

        df_t.at[row.name, f"MAX_SUCCESS_IN_WINDOW_{radius_km}KM"] = max_count

    return df_t
