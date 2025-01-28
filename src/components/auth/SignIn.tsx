import type React from "react";
import type { AppDispatch } from "../../app/store";
import { auth, googleProvider } from "../../firebaseConfig";
import { signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import { setError, setUser } from "../../features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "../../app/hook";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import "@/styles/custom.css";
import {  useLocation, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { FirebaseError } from "firebase/app";

const SignInCard: React.FC = () => {
  const dispatch: AppDispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log(location);
    if (user) {
      const from = location.state?.from || "/home";
      navigate(from);
    }
  }, [user, navigate, location.state]);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      dispatch(
        setUser({
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL,
        })
      );
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      const firebaseError = error as FirebaseError;
      dispatch(setError(firebaseError.message || "Some error occurred"));
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const result = await signInWithEmailAndPassword(auth, email, password);
      dispatch(
        setUser({
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL,
        })
      );
    } catch (error) {
      console.error("Email Sign-In Error:", error);
      const firebaseError = error as FirebaseError;
      dispatch(setError(firebaseError.message || "Some error occurred"));
    } finally {
      setLoading(false);
    }
  };

  const handleSignUpRedirect = () => {
    const from = location.state?.from || "/home";
    navigate("/signup", { state: { from } });
  };

  return (
    <Card className="w-full max-w-md mx-auto p-[1px] bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 shadow-md">
      <div className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-[inherit]">
        <CardHeader className="bg-white bg-opacity-80 rounded-t-[inherit]">
          <CardTitle>Sign In</CardTitle>
          <CardDescription>
            Choose your preferred sign-in method
          </CardDescription>
        </CardHeader>
        <CardContent className="bg-white bg-opacity-80 rounded-b-[inherit] space-y-4">
          <Button
            onClick={handleGoogleSignIn}
            className="w-full gradient-hover"
          >
            <span>Sign in with Google</span>
          </Button>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const email = (
                e.currentTarget.elements.namedItem("email") as HTMLInputElement
              ).value;
              const password = (
                e.currentTarget.elements.namedItem(
                  "password"
                ) as HTMLInputElement
              ).value;
              handleEmailSignIn(email, password);
            }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Email"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Password"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full gradient-hover"
              disabled={loading}
            >
              {loading ? (
                <span className="animate-spin">
                  <Loader2 />
                </span>
              ) : (
                <span>Sign in with Email</span>
              )}
            </Button>
          </form>
          <small>
            Do not have an account.{" "}
            <button onClick={handleSignUpRedirect} className="underline">
              Sign up
            </button>{" "}
            today.
          </small>
        </CardContent>
      </div>
    </Card>
  );
};

export default SignInCard;
