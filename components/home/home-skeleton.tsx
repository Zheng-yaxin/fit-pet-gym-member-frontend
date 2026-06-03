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
        title="小爪印正在热身"
        message="正在把训练、饮食和场馆状态排成可爱的队形。"
      />
    </div>
  );
}
