import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_main/orders")({
	component: Orders,
});

function Orders() {
	return <div>Orders Page</div>;
}
