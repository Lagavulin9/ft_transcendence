import React from "react";
import WindowIcon from "../globalComponents/WindowIcon";
import { useRouter } from "next/router";

const RandomMatch = () => {
  const router = useRouter();

  const openModal = () => {
    document.body.style.overflow = "hidden";
    router.push("/Page/Random", "/Page/Random", { shallow: false });
  };

  return (
    <div>
      <WindowIcon
        IconName="랜덤매칭."
        func={openModal}
        ImageUrl="https://user-images.githubusercontent.com/86397600/242120080-89599585-6c22-48a3-b7b0-edceaf02d95c.png"
      />
    </div>
  );
};

export default RandomMatch;
