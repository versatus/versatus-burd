import React, { useState } from "react";
import { useLasrWallet } from "@/providers/LasrWalletProvider";
import axios from "axios";
import BurdTitle from "@/components/BurdTitle";
import { AnimatePresence, motion } from "framer-motion";
import { delay } from "@/lib/utils";

const SignUpForm = ({ getProgram }: { getProgram: any }) => {
  const { address } = useLasrWallet();
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [isSigningUp, setIsSigningUp] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    setIsSigningUp(true);
    e.preventDefault();
    try {
      await axios.post("/api/add-user", {
        address,
        handle: displayName,
        username,
        imgUrl,
      });
      await delay(1000);
      await getProgram();
    } catch (e) {
      console.log(e);
    } finally {
      setIsSigningUp(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{
          duration: 1,
        }}
        className={""}
      >
        <div className="flex items-center w-full justify-start p-4 text-white text-xl">
          <span
            className={
              "flex flex-col justify-center w-full text-center items-center gap-1"
            }
          >
            <BurdTitle />
            <form
              onSubmit={handleSignUp}
              className="flex flex-col w-full items-center gap-2 mt-6 "
            >
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full  text-center focus:outline-none p-2 border border-gray-600 bg-gray-600 text-white rounded-lg"
              />
              <input
                type="text"
                placeholder="Display Name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full text-center focus:outline-none p-2 border border-gray-600 bg-gray-600 text-white rounded-lg"
              />
              <input
                type="text"
                placeholder="X PFP URL (https://pbs.twimg.com...)"
                value={imgUrl}
                onChange={(e) => setImgUrl(e.target.value)}
                className="w-full text-center focus:outline-none p-2 border border-gray-600 bg-gray-600 text-white rounded-lg"
              />
              <button
                disabled={!username || !displayName || !imgUrl || isSigningUp}
                type="submit"
                className="bg-pink-600  w-full hover:opacity-75 mt-8 text-white font-bold py-2 px-4 rounded disabled:opacity-20"
              >
                {isSigningUp ? "Signing Up..." : "Sign Up"}
              </button>
            </form>
          </span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SignUpForm;
