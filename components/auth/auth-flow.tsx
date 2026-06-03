"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, LockKeyhole, Phone, ShieldCheck, Sparkles, UserRound, VenusAndMars } from "lucide-react";
import { characterFallbackSrc } from "@/lib/character-assets";
import { loginAdmin, loginMember, registerMember } from "@/lib/auth-api";
import { saveAuthSession } from "@/lib/auth-store";


type AuthMode = "member" | "register" | "admin";
type GenderChoice = "girl" | "boy";

function cleanNextPath(value: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return "/";
  return value;
}

function isPhone(value: string) {
  return /^1\d{10}$/.test(value.trim());
}

export function AuthFlow() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = useMemo(() => cleanNextPath(searchParams.get("next")), [searchParams]);
  const [mode, setMode] = useState<AuthMode>("member");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState<GenderChoice>("girl");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const copy = {
    member: {
      eyebrow: "会员入口",
      title: "欢迎回来",
      body: "登录后继续同步身体数据、饮食目标和训练记录。",
      button: "登录并继续"
    },
    register: {
      eyebrow: "创建会员",
      title: "创建 Fit-Pet 账户",
      body: "注册后会自动登录，并继续完成首次设置。",
      button: "注册并继续"
    },

    admin: {
      eyebrow: "系统管理",
      title: "进入管理控制台",
      body: "管理员登录后会跳转到现有 Vue 控制台。",
      button: "登录管理端"
    }
  }[mode];

  const switchMode = (nextMode: AuthMode) => {
    setMode(nextMode);
    setError("");
    setPassword("");
  };

  const validateCommon = () => {
    if (mode === "admin") {
      if (!username.trim()) return "请输入管理员账号。";
    } else if (!isPhone(phone)) {
      return "请输入 11 位手机号。";
    }

    if (password.trim().length < 6) {
      return "密码至少需要 6 位。";
    }

    if (mode === "register" && name.trim().length < 2) {
      return "请填写 2 个字以上的昵称。";
    }

    return "";
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationError = validateCommon();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      if (mode === "register") {
        await registerMember({
          name: name.trim(),
          phone: phone.trim(),
          password: password.trim(),
          gender: gender === "girl" ? 0 : 1
        });
      }


      if (mode === "admin") {
        const token = await loginAdmin({ username: username.trim(), password: password.trim() });
        saveAuthSession({ token, userType: "SYS_USER" });
        router.replace("/admin");
        return;
      }

      const token = await loginMember({
        phone: phone.trim(),
        password: password.trim()
      });

      saveAuthSession({ token, userType: "MEMBER" });
      router.replace(mode === "register" ? "/onboarding" : (nextPath === "/onboarding" ? "/" : nextPath));
    } catch (err) {
      setError(err instanceof Error ? err.message : "认证失败，请稍后再试。");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="auth-page" aria-label="Fit-Pet 统一登录注册">
      <section className="auth-shell">
        <Link href="/" className="auth-back">
          <ArrowLeft size={18} />
          返回
        </Link>

        <div className="auth-card">
          <div className="auth-hero" aria-hidden="true">
            <div className="auth-badge">
              <Sparkles size={18} />
              Fit-Pet Passport
            </div>
            <div className="auth-illustration">
              <span className="auth-sticker sticker-heart" />
              <span className="auth-sticker sticker-dumbbell" />
              <span className="auth-sticker sticker-meal" />
              <span className="auth-sticker sticker-sparkle" />
              <div className="auth-illustration-frame">
                <img src={characterFallbackSrc.girl} alt="" />
              </div>
              <span className="auth-illustration-shadow" />
            </div>
            <div className="auth-ticket ticket-a">会员健康数据同步</div>
            <div className="auth-ticket ticket-b">教练与管理工作台</div>
          </div>

          <div className="auth-panel">
            <div className="auth-heading">
              <span>{copy.eyebrow}</span>
              <h1>{copy.title}</h1>
              <p>{copy.body}</p>
            </div>

            <div className="auth-switch role-switch" role="tablist" aria-label="选择登录角色">
              <button type="button" className={mode === "member" || mode === "register" ? "active" : ""} onClick={() => switchMode("member")}>
                会员
              </button>

              <button type="button" className={mode === "admin" ? "active" : ""} onClick={() => switchMode("admin")}>
                管理员
              </button>
            </div>

            {(mode === "member" || mode === "register") ? (
              <div className="auth-switch" role="tablist" aria-label="选择登录或注册">
                <button type="button" className={mode === "member" ? "active" : ""} onClick={() => switchMode("member")}>
                  登录
                </button>
                <button type="button" className={mode === "register" ? "active" : ""} onClick={() => switchMode("register")}>
                  注册
                </button>
              </div>
            ) : null}

            <form className="auth-form" onSubmit={handleSubmit}>
              {mode === "register" ? (
                <label>
                  <span>
                    <UserRound size={18} />
                    昵称
                  </span>
                  <input autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} placeholder="小燃" />
                </label>
              ) : null}

              {mode === "admin" ? (
                <label>
                  <span>
                    <ShieldCheck size={18} />
                    管理员账号
                  </span>
                  <input autoComplete="username" value={username} onChange={(event) => setUsername(event.target.value)} placeholder="admin" />
                </label>
              ) : (
                <label>
                  <span>
                    {<Phone size={18} />}
                    {"手机号"}
                  </span>
                  <input
                    autoComplete="tel"
                    inputMode="tel"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    placeholder="13800000000"
                  />
                </label>
              )}

              <label>
                <span>
                  <LockKeyhole size={18} />
                  密码
                </span>
                <input
                  autoComplete={mode === "member" || mode === "admin" ? "current-password" : "new-password"}
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="至少 6 位"
                />
              </label>

              {mode === "register" ? (
                <fieldset className="auth-gender">
                  <legend>
                    <VenusAndMars size={18} />
                    伙伴性别
                  </legend>
                  <div>
                    <button type="button" className={gender === "girl" ? "active" : ""} onClick={() => setGender("girl")}>
                      女孩伙伴
                    </button>
                    <button type="button" className={gender === "boy" ? "active" : ""} onClick={() => setGender("boy")}>
                      男孩伙伴
                    </button>
                  </div>
                </fieldset>
              ) : null}

              {error ? (
                <p className="auth-error" role="alert">
                  {error}
                </p>
              ) : null}

              <button className="auth-submit" type="submit" disabled={submitting}>
                {submitting ? "处理中..." : copy.button}
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
