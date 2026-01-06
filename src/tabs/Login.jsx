import Logo from "../components/Logo.jsx";

const Login = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-sl-white">
      <div className="mb-8">
        <Logo iconSize={128} textSize={64} spacing="ml-2" />
      </div>
      <button type="button">
        <img src="/images/icons/google-signin.svg" alt="Google로 로그인" className="h-12" />
      </button>
    </div>
  );
};

export default Login;
