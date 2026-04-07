"use client";

import Link from "next/link";
import { useState } from "react";
import { login } from "@/lib/auth-actions";
import { showAlert } from "@/lib/show-alert";

export default function Login({ onLogin }: { onLogin?: () => void }) {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(form.email, form.password);
      await showAlert({
        icon: "info",
        title: "Logged in!",
        message: "You're all set. You can speak with AVA freely from now on.",
        onConfirm: onLogin,
      });
    } catch (err) {
      await showAlert({
        icon: "warning",
        title: "Error Loggin In",
        message: "Incorret email or password. Try again.",
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-10 flex flex-col gap-4 items-center w-full md:max-w-lg sm:max-w-md"
    >
      <h1 className="md:text-5xl sm:text-4xl text-3xl font-medium leading-4">
        Welcome back
      </h1>
      <h2>Sign in your account</h2>

      <Input
        placeholder="Email"
        example="username@interactiveworkes.com"
        value={form.email}
        onChange={(value) => setForm((prev) => ({ ...prev, email: value }))}
      />

      <Input
        placeholder="Password"
        example="********"
        secret
        value={form.password}
        onChange={(value) => setForm((prev) => ({ ...prev, password: value }))}
      />

      <button
        type="submit"
        className="bg-white text-black font-medium rounded-xl px-4 py-3 w-full cursor-pointer mt-4"
      >
        Login
      </button>

      <p>
        Can't login?{" "}
        <Link href={""} className="hover:underline">
          Contact support now.
        </Link>
      </p>
    </form>
  );
}

const Input = ({
  placeholder,
  example,
  value,
  onChange,
  secret = false,
}: {
  placeholder?: string;
  example?: string;
  value?: string;
  onChange?: (value: string) => void;
  secret?: boolean;
}) => {
  const [isSecret, setIsSecret] = useState<boolean>(secret);

  return (
    <div className="border rounded-lg border-[#606060] w-full py-2 px-4 text-sm relative">
      {placeholder && (
        <span className="text-xs select-none">{placeholder}</span>
      )}

      <input
        placeholder={example}
        className="w-full outline-0 bg-transparent"
        type={isSecret ? "password" : "text"}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
      />

      {secret && (
        <svg
          width="17"
          height="12"
          viewBox="0 0 17 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="cursor-pointer absolute bottom-0 right-0 m-4 group/eye z-10"
          onClick={() => setIsSecret(!isSecret)}
        >
          <path
            d="M8.21779 2.31592C7.49378 2.31592 6.78603 2.53062 6.18404 2.93285C5.58205 3.33509 5.11286 3.90681 4.83579 4.57571C4.55872 5.2446 4.48623 5.98064 4.62748 6.69073C4.76873 7.40083 5.11737 8.0531 5.62932 8.56505C6.14127 9.077 6.79354 9.42564 7.50363 9.56689C8.21373 9.70814 8.94977 9.63565 9.61866 9.35858C10.2876 9.08151 10.8593 8.61232 11.2615 8.01033C11.6638 7.40833 11.8784 6.70059 11.8784 5.97658C11.8784 5.00571 11.4928 4.07461 10.8063 3.3881C10.1198 2.7016 9.18866 2.31592 8.21779 2.31592V2.31592ZM8.21779 8.2925C7.75975 8.2925 7.31199 8.15667 6.93113 7.9022C6.55028 7.64772 6.25344 7.28602 6.07816 6.86284C5.90287 6.43966 5.85701 5.97401 5.94637 5.52476C6.03573 5.07552 6.2563 4.66286 6.58019 4.33897C6.90408 4.01508 7.31673 3.79451 7.76598 3.70515C8.21522 3.61579 8.68088 3.66166 9.10406 3.83694C9.52724 4.01223 9.88894 4.30907 10.1434 4.68992C10.3979 5.07077 10.5337 5.51853 10.5337 5.97658C10.5337 6.5908 10.2897 7.17986 9.8554 7.61418C9.42108 8.0485 8.83201 8.2925 8.21779 8.2925V8.2925ZM16.204 5.02032C15.9113 4.41788 15.5284 3.86365 15.0684 3.37677C14.2022 2.45645 13.1932 1.68198 12.0802 1.08325C10.901 0.410955 9.57459 0.0389477 8.21779 0C6.15391 0.10806 4.18381 0.8961 2.61475 2.24122C1.92702 2.78264 1.31185 3.41036 0.784426 4.1089C0.571717 4.40244 0.386649 4.71506 0.231592 5.04274C0.0904976 5.3346 0.011631 5.65261 0 5.97658C0.00850478 6.30814 0.0874495 6.63411 0.231592 6.93283C0.524277 7.53527 0.907203 8.0895 1.36714 8.57639C2.23334 9.4967 3.24241 10.2712 4.35543 10.8699C5.53459 11.5422 6.861 11.9142 8.21779 11.9532C10.2817 11.8451 12.2518 11.0571 13.8208 9.71194C14.5203 9.1799 15.1481 8.55967 15.6885 7.86667C15.9012 7.57312 16.0863 7.26051 16.2413 6.93283C16.3726 6.63128 16.4388 6.30544 16.4356 5.97658C16.4271 5.64501 16.3481 5.31904 16.204 5.02032V5.02032ZM14.8369 6.3277C14.608 6.78176 14.3135 7.19963 13.9628 7.56784C13.2215 8.36111 12.3591 9.03183 11.4078 9.55505C10.4348 10.1136 9.3392 10.424 8.21779 10.459C6.49691 10.3551 4.85721 9.69131 3.54859 8.56892C2.96556 8.10902 2.44339 7.57681 1.99468 6.98512C1.84199 6.77914 1.7094 6.55899 1.59873 6.3277C1.54546 6.21695 1.51015 6.09843 1.49414 5.97658C1.51015 5.85473 1.54546 5.7362 1.59873 5.62545C1.82761 5.17139 2.12213 4.75353 2.47281 4.38531C3.2141 3.59205 4.07647 2.92132 5.02779 2.3981C6.00083 1.83956 7.09639 1.52911 8.21779 1.49414C9.93867 1.59809 11.5784 2.26185 12.887 3.38424C13.47 3.84414 13.9922 4.37634 14.4409 4.96803C14.5936 5.17401 14.7262 5.39416 14.8369 5.62545C14.8901 5.7362 14.9254 5.85473 14.9414 5.97658C14.9254 6.09843 14.8901 6.21695 14.8369 6.3277V6.3277Z"
            className="fill-[#606060] group-hover/eye:fill-white"
          />
        </svg>
      )}
    </div>
  );
};
