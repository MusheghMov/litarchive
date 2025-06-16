"use client";

import { Button } from "@/components/ui/button";
import { PaletteIcon } from "lucide-react";
import { useTheme } from "next-themes";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
} from "../ui/select";

export default function ModeToggle() {
	const { setTheme } = useTheme();
	return (
		<Select
			onValueChange={(value) => {
				console.log(value);
				setTheme(value);
			}}
		>
			<SelectTrigger asChild>
				<Button
					variant="outline"
					size="icon"
					className="absolute !bg-background -right-10 top-0 bottom-0 m-auto w-fit border-border hover:bg-foreground/10 rounded-full border p-2 focus-visible:ring-0"
				>
					<PaletteIcon className="stroke-main" />
				</Button>
			</SelectTrigger>
			<SelectContent>
				<SelectGroup>
					<SelectItem value="dark">Dark</SelectItem>
					<SelectItem value="light">Light</SelectItem>
					<SelectItem value="green">Green</SelectItem>
					<SelectItem value="pink">Pink</SelectItem>
					<SelectItem value="violet">Violet</SelectItem>
					<SelectItem value="blue">Blue</SelectItem>
				</SelectGroup>
			</SelectContent>
		</Select>
	);
}
