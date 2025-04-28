import ListCard from "@/components/ListCard";
import { auth } from "@clerk/nextjs/server";
import honoClient from "../honoRPCClient";

export default async function ListsPage() {
  const { userId } = await auth();
  let lists;
  try {
    const listsJson = await honoClient.lists.$get(
      {
        query: {},
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
    <div className="flex w-full flex-col gap-y-4">
      <div className="flex w-fit items-center gap-2">
        <p className="font-bold capitalize">your lists</p>
        {lists && lists.length > 0 && (
          <p className="bg-primary/40 flex h-6 w-6 items-center justify-center rounded-full text-sm font-bold">
            {lists?.length}
          </p>
        )}
      </div>
      {lists && lists.length > 0 ? (
        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
          {lists?.map((list) => <ListCard key={list.id} list={list} />)}
        </div>
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <p className="text-sm font-bold">You have no lists</p>
        </div>
      )}
    </div>
  );
}
