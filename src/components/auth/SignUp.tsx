import { auth } from "../../firebaseConfig";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { setError, setUser } from "../../features/auth/authSlice";
import { useAppDispatch } from "../../app/hook";
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
import { Link, useNavigate } from "react-router";
import { useState } from "react";
import { Loader2 } from "lucide-react";

function SignUp() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleEmailSignUp = async (
    email: string,
    password: string,
    displayName: string,
    photoURL: string
  ) => {
    try {
      setLoading(true);
      // Create user with email and password
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Update user profile with displayName and photoURL
      await updateProfile(result.user, {
        displayName,
        photoURL,
      });

      // Dispatch user details to the store
      dispatch(
        setUser({
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL,
        })
      );

      navigate("/dashboard");
    } catch (error) {
      console.error("Email Sign-Up Error:", error);
      if (error instanceof Error) {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto p-[1px] bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 shadow-md">
      <div className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-[inherit]">
        <CardHeader className="bg-white bg-opacity-80 rounded-t-[inherit]">
          <CardTitle>Sign Up</CardTitle>
          <CardDescription>Create your account</CardDescription>
        </CardHeader>
        <CardContent className="bg-white bg-opacity-80 rounded-b-[inherit] space-y-4">
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
              const displayName = (
                e.currentTarget.elements.namedItem(
                  "displayName"
                ) as HTMLInputElement
              ).value;
              const photoURL =
                "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg";
              handleEmailSignUp(email, password, displayName, photoURL);
            }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                id="displayName"
                name="displayName"
                type="text"
                placeholder="Display Name"
                required
              />
            </div>
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
                <span>Sign Up</span>
              )}
            </Button>
          </form>
          <small>
            Already have an account.{" "}
            <Link to={"/signin"} className="underline">
              Sign in
            </Link>{" "}
            instantly.
          </small>
        </CardContent>
      </div>
    </Card>
  );
}

export default SignUp;
