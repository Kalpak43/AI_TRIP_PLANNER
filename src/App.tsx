import React, { useEffect } from "react";
import { Routes, Route } from "react-router";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { useAppSelector } from "./app/hook";
import HomePage from "./pages/HomePage";
import SigninPage from "./pages/SigninPage";
import "@/styles/custom.css";
import "@/App.css";
import Layout from "./Layout";
import SignupPage from "./pages/SignupPage";
import { Toaster } from "./components/ui/toaster";
import { useToast } from "./hooks/use-toast";
import ProfilePage from "./pages/ProfilePage";
import PlanPage from "./pages/PlanPage";
import ItineraryPage from "./pages/ItineraryPage";
import LandingPage from "./pages/LandingPage";

const App: React.FC = () => {
  const { user, error } = useAppSelector((state) => state.auth);
  const { toast } = useToast();

  useEffect(() => {
    user &&
      toast({
        title: "Signed in Successfully.",
        variant: "success",
      });

    error &&
      toast({
        title: error,
        variant: "destructive",
      });
  }, [user, error]);

  return (
    <>
      <Routes>
        <Route path="/signin" element={<SigninPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<LandingPage />} />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/plan"
            element={
              <ProtectedRoute>
                <PlanPage />
              </ProtectedRoute>
            }
          />
          <Route path="/itinerary/:completeId" element={<ItineraryPage />} />
        </Route>
      </Routes>
      <Toaster />
    </>
  );
};

export default App;
