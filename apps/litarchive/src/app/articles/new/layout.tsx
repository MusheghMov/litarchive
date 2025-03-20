export default function BooksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mt-8 flex h-full w-full flex-row items-center justify-center gap-x-10 lg:mt-14">
      {children}
    </div>
  );
}
