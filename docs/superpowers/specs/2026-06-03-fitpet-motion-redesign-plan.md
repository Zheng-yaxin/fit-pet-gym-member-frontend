# Fit-Pet Member Frontend Motion Redesign Plan

Date: 2026-06-03
Target app: `D:\fitpet\gym-main\fit-pet-gym-member-frontend`

## 1. Confirmed Direction

This plan is for the member-facing Next.js frontend, not the Vue management backend.

The redesign keeps the current Fit-Pet style:

- Warm daily health companion.
- Q-version, hand-drawn, soft, functional.
- A clean health app with a lovable character, not a loud mobile game.
- No neon tech gradients, no generic AI SaaS look, no overloaded effects.

The motion direction is:

- Primary mood: warm, healing, lively, companion-like.
- Secondary mood: light game feedback for achievement moments.
- First implementation phase: homepage, character stage, loading experience.
- Motion intensity: medium-high, but controlled.
- First phase stack: `framer-motion`, `motion/react`, `animejs`.
- GSAP is reserved for later complex timelines and scroll storytelling.

## 2. Current Evidence

Current design system source:

- `DESIGN.md` defines the visual language, palette, typography, components, motion rules, and bans.
- The key motion rule is: motion explains state, homepage motion should be gentle breathing, stretching, training, or replenishing, and only transform plus opacity should be animated.

Current animation audit source:

- `docs/superpowers/specs/2026-05-28-fitpet-animation-audit.md`

Main issues from the audit:

- `components/home/character-stage.tsx` currently feels like a whole PNG moving, not a character with independent body motion.
- `components/loading-screen.tsx` currently simulates running by bouncing a whole image.
- `components/onboarding/arrival-animation.tsx` should settle into breathing and blinking, not keep floating.
- The strongest reusable references already inside the project are `PetAvatar`, `RefinedPet`, and `CalorieBoss`, because they use layered SVG parts.

Existing motion assets:

- `framer-motion` is already installed and widely used.
- `motion/react` is already used by `components/BlurText.tsx`.
- `animejs` is installed and wrapped by `components/motion/use-anime.ts`.
- `components/motion/fitpet-motion.ts` already contains project motion tokens and reduced-motion helpers.

## 3. Skill And Plugin Plan

Use these Codex skills during the redesign:

| Skill | When to use | Output |
|---|---|---|
| `brainstorming` | Confirm scope, direction, and tradeoffs before major implementation | Design decisions and plan |
| `impeccable animate` | Audit and improve motion quality | Motion rules, anti-pattern checks, polish notes |
| `frontend-design` | Build or refine concrete UI components/pages | Production UI implementation |
| `gsap-core` | Later if complex DOM/SVG timelines are needed | Tween/timeline implementation patterns |
| `gsap-react` | Later if GSAP enters the Next.js app | `useGSAP` setup, cleanup, SSR safety |
| `gsap-scrolltrigger` | Later if homepage gets scroll storytelling | ScrollTrigger/pin/scrub plan |
| `gsap-performance` | Before shipping heavy motion | Performance checks and fixes |
| `web-design-guidelines` | Final accessibility/UX pass | A11y and interaction review |

Use these plugins/tools:

| Tool or plugin | When to use | Output |
|---|---|---|
| Browser | Open local Next.js app and inspect visible motion | Visual QA screenshots/checks |
| Chrome | Use if real profile/login/reference browsing is needed | Authenticated visual/reference checks |
| GitHub | Only if this becomes PR work | PR summary, review, CI fixes |
| HyperFrames | Optional later if making a motion demo video | Video prototype or walkthrough |

## 4. External Resource Plan

External resources are split into code candidates and inspiration sources.

| Resource | Role | First phase usage |
|---|---|---|
| Anime.js | DOM/SVG micro-interactions, XP bursts, particles, scoped cleanup | Use directly |
| Framer Motion | React component state motion, page/card entrance, character mood motion | Use directly |
| motion/react | Existing animated text/component primitives | Keep and reuse where appropriate |
| GSAP | Complex timelines, scroll storytelling, advanced SVG choreography | Reserve for phase 2 |
| React Bits | Animated React component inspiration and possible copy-adapt candidates | Build candidate list |
| 21st.dev | React/Next component structure inspiration | Build candidate list |
| ShaderGradient | Dynamic visual atmosphere for special pages | Not in first homepage pass |
| Made with GSAP | Timing, scroll rhythm, and choreography inspiration | Reference only |
| MotionSites | Premium motion website inspiration | Reference only |
| Bento grid references | Information layout inspiration | Use carefully, no generic bento wall |

Official references checked:

- Anime.js scope and cleanup: https://animejs.com/documentation/scope/
- GSAP docs: https://gsap.com/docs/v3
- GSAP React docs: https://gsap.com/resources/React/
- React Bits: https://reactbits.dev/get-started/index
- 21st.dev components: https://21st.dev/community/components/s/21st-dev

## 5. Library Responsibilities

### Framer Motion

Use for React state-driven UI:

- Homepage section entrance.
- Card stagger.
- Character mood states.
- Loading component parts.
- Reduced-motion-aware transitions.

Do not use it for:

- Random decorative motion that does not explain state.
- Layout-heavy animations.
- Effects that should be centralized in Anime.js.

### Anime.js

Use for scoped DOM/SVG micro-interactions:

- XP burst.
- Small particles.
- Number or progress feedback.
- Button/card sparkle moments.
- One-off effect orchestration inside a component.

Use `useAnimeScope` for cleanup. Avoid global selectors without a scoped root.

### motion/react

Use only where it already fits:

- Text reveal components such as `BlurText`.
- Small component primitives that already depend on `motion/react`.

Do not add another parallel pattern unless it clearly reduces code.

### GSAP

Do not install in phase 1.

Reserve for:

- ScrollTrigger homepage storytelling.
- Long chained timelines.
- Advanced SVG choreography that becomes painful in Framer Motion.
- Pin/scrub/scroll-driven sections.

If introduced later, install both:

- `gsap`
- `@gsap/react`

Use `useGSAP` with scoped refs and automatic cleanup.

## 6. Phase 1 Scope

### Page 1: Homepage

Primary goal:

- The first viewport should feel alive, fluid, and premium while staying warm and simple.

Motion upgrades:

- Hero content staggered entrance.
- Character stage enters after copy, not at the same time.
- Daily focus/progress bars animate from zero to current values.
- Action tiles enter with small offsets.
- Buttons get tactile press and hover feedback.
- Achievement/XP feedback appears only after meaningful action or state change.

Avoid:

- Heavy shader background.
- Scroll pinning.
- Large camera-like transitions.
- Generic bento wall.

### Component 1: Character Stage

Primary goal:

- Replace whole-image bobbing with stateful, believable character motion.

Phase 1 implementation:

- Use existing layered SVG character capability where possible.
- Map each mood to independent part motion:
  - idle: breathing, blink, small ear/tail motion.
  - needsFuel: slower body motion, softer expression.
  - warmup: arm stretch, slight torso tilt.
  - steady: calm breathing and subtle confidence.
  - training: arm swing, leg/step suggestion, motion lines.
  - celebrate: short burst, sparkle, tail/arms excited motion.

Longer-term asset upgrade:

- Split or redraw the current boy/girl PNG characters into head, body, arms, legs, eyes, accessories.

### Component 2: Loading Screen

Primary goal:

- Loading should feel like a small fitness moment, not a bouncing image.

Motion upgrades:

- Runner uses independent body/arm/leg rhythm.
- Track movement and step indicators support the run.
- Loading text or progress can pulse lightly.
- Reduced motion switches to a calm progress indicator.

### Optional Component: XP Burst

Primary goal:

- Provide a reusable light game-feedback primitive.

Rules:

- Trigger only after meaningful completion states.
- Use warm Fit-Pet colors: yolk, mint, coral, motion blue.
- Keep burst short, less than 900ms.
- Avoid confetti overload.

## 7. Implementation Steps

1. Create or update motion primitives.
   - Extend `components/motion/fitpet-motion.ts` if needed.
   - Keep all durations/eases in one place.
   - Keep reduced-motion helpers.

2. Create reusable feedback primitives.
   - Add `components/motion/xp-burst.tsx`.
   - Use `useAnimeScope` for particle cleanup.

3. Upgrade character stage.
   - Replace whole-image-only motion with layered SVG behavior.
   - Keep existing copy/data behavior unchanged.
   - Use mood profiles from `fitpet-motion.ts`.

4. Upgrade loading screen.
   - Replace whole-runner bounce with part-based motion.
   - Respect reduced motion.

5. Upgrade homepage entrance.
   - Add clear entrance order.
   - Animate only transform and opacity.
   - Avoid changing content meaning.

6. Verify.
   - Run `npm.cmd run build`.
   - Open local app in Browser.
   - Check normal motion and reduced motion.

## 8. Performance Rules

All first-phase motion must follow these rules:

- Animate `transform` and `opacity`.
- Avoid animating `width`, `height`, `top`, `left`, `margin`, or layout-affecting properties.
- Keep infinite loops subtle and low count.
- No heavy shader in the homepage first viewport.
- Use scoped cleanup for Anime.js.
- Use Framer Motion's reduced-motion hooks where appropriate.
- Ensure `prefers-reduced-motion: reduce` disables loops and major movement.

## 9. Resource Candidate Table

| Need | Search in | Query or category | Accept if |
|---|---|---|---|
| Text reveal | React Bits, 21st.dev | staggered text, blur text, animated heading | It can be toned down and supports readable Chinese text |
| Button feedback | React Bits, 21st.dev | glow button, animated button, press interaction | It becomes tactile, not neon |
| XP burst | React Bits, Anime.js examples | particles, reward, sparkle | Short, warm, small, not confetti-heavy |
| Hero rhythm | Made with GSAP, MotionSites | soft homepage reveal, character product hero | Rhythm inspires timing without copying style |
| Layout | Bento grid references | asymmetric dashboard, health cards | Supports content hierarchy, not a generic card wall |
| Background | ShaderGradient | soft gradient, organic field | Only for special pages or very subtle panels |

## 10. Acceptance Criteria

The phase 1 redesign is accepted when:

- Homepage keeps the existing warm Fit-Pet style.
- First viewport feels more alive within 2 seconds.
- Character motion includes at least breathing and blinking.
- Training or celebration state has independent part motion, not only whole-image movement.
- Loading no longer reads as a single static character bouncing.
- At least one meaningful game-feedback primitive exists.
- All major motion respects reduced-motion preferences.
- Production build passes with `npm.cmd run build`.
- Browser visual QA confirms no obvious layout breakage.

## 11. Deferred Work

Do not do these in phase 1:

- Whole-site redesign.
- Management backend animation work.
- GSAP/ScrollTrigger installation.
- Shader-heavy background system.
- Full boy/girl PNG asset decomposition.
- Large new design language.

These are phase 2 or later after phase 1 is visible and approved.

