import { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import Field from "../../components/forms/Field.jsx";
import Button from "../../components/buttons/Button.jsx";
import Modal from "../../components/modals/Modal.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import { demoUsers, DEMO_PASSWORD } from "../../services/authService.js";
import { API_URL } from "../../config/api.js";

export default function Login() {
  const { login } = useAuth();
  const toast = useToast();
  const [form, setForm] = useState({ email: "", password: "", remember: true });
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [forgot, setForgot] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [signup, setSignup] = useState(false);
  const [signupForm, setSignupForm] = useState({
    email: "",
    password: "",
    name: "",
    role: "employee",
  });
  const [signupError, setSignupError] = useState("");
  const [signupLoading, setSignupLoading] = useState(false);

  const setLoginField = (key) => (e) => {
    const value = key === "remember" ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const setSignupField = (key) => (e) => {
    setSignupForm((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password)
      return setError("Enter your email and password.");
    setError("");
    setLoading(true);
    try {
      await login(form.email, form.password, form.remember);
    } catch (err) {
      setError(err.message || "Login failed");
      setLoading(false);
    }
  };

  const submitSignup = async (e) => {
    if (e) e.preventDefault();
    if (!signupForm.email || !signupForm.password || !signupForm.name) {
      return setSignupError("All fields are required.");
    }
    if (signupForm.password.length < 6) {
      return setSignupError("Password must be at least 6 characters.");
    }
    // Only employee self-signup is allowed
    if (signupForm.role !== "employee") {
      return setSignupError(
        "Only Employee signup is open. Admin and HR require verification.",
      );
    }
    setSignupError("");
    setSignupLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: signupForm.email.trim().toLowerCase(),
          password: signupForm.password,
          name: signupForm.name.trim(),
          role: "employee",
        }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error || "Signup failed");
      toast.success("Account created! You can now sign in.");
      setSignup(false);
      setForm((prev) => ({
        ...prev,
        email: signupForm.email,
        password: signupForm.password,
      }));
      setSignupForm({ email: "", password: "", name: "", role: "employee" });
    } catch (err) {
      setSignupError(err.message || "Signup failed");
    } finally {
      setSignupLoading(false);
    }
  };

  return (
    <div className="login">
      <div className="login-art">
        <div className="brand" style={{ padding: 0 }}>
          <span className="brand-mark">H</span>HCM Lite
        </div>
        <div>
          <h1 style={{ fontSize: 34, lineHeight: 1.15, maxWidth: 420 }}>
            People, attendance and payroll in one calm place.
          </h1>
          <p style={{ opacity: 0.75, marginTop: 12, maxWidth: 420 }}>
            Admins set up the organization, HR runs daily operations, and
            employees see only their own records.
          </p>
        </div>
        <p className="small" style={{ opacity: 0.6 }}>
          Connected to MongoDB Atlas. Real backend API.
        </p>
      </div>
      <div className="login-form">
        <form className="card card-pad stack" onSubmit={submit} noValidate>
          <div>
            <h1>Sign in</h1>
            <p className="muted">Use a demo account below or enter your own.</p>
          </div>
          {error && (
            <div className="alert" role="alert">
              {error}
            </div>
          )}
          <Field
            label="Email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={setLoginField("email")}
          />
          <div className="field">
            <label htmlFor="pw">Password</label>
            <div style={{ position: "relative" }}>
              <input
                id="pw"
                className="input"
                type={show ? "text" : "password"}
                autoComplete="current-password"
                value={form.password}
                onChange={setLoginField("password")}
                style={{ paddingRight: 44 }}
              />
              <button
                type="button"
                className="btn ghost sm icon"
                aria-label={show ? "Hide password" : "Show password"}
                onClick={() => setShow((s) => !s)}
                style={{ position: "absolute", right: 4, top: 5 }}
              >
                {show ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <div className="row between">
            <label className="check">
              <input
                type="checkbox"
                checked={form.remember}
                onChange={setLoginField("remember")}
              />
              Remember me
            </label>
            <button
              type="button"
              className="btn ghost sm"
              onClick={() => setForgot(true)}
            >
              Forgot password?
            </button>
          </div>
          <Button variant="primary" type="submit" loading={loading}>
            Sign in
          </Button>
          <hr className="divider" />
          <div className="stack-sm">
            <span className="muted small">Quick demo login</span>
            <div className="row">
              {demoUsers.map((u) => (
                <Button
                  key={u.id}
                  size="sm"
                  type="button"
                  onClick={() =>
                    setForm((prev) => ({
                      ...prev,
                      email: u.email,
                      password: DEMO_PASSWORD,
                    }))
                  }
                >
                  {u.role === "hr"
                    ? "HR"
                    : u.role[0].toUpperCase() + u.role.slice(1)}
                </Button>
              ))}
            </div>
            <span className="muted small">Password: {DEMO_PASSWORD}</span>
          </div>
          <Button
            variant="ghost"
            type="button"
            onClick={() => {
              setSignup(true);
              setSignupError("");
            }}
            style={{ marginTop: 8 }}
          >
            Don&apos;t have an account? Sign up
          </Button>
        </form>
      </div>

      {forgot && (
        <Modal
          title="Reset password"
          onClose={() => setForgot(false)}
          footer={
            <>
              <Button type="button" onClick={() => setForgot(false)}>
                Cancel
              </Button>
              <Button
                type="button"
                variant="primary"
                onClick={() => {
                  setForgot(false);
                  toast.success(
                    "If that email exists, a reset link has been sent.",
                  );
                }}
              >
                Send reset link
              </Button>
            </>
          }
        >
          <Field
            label="Work email"
            type="email"
            value={resetEmail}
            onChange={(e) => setResetEmail(e.target.value)}
          />
        </Modal>
      )}

      {signup && (
        <Modal
          title="Create account"
          onClose={() => setSignup(false)}
          footer={
            <>
              <Button type="button" onClick={() => setSignup(false)}>
                Cancel
              </Button>
              <Button
                type="button"
                variant="primary"
                loading={signupLoading}
                onClick={submitSignup}
              >
                Sign up as Employee
              </Button>
            </>
          }
        >
          <form className="stack" onSubmit={submitSignup}>
            {signupError && (
              <div className="alert" role="alert">
                {signupError}
              </div>
            )}
            <Field
              label="Full name"
              value={signupForm.name}
              onChange={setSignupField("name")}
              autoComplete="name"
            />
            <Field
              label="Email"
              type="email"
              value={signupForm.email}
              onChange={setSignupField("email")}
              autoComplete="email"
            />
            <Field
              label="Password"
              type="password"
              value={signupForm.password}
              onChange={setSignupField("password")}
              autoComplete="new-password"
              hint="At least 6 characters"
            />
            <div className="field">
              <label>Role</label>
              <div className="row" style={{ gap: 8, flexWrap: "wrap" }}>
                <button
                  type="button"
                  className="btn sm"
                  style={{
                    borderColor: "var(--brand)",
                    background: "var(--brand)",
                    color: "#fff",
                  }}
                  onClick={() =>
                    setSignupForm((p) => ({ ...p, role: "employee" }))
                  }
                >
                  Employee
                </button>
                <button
                  type="button"
                  className="btn sm"
                  disabled
                  title="Verify before signup as admin"
                  style={{ opacity: 0.65, cursor: "not-allowed" }}
                >
                  <Lock size={14} style={{ marginRight: 6 }} />
                  Admin
                </button>
                <button
                  type="button"
                  className="btn sm"
                  disabled
                  title="Verify before signup as HR"
                  style={{ opacity: 0.65, cursor: "not-allowed" }}
                >
                  <Lock size={14} style={{ marginRight: 6 }} />
                  HR
                </button>
              </div>
              <p className="muted small" style={{ marginTop: 8 }}>
                Verify before signup as admin and hr. Self-signup is open for{" "}
                <strong>Employee</strong> only.
              </p>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
