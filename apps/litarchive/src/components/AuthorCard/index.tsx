import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Earth, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import TooltipContainer from "@/components/TooltipContainer";
// @ts-ignore
import { unstable_ViewTransition as ViewTransition } from "react";
import { Author } from "@/types";

export default function AuthorCard({
  author,
  userRating,
  averageRating,
}: {
  author: Author;
  userRating?: number;
  averageRating?: number;
}) {
  return (
    <Link
      href={{ pathname: `/authors/${author.slug}` }}
      className="relative w-full rounded border border-foreground/20 bg-card p-1 hover:border-primary/60"
    >
      <AspectRatio
        ratio={9 / 12}
        className="flex flex-col justify-end overflow-hidden"
      >
        <ViewTransition name={`${author.slug}`}>
          <div className="h-full overflow-hidden p-1">
            <Image
              src={
                author?.imageUrl ||
                "https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Tumanyan_%282%29.jpg/640px-Tumanyan_%282%29.jpg"
              }
              className="h-full w-full rounded object-cover object-top"
              width={200}
              height={300}
              loading="lazy"
              quality={10}
              alt="Author's image"
            />
          </div>
        </ViewTransition>
        <div className="z-10 flex h-min w-full flex-none items-start justify-between p-2 text-xs font-bold uppercase">
          <div className="flex flex-col items-start gap-1">
            <p className="text-start">{author?.name}</p>
            <p>
              {author?.deathDate
                ? `${new Date(author?.birthDate!).getFullYear()} - ${new Date(author?.deathDate!).getFullYear()}`
                : new Date(author?.birthDate!).getFullYear()}
            </p>
          </div>
          <div className="flex flex-col items-end gap-1">
            {userRating ? (
              <TooltipContainer tooltipContent="Your Rating">
                <div className="flex h-min w-fit items-center justify-center gap-1 rounded-full bg-background/35 p-0 backdrop-blur-lg">
                  <p className="text-sm font-semibold uppercase text-foreground">
                    {userRating}
                  </p>
                  <User
                    size={14}
                    className="fill-yellow-300 stroke-yellow-500"
                  />
                </div>
              </TooltipContainer>
            ) : null}
            {averageRating ? (
              <TooltipContainer tooltipContent="Global Rating">
                <div className="flex h-min w-fit items-center justify-center gap-1 rounded-full bg-background/35 p-0 backdrop-blur-lg">
                  <p className="text-sm font-semibold uppercase text-foreground">
                    {Number.isInteger(averageRating)
                      ? averageRating
                      : averageRating.toFixed(1)}
                  </p>
                  <Earth size={14} className="stroke-yellow-500" />
                </div>
              </TooltipContainer>
            ) : null}
          </div>
        </div>
      </AspectRatio>
    </Link>
  );
}
