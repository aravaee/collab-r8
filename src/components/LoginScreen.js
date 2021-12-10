import React from "react";
import * as Realm from "realm-web";
import { useRealmApp } from "../RealmApp";
import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import TextInput from "@leafygreen-ui/text-input";
import LGCard from "./Card";
import validator from "validator";
import Loading from "./Loading";

export default function LoginScreen() {
  const app = useRealmApp();
  // Toggle between logging users in and registering new users
  const [mode, setMode] = React.useState("login");
  const toggleMode = () => {
    setMode((oldMode) => (oldMode === "login" ? "register" : "login"));
  };
  // Keep track of form input state
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  // Keep track of input validation/errors
  const [error, setError] = React.useState({});
  // Whenever the mode changes, clear the form inputs
  React.useEffect(() => {
    setEmail("");
    setPassword("");
    setError({});
  }, [mode]);

  const [isLoggingIn, setIsLoggingIn] = React.useState(false);
  const handleLogin = async () => {
    setIsLoggingIn(true);
    setError((e) => ({ ...e, password: null }));
    try {
      await app.logIn(Realm.Credentials.emailPassword(email, password));
    } catch (err) {
      handleAuthenticationError(err, setError);
    }
  };

  const handleRegistrationAndLogin = async () => {
    const isValidEmailAddress = validator.isEmail(email);
    setError((e) => ({ ...e, password: null }));
    if (isValidEmailAddress) {
      try {
        // Register the user and, if successful, log them in
        await app.emailPasswordAuth.registerUser({ email, password });
        return await handleLogin();
      } catch (err) {
        handleAuthenticationError(err, setError);
      }
    } else {
      setError((err) => ({ ...err, email: "Email is invalid." }));
    }
  };

  return (
    <Container>
      <div style={{ color: "#e86a92", fontSize: "2rem" }}>
        <h1>
          Collab-R8{" "}
          <span role="img" aria-label="handshake">
            🤝
          </span>
        </h1>
      </div>
      {isLoggingIn ? (
        <Loading />
      ) : (
        <>
          <div style={{ width: "600px", color: "#1F1300" }}>
            <p>
              Hello! Welcome to Collab-R. This web-app allows you to keep track
              of your tasks. You can also add your friends/colleagues to easily
              collabrate!
            </p>
          </div>
          <Card>
            <LoginFormRow>
              <LoginHeading>
                {mode === "login" ? "Log In" : "Create account"}
              </LoginHeading>
            </LoginFormRow>
            <LoginFormRow>
              <TextInput
                type="email"
                label="Email"
                placeholder="email@example.ca"
                onChange={(e) => {
                  setError((e) => ({ ...e, email: null }));
                  setEmail(e.target.value);
                }}
                value={email}
                state={
                  error.email
                    ? "error"
                    : validator.isEmail(email)
                    ? "valid"
                    : "none"
                }
                errorMessage={error.email}
              />
            </LoginFormRow>
            <LoginFormRow>
              <TextInput
                type="password"
                label="Password"
                placeholder="password"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                value={password}
                state={
                  error.password ? "error" : error.password ? "valid" : "none"
                }
                errorMessage={error.password}
              />
            </LoginFormRow>
            {mode === "login" ? (
              <Button variant="default" onClick={() => handleLogin()}>
                Log In
              </Button>
            ) : (
              <Button
                variant="default"
                onClick={() => handleRegistrationAndLogin()}
              >
                Sign Up
              </Button>
            )}
            <ToggleContainer>
              <ToggleText>
                {mode === "login"
                  ? "Don't have an account?"
                  : "Already have an account?"}
              </ToggleText>
              <ToggleLink
                onClick={(e) => {
                  e.preventDefault();
                  toggleMode();
                }}
              >
                {mode === "login" ? "Sign Up now." : "Log in instead."}
              </ToggleLink>
            </ToggleContainer>
          </Card>
        </>
      )}
    </Container>
  );
}

function handleAuthenticationError(err, setError) {
  const { status, message } = parseAuthenticationError(err);
  const errorType = message || status;
  switch (errorType) {
    case "invalid username":
      setError((prevErr) => ({ ...prevErr, email: "Invalid email address." }));
      break;
    case "invalid username/password":
    case "invalid password":
    case "401":
      setError((err) => ({ ...err, password: "Incorrect password." }));
      break;
    case "name already in use":
    case "409":
      setError((err) => ({ ...err, email: "Email is already registered." }));
      break;
    case "password must be between 6 and 128 characters":
    case "400":
      setError((err) => ({
        ...err,
        password: "Password must be between 6 and 128 characters.",
      }));
      break;
    default:
      break;
  }
}

function parseAuthenticationError(err) {
  const parts = err.message.split(":");
  const reason = parts[parts.length - 1].trimStart();
  if (!reason) return { status: "", message: "" };
  const reasonRegex = /(?<message>.+)\s\(status (?<status>[0-9][0-9][0-9])/;
  const match = reason.match(reasonRegex);
  const { status, message } = match?.groups ?? {};
  return { status, message };
}

const Card = styled(LGCard)`
  width: 600px;
  background: #c1dbb3;
`;
const ToggleContainer = styled.div`
  margin-top: 8px;
  font-size: 12px;
  display: flex;
  justify-content: center;
`;

const ToggleText = styled.span`
  line-height: 28px;
`;

const ToggleLink = styled.button`
  background: none;
  border: none;
  font-size: 12px;
  color: #e86a92;
`;

const Container = styled.div`
  height: 100vh;
  justify-content: center;
  align-items: center;
  display: flex;
  flex-direction: column;
  background: #faedca;
`;

const LoginHeading = styled.h1`
  margin: 0;
  font-size: 32px;
  color: rgb(65, 79, 87);
`;

const LoginFormRow = styled.div`
  margin-bottom: 16px;
`;
