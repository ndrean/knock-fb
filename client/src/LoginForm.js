import React from "react";
import ReactModalLogin from "react-modal-login";
import Container from "react-bootstrap/Container";

import { myappId, uri } from "./ids";

const facebookConfig = {
  appId: myappId,
  cookie: true,
  xfbml: true,
  version: "v7.0",
  scope: "email",
};

export default function LoginForm() {
  const [showModal, setShowModal] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [loggedIn, setLoggedIn] = React.useState(false);
  // const [initialTab, setInitialTal] = React.useState(null);
  const [recoverPasswordSuccess, setRecoverPasswordSuccess] = React.useState(
    null
  );
  const [result, setResult] = React.useState("");

  function openModal() {
    // setShowModal(true);
    if (loggedIn === false) {
      setShowModal(true);
    }
  }

  function closeModal() {
    setShowModal(false);
    setError(null);
  }

  function onLogin() {
    console.log("_onLogin_");

    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;
    console.log("email: ", email);
    console.log("password: ", password);

    if (!email || !password) {
      setError(true);
    } else {
      onLoginSuccess("formIn", { email: email, password: password });
    }
  }

  function onRegister() {
    console.log("_onRegister_");
    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;

    if (!email || !password) {
      setError(true);
    } else {
      onLoginSuccess("formUp", { email, password });
    }
  }

  function onRecoverPassword() {
    console.log("__onFotgottenPassword__");
    const email = document.querySelector("#email").value;

    if (!email) {
      setError(true);
      setRecoverPasswordSuccess(false);
    } else {
      setError(null);
      setRecoverPasswordSuccess(true);
      setResult({ method: "recoverPassword", recoverEmail: email });
    }
  }

  async function onLoginSuccess(method, response) {
    if (method === "facebook") {
      const {
        authResponse: { accessToken, userID },
      } = response;

      // call Facebook to get user credentials
      // window.FB.api(userID, (res) =>{ setResult(res.name )})
      const query = await fetch(`https://graph.facebook.com/me?access_token=${accessToken}&
fields=id,name,email,picture.width(640).height(640)`);
      const {
        id,
        name,
        email,
        picture: {
          data: { url, height, width },
        },
      } = await query.json();

      setResult({ method, accessToken, email, name, FBId: id, url });
      // const user = JSON.stringify({
      //   auth: { email: email, password: password },
      // });
      // const get_token = await fetchWithRailsToken(
      //   "http://localhost:3000/api/v1/userToken",
      //   {
      //     options: {
      //       method: "POST",
      //       "Content-Type": "application/json",
      //       body: user,
      //     },
      //   }
      // );
      // const jwtToken = await get_token.json();
      // console.log(jwtToken);
    } else {
      const { email, password } = response;
      setResult({ method, email, password });
      const userData = JSON.stringify({
        auth: { email: email, password: password },
      });
      // fetch the jwt token from the backend
      try {
        const get_user_token = await fetch(uri + "getUserToken", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: userData,
        });
        console.log(get_user_token);
        if (get_user_token.ok) {
          setLoggedIn(true);
          const { jwt } = await get_user_token.json();
          console.log(jwt);
          const fetchData = await fetch(uri + "users", {
            headers: {
              authorization: `Bearer ${jwt}`,
            },
          });
          const users = await fetchData.json();
          console.log(users);
        } else {
          alert("not found");
          setLoggedIn(false);
        }
      } catch (err) {
        console.log(err);
      }
    }

    closeModal();
  }

  function onLoginFail(response) {
    setLoading(false);
    setError(response);
    setResult({ error: response });
  }

  function startLoading() {
    setLoading(true);
  }

  function finishLoading() {
    setLoading(false);
  }

  // function afterTabsChange() {
  //   setError(null);
  //   setRecoverPasswordSuccess(false);
  // }

  return (
    <>
      <Container>
        <button onClick={openModal} hidden={loggedIn}>
          Connect
        </button>

        <ReactModalLogin
          visible={showModal}
          onCloseModal={closeModal}
          loading={loading}
          error={error}
          //   tabs={{ afterChange: afterTabsChange }}
          loginError={{ label: "Couldn't sign in, please try again." }}
          registerError={{ label: "Couldn't sign up, please try again." }}
          startLoading={startLoading}
          finishLoading={finishLoading}
          providers={{
            facebook: {
              config: facebookConfig,
              onLoginSuccess: onLoginSuccess,
              onLoginFail: onLoginFail,
              label: "Continue with Facebook",
            },
          }}
          form={{
            onLogin: onLogin,
            onRegister: onRegister,
            onRecoverPassword: onRecoverPassword,
            recoverPasswordSuccessLabel: recoverPasswordSuccess
              ? {
                  label: "New password has been sent to your mailbox!",
                }
              : null,
            recoverPasswordAnchor: {
              label: "Forgot your password?",
            },
            loginBtn: {
              label: "Sign in",
            },
            registerBtn: {
              label: "Sign up",
            },
            recoverPasswordBtn: {
              label: "Send new password",
            },
            loginInputs: [
              {
                containerClass: "RML-form-group",
                label: "Email",
                type: "email",
                inputClass: "RML-form-control",
                id: "email",
                name: "email",
                placeholder: "Email",
              },
              {
                containerClass: "RML-form-group",
                label: "Password",
                type: "password",
                inputClass: "RML-form-control",
                id: "password",
                name: "password",
                placeholder: "Password",
              },
            ],
            registerInputs: [
              // {
              //   containerClass: "RML-form-group",
              //   label: "Nickname",
              //   type: "text",
              //   inputClass: "RML-form-control",
              //   id: "login",
              //   name: "login",
              //   placeholder: "Nickname",
              // },
              {
                containerClass: "RML-form-group",
                label: "Email",
                type: "email",
                inputClass: "RML-form-control",
                id: "email",
                name: "email",
                placeholder: "Email",
              },
              {
                containerClass: "RML-form-group",
                label: "Password",
                type: "password",
                inputClass: "RML-form-control",
                id: "password",
                name: "password",
                placeholder: "Password",
              },
            ],
            recoverPasswordInputs: [
              {
                containerClass: "RML-form-group",
                label: "Email",
                type: "email",
                inputClass: "RML-form-control",
                id: "email",
                name: "email",
                placeholder: "Email",
              },
            ],
          }}
        />
      </Container>
    </>
  );
}
