// src/components/GoogleButton.tsx
import React from "react";

type Props = {
  onClick?: () => void; // (선택) 커스텀 클릭 핸들러
  disabled?: boolean; // (선택) 비활성화 상태
  className?: string; // (선택) 스타일 확장
  text?: string; // (선택) 버튼 텍스트 커스터마이즈
};

const GoogleButton: React.FC<Props> = ({
  onClick,
  disabled = false,
  className = "",
  text = "구글로 계속하기",
}) => {
  const handleClick = () => {
    if (disabled) return;
    if (onClick) return onClick();
    alert("구글 로그인 준비 중입니다.");
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className={`mt-2 w-60 h-10 rounded-md border border-gray-300 bg-white
        flex items-center justify-center gap-2
        text-sm text-gray-700 hover:bg-gray-50
        disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
      aria-label="구글 로그인"
    >
      <img
        alt="google"
        width={18}
        height={18}
        src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
      />
      <span>{text}</span>
    </button>
  );
};

export default GoogleButton;
