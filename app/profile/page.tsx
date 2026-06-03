"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, CreditCard, Dumbbell, LogOut, RefreshCcw, Settings, UserRound, WalletCards, Wrench } from "lucide-react";
import { ApiError, isAuthStatus } from "@/lib/api-client";
import { logout } from "@/lib/auth-api";
import { clearAuthSession, hasMemberSession } from "@/lib/auth-store";
import {
  createRepairLog,

  getEquipmentPage,
  getMemberProfile,
  getMyRepairLogs,
  getValidMemberCard,
  getWalletBalance,
  getWalletTransactions,
  pageRows,
  rechargeWallet,
  type Equipment,
  type MemberCard,
  type MemberProfile,
  type RepairLog,
  type WalletTransaction
} from "@/lib/member-api";
import { readOnboardingState, resetOnboarding } from "@/lib/onboarding-store";
import "./profile.css";

type ProfileData = {
  profile: MemberProfile | null;
  card: MemberCard | null;
  walletBalance: number | null;
  transactions: WalletTransaction[];
  repairs: RepairLog[];
  equipment: Equipment[];
  
};

async function settle<T>(request: Promise<T>, fallback: T) {
  try {
    return await request;
  } catch (err) {
    if (err instanceof ApiError && isAuthStatus(err.status)) throw err;
    return fallback;
  }
}

function extractBalance(value: number | { balance?: number } | null) {
  if (typeof value === "number") return value;
  return typeof value?.balance === "number" ? value.balance : null;
}

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [data, setData] = useState<ProfileData | null>(null);
  const [rechargeAmount, setRechargeAmount] = useState("100");
  const [repairEquipmentId, setRepairEquipmentId] = useState("");
  const [faultDesc, setFaultDesc] = useState("");
  const [error, setError] = useState("");

  const loadProfile = async () => {
    if (!hasMemberSession()) {
      router.replace("/auth?next=/profile");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const profile = await settle(getMemberProfile(), null);
      const memberId = profile?.id ?? profile?.userId;
      const [card, walletRaw, transactionsRaw, repairsRaw, equipmentRaw] = await Promise.all([
        memberId ? settle(getValidMemberCard(memberId), null) : Promise.resolve(null),
        memberId ? settle(getWalletBalance(memberId), null) : Promise.resolve(null),
        memberId ? settle(getWalletTransactions(memberId), null) : Promise.resolve(null),
        settle(getMyRepairLogs(), null),
        getEquipmentPage().catch(() => null),
  
      ]);

      const equipment = pageRows(equipmentRaw);
      setData({
        profile,
        card,
        walletBalance: extractBalance(walletRaw),
        transactions: pageRows(transactionsRaw),
        repairs: pageRows(repairsRaw),
        equipment,

      });

      if (!repairEquipmentId && equipment[0]?.id) {
        setRepairEquipmentId(String(equipment[0].id));
      }
    } catch (err) {
      if (err instanceof ApiError && isAuthStatus(err.status)) {
        clearAuthSession();
        router.replace("/auth?next=/profile");
        return;
      }

      setError(err instanceof Error ? err.message : "个人主页加载失败。");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRecharge = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const memberId = data?.profile?.id ?? data?.profile?.userId;
    if (!memberId) return;
    setBusy(true);
    setError("");
    try {
      await rechargeWallet(memberId, Number(rechargeAmount));
      await loadProfile();
    } catch (err) {
      setError(err instanceof Error ? err.message : "充值失败。");
    } finally {
      setBusy(false);
    }
  };

  const handleRepair = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!repairEquipmentId || !faultDesc.trim()) {
      setError("请选择器材并填写故障描述。");
      return;
    }
    setBusy(true);
    setError("");
    try {
      await createRepairLog({ equipmentId: Number(repairEquipmentId), faultDesc: faultDesc.trim() });
      setFaultDesc("");
      await loadProfile();
    } catch (err) {
      setError(err instanceof Error ? err.message : "提交报修失败。");
    } finally {
      setBusy(false);
    }
  };

  const handleLogout = async () => {
    setBusy(true);
    setError("");
    try {
      await logout();
    } catch {
      // Clearing local auth keeps the member app consistent even if the backend token is already gone.
    } finally {
      clearAuthSession();
      router.replace("/auth");
    }
  };

  const onboarding = typeof window !== "undefined" ? readOnboardingState() : { characterGender: null };
  const displayName = data?.profile?.nickname || data?.profile?.name || data?.profile?.username || "Fit-Pet 会员";

  return (
    <main className="profile-page" aria-label="个人主页">
      <div className="profile-shell">
        <header className="profile-header">
          <Link href="/" className="profile-back">
            <ArrowLeft size={18} />
            返回首页
          </Link>
          <div>
            <span>Profile Hub</span>
            <h1>个人主页</h1>
          </div>
          <div className="profile-header-actions">
            <button className="profile-plain-button" type="button" onClick={loadProfile} disabled={loading || busy}>
              <RefreshCcw size={16} />
              刷新
            </button>
            <button className="profile-plain-button danger" type="button" onClick={handleLogout} disabled={busy}>
              <LogOut size={16} />
              退出登录
            </button>
          </div>
        </header>

        {loading ? (
          <section className="profile-loading" aria-label="个人主页加载中">
            <span />
            <span />
            <span />
          </section>
        ) : null}

        {error ? (
          <section className="profile-error" role="alert">
            <h2>暂时没有加载成功</h2>
            <p>{error}</p>
          </section>
        ) : null}

        {!loading && !error ? (
          <>
            <section className="profile-summary">
              <div className={`profile-face ${onboarding.characterGender ?? "girl"}`} aria-hidden="true" />
              <div>
                <span>会员资料</span>
                <h2>{displayName}</h2>
                <p>{data?.profile?.phone ? `手机号 ${data.profile.phone}` : "会员资料来自 /member/profile。"}</p>
              </div>
            </section>

            <section className="profile-grid" aria-label="会员资产入口">
              <article className="profile-tile">
                <CreditCard size={24} />
                <span>会员卡</span>
                <h3>{data?.card?.cardType ?? "暂无有效会员卡"}</h3><p>{data?.card?.expireDate ? `有效期至 ${data.card.expireDate}` : "数据源：/member/card/valid/:memberId"}</p><Link href="/membership" style={{ display: "inline-block", marginTop: 8, fontSize: 13, color: "var(--accent)", fontWeight: 600 }}>购买 / 续费会员卡 \u2192</Link>
                <p>{data?.card?.expireDate ? `有效期至 ${data.card.expireDate}` : "数据源：/member/card/valid/:memberId"}</p>
              </article>

              <article className="profile-tile">
                <WalletCards size={24} />
                <span>钱包</span>
                <h3>{data?.walletBalance === null ? "等待余额" : `¥${data?.walletBalance?.toFixed(2)}`}</h3>
                <p>最近交易 {data?.transactions.length ?? 0} 条。</p>
              </article>

              <article className="profile-tile">
                <Wrench size={24} />
                <span>器材报修</span>
                <h3>{data?.repairs.length ?? 0} 条记录</h3>
                <p>{data?.repairs[0]?.equipmentName ? `最近：${data.repairs[0].equipmentName}` : "数据源：/equipment/repair/my"}</p>
              </article>



              <article className="profile-tile wide">
                <Settings size={24} />
                <span>设置和伙伴</span>
                <h3>{onboarding.characterGender === "boy" ? "男孩伙伴" : "女孩伙伴"}</h3>
                <p>本地保存伙伴选择；需要重设时回到首次设置流程。</p>
                <button type="button" onClick={() => { resetOnboarding(); window.location.href = "/onboarding"; }} style={{ background: "none", border: "1px solid var(--border)", borderRadius: 8, padding: "4px 12px", cursor: "pointer", color: "var(--accent)" }}>重新选择伙伴</button>
              </article>

              <article className="profile-tile wide quiet">
                <UserRound size={24} />
                <span>账户状态</span>
                <h3>{data?.profile?.status === "1" ? "已停用" : "正常"}</h3>
                <p>这里收纳低频但重要的会员资产，不占用每日健康首页的注意力。</p>
              </article>
            </section>

            <section className="profile-forms">
              <form className="profile-form-card" onSubmit={handleRecharge}>
                <h2>钱包充值</h2>
                <label>
                  金额
                  <input value={rechargeAmount} inputMode="decimal" onChange={(event) => setRechargeAmount(event.target.value)} />
                </label>
                <button type="submit" disabled={busy || !data?.profile}>充值</button>
                <div className="profile-mini-list">
                  {data?.transactions.slice(0, 4).map((item) => (
                    <p key={item.id ?? item.createTime}>{item.transactionType ?? "交易"} · ¥{item.amount ?? 0} · {item.createTime ?? "--"}</p>
                  ))}
                </div>
              </form>

              <form className="profile-form-card" onSubmit={handleRepair}>
                <h2>提交报修</h2>
                {data?.equipment.length ? (
                  <label>
                    器材
                    <select value={repairEquipmentId} onChange={(event) => setRepairEquipmentId(event.target.value)}>
                      {data.equipment.map((item) => (
                        <option key={item.id} value={item.id}>{item.name ?? `器材 ${item.id}`}</option>
                      ))}
                    </select>
                  </label>
                ) : (
                  <label>
                    器材 ID
                    <input value={repairEquipmentId} inputMode="numeric" onChange={(event) => setRepairEquipmentId(event.target.value)} placeholder="输入器材编号" />
                  </label>
                )}
                <label>
                  故障描述
                  <input value={faultDesc} onChange={(event) => setFaultDesc(event.target.value)} placeholder="例如：跑步机异响" />
                </label>
                <button type="submit" disabled={busy}>提交报修</button>
              </form>
            </section>
          </>
        ) : null}
      </div>
    </main>
  );
}
