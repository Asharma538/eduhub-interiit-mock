import { onMount, type Component } from "solid-js";
import "./component.css";
import { Navigator, useNavigate } from "@solidjs/router";
import { Axios, AxiosInstance } from "axios";
import { useAxiosContext } from "../lib/useAxiosContext";

const backend_url: string = import.meta.env.VITE_BACKEND_URL;

const handleCredentialResponse = (
  response: any,
  navigate: Navigator,
  axios: AxiosInstance
) => {
  const token = response.credential;
  console.log("Google ID Token:", token);

  // Send the token to your backend for verification
  console.log(backend_url);
  console.log(backend_url + "/login");

  axios
    .post(
      "/login",
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ` + token,
        },
      }
    )
    .then((res) => {
      const { jwtToken } = res.data;
      localStorage.setItem("jwtToken", jwtToken);
      navigate("/dashboard");
    })
    .catch((err) => {
      console.log(err);
    });
};

// Google Login Button Component
const GoogleLogin: Component = () => {
  const navigate = useNavigate();
  const axios = useAxiosContext();
  onMount(() => {

    axios!.get("/verify").then((res) => {
      if(res.status == 200){
        navigate("/dashboard");
      }
    })


    // @ts-expect-error
    window.google?.accounts.id.initialize({
      client_id:
        "828962016540-p7pupol91p0egci37j2q312mefifsjq0.apps.googleusercontent.com",
      callback: (response: any) =>
        handleCredentialResponse(response, navigate, axios),
    });

    // @ts-expect-error
    window.google?.accounts.id.renderButton(
      document.getElementById("google-signin-button"),
      { theme: "outline", size: "large" }
      // Customize button appearance
    );
  });

  return (
    <button id="google-signin-button" class="googleLoginButton">
      Login with Google
    </button>
  );
};

export default GoogleLogin;
