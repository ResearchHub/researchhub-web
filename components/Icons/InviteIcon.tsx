type Args = {
  width?: number;
  height?: number;
};

const InviteIcon = ({ height = 32, width = 33 }: Args) => {
  return (
    <svg
      width={width}
      height={32}
      viewBox="0 0 33 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clip-path="url(#clip0_13514_182387)">
        <path
          d="M19.1666 19.0053V29.3359H5.83325C5.83284 27.7078 6.20515 26.1011 6.92165 24.6391C7.63815 23.1771 8.67983 21.8985 9.96687 20.9013C11.2539 19.9041 12.7522 19.2148 14.3468 18.8861C15.9414 18.5575 17.5901 18.5982 19.1666 19.0053ZM16.4999 17.3359C12.0799 17.3359 8.49992 13.7559 8.49992 9.33594C8.49992 4.91594 12.0799 1.33594 16.4999 1.33594C20.9199 1.33594 24.4999 4.91594 24.4999 9.33594C24.4999 13.7559 20.9199 17.3359 16.4999 17.3359ZM24.4999 22.6693V18.6693H27.1666V22.6693H31.1666V25.3359H27.1666V29.3359H24.4999V25.3359H20.4999V22.6693H24.4999Z"
          fill="url(#paint0_linear_13514_182387)"
        />
      </g>
      <defs>
        <linearGradient
          id="paint0_linear_13514_182387"
          x1="18.4999"
          y1="1.33594"
          x2="18.4999"
          y2="29.3359"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#6C96FF" />
          <stop offset="1" stop-color="#3B72FF" />
        </linearGradient>
        <clipPath id="clip0_13514_182387">
          <rect
            width="32"
            height="32"
            fill="white"
            transform="translate(0.5)"
          />
        </clipPath>
      </defs>
    </svg>
  );
};

export default InviteIcon;
