import honoClient from "@/app/honoRPCClient";
import { auth } from "@clerk/nextjs/server";
import ListBooks from "./ListBooks";

export default async function AuthorsPage({
  params,
}: {
  params: Promise<{
    listId: string;
  }>;
}) {
  const { listId } = await params;
  const { userId } = await auth();

  let list;
  try {
    const listsJson = await honoClient.lists[":listId"].$get(
      {
        param: { listId: listId },
      },
      {
        headers: { Authorization: `${userId}` },
      }
    );
    if (listsJson.ok) {
      list = await listsJson.json();
    }
  } catch (error) {
    console.error("error", error);
  }

  return (
    <>
      {list && list.books?.length > 0 && (
        <div className="flex flex-col space-y-4">
          <p className="font-bold capitalize">{list.name}</p>
          <ListBooks list={list} />
        </div>
      )}
    </>
  );
}
