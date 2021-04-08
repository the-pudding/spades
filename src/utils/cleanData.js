import scatterDimensions from "../data/scatterDimensions.csv";

export default function cleanData(d) {
	const followers = +d.followers;
	const topRank = d.topRank ? +d.topRank : null;
	const ranks = d.ranks.split("|").filter((v) => v).map((v) => +v);
	const dates = d.dates.split("|").filter((v) => v).map((v) => new Date(v));
	const hits = ranks.length;
	const topDate = dates.length ? dates[0] : null;
	const band = d.band || d.name;
	const isBand = !d.band;
	const titles = d.titles.split("|").filter((v) => v).map(v => {
		if (v.startsWith("(")) return v.split(")")[1].trim();
		else return v.split("(")[0].trim();
	});
	const dimensions = dates.map((v, i) => {
		const match = scatterDimensions.find(({ id }) => id === `${d.name}|${i}`);
		const width = match ? +match.width + 1 : null;
		const height = match ? +match.height + 1 : null;
		return { width, height };
	});

	return {
		...d,
		band,
		followers,
		ranks,
		dates,
		titles,
		hits,
		topRank,
		topDate,
		dimensions,
		isBand
	};
}

