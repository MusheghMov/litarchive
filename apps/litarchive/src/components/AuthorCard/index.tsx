import { Earth, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import TooltipContainer from "@/components/TooltipContainer";
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
      className="border-foreground/20 bg-card hover:border-primary/60 relative flex aspect-[9/12] w-full flex-col justify-end overflow-hidden rounded border p-1"
    >
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
              <div className="bg-background/35 flex h-min w-fit items-center justify-center gap-1 rounded-full p-0 backdrop-blur-lg">
                <p className="text-foreground text-sm font-semibold uppercase">
                  {userRating}
                </p>
                <User size={14} className="fill-yellow-300 stroke-yellow-500" />
              </div>
            </TooltipContainer>
          ) : null}
          {averageRating ? (
            <TooltipContainer tooltipContent="Global Rating">
              <div className="bg-background/35 flex h-min w-fit items-center justify-center gap-1 rounded-full p-0 backdrop-blur-lg">
                <p className="text-foreground text-sm font-semibold uppercase">
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
    </Link>
  );
}
