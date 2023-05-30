import { css } from "aphrodite";
import Image from "next/image";

type Args = {
  onClick?: Function;
  overrideStyle?: any;
  height?: number;
  width?: number;
  version?: number;
  color?: string;
};

const ResearchCoinIcon = ({
  onClick,
  overrideStyle,
  height = 25,
  width = 25,
  version = 1,
  color = "#F3A113",
}: Args) => {
  return (
    <span
      onClick={(event) => onClick && onClick(event)}
      style={{ display: "inline-flex" }}
      className={css(overrideStyle && overrideStyle)}
    >
      {version === 1 ? (
        <img
          src={"/static/icons/coin-filled.png"}
          alt="RSC Coin"
          width={width}
          height={height}
        />
      ) : version === 2 ? (
        <img
          className={css(overrideStyle && overrideStyle)}
          src={"/static/icons/rsc_v2.png"}
          alt="RSC Coin"
          width={width}
          height={height}
        />
      ) : version === 3 ? (
        <img
          className={css(overrideStyle && overrideStyle)}
          src={"/static/icons/rsc_v3.png"}
          alt="RSC Coin"
          width={width}
          height={height}
        />
      ) : version === 4 ? (
        <svg
          width={width}
          height={height}
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M6.96539 0.079115C10.2355 0.612213 12.4541 3.6951 11.9209 6.96525C11.3877 10.2355 8.30472 12.454 5.03461 11.9209C1.7645 11.3876 -0.454098 8.30493 0.0791078 5.03456C0.612313 1.7643 3.69517 -0.454097 6.96539 0.079115Z"
            fill={color}
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M6.76253 6.13023L8.5816 9.00106C8.71656 9.21596 8.74249 9.39999 8.65926 9.55317C8.57612 9.70644 8.40678 9.78308 8.15131 9.78308H3.98532C3.7298 9.78308 3.56043 9.70644 3.47725 9.55317C3.39407 9.39999 3.42 9.21591 3.55497 9.00102L5.37393 6.13019V4.68565L5.37955 4.2511H6.75815L6.76253 4.68564V6.13023ZM5.76572 6.37631L4.90355 7.64457H7.23656L6.37316 6.37631L6.30086 6.26405V6.13013V4.68559H5.83803V6.13013V6.26405L5.76572 6.37631Z"
            fill="white"
          />
          <path
            d="M5.36161 6.42662L4.71875 7.92663L7.71875 8.1409L6.43304 6.21233V4.49805H5.57589V4.92662L5.36161 6.42662Z"
            fill="white"
          />
          <rect
            x="4.89844"
            y="4.19885"
            width="2.33301"
            height="0.530231"
            rx="0.265115"
            fill="white"
          />
          <rect
            x="4.64062"
            y="2.3689"
            width="0.849925"
            height="0.850897"
            rx="0.424962"
            fill="white"
          />
          <rect
            x="6.75"
            y="2.3689"
            width="0.849925"
            height="0.850897"
            rx="0.424962"
            fill="white"
          />
          <rect
            x="5.80469"
            y="1.2854"
            width="0.655656"
            height="0.656406"
            rx="0.327828"
            fill="white"
          />
        </svg>
      ) : version === 5 ? (
        <img
          className={css(overrideStyle && overrideStyle)}
          src={"/static/icons/coin-empty.png"}
          alt="RSC Coin"
          width={width}
          height={height}
        />
      ) : version === 6 ? (
        <Image
          src="/static/icons/tip.png"
          height={height}
          width={width}
          alt="Tip"
        />
      ) : null}
    </span>
  );
};

export default ResearchCoinIcon;
