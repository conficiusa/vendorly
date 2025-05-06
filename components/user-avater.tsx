import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "better-auth";
import { UserIcon } from "lucide-react";

type UserAvaterProps = {
	user: User;
};
const UserAvater = ({ user }: UserAvaterProps) => {
	const image = user.image ?? undefined;
	return (
		<div>
			<div className='flex cursor-default items-center gap-2 md:bg-muted-foreground/20 px-2  md:pr-4 py-1 rounded-full'>
				<div className='relative w-8 h-8 rounded-full bg-muted-foreground/40 flex items-center justify-center'>
					<Avatar className={"w-10 h-10"}>
						<AvatarImage src={image} />
						<AvatarFallback>
							<div className='relative w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center'>
								<UserIcon size={16} className='text-primary/70' />
								{/* <span className='w-2 h-2 absolute bg-green-600 rounded-full bottom-0 right-0 border-2 border-white' /> */}
							</div>
						</AvatarFallback>
					</Avatar>
				</div>
				<div className='max-md:hidden'>
					<p className='text-sm font-medium'>{user.name?.split(" ")[0]}</p>
					<p className='text-xs text-muted-foreground'>{user.email}</p>
				</div>
			</div>
		</div>
	);
};

export default UserAvater;
