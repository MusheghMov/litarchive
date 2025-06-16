import { Keyboard } from "lucide-react";
import React, { useState } from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

const shortcuts = [
	{ keys: ["⌘", "B"], description: "Bold" },
	{ keys: ["⌘", "I"], description: "Italic" },
	{ keys: ["⌘", "U"], description: "Strikethrough" },
	{ keys: ["⌘", "K"], description: "Code" },
	{ keys: ["⌘", "E"], description: "Code Block" },
	{ keys: ["⌘", "Q"], description: "Quote" },
	{ keys: ["⌘", "1-3"], description: "Heading 1-3" },
	{ keys: ["⌘", "0"], description: "Paragraph" },
	{ keys: ["⌘", "⇧", "L"], description: "Bullet List" },
	{ keys: ["⌘", "⇧", "O"], description: "Ordered List" },
];

export default function KeyboardShortcutsHelp() {
	const [open, setOpen] = useState(false);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="ghost"
					title="Keyboard shortcuts"
					className="cursor-pointer"
				>
					<Keyboard className="h-4 w-4" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-80" align="end">
				<div className="space-y-3">
					<h4 className="font-medium text-sm">Keyboard Shortcuts</h4>
					<div className="space-y-2">
						{shortcuts.map((shortcut, index) => (
							<div key={index} className="flex items-center justify-between">
								<span className="text-sm text-muted-foreground">
									{shortcut.description}
								</span>
								<div className="flex gap-1">
									{shortcut.keys.map((key, keyIndex) => (
										<Badge
											key={keyIndex}
											variant="secondary"
											className="text-xs px-1.5 py-0.5 font-mono"
										>
											{key}
										</Badge>
									))}
								</div>
							</div>
						))}
					</div>
					<div className="pt-2 border-t text-xs text-muted-foreground">
						<p>⌘ = Cmd on Mac, Ctrl on Windows/Linux</p>
					</div>
				</div>
			</PopoverContent>
		</Popover>
	);
}
