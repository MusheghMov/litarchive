"use client";

import TiptapEditor from "@/components/TiptapEditor";

export default function () {
  return (
    <div className="flex w-full flex-col gap-6 px-4 md:px-8 lg:max-w-[1000px] lg:p-0">
      <TiptapEditor editable={true} />
    </div>
  );
}
