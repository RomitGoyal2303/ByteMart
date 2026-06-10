import { api } from "@/utils/api-client";
import type { QueryConfig } from "@/utils/react-query";
import { queryOptions, useQuery } from "@tanstack/react-query";
import type { User, ApiResponse } from "@bytemart/types";

export const verifyUser = (): Promise<ApiResponse<User>> => {
	return api.get("/auth/me");
};	

export const verifyUserQueryOptions = () => {
	return queryOptions({
		queryKey: ["verify-user"],
		queryFn: verifyUser,
		retry: false,
	});
};

export const useVerifyUser = ({
	queryConfig = {},
}: { queryConfig?: QueryConfig<typeof verifyUserQueryOptions> }) => {
	return useQuery({ ...verifyUserQueryOptions(), ...queryConfig });
};