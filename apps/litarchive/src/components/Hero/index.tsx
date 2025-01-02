/* eslint-disable react/no-unescaped-entities */
"use client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { MoveRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Autoplay from "embla-carousel-autoplay";

export default function Hero() {
  return (
    <div className="flex h-min items-center justify-center overflow-hidden lg:py-16">
      <Carousel
        plugins={[
          Autoplay({
            delay: 4000,
          }),
        ]}
        className="h-min w-full [&>div]:h-min"
      >
        <CarouselContent className="h-[100dvh] md:h-full">
          <CarouselItem className="flex h-full items-center justify-center">
            <div className="relative h-full bg-transparent lg:max-w-[80%]">
              <div className="relative z-20 flex h-full w-full flex-col justify-center gap-40 bg-gray-500/30 p-3 text-foreground text-white md:bg-transparent md:p-0 md:mix-blend-normal">
                <p className="translate-x-10 text-lg font-light italic text-foreground">
                  - Authors
                </p>
                <p className="w-[60%] translate-x-10 text-3xl font-semibold text-foreground sm:text-7xl">
                  Hovhannes Tumanyan: Armenia's national poet and writer
                </p>
                <div className="flex flex-col pl-6">
                  <p className="text-foreground">
                    Hovhannes Tumanyan biography and books
                  </p>
                  <Link
                    href="/authors/27"
                    className="flex flex-row text-foreground"
                  >
                    Learn More <MoveRight />
                  </Link>
                </div>
              </div>
              <div className="absolute bottom-0 top-0 m-auto h-full w-full overflow-hidden bg-black md:right-10 md:h-[400px] md:w-[400px] md:rounded-full lg:right-20 lg:top-20 lg:h-[600px] lg:w-[600px]">
                <div className="absolute z-10 h-full w-full bg-gray-500/40 md:rounded-full"></div>
                <Image
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Tumanyan_%282%29.jpg/640px-Tumanyan_%282%29.jpg"
                  alt="Hovhannes Tumanyan"
                  priority
                  quality={40}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  fill
                  loading="eager"
                  className="object-cover"
                />
              </div>
            </div>
          </CarouselItem>
          <CarouselItem className="flex h-full items-center justify-center">
            <div className="relative h-full bg-transparent md:max-w-[80%]">
              <div className="relative z-20 flex h-full w-full flex-col justify-center gap-40 bg-gray-500/30 text-foreground text-white md:bg-transparent md:mix-blend-normal">
                <p className="translate-x-10 text-lg font-light italic text-foreground">
                  - Authors
                </p>
                <p className="w-[60%] translate-x-10 text-3xl font-semibold text-foreground sm:text-7xl">
                  Ink & Insight: Eghishe Charents' Literary Luminescence
                </p>
                <div className="flex flex-col pl-6">
                  <p className="text-foreground">
                    Eghishe Charents' biography and books
                  </p>
                  <Link
                    href="/authors/17"
                    className="flex flex-row text-foreground"
                  >
                    Learn More <MoveRight />
                  </Link>
                </div>
              </div>

              <div className="absolute bottom-0 top-0 m-auto h-full w-full overflow-hidden bg-black md:right-10 md:top-20 md:h-[400px] md:w-[400px] md:rounded-full lg:right-20 lg:top-10 lg:h-[600px] lg:w-[600px]">
                <div className="absolute z-10 h-full w-full bg-gray-500/40 md:rounded-full"></div>
                <Image
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Yeghishe_Charents_Armenian_poet.jpg/1200px-Yeghishe_Charents_Armenian_poet.jpg"
                  alt="Eghishe Charents"
                  fill
                  quality={40}
                  loading="lazy"
                  className="object-cover"
                />
              </div>
            </div>
          </CarouselItem>
          <CarouselItem className="flex h-full items-center justify-center">
            <div className="relative h-full bg-transparent md:max-w-[80%]">
              <div className="relative z-20 flex h-full w-full flex-col justify-center gap-40 bg-gray-500/30 text-foreground text-white md:bg-transparent md:mix-blend-normal">
                <p className="translate-x-10 text-lg font-light italic text-foreground">
                  - Authors
                </p>
                <p className="w-[60%] translate-x-10 text-3xl font-semibold text-foreground sm:text-7xl">
                  Vahan Teryan: Poetic Visions in the Armenian Soul
                </p>
                <div className="flex flex-col pl-6 text-foreground">
                  <p>Vahan Teryan's biography and books</p>
                  <Link
                    href="/authors/38"
                    className="flex flex-row text-foreground"
                  >
                    Learn More <MoveRight />
                  </Link>
                </div>
              </div>

              <div className="absolute bottom-0 top-0 m-auto h-full w-full overflow-hidden bg-black md:right-10 md:top-20 md:h-[400px] md:w-[400px] md:rounded-full lg:right-20 lg:top-10 lg:h-[600px] lg:w-[600px]">
                <div className="absolute z-10 h-full w-full bg-gray-500/40 md:rounded-full"></div>
                <Image
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Vahan_Teryan_portrait.jpg/1920px-Vahan_Teryan_portrait.jpg"
                  alt="Vahan Teryan"
                  quality={40}
                  fill
                  loading="lazy"
                  className="object-cover"
                />
              </div>
            </div>
          </CarouselItem>
        </CarouselContent>
        <CarouselPrevious className="left-4" />
        <CarouselNext className="right-4" />
      </Carousel>
    </div>
  );
}
