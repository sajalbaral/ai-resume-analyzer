import { useState } from "react";
import supabase from "../supabase";
import AuthField from "./AuthField";
import AuthRight from "./AuthRight";
import { AuthLogo } from "./Icons";

export default function Auth({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [signUpSuccess, setSignUpSuccess] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  async function handleLogin() {
    setError("");
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setError(error.message);
    } else {
      setUser(data.user);
    }
  }

  async function handleSignUp() {
    setError("");
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setError(error.message);
    } else {
      setSignUpSuccess(true);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      isLogin ? handleLogin() : handleSignUp();
    }
  }

  async function handleGoogleLogin() {
    setError("");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
    if (error) {
      setError(error.message);
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-left">
        <div className="auth-card">
          <AuthLogo />

          <div className="auth-header">
            <h2>{isLogin ? "Welcome back" : "Create an account"}</h2>
            <p>
              {isLogin
                ? "Sign in to your account"
                : "Start analyzing your resume today"}
            </p>
          </div>

          <button className="auth-btn" onClick={handleGoogleLogin}>
            Continue with Google
          </button>

          <div className="auth-divider">
            <span>or</span>
          </div>

          {signUpSuccess ? (
            <div className="auth-success">
              <div className="auth-success-icon">✓</div>
              <h3>Check your email</h3>
              <p>
                We sent a confirmation link to <strong>{email}</strong>. Click
                it to activate your account, then sign in.
              </p>
              <button
                className="auth-btn"
                onClick={() => {
                  setSignUpSuccess(false);
                  setIsLogin(true);
                }}
              >
                Back to Sign In
              </button>
            </div>
          ) : (
            <>
              {error && <div className="auth-error">{error}</div>}

              <AuthField
                label="Email"
                type="email"
                placeholder={"you@example.com"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyDown}
              />

              <AuthField
                label="Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
              />

              <button
                className="auth-btn"
                onClick={isLogin ? handleLogin : handleSignUp}
              >
                {isLogin ? "Sign in" : "Sign up"}
              </button>

              <p className="auth-toggle">
                {isLogin
                  ? "Don't have an account?"
                  : "Already have an account?"}
                <button
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError("");
                  }}
                >
                  {isLogin ? "Sign up" : "Sign in"}
                </button>
              </p>
            </>
          )}
        </div>
      </div>
      <AuthRight />
    </div>
  );
}
