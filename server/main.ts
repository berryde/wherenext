import { Application, Router } from "https://deno.land/x/oak@v12.1.0/mod.ts";
import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";
import dataset from "./db.json" assert { type: "json" };
import { details, RankedFeature, type City } from "./features.ts";

const app = new Application();
const router = new Router();

// Score a city based on weighted features
function score(
	city: Record<string, unknown>,
	wanted: string[],
	unwanted: string[]
) {
	if (wanted.length == 0 && unwanted.length == 0) {
		wanted = Object.keys(details);
	}
	const bonus = wanted.reduce((acc, feature) => {
		const rank = city[feature + "Rank"] as number;
		return acc + (dataset.length - rank);
	}, 0);
	const penalty = unwanted.reduce((acc, feature) => {
		const rank = city[feature + "Rank"] as number;
		return acc + (dataset.length - rank);
	}, 0);
	return bonus - penalty;
}

function serializeCity(city: Record<string, string | number>): City {
	let keys = Object.keys(dataset[0])
		.filter((key) => key.endsWith("Rank"))
		.map((key) => key.replace("Rank", ""));

	// remove keys that aren't features
	keys = keys.filter((key) => key in details);

	const features: [string, RankedFeature][] = keys.map((key) => [
		key,
		{
			rank: city[key + "Rank"] as number,
			value: city[key] as number,
		},
	]);

	const result = Object.keys(city)
		.filter((key) => !keys.includes(key))
		.reduce((acc, key) => {
			acc[key] = city[key];
			return acc;
		}, {} as Record<string, unknown>) as City;

	result.features = Object.fromEntries(features);
	return result;
}

// Compute the magnitude of a city's ranked features
function magnitude(city: Record<string, unknown>) {
	return Math.sqrt(
		Object.keys(city)
			.filter((key) => key.endsWith("Rank"))
			.reduce((acc, feature) => {
				const rank = city[feature] as number;
				return acc + rank * rank;
			}, 0)
	);
}

// Compute the cosine similarity between two cities based on their ranked features
function similarity(
	city: Record<string, unknown>,
	other: Record<string, unknown>
) {
	const features = Object.keys(city).filter((key) => key.endsWith("Rank"));
	const product = features.reduce((acc, feature) => {
		return acc + (city[feature] as number) * (other[feature] as number);
	}, 0);
	return product / (magnitude(city) * magnitude(other));
}

// Get cities, specifying weighted features as query params
router.get("/cities", (ctx) => {
	const wanted = ctx.request.url.searchParams.getAll("wanted");
	const unwanted = ctx.request.url.searchParams.getAll("unwanted");
	const limit =
		Number(ctx.request.url.searchParams.get("limit")) || dataset.length;
	const cities = dataset
		.map((city) => ({ ...city, score: score(city, wanted, unwanted) }))
		.sort((a, b) => b.score - a.score)
		.slice(0, limit);

	ctx.response.body = cities.map((city) => serializeCity(city));
});

// Get the features available for scoring
router.get("/features", (ctx) => {
	ctx.response.body = details;
});

// Get a single city by its ID
router.get("/cities/:id", (ctx) => {
	const id = ctx.params.id;
	const city = dataset.find((city) => city.id.toString() === id);
	if (!city) {
		ctx.response.status = 404;
		return;
	}
	ctx.response.body = serializeCity(city);
});

// Get the most similar cities to a given city based on ranked features.
router.get("/cities/:id/similar", (ctx) => {
	const id = ctx.params.id;
	const city = dataset.find((city) => city.id.toString() === id);
	if (!city) {
		ctx.response.status = 404;
		return;
	}
	const limit =
		Number(ctx.request.url.searchParams.get("limit")) + 1 || dataset.length;
	const cities = dataset
		.map((other) => ({ ...other, similarity: similarity(city, other) }))
		.sort((a, b) => b.similarity - a.similarity)
		.slice(1, limit);

	ctx.response.body = cities.map((city) => serializeCity(city));
});

app.use(oakCors());
app.use(async (ctx, next) => {
	await next();
	const rt = ctx.response.headers.get("X-Response-Time");
	console.log(`${ctx.request.method} ${ctx.request.url} - ${rt}`);
});
app.use(async (ctx, next) => {
	const start = Date.now();
	await next();
	const ms = Date.now() - start;
	ctx.response.headers.set("X-Response-Time", `${ms}ms`);
});

app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8000 });
