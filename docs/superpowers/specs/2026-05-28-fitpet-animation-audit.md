# FitPet 动画审计报告 2026-05-28

## 审计范围

对 `fit-pet-gym-member-frontend` 下所有 motion / CSS animation / transition 做逐项审计，区分"真动效"（身体部件独立运动、状态驱动、有意义的反馈）和"假动效"（整图平移/缩放/旋转、纯装饰、无肢体分离）。

---

## 1. 假动效清单（需替换）

### 1.1 CharacterStage（components/home/character-stage.tsx）

| 元素 | 当前行为 | 问题 |
|---|---|---|
| character-figure | y: [0, -5, 0], rotate: [0, -1, 1, 0] | **整张 PNG 上下晃 + 微旋转**。手、腿、表情、耳朵完全不动。 |
| character-halo | scale/opacity 呼吸 | 光环脉冲可保留，但当前与角色动作无联动 |
| character-shadow | scaleX/opacity 呼吸 | 影子呼吸可保留 |
| snack/dumbbell 道具 | y/rotate 浮动 | 道具动画本身合格，但与静止人物不匹配 |

**判断**：这是用户说的"只是一个图片在那里晃动"的核心位置。6 种 mood（idle/needsFuel/warmup/steady/training/celebrate）全部用同一套 y+rotate keyframes，只改动数值幅度，没有肢体分化。

### 1.2 LoadingScreen（components/loading-screen.tsx）

| 元素 | 当前行为 | 问题 |
|---|---|---|
| loading-runner | y: [0, -13, 0], rotate: [-1.4, 2.2, -1.4] | **整图上下跳**。名为"跑步"但没有迈腿、摆臂、身体前倾 |
| loading-track i | x 平移 | 地面轨道 OK |
| loading-sun | rotate 360° | 环境动画 OK |
| loading-steps | opacity + scale 脉冲 | 步伐指示器 OK |

**判断**：角色本身是静止 PNG 在弹跳，跑步感完全缺失。

### 1.3 ArrivalAnimation（components/onboarding/arrival-animation.tsx）

| 元素 | 当前行为 | 问题 |
|---|---|---|
| arrival-character | y: [0, -8, 0] (infinite) | **整图上下悬浮**。onboarding 最终画面应该是角色站定后的轻微呼吸 + 眨眼，而不是无限弹跳 |
| arrival-ring | opacity + scale 入场 | OK |
| arrival-metric | x slide 入场 | OK |

**判断**：入场后应该是"呼吸+眨眼"稳态，不是无限跳。

---

## 2. 真动效清单（可保留/可参考）

### 2.1 RefinedPet（components/style-lab/refined-pet.tsx）⭐ 参考

| 元素 | 行为 | 评价 |
|---|---|---|
| 左耳 path | rotate 独立动画 | ✅ 部件独立运动 |
| 右耳 path | rotate 独立动画 | ✅ 部件独立运动 |
| 眨眼（双眼 g） | scaleY: [1, 1, 0.1, 1] | ✅ 真正的眨眼 |
| 左臂 path | x 平移/旋转 | ✅ 肢体独立 |
| 右臂 path | rotate 独立动画 | ✅ 肢体独立 |
| 尾巴 path | 情绪驱动 rotate | ✅ 情绪驱动 |
| 身体 | mood 驱动的 scale/rotate | ✅ 整体协调 |
| 零食/速度线/睡眠气泡 | 道具入场/循环 | ✅ 辅助元素 |

**判断**：这是本项目内已有的"真动效"范本。SVG 部件独立运动 + framer-motion 编排。

### 2.2 PetAvatar（components/pet-avatar.tsx）⭐ 参考

同 RefinedPet 结构，SVG 分层 + 耳朵/眼睛/身体/手臂/尾巴独立动画。

### 2.3 CalorieBoss（components/style-lab/calorie-boss.tsx）

SVG 分层 + hit/shake/idle 状态切换。可作为打击反馈参考。

### 2.4 CSS 交互反馈（globals.css）

| 元素 | 行为 | 评价 |
|---|---|---|
| toy-button | hover translateY(-3px) + active translateY(5px) scale(0.98) | ✅ 触觉按压反馈 |
| meter span | width transition 520ms | ✅ 进度条动画 |
| body-stat-control | hover translateY(-4px) | ✅ 卡片悬浮 |
| action-tile | hover translateY(-5px) + active translateY(3px) | ✅ 卡片交互 |
| skeletonWash | background-position 1.4s | ✅ 骨架屏 |

---

## 3. 缺失的动画类别

| 类别 | 状态 | 需要的动作 |
|---|---|---|
| 呼吸 | ❌ 无 | 角色 idle 时身体轻微缩放 + 眨眼（间隔 3-4s） |
| 眨眼 | ❌ 无（生产环境） | 每 3-5 秒一次闭眼 100ms |
| 手臂摆动 | ❌ 无 | walking/running 时手臂前后摆 |
| 腿部迈步 | ❌ 无 | 跑步循环的抬腿、落地 |
| 情绪表情 | ❌ 无 | happy 时眼睛弧度变化、needsFuel 时嘴角下弯 |
| 道具互动 | ⚠️ 仅 CSS 浮动 | 人物手持/触碰道具的真实感 |
| 加载进度联动 | ❌ 无 | 角色跑步速度与数据加载进度同步 |
| 入场编排 | ⚠️ 仅整体入场 | 部件级 staggered 入场（头先、身体后、手脚最后） |
| 庆祝粒子 | ❌ 无 | celebrate mood 时的星星/爱心粒子 |

---

## 4. 技术资产现状

| 资产 | 格式 | 可用性 |
|---|---|---|
| fitpet-girl-chibi-cut.png | 整张 PNG 320KB | ⚠️ 不可分层 |
| fitpet-boy-chibi-cut.png | 整张 PNG 360KB | ⚠️ 不可分层 |
| RefinedPet SVG | 内联 SVG path | ✅ 已分层（耳/眼/臂/尾/身） |
| PetAvatar SVG | 内联 SVG path | ✅ 已分层 |
| CalorieBoss SVG | 内联 SVG path | ✅ 已分层 |

---

## 5. 升级路线

1. **创建分层角色资产**：把女孩/男孩 chibi 角色拆成 head/body/leftArm/rightArm/leftLeg/rightLeg/eyes 独立部件
2. **打造统一动效体系**：fitpet-motion.ts 定义 spring、duration、easing、reduced-motion 策略
3. **重写 CharacterStage**：6 种 mood 各对应一组部件级 keyframes
4. **重写 LoadingScreen**：角色跑步循环 + 步频与加载进度联动
5. **重写 ArrivalAnimation**：部件级 staggered 入场 + 落地后呼吸眨眼稳态
