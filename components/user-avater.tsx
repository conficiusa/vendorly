import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@/lib/types/better-auth.types";

type UserAvaterProps = {
	user: User;
};
const UserAvater = ({ user }: UserAvaterProps) => {
	const image = user.image ?? undefined;
	return (
		<Avatar className={"w-10 h-10"}>
			<AvatarImage src={image} />
			<AvatarFallback className="font-semibold">
				{user.first_name.charAt(0).toUpperCase()}
				{user.last_name.charAt(0).toUpperCase()}
			</AvatarFallback>
		</Avatar>
	);
};

export default UserAvater;
