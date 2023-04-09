# A server for the created dataset

The server interfaces between the application and SQLite.

## Creating the database

Use `sqlite3 db.sqlite` to create a new SQL database that can serve the `cleaned.csv` file.

Use the following commands to load the `cleaned.csv` data into a table called `data` in the created database.

```sql
sqlite> create table cities(name TEXT, country TEXT, population INT, wikidata TEXT, lon REAL, lat REAL, meanTemp INT, precipitation INT, tempRange INT, housing INT, costOfLiving INT, startups INT, ventureCapital INT, travelConnectivity INT, commute INT, businessFreedom INT, safety INT, healthcare INT, education INT, environmentalQuality INT, economy INT, taxation INT, internetAccess INT, leisureAndCulture INT, tolerance INT, outdoors INT, humanFreedom INT, economicFreedom INT, personalFreedom INT);
sqlite> .mode csv
sqlite> .import ../data/cleaned.csv cities
sqlite> DELETE FROM cities WHERE name in (SELECT name FROM cities LIMIT 1);
sqlite> .quit
```

## Starting the server

The server runs using `deno`. Simply execute `deno run main.ts`.

## API Contract

The client sends a request with their selected preferences and the number of cities to find:

```json
{
	"wanted": ["costOfLiving", "outdoors"],
	"unwanted": ["taxation", "precipitation"],
	"count": 5
}
```

Any unspecified variables are assumed to have neutral weight. Unwanted variables are negatively weighted whereas wanted variables are positively weighted.

The server responds with the optimal cities that maximise the given criteria.

```json
{
	[
    {
        "name": "Tbilisi",
        "country": "Georgia",
        "population": 1118035,
        "wikidata": "http://www.wikidata.org/entity/Q994",
        "lon": 44.783333333,
        "lat": 41.716666666,
        ...
    },
    ...
    ]
}
```
