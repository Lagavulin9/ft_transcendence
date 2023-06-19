import React from "react";
import ImageTag from "../PostComponents/ImageTag";

interface Props {
  IconName: string;
  ImageUrl: string;
  func: () => void;
}

const WindowIcon = ({ IconName, func, ImageUrl }: Props) => {
  return (
    <div>
      <button
        style={{
          background: "transparent",
          borderWidth: "0px",
          paddingTop: "10px",
          width: "120px",
        }}
        onClick={func}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: "50px",
              display: "inline-block",
              verticalAlign: "middle",
            }}
          >
            <ImageTag Url={ImageUrl} />
          </div>
          <span
            style={{
              color: "white",
              paddingLeft: "8px",
              fontFamily: "dunggeunmo-bold",
              fontSize: "20px",
              zIndex: 0,
            }}
          >
            {IconName}
          </span>
        </div>
      </button>
    </div>
  );
};

export default WindowIcon;
