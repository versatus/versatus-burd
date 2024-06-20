import React, { ReactNode } from "react";

const BurdLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex max-w-3xl m-auto w-full flex-col gap-2 text-center p-24">
      <main className="flex flex-col items-center p-4 grow">{children}</main>
    </div>
  );
};

export default BurdLayout;
