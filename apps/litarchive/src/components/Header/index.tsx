"use client";
import { Menu, SlidersHorizontal } from "lucide-react";

const ModeToggle = dynamic(() => import("../ModeToggle"), {
  ssr: false,
});
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { SignInButton, SignedOut, UserButton, useAuth } from "@clerk/nextjs";
import { Button } from "../ui/button";
import dynamic from "next/dynamic";

export default function Header() {
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [selected, setSelected] = useState(pathname.split("/")[1]);
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="sticky top-0 z-50 !m-0 grid w-full shrink-0 grow-0 self-center overflow-hidden rounded-none border-b border-border/65 bg-background/35 backdrop-blur-lg lg:inset-0 lg:top-3 lg:m-auto lg:w-fit lg:rounded-[30px] lg:border">
      <div className="flex w-full flex-row items-center justify-between gap-14 px-4 py-2 md:justify-between lg:justify-center lg:px-2 lg:py-1">
        <Link href="/" className="flex flex-row items-center gap-2 pl-3">
          <svg
            className="fill-foreground"
            height="16px"
            width="16px"
            version="1.1"
            id="Capa_1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 490.00 490.00"
            stroke="#ffffff"
            strokeWidth="0.0049"
            transform="matrix(1, 0, 0, 1, 0, 0)rotate(0)"
          >
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              strokeLinecap="round"
              strokeLinejoin="round"
              stroke="#e60000"
              strokeWidth="8.82"
            ></g>
            <g id="SVGRepo_iconCarrier">
              <g>
                <g>
                  <g>
                    <path d="M56.3,386.7H377c4.3-11.6,10.5-22.9,19-32.6H62.1c-34.2,0-61.7,30.3-61.7,67.9s27.6,68,61.7,68H396 c-8.5-9.7-14.8-20.6-19-32.6H56.3c-5.4,0-10.1-4.3-10.1-10.1c0-5.4,4.3-10.1,10.1-10.1h316.1c-1.6-10.5-1.6-21,0-31.1H56.3 c-5.4,0-10.1-4.3-10.1-10.1C46.2,391,50.9,386.7,56.3,386.7z"></path>{" "}
                    <path d="M427.9,177.4H94c8.5,9.7,14.8,20.6,19,32.6h318c5.4,0,10.1,4.3,10.1,10.1c0,5.4-4.3,10.1-10.1,10.1H117.6 c1.6,10.5,1.6,21,0,31.1H431c5.4,0,10.1,4.3,10.1,10.1c0,5.4-4.3,10.1-10.1,10.1H113c-4.3,11.6-10.5,22.9-19,32.6h333.9 c34.2,0,61.7-30.3,61.7-67.9S462,177.4,427.9,177.4z"></path>{" "}
                    <path d="M62.1,136.7H396c-8.5-9.7-14.8-20.6-19-32.6H61.3c-5.4,0-10.1-4.3-10.1-10.1s4.3-10.1,10.1-10.1h311 c-1.6-10.5-1.6-21,0-31.1h-311c-5.4,0-10.1-4.3-10.1-10.1s4.3-10.1,10.1-10.1H377C381.3,21,387.5,9.7,396,0H62.1 C28,0.8,0.4,31.1,0.4,68.7S28,136.7,62.1,136.7z"></path>{" "}
                  </g>
                </g>
              </g>
            </g>
          </svg>
          <h2 className="text-sm font-semibold">LITARCHIVE</h2>
        </Link>

        <div className="hidden flex-row items-center gap-10 text-foreground lg:flex">
          <Link
            href="/"
            prefetch
            className={cn(
              "border-primary/80 text-sm text-foreground/60 hover:text-foreground",
              selected === "" && "text-foreground"
            )}
            onClick={() => setSelected("")}
          >
            Home
          </Link>
          <Link
            href="/authors"
            prefetch
            className={cn(
              "border-primary/80 text-sm text-foreground/60 hover:text-foreground",
              selected === "authors" && "text-foreground"
            )}
            onClick={() => setSelected("authors")}
          >
            Authors
          </Link>
          <Link
            href="/books"
            className={cn(
              "border-primary/80 text-sm text-foreground/60 hover:text-foreground",
              selected === "books" && "text-foreground"
            )}
            onClick={() => setSelected("books")}
          >
            Books
          </Link>
          <Link
            href="/articles"
            className={cn(
              "border-primary/80 text-sm text-foreground/60 hover:text-foreground",
              selected === "articles" && "text-foreground"
            )}
            onClick={() => setSelected("articles")}
          >
            Articles
          </Link>
          {isSignedIn && (
            <Link
              href="/profile"
              className={cn(
                "border-primary/80 text-sm text-foreground/60 hover:text-foreground",
                selected === "profile" && "text-foreground"
              )}
              onClick={() => setSelected("profile")}
            >
              My Collection
            </Link>
          )}
        </div>
        <div className="flex flex-row items-center space-x-4 lg:flex">
          {isSignedIn && (
            <UserButton
              appearance={{
                elements: {
                  userButtonPopoverMain: "dark:bg-slate-800 dark:text-white",
                  button: "dark:text-white",
                },
              }}
              userProfileProps={{
                appearance: {
                  elements: {
                    scrollBox: "dark:bg-slate-800",
                    page: "dark:text-white",
                    navbarButtons: "dark:text-white",
                    navbarButton:
                      "dark:hover:bg-slate-600 dark:focus:bg-slate-800 dark:focus:text-white dark:text-black dark:hover:text-white",
                    formFieldLabel: "dark:text-white",
                    headerTitle: "dark:text-white",
                    profileSection: "dark:bg-slate-800",
                    button: "dark:text-white",
                    menuList: "dark:bg-slate-700 dark:hover:bg-slate-600",
                    navbarMobileMenuRow: "dark:bg-slate-600",
                    navbarMobileMenuButton: "dark:text-black",
                    navbarMobileMenuButtonIcon: "dark:text-white",
                    badge: "dark:text-white border dark:border-white",
                    userPreview: "dark:text-white",
                    profileSectionPrimaryButton: "dark:hover:bg-slate-600",
                    menuButton: "dark:hover:bg-slate-600",
                    cardBox: "dark:bg-slate-600",
                    actionCard: "dark:bg-slate-700",
                    formButtonReset: "dark:hover:bg-slate-600",
                    avatarImageActionsUpload: "dark:hover:bg-slate-600",
                    avatarImageActionsRemove: "dark:hover:bg-slate-600",
                  },
                },
              }}
            />
          )}
          <DropdownMenu>
            <DropdownMenuTrigger className="lg:hidden">
              <Menu />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => router.push("/")}>
                Home
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/authors")}>
                Authors
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/books")}>
                Books
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/articles")}>
                Articles
              </DropdownMenuItem>
              {isSignedIn && (
                <DropdownMenuItem onClick={() => router.push("/profile")}>
                  My Collection
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          {!isSignedIn && <SignInButton />}

          <Button
            variant="outline"
            size="icon"
            className="rounded-full border border-main/65 bg-black/50 p-2 backdrop-blur-lg hover:bg-black/90"
            onClick={() => setExpanded(!expanded)}
          >
            <SlidersHorizontal className="stroke-main" />
          </Button>
        </div>
      </div>
      <ModeToggle expanded={expanded} setExpanded={setExpanded} />
    </div>
  );
}
