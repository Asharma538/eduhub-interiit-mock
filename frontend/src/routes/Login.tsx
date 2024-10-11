import { createSignal } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { Alert, Button, Card } from "@suid/material";
import auth from "solid-auth-client"

const LoginPage = () => {
  const [error, setError] = createSignal("");
  const [loading, setLoading] = createSignal(false);
  const navigate = useNavigate();

  // OAuth Login function using solid-auth-client
  const handleOAuthLogin = async () => {
    setError("");
    setLoading(true);

    try {
      // Redirect to an OAuth provider (e.g., Google, GitHub, etc.)
     console.log(auth);
      await auth.login("https://accounts.google.com"); // Example: Google OAuth login
      navigate("/dashboard"); // Redirect to dashboard after successful login
    } catch (err) {
      setError("OAuth login failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="min-h-screen bg-gray-100 flex items-center justify-center">
      <Card class="w-full max-w-md p-6">
        <h1 class="text-2xl font-bold text-center mb-6">Login with Google</h1>
        {error() && (
          <Alert variant="outlined">
            <p>{error()}</p>
          </Alert>
        )}
        <Button
          type="button"
          disabled={loading()}
          onClick={handleOAuthLogin}
          class="w-full"
        >
          {loading() ? "Redirecting to Google..." : "Login with Google"}
        </Button>
      </Card>
    </div>
  );
};

export default LoginPage;
