import React from "react";
import { Image } from "antd";

interface Props {
  Url: string;
}

const ImageTag = ({ Url }: Props) => {
  return (
    <Image
      preview={false}
      src={Url}
      width={"100%"}
      style={{ maxWidth: "500px" }}
    />
  );
};

export default ImageTag;
