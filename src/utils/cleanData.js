export default function cleanData(d) {
	const followers = +d.followers;
	const topRank = d.topRank ? +d.topRank : null;
	const ranks = d.ranks.split("|").filter((v) => v).map((v) => +v);
	const dates = d.dates.split("|").filter((v) => v).map((v) => new Date(v));
	const years = dates.map(v => v.getFullYear());
	const titles = d.titles.split("|").filter((v) => v).map(v => v.split("(")[0].trim());
	const hits = ranks.length;
	const topYear = years.length ? years[0] : null;
	const topDate = dates.length ? dates[0] : null;
	const band = d.band || d.name;
	return {
		...d,
		band,
		followers,
		ranks,
		dates,
		years,
		titles,
		hits,
		topRank,
		topYear,
		topDate
	};
}
  
