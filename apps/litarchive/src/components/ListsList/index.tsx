import honoClient from "@/app/honoRPCClient";
import { ArrowRight } from "lucide-react";
import ListCard from "../ListCard";
import { Button } from "../ui/button";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";

export default async function ListsList() {
  const { userId } = await auth();
  let lists;
  try {
    const listsJson = await honoClient.lists.$get(
      {
        query: {
          limit: "3",
        },
      },
      {
        headers: { Authorization: `${userId}` },
      }
    );
    if (listsJson.ok) {
      lists = await listsJson.json();
    }
  } catch (error) {
    console.error("error", error);
  }

  return (
    <>
      {lists && lists.length > 0 && (
        <div className="flex w-full flex-col gap-y-4">
          <div className="flex w-full items-center justify-between gap-4">
            <div className="flex w-fit items-center gap-2">
              <p className="font-bold capitalize">your lists</p>
              <p className="bg-primary/40 flex h-6 w-6 items-center justify-center rounded-full text-sm font-bold">
                {lists?.length}
              </p>
            </div>
            <Link href="/lists">
              <Button className="w-fit" variant="link">
                View All Lists
                <ArrowRight size={16} className="ml-1" />
              </Button>
            </Link>
          </div>
          <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
            {lists?.map((list) => <ListCard key={list.id} list={list} />)}
          </div>
        </div>
      )}
    </>
  );
}
