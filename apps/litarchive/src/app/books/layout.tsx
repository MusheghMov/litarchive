export default function BooksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="m-auto mt-8 flex h-full w-full flex-col items-start gap-4 self-center px-4 md:px-8 lg:mt-14 lg:max-w-[1000px] lg:p-0">
      {children}
    </div>
  );
}
