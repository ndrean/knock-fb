import React from "react";
import ReactModalLogin from "react-modal-login";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Nav from "react-bootstrap/Nav";

import { myAppId, myAppSecret, uri } from "./ids";

const facebookConfig = {
  appId: myAppId,
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
    // if (loggedIn === false) {
    setShowModal(true);
    // }
  }

  function closeModal() {
    setShowModal(false);
    setError(null);
  }

  function onLogin() {
    console.log("_onLogin_");
    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;
    if (!email || !password) {
      setError(true);
    } else {
      onLoginSuccess("formIn", { email, password });
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
    setResult({ method, response });
    const { email, password } = response;

    if (method === "facebook") {
      const {
        authResponse: { accessToken, userID },
      } = response;

      // call Facebook to get user credentials: window.FB.api(userID, (res) =>{ setResult(res.name )})
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

      const fbUserData = {
        user: {
          email,
          uid: id,
        },
      };
      const queryAppToken = await fetch(uri + "/api/v1/findCreateFbUser", {
        method: "POST",
        body: JSON.stringify(fbUserData),
        headers: { "Content-Type": "application/json" },
      });
      if (queryAppToken.ok) {
        const { access_token } = await queryAppToken.json();
        const payload = {
          auth: { email, password: access_token, access_token },
        };
        try {
          const queryFbCreateUser = await fetch(uri + "/api/v1/getUserToken", {
            method: "POST",
            body: JSON.stringify(payload),
            headers: { "Content-Type": "application/json" },
          });
          if (queryFbCreateUser.ok) {
            const { jwt } = await queryFbCreateUser.json();
            const getCurrentUser = await fetch(uri + "/api/v1/profile", {
              headers: { authorization: "Bearer " + jwt },
            });
            const currentUser = await getCurrentUser.json();

            if (currentUser.confirm_email && !currentUser.confirm_token) {
              setLoggedIn(true);
              localStorage.setItem("jwt", jwt);
              localStorage.setItem("user", currentUser.email);
              alert(`Welcome ${currentUser.email}`);
            } else {
              onLoginFail("Check your mail to confirm password update");
            }
          } else {
            onLoginFail("Check your mail to confirm password update");
          }
        } catch (err) {
          throw new Error(err);
        }
      } else {
        onLoginFail("Please confirm with your email");
      }
    }

    const authData = JSON.stringify({
      auth: { email, password },
    });

    if (method === "formUp") {
      // 1- check if user already exists with these credentials
      try {
        const getUserToken = await fetch(uri + "/api/v1/getUserToken", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: authData,
        });

        if (getUserToken.ok) {
          const { jwt } = await getUserToken.json();
          const getCurrentUser = await fetch(uri + "/api/v1/profile", {
            headers: { authorization: "Bearer " + jwt },
          });
          const currentUser = await getCurrentUser.json();
          if (currentUser.confirm_email && !currentUser.confirm_token) {
            console.log("__confirmed__");
            setLoggedIn(true);
            localStorage.setItem("jwt", jwt);
            localStorage.setItem("user", currentUser.email);
            alert(`Welcome ${currentUser.email}`);
            setResult("confirmed");
          } else {
            onLoginFail("Check your mail to confirm password update 1");
          }
        } else {
          console.log("__update__");
          // credentials don't exist: update with received credentials via email
          const userData = JSON.stringify({
            user: { email: response.email, password: response.password },
          });
          const checkUser = await fetch(uri + "/api/v1/createUser", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: userData,
          });

          if (checkUser.ok) {
            try {
              const getUserToken = await fetch(uri + "/api/v1/getUserToken", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: authData,
              });

              if (getUserToken.ok) {
                console.log("updated in db, waiting for mail confirmation");
                const { jwt } = await getUserToken.json();

                // check in db if email_confirmed with the token
                const getCurrentUser = await fetch(uri + "/api/v1/profile", {
                  headers: { authorization: "Bearer " + jwt },
                });
                const currentUser = await getCurrentUser.json();

                if (currentUser.confirm_mail && !currentUser.confirm_token) {
                  console.log("__updated__");
                  setLoggedIn(true);
                  localStorage.setItem("jwt", jwt);
                  localStorage.setItem("user", currentUser.email);
                  alert(`Welcome ${currentUser.email}`);
                } else {
                  onLoginFail("Check your mail to confirm password update 2");
                }
              } else {
                onLoginFail("Not existing");
              }
            } catch (err) {
              throw new Error(err);
            }
          } else {
            onLoginFail("Bad input");
          }
        }
      } catch (err) {
        throw new Error(err);
      }
    }

    if (method === "formIn") {
      // check user with the jwt token return from the backend
      try {
        const getUserToken = await fetch(uri + "/api/v1/getUserToken", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: authData,
        });

        if (getUserToken.ok) {
          // need to have mail checked to enter
          const { jwt } = await getUserToken.json();
          const getCurrentUser = await fetch(uri + "/api/v1/profile", {
            headers: { authorization: "Bearer " + jwt },
          });
          const currentUser = await getCurrentUser.json();
          if (currentUser.confirm_email && !currentUser.confirm_token) {
            setLoggedIn(true);
            localStorage.setItem("jwt", jwt);
            localStorage.setItem("user", response.email);
            alert(`Welcome ${currentUser.email}`);
          } else {
            onLoginFail("Please confirm with your email");
          }
        } else {
          onLoginFail("Wrong credentials");
        }
      } catch (err) {
        throw new Error(err);
      }
    }
    closeModal();
    setLoading(false);
  }

  function onLoginFail(response) {
    alert(response);
    setError(response);
    setLoading(false);
    setLoggedIn(false);
    setResult({ error: response });
    localStorage.removeItem("jwt");
    localStorage.removeItem("user");
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
      <Nav className="justify-content-center" activeKey="/home">
        <Nav.Item>
          <Nav.Link href="/home">Home</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <button
            onClick={openModal}
            hidden={loggedIn}
            style={{
              padding: "10px",
              margin: "20px",
              border: "none",
              backgroundColor: "blue",
              color: "white",
              fontWeight: "bold",
            }}
          >
            Connect
          </button>
          {localStorage.jwt ? (
            <button
              onClick={() => {
                setLoggedIn(false);
                localStorage.removeItem("jwt");
                localStorage.removeItem("user");
              }}
            >
              Logout
            </button>
          ) : null}
        </Nav.Item>
      </Nav>

      <Container>
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
            // onRecoverPassword: onRecoverPassword,
            // recoverPasswordSuccessLabel: recoverPasswordSuccess
            //   ? {
            //       label: "New password has been sent to your mailbox!",
            //     }
            //   : null,
            // recoverPasswordAnchor: {
            //   label: "Forgot your password?",
            // },
            loginBtn: {
              label: "Sign in",
            },
            registerBtn: {
              label: "Sign up",
            },
            // recoverPasswordBtn: {
            //   label: "Send new password",
            // },
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
