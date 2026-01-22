export default function Login() {
  const handleLogin = () => {
    console.log("Redirecting to login...");
    window.location.href = "http://localhost:3000/auth/login";
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>TeamHub</h1>
      <p>Please sign in to continue</p>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}
