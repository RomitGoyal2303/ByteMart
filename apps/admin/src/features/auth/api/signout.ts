import { api } from "@/utils/api-client";
import type { MutationConfig } from "@/utils/react-query";
import { useMutation } from "@tanstack/react-query";

export const signout = () => {
	return api.post("auth/signout");
};

export const useSignout = ({
	mutationConfig,
}: { mutationConfig?: MutationConfig<typeof signout> } = {}) => {
	return useMutation({
		mutationFn: () => signout(),
		...mutationConfig,
	});
};
