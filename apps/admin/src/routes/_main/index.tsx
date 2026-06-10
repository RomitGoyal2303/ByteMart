import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_main/")({
	component: Dashboard,
});

function Dashboard() {
	return <div>Dashboard Page</div>;
}
