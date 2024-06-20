import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { FaDownload } from "react-icons/fa6";

const DownloadWalletButton = () => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{
          duration: 0.8,
        }}
        className={"flex flex-col gap-4"}
      >
        <Link
          target={"_blank"}
          href={"https://itero.plasmo.com/ext/omkbidglggpedccmhohmemehpghgidaj"}
        >
          <button className="border-pink-500 font-black border text-pink-500 hover:opacity-50 rounded-md flex flex-row gap-2 px-10 p-4 disabled:opacity-50">
            <FaDownload className="text-xl" />
            DOWNLOAD <span>LASR</span> BETA WALLET
          </button>
        </Link>
      </motion.div>
    </AnimatePresence>
  );
};

export default DownloadWalletButton;
