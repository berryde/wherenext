import pandas as pd
import json

if __name__ == "__main__":
    df = pd.read_csv("scripts/input/dataset.csv")
    geodata = pd.read_csv("scripts/input/geodata.csv")

    # Convert FIPS Code to string
    df["FIPS Code"] = df["FIPS Code"].astype(str).str.zfill(5)

    # Add geodata
    geodata = geodata.rename(columns={"county_fips": "FIPS Code"})
    geodata["FIPS Code"] = geodata["FIPS Code"].astype(str).str.zfill(5)
    geodata["lat"] = geodata["lat"].astype(float)
    geodata["lng"] = geodata["lng"].astype(float)
    geodata["population"] = geodata["population"].astype(int)
    geodata = geodata[["FIPS Code", "lat", "lng", "population"]]
    df = df.merge(geodata, on="FIPS Code")

    # get the first 24 columns
    CONSTANTS = df.columns[:4]
    FEATURES = df.columns[5:24]
    GEO = df.columns[-3:]

    # Construct the output JSON
    res = []
    for _, row in df.iterrows():
        county = {"features": {}}
        for col in CONSTANTS:
            county[col] = row[col]
        for col in FEATURES:
            county["features"][col] = {
                "value": row[col],
                "rank": row["Ranking " + col],
            }
            if "Percentile " + col in row:
                county["features"][col]["percentile"] = row["Percentile " + col]
        for col in GEO:
            county[col] = row[col]
        res.append(county)

    with open("scripts/output/dataset.json", "w") as f:
        json.dump(res, f)
