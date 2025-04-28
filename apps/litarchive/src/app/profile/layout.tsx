export default function BooksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex w-full max-w-[1000px] flex-col items-start justify-between gap-2 self-center px-4 py-10 sm:p-10 lg:px-0">
      {children}
    </div>
  );
}
