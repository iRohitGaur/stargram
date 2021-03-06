import { FC } from "react";
import "./page404.css";
import Lottie from "react-lottie";
import animationData from "lotties/not-found-page.json";

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: animationData,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

export const Page404: FC = () => {
  return (
    <div className="page_404">
      <Lottie options={defaultOptions} />
    </div>
  );
};
