import honoClient from "../honoRPCClient";
import Authors from "./Authors";

export default async function AuthorsPage() {
  let authors;
  try {
    const res = await honoClient.authors.$get({
      query: {
        search: "",
      },
    });
    if (res.ok) {
      authors = await res.json();
    }
  } catch (error) {
    console.error("Error fetching authors:", error);
  }

  if (!authors) {
    return <div>No authors found</div>;
  }

  return <Authors authors={authors} />;
}
