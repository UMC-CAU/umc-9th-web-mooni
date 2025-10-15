import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { postSignup } from "../apis/auth";
import GoogleButton from "../components/GoogleButton.tsx";

const schema = z
  .object({
    email: z.string().email({ message: "올바른 이메일 형식이 아닙니다." }),
    password: z
      .string()
      .min(8, { message: "비밀번호는 8자 이상이어야 합니다." })
      .max(20, { message: "비밀번호는 20자 이하이어야 합니다." }),
    passwordCheck: z
      .string()
      .min(8, { message: "비밀번호는 8자 이상이어야 합니다." })
      .max(20, { message: "비밀번호는 20자 이하이어야 합니다." }),
    nickName: z.string().min(1, { message: "닉네임을 입력해주세요." }),
    bio: z.string().optional(),
    avatar: z.string().optional(),
  })
  .refine((data) => data.password === data.passwordCheck, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["passwordCheck"],
  });

type FormFields = z.infer<typeof schema>;

const SignUpPage = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    trigger,
    //getValues,
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
      passwordCheck: "",
      nickName: "",
      bio: "",
      avatar: "",
    },
  });

  const email = watch("email");
  const password = watch("password");
  const confirmPassword = watch("passwordCheck");
  const nickName = watch("nickName");

  const matchError = confirmPassword && password !== confirmPassword;

  // 회원가입 API + 성공 시 /login 이동
  const onSubmit = async (formData: FormFields) => {
    try {
      const result = await postSignup({
        name: formData.nickName,
        email: formData.email,
        password: formData.password,
        bio: formData.bio,
        avatar: formData.avatar,
      });

      console.log("회원가입 성공:", result);
      alert("회원가입이 완료되었습니다!");
      navigate("/login");
    } catch (error: any) {
      console.error("회원가입 실패 상세:", error);
      console.error("에러 응답:", error.response?.data);
      console.error("에러 상태:", error.response?.status);

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "알 수 없는 오류가 발생했습니다.";
      alert(`회원가입 실패: ${errorMessage}`);
    }
  };

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();

    if (step === 1) {
      const valid = await trigger("email");
      if (valid) setStep(2);
    }

    if (step === 2) {
      const validPwd = await trigger("password");
      const validConfirm = await trigger("passwordCheck");

      if (validPwd && validConfirm && !matchError) setStep(3);
    }
  };

  return (
    <div className="flex justify-center min-h-screen items-center bg-black">
      <form
        onSubmit={step === 3 ? handleSubmit(onSubmit) : handleNext}
        className="relative flex flex-col gap-4 items-center w-80 p-6"
      >
        {/* 헤더 + 뒤로가기 */}
        <div className="flex items-center justify-center w-full mb-4">
          <button
            type="button"
            onClick={() => (step === 1 ? navigate("/") : setStep(step - 1))}
            className="absolute left-0 text-white text-2xl"
          >
            &lt;
          </button>
          <h1 className="font-bold text-2xl text-white">회원가입</h1>
        </div>

        {/* 이메일 */}
        {step === 1 && (
          <div className="flex flex-col items-center gap-3 w-full">
            <input
              {...register("email")}
              placeholder="이메일을 입력하세요"
              className={`w-full bg-zinc-800 text-white border-none rounded-lg px-4 py-3 outline-none placeholder-gray-500 ${
                errors.email ? "ring-2 ring-red-500" : ""
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}

            <button
              type="submit"
              disabled={!email || !!errors.email}
              className={`rounded-lg w-full py-3 text-white font-semibold transition ${
                !email || errors.email
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-pink-500 hover:bg-pink-600"
              }`}
            >
              다음
            </button>
          </div>
        )}

        {/* 비밀번호 입력 */}
        {step === 2 && (
          <div className="flex flex-col items-center gap-3 w-full">
            <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
              <span>✉️</span>
              <span>{email}</span>
            </div>

            {/* 비밀번호 */}
            <div className="relative w-full">
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                placeholder="비밀번호를 입력하세요"
                className={`w-full bg-zinc-800 text-white border-none rounded-lg px-4 py-3 pr-12 outline-none placeholder-gray-500 ${
                  errors.password ? "ring-2 ring-red-500" : ""
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

            {/* 비밀번호 확인 */}
            <div className="relative w-full">
              <input
                {...register("passwordCheck")}
                type={showConfirmPassword ? "text" : "password"}
                placeholder="비밀번호를 다시 입력하세요"
                className={`w-full bg-zinc-800 text-white border-none rounded-lg px-4 py-3 pr-12 outline-none placeholder-gray-500 ${
                  errors.passwordCheck ? "ring-2 ring-red-500" : ""
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>

            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
            {errors.passwordCheck && (
              <p className="text-red-500 text-sm">
                {errors.passwordCheck.message}
              </p>
            )}

            <button
              type="submit"
              disabled={
                errors.password ||
                errors.passwordCheck ||
                matchError ||
                !password ||
                !confirmPassword
              }
              className={`rounded-lg w-full py-3 text-white font-semibold transition ${
                errors.password ||
                errors.passwordCheck ||
                matchError ||
                !password ||
                !confirmPassword
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-pink-500 hover:bg-pink-600"
              }`}
            >
              다음
            </button>
          </div>
        )}

        {/* 닉네임 입력 + 완료 */}
        {step === 3 && (
          <div className="flex flex-col items-center gap-3 w-full">
            <div className="w-24 h-24 rounded-full bg-zinc-700 flex items-center justify-center mb-4">
              <svg
                className="w-12 h-12 text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                />
              </svg>
            </div>

            <input
              {...register("nickName")}
              placeholder="닉네임을 입력하세요"
              className={`w-full bg-zinc-800 text-white border-none rounded-lg px-4 py-3 outline-none placeholder-gray-500 ${
                errors.nickName ? "ring-2 ring-red-500" : ""
              }`}
            />
            {errors.nickName && (
              <p className="text-red-500 text-sm">{errors.nickName.message}</p>
            )}

            <input
              {...register("bio")}
              placeholder="한 줄 소개 (선택)"
              className="w-full bg-zinc-800 text-white border-none rounded-lg px-4 py-3 outline-none placeholder-gray-500"
            />
            <input
              {...register("avatar")}
              placeholder="아바타 URL (선택)"
              className="w-full bg-zinc-800 text-white border-none rounded-lg px-4 py-3 outline-none placeholder-gray-500"
            />

            <button
              type="submit"
              disabled={!nickName || !!errors.nickName || isSubmitting}
              className={`rounded-lg w-full py-3 text-white font-semibold transition ${
                !nickName || errors.nickName || isSubmitting
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-pink-500 hover:bg-pink-600"
              }`}
            >
              {isSubmitting ? "처리 중..." : "회원가입 완료"}
            </button>
          </div>
        )}

        {/* 하단 소셜 버튼  */}
        <GoogleButton />
      </form>
    </div>
  );
};

export default SignUpPage;
