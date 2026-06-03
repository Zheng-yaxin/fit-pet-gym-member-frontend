import {
  Apple,
  BadgeCheck,
  Beef,
  Dumbbell,
  Flame,
  Gauge,
  HeartPulse,
  Map,
  Medal,
  ScanLine,
  ShieldCheck,
  Sparkles,
  Swords,
  Trophy,
  Zap
} from "lucide-react";

export type Tone = "orange" | "mint" | "blue" | "violet" | "red" | "yellow" | "green" | "pink";

export type Quest = {
  id: string;
  title: string;
  hint: string;
  reward: string;
  stat: string;
  tone: Tone;
  icon: typeof Dumbbell;
  action: "gacha" | "train" | "food" | "scan";
};

export type NavItem = {
  id: string;
  label: string;
  hint: string;
  icon: typeof Dumbbell;
  tone: Tone;
};

export const quests: Quest[] = [
  {
    id: "checkin",
    title: "签到扭蛋",
    hint: "领今日 Buff",
    reward: "力量糖 x1",
    stat: "30 秒",
    tone: "orange",
    icon: Sparkles,
    action: "gacha"
  },
  {
    id: "back",
    title: "背部训练",
    hint: "划船 + 下拉",
    reward: "+80 XP",
    stat: "32 分钟",
    tone: "mint",
    icon: Dumbbell,
    action: "train"
  },
  {
    id: "meal",
    title: "记录一餐",
    hint: "蛋白补给",
    reward: "炼金碎片 x3",
    stat: "520 kcal",
    tone: "violet",
    icon: Apple,
    action: "food"
  },
  {
    id: "scan",
    title: "体测扫描",
    hint: "正向解释",
    reward: "体能 +2",
    stat: "3 项",
    tone: "blue",
    icon: HeartPulse,
    action: "scan"
  }
];

export const navItems: NavItem[] = [
  {
    id: "train",
    label: "训练区",
    hint: "计划 / 打卡 / 肌肉领地",
    icon: Dumbbell,
    tone: "mint"
  },
  {
    id: "food",
    label: "营养体测",
    hint: "饮食炼金 / 机甲扫描",
    icon: Beef,
    tone: "orange"
  },
  {
    id: "raid",
    label: "讨伐小队",
    hint: "团课副本 / 私教招募",
    icon: Swords,
    tone: "red"
  },
  {
    id: "bag",
    label: "成就背包",
    hint: "徽章 / 称号 / 装饰",
    icon: Medal,
    tone: "yellow"
  }
];

export const statCards = [
  { label: "等级", value: "LV. 8", icon: Trophy, tone: "yellow" as Tone },
  { label: "活力", value: "92", icon: Zap, tone: "mint" as Tone },
  { label: "连击", value: "6天", icon: Flame, tone: "orange" as Tone },
  { label: "状态", value: "轻盈", icon: Gauge, tone: "blue" as Tone }
];

export const achievements = [
  { label: "早鸟勇者", count: "12", tone: "yellow" as Tone },
  { label: "稳定输出", count: "8", tone: "mint" as Tone },
  { label: "炼金新星", count: "5", tone: "violet" as Tone }
];

export const muscleZones = [
  { label: "背", value: 82, tone: "mint" as Tone },
  { label: "腿", value: 64, tone: "orange" as Tone },
  { label: "胸", value: 48, tone: "red" as Tone },
  { label: "核心", value: 76, tone: "blue" as Tone }
];

export const dailyPlan = [
  { label: "热身", value: "8 min", tone: "yellow" as Tone },
  { label: "主训练", value: "32 min", tone: "mint" as Tone },
  { label: "拉伸", value: "6 min", tone: "blue" as Tone }
];

export const gachaRewards = ["力量糖", "恢复泡泡", "闪光贴纸", "训练券", "薄荷披风"];

export const toneMap: Record<Tone, string> = {
  orange: "var(--pet-orange)",
  mint: "var(--pet-mint)",
  blue: "var(--pet-blue)",
  violet: "var(--pet-violet)",
  red: "var(--pet-red)",
  yellow: "var(--pet-yellow)",
  green: "var(--pet-green)",
  pink: "var(--pet-pink)"
};

export const guestSession = {
  name: "游客勇者",
  pet: "薄荷团子",
  mode: "本地演示"
};

export const loggedSession = {
  name: "小杨",
  pet: "薄荷团子",
  mode: "会员账号"
};

export function completionPercent(done: string[]) {
  return Math.round((done.length / quests.length) * 100);
}

export const BadgeCheckIcon = BadgeCheck;
export const MapIcon = Map;
export const ScanIcon = ScanLine;
export const ShieldIcon = ShieldCheck;
