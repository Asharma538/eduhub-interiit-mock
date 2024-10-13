import { onMount, type Component } from "solid-js";
import "./component.css";

const backend_url:string = import.meta.env.VITE_BACKEND_URL

const handleCredentialResponse = (response: any) => {
  const token = response.credential;
  console.log("Google ID Token:", token);

  // Send the token to your backend for verification
  console.log(backend_url);
  console.log(backend_url+"/login");
  fetch(backend_url+"/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer `+token,
    },
  })
  .then(res => res.json())
  .then((data) => {
    console.log("Login successful:", data);
  })
  .catch((error) => {
    console.error("Error:", error);
  });
};

// Google Login Button Component
const GoogleLogin: Component = () => {
  onMount(() => {
    window.google?.accounts.id.initialize({
      client_id: "828962016540-p7pupol91p0egci37j2q312mefifsjq0.apps.googleusercontent.com",
      callback: handleCredentialResponse,
    });

    window.google?.accounts.id.renderButton(document.getElementById("google-signin-button"),{ theme: "outline", size: "large" }
      // Customize button appearance
    );
  });

  return <button id="google-signin-button" class="googleLoginButton">Login with Google</button>;
};

export default GoogleLogin;
