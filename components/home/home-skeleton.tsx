import { LoadingScreen } from "@/components/loading-screen";
import type { CharacterGender } from "@/lib/home-model";

type HomeSkeletonProps = {
  gender?: CharacterGender;
};

export function HomeSkeleton({ gender = "girl" }: HomeSkeletonProps) {
  return (
    <div className="home-skeleton" aria-label="首页加载中">
      <LoadingScreen
        gender={gender}
        title="健身伙伴正在跑步热身"
        message="正在把你的首页数据排好队，马上开练。"
      />
    </div>
  );
}
