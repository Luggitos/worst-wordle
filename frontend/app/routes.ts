import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
	index("pages/wordle.tsx"),
	route("/wordle", "routes/wordle.tsx"),
] satisfies RouteConfig;
