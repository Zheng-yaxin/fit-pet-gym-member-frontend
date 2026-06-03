import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { CharacterGender } from "@/lib/home-model";
import { characterFallbackSrc } from "@/lib/character-assets";

type ProfileAvatarButtonProps = {
  gender: CharacterGender;
  name?: string;
  unreadCount?: number;
};

export function ProfileAvatarButton({ gender, name, unreadCount = 0 }: ProfileAvatarButtonProps) {
  return (
    <Link className="profile-entry" href="/profile" aria-label="进入个人主页">
      <span className={`mini-avatar ${gender}`}>
        <Image
          src={characterFallbackSrc[gender]}
          alt=""
          width={128}
          height={128}
          loading="eager"
        />
        {unreadCount > 0 ? <i aria-label={`${unreadCount} 条未读消息`} /> : null}
      </span>
      <span>
        <strong>{name || "会员"}</strong>
        <em>个人主页</em>
      </span>
      <ChevronRight size={18} />
    </Link>
  );
}
