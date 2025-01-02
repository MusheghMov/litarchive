export default function Layout({
  children,
  authorBooks,
}: {
  children: React.ReactNode;
  authorBooks: React.ReactNode;
}) {
  return (
    <div className="mt-0 flex w-full flex-col items-start justify-between pb-10 lg:mt-8">
      {children}
      {authorBooks}
    </div>
  );
}
