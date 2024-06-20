"use client";
import { LasrWalletProvider } from "@/providers/LasrWalletProvider";
import { Toaster } from "react-hot-toast";
import BurdCage from "@/components/BurdCage";
import { BurdProvider } from "@/providers/BurdProvider";
import { BurdAccountProvider } from "@/providers/BurdAccountProvider";

export default function BurdPage() {
  return (
    <LasrWalletProvider>
      <BurdProvider>
        <BurdAccountProvider>
          <div className={"bg-gray-800 min-h-screen"}>
            <BurdCage />
            <Toaster
              position={"bottom-right"}
              toastOptions={{
                className: "bg-pink-600 text-white font-bold",
                style: {
                  backgroundColor: "#374151",
                  padding: "16px",
                  color: "white",
                  wordBreak: "break-all",
                },
              }}
            />
          </div>
        </BurdAccountProvider>
      </BurdProvider>
    </LasrWalletProvider>
  );
}
