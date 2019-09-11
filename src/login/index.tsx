import * as React from "react";
import {Button } from "semantic-ui-react";

import { loadScript, loadAuth2, signIn, signOut } from "./loginApi";

import { GoogleLoginState, GoogleLoginAction, GoogleUser } from "./types";

import "./index.css";

function googleLoginReducer(
  state: GoogleLoginState,
  action: GoogleLoginAction
): GoogleLoginState {
  switch (action.type) {
    case "loadPlatformStart":
      return { ...state, loadingPlatform: "platformLoading" };
    case "loadPlatformSuccess":
      return { ...state, loadingPlatform: "platformLoadSuccess" };
    case "loadPlatformFailure":
      return { ...state, loadingPlatform: "platformLoadFailure" };
    case "loadAuth2Start":
      return { ...state, loadingAuth2: "auth2Loading" };
    case "loadAuth2Init":
      return { ...state, loadingAuth2: "auth2Initing" };
    case "loadAuth2Success":
      return { ...state, loadingAuth2: "auth2LoadSuccess" };
    case "loadAuth2Failure":
      return { ...state, loadingAuth2: "auth2LoadFailure" };
    default:
      return state;
  }
}

const Login: React.FC<{
  autoSignIn: boolean;
  clientId: string;
  onLoginChange: (user: GoogleUser | null) => void;
}> = ({ autoSignIn, clientId, onLoginChange }) => {
  const [{ loadingPlatform, loadingAuth2 }, dispatch] = React.useReducer(
    googleLoginReducer,
    {
      loadingPlatform: "platformUnloaded",
      loadingAuth2: "auth2Unloaded"
    }
  );

  const [loading, setLoading] = React.useState(false);
  const [user, setUser] = React.useState<GoogleUser | null>(null);

  React.useEffect(() => {
    let cancelEffect = false;

    switch (loadingPlatform) {
      case "platformLoading":
        loadScript("https://apis.google.com/js/platform.js")
          .then(() => {
            if (!cancelEffect) {
              dispatch({ type: "loadPlatformSuccess" });
            }
          })
          .catch(() => {
            if (!cancelEffect) {
              dispatch({ type: "loadPlatformFailure" });
            }
          });
        break;
      case "platformLoadSuccess":
        loadAuth2()
          .then(() => {
            if (!cancelEffect) {
              dispatch({ type: "loadAuth2Init" });
            }
          })
          .catch((err: any) => {
            console.error(err);
            if (!cancelEffect) {
              dispatch({ type: "loadAuth2Failure" });
            }
          });
        break;
      default:
        break;
    }

    return () => {
      cancelEffect = true;
    };
  }, [loadingPlatform]);

  React.useEffect(() => {
    if (!window.gapi || !window.gapi.auth2) {
      return;
    }

    let cancelEffect = false;
    const signInWatcher = (isSignedIn: boolean): void => {
      if (window.gapi && window.gapi.auth2 && isSignedIn) {
        const user = window.gapi.auth2
          .getAuthInstance() // Auth Instance
          .currentUser.get(); // Current User
        const userProfile = user.getBasicProfile();

        if (!cancelEffect) {
          setUser({
            email: userProfile.getEmail(),
            name: userProfile.getName()
          });
          setLoading(false);
        }
        return;
      }

      if (!cancelEffect) {
        setLoading(false);
        setUser(null);
      }
    };

    switch (loadingAuth2) {
      case "auth2Initing":
        window.gapi.auth2
          .init({
            client_id: clientId
          })
          .then(
            () => dispatch({ type: "loadAuth2Success" }),
            (err: any) => {
              console.error(err);
              if (!cancelEffect) {
                dispatch({ type: "loadAuth2Failure" });
              }
            }
          );
        break;
      case "auth2LoadSuccess":
        const isSignedIn = window.gapi.auth2.getAuthInstance().isSignedIn;
        isSignedIn.listen(signInWatcher);
        signInWatcher(isSignedIn.get());

        if (autoSignIn && !isSignedIn.get()) {
          signIn();
        }

        break;
      default:
        break;
    }

    return () => {
      cancelEffect = true;
    };
  }, [autoSignIn, clientId, loadingAuth2]);

  React.useEffect(() => {
    let cancelEffect = false;

    if (!cancelEffect) {
      onLoginChange(user);
    }

    return () => {
      cancelEffect = true;
    };
  }, [onLoginChange, user]);

  const login = React.useCallback(() => {
    setLoading(true);
    if (loadingAuth2 === "auth2LoadSuccess") {
      signIn();
      return;
    }
    dispatch({ type: "loadPlatformStart" });
  }, [dispatch, loadingAuth2]);

  return (
    <div id="loginButtonDiv">
      <Button
        color="google plus"
        type="submit"
        loading={loading}
        onClick={user === null ? login : signOut}
      >
        Login
      </Button>
    </div>
  );
};

export default Login;
