import pandas as pd
import json

NAME_MAP = {
    "Median Monthly Rent (1-bedroom Flat)": "rentAffordability",
    "Median Annual Personal Income": "income",
    "Unemployment Rate": "employment",
    "Adults with Bachelor's Degree or higher": "education",
    "Overall Environmental Quality Score": "environment",
}
CONSTANTS = ["FIPS Code", "County", "State", "lat", "lng", "population"]
FEATURES = [
    "Median Monthly Rent (1-bedroom Flat)",
    "Median Annual Personal Income",
    "Unemployment Rate",
    "Adults with Bachelor's Degree or higher",
    "Overall Environmental Quality Score",
]
FEATURE_COLS = [
    (column, "Ranking " + column, "Percentile " + column) for column in FEATURES
]


def to_lower_camelcase(s):
    res = "".join([word.capitalize() for word in s.split(" ")])
    return res[0].lower() + res[1:]


def get_name(col):
    if col.startswith("Ranking") and col[8:] in NAME_MAP:
        return NAME_MAP[col[8:]] + "Rank"
    elif col.startswith("Percentile") and col[11:] in NAME_MAP:
        return NAME_MAP[col[11:]] + "Percentile"
    elif col not in NAME_MAP:
        return to_lower_camelcase(col)
    return NAME_MAP[col]


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

    df = df[[*CONSTANTS, *sum(FEATURE_COLS, ())]]
    df.columns = [get_name(col) for col in df.columns]

    # Construct the output JSON
    res = []
    for _, row in df.iterrows():
        county = {"features": {}}
        for col in CONSTANTS:
            county[to_lower_camelcase(col)] = row[to_lower_camelcase(col)]
        for col in FEATURES:
            county["features"][get_name(col)] = {
                "name": get_name(col),
                "value": row[get_name(col)],
                "rank": row[get_name(col) + "Rank"],
                "percentile": row[get_name(col) + "Percentile"],
            }
        res.append(county)

    with open("scripts/output/dataset.json", "w") as f:
        json.dump(res, f)
