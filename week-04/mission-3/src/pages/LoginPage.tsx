import { useState } from "react";
import useForm from "../hooks/useForm";
import { UserSigninInformation, validateSignin } from "../utils/validate";
import { postSignin } from "../apis/auth";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { LOCAL_STORAGE_KEY } from "../constants/key";
import { useNavigate } from "react-router-dom";
import GoogleButton from "../components/GoogleButton.tsx";

const LoginPage = () => {
  const navigate = useNavigate();
  const { setItem } = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);
  const [showPassword, setShowPassword] = useState(false);

  const { values, errors, touched, getInputProps } =
    useForm<UserSigninInformation>({
      initialValue: {
        email: "",
        password: "",
      },
      validate: validateSignin,
    });

  const handleSubmit = async () => {
    console.log(values);
    try {
      const response = await postSignin(values);
      setItem(response.data.accessToken);
      alert("로그인 성공!");
      navigate("/"); // 또는 메인 페이지로 이동
    } catch (error: any) {
      console.error("로그인 실패:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "로그인에 실패했습니다.";
      alert(`로그인 실패: ${errorMessage}`);
    }
  };

  // 오류가 있거나, 입력값이 비어있으면 버튼을 비활성화
  const isDisabled =
    Object.values(errors || {}).some((error) => error.length > 0) ||
    Object.values(values).some((value) => value === "");

  return (
    <div className="flex justify-center min-h-screen items-center bg-black">
      <div className="relative flex flex-col gap-4 items-center w-80 p-6">
        {/* 헤더 + 뒤로가기 */}
        <div className="flex items-center justify-center w-full mb-4">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="absolute left-0 text-white text-2xl"
          >
            &lt;
          </button>
          <h1 className="font-bold text-2xl text-white">로그인</h1>
        </div>

        {/* 로그인 폼 */}
        <div className="flex flex-col gap-3 w-full">
          {/* 이메일 입력 */}
          <div>
            <input
              {...getInputProps("email")}
              type="email"
              placeholder="이메일을 입력하세요"
              className={`w-full bg-zinc-800 text-white border-none rounded-lg px-4 py-3 outline-none placeholder-gray-500 ${
                errors?.email && touched?.email ? "ring-2 ring-red-500" : ""
              }`}
            />
            {errors?.email && touched?.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* 비밀번호 입력 */}
          <div>
            <div className="relative">
              <input
                {...getInputProps("password")}
                type={showPassword ? "text" : "password"}
                placeholder="비밀번호를 입력하세요"
                className={`w-full bg-zinc-800 text-white border-none rounded-lg px-4 py-3 pr-12 outline-none placeholder-gray-500 ${
                  errors?.password && touched?.password
                    ? "ring-2 ring-red-500"
                    : ""
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
            {errors?.password && touched?.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* 로그인 버튼 */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isDisabled}
            className={`rounded-lg w-full py-3 text-white font-semibold transition ${
              isDisabled
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-pink-500 hover:bg-pink-600"
            }`}
          >
            로그인
          </button>
        </div>

        {/* 하단 소셜 버튼 */}
        <GoogleButton />
      </div>
    </div>
  );
};

export default LoginPage;
