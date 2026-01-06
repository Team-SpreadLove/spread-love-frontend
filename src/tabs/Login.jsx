import Logo from "../components/Logo.jsx";

const Login = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-sl-white">
      <div className="mb-16">로고</div>
      <button
        type="button"
        className="flex items-center justify-center gap-3 w-96 py-4 bg-sl-white border border-sl-gray-light rounded-lg text-lg"
      >
        구글 로그인
      </button>
    </div>
  );
};

export default Login;
