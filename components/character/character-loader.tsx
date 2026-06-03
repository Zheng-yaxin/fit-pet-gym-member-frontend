import { LoadingScreen } from "@/components/loading-screen";
import type { CharacterGender } from "@/lib/home-model";

type CharacterLoaderProps = {
  gender?: CharacterGender;
  title?: string;
  message?: string;
};

export function CharacterLoader({
  gender = "girl",
  title = "健身伙伴正在热身",
  message = "正在同步你的训练、饮食和身体数据..."
}: CharacterLoaderProps) {
  return <LoadingScreen gender={gender} title={title} message={message} />;
}
