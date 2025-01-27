import { useAppSelector } from "@/app/hook";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Link } from "react-router";

function LandingPage() {
  const { user } = useAppSelector((state) => state.auth);
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 opacity-70 blur-3xl" />

      {/* Content */}
      <div className="p-[1px] bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 shadow-md rounded-xl">
        <motion.div
          className="relative z-10 text-center space-y-8 p-8 bg-white backdrop-blur-md rounded-xl shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1
            className="text-5xl font-bold text-center bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-transparent bg-clip-text"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Welcome to the AI Trip Planner
          </motion.h1>
          <motion.p
            className="text-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <span className="font-[600] bg-gradient-to-r from-green-400 to-blue-500 text-transparent bg-clip-text">
              Plan
            </span>{" "}
            your next trip with ease
          </motion.p>
          <motion.p
            className="text-lg text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            Please log in to continue
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <Button asChild size="lg" className="">
              {user ? (
                <Link to="/home">Go to Dashboard</Link>
              ) : (
                <Link to="/login">Log In</Link>
              )}
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default LandingPage;
