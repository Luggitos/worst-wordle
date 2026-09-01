import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [index("routes/home.tsx"), route("/wordle", "pages/wordle.tsx")] satisfies RouteConfig;
