"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, CreditCard, Crown, Sparkles, Zap } from "lucide-react";
import {
  buyMemberCard,
  getMemberProfile,
  getValidMemberCard,
  getWalletBalance,
  rechargeWallet,
  type MemberCard,
  type MemberProfile,
  type WalletBalance
} from "@/lib/member-api";
import "../feature-placeholder.css";

type CardPlan = {
  key: string;
  name: string;
  duration: number;
  label: string;
  price: number;
  icon: typeof Zap;
  color: string;
  features: string[];
};

const PLANS: CardPlan[] = [
  { key: "日卡", name: "日卡体验", duration: 1, label: "1 天", price: 29, icon: Zap, color: "#f59e0b", features: ["全天自由训练", "基础器材使用", "团课体验 1 节"] },
  { key: "周卡", name: "周卡畅练", duration: 7, label: "7 天", price: 99, icon: Sparkles, color: "#8b5cf6", features: ["7 天无限次入场", "全部器材使用", "团课无限预约", "私教体验 1 次"] },
  { key: "月卡", name: "月卡塑形", duration: 30, label: "30 天", price: 299, icon: CreditCard, color: "#3b82f6", features: ["30 天无限次入场", "全部器材使用", "团课无限预约", "私教课程 2 节", "月度体测报告"] },
  { key: "年卡", name: "年卡尊享", duration: 365, label: "365 天", price: 1999, icon: Crown, color: "#ef4444", features: ["全年无限次入场", "全部器材优先使用", "团课无限预约", "私教课程 12 节", "月度体测报告", "专属储物柜", "生日礼品"] }
];

function toWalletBalance(raw: number | WalletBalance | null | undefined): WalletBalance | null {
  if (raw === null || raw === undefined) return null;
  if (typeof raw === "number") return { balance: raw };
  return raw;
}

export default function MembershipPage() {
  const [profile, setProfile] = useState<MemberProfile | null>(null);
  const [card, setCard] = useState<MemberCard | null>(null);
  const [wallet, setWallet] = useState<WalletBalance | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<CardPlan | null>(null);
  const [rechargeAmount, setRechargeAmount] = useState("100");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const [nextProfile] = await Promise.all([getMemberProfile()]);
      setProfile(nextProfile);
      if (nextProfile?.id) {
        const [nextCard, nextWallet] = await Promise.all([getValidMemberCard(nextProfile.id), getWalletBalance(nextProfile.id)]);
        setCard(nextCard);
        setWallet(toWalletBalance(nextWallet));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "数据加载失败。");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleBuyCard = async () => {
    if (!selectedPlan || !profile?.id) return;
    setBusy(true);
    setError("");
    setSuccess("");
    try {
      await buyMemberCard({
        memberId: profile.id,
        cardType: selectedPlan.key,
        amount: selectedPlan.price,
        duration: selectedPlan.duration,
        remark: `购买${selectedPlan.name}`
      });
      setSuccess(`成功购买${selectedPlan.name}！有效期 ${selectedPlan.label}。`);
      setSelectedPlan(null);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "购买失败，请检查钱包余额。");
    } finally {
      setBusy(false);
    }
  };

  const handleRecharge = async () => {
    if (!profile?.id) return;
    const amt = Number(rechargeAmount);
    if (amt <= 0) { setError("金额必须大于0"); return; }
    setBusy(true);
    setError("");
    setSuccess("");
    try {
      await rechargeWallet(profile.id, amt);
      setSuccess(`成功充值 ¥${amt}！`);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "充值失败。");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="feature-page" aria-label="会员卡">
      <div className="feature-shell wide">
        <Link className="feature-back" href="/profile"><ArrowLeft size={18} />返回个人中心</Link>
        <section className="feature-panel">
          <div className="feature-heading">
            <span>Membership</span>
            <h1>会员卡中心</h1>
            <p>选择计划、充值钱包、购买会员卡。当前卡片状态与余额一目了然。</p>
          </div>

          {error ? <p className="feature-error">{error}</p> : null}
          {success ? <p className="feature-error" style={{ color: "var(--green)" }}>{success}</p> : null}

          <div className="feature-grid three">
            <article className="feature-data"><span>当前会员卡</span><h2>{card?.cardType ?? "无"}</h2><p>{card?.expireDate ? `至 ${card.expireDate.slice(0, 10)}` : "未激活"}</p></article>
            <article className="feature-data"><span>钱包余额</span><h2>¥{wallet?.balance ?? "0.00"}</h2><p>{loading ? "..." : "购买前请确认余额充足"}</p></article>
            <article className="feature-data"><span>昵称</span><h2>{profile?.nickname || profile?.name || "--"}</h2><p>{profile?.phone ?? ""}</p></article>
          </div>

          <div className="feature-heading" style={{ marginTop: 16 }}>
            <span>Select Plan</span>
            <h2>选择计划</h2>
          </div>

          <div className="feature-grid two" style={{ marginTop: 8 }}>
            {PLANS.map((plan) => {
              const Icon = plan.icon;
              const isSelected = selectedPlan?.key === plan.key;
              return (
                <article key={plan.key} className="feature-list"
                  style={{ border: isSelected ? `2px solid ${plan.color}` : undefined, cursor: "pointer" }}
                  onClick={() => setSelectedPlan(plan)}>
                  <span style={{ color: plan.color }}><Icon size={20} />{plan.name}</span>
                  <div style={{ textAlign: "center", padding: "12px 0" }}>
                    <h2 style={{ fontSize: 36, color: plan.color, margin: 0 }}>¥{plan.price}</h2>
                    <p style={{ color: "var(--muted)" }}>{plan.label}</p>
                  </div>
                  {plan.features.map((f) => <p key={f} style={{ fontSize: 13, padding: "2px 0" }}>\u2713 {f}</p>)}
                </article>
              );
            })}
          </div>

          {selectedPlan ? (
            <div style={{ textAlign: "center", marginTop: 16 }}>
              <button type="button" disabled={busy} onClick={handleBuyCard} style={{
                background: selectedPlan.color, color: "#fff", border: "none", padding: "12px 48px",
                borderRadius: 12, fontSize: 16, fontWeight: 600, cursor: busy ? "not-allowed" : "pointer"
              }}>
                {busy ? "处理中..." : `购买 ${selectedPlan.name} \u2014 ¥${selectedPlan.price}`}
              </button>
              <p style={{ color: "var(--muted)", marginTop: 8, fontSize: 13 }}>
                余额 ¥{wallet?.balance ?? "0"} {selectedPlan.price > (wallet?.balance ?? 0) ? "\u26a0 余额不足" : "\u2714 余额充足"}
              </p>
            </div>
          ) : null}

          <div style={{ marginTop: 24, textAlign: "center" }}>
            <div style={{ display: "inline-flex", gap: 8, alignItems: "center", background: "var(--surface)", padding: "8px 16px", borderRadius: 10 }}>
              <span style={{ fontSize: 14 }}>快速充值:</span>
              <input value={rechargeAmount} inputMode="decimal"
                onChange={(e) => setRechargeAmount(e.target.value)}
                style={{ width: 80, padding: "4px 8px", borderRadius: 6, border: "1px solid var(--border)", background: "var(--bg)", textAlign: "center" }} />
              <button type="button" disabled={busy} onClick={handleRecharge}
                style={{ background: "var(--accent)", color: "#fff", border: "none", padding: "4px 16px", borderRadius: 6, cursor: "pointer" }}>充值</button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}