import colors from "../themes/colors";

type Props = {
  height?: number;
  width?: number;
}

export const OpenAccessAchievementIcon = ({ height = 40, width = 40 }: Props) => {
  const color = "black";

  return (
    <svg width={width} height={height} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1.25" y="1.25" width="37.5" height="37.5" rx="18.75" stroke={color} strokeWidth="2.5" />
      {/* @ts-ignore */}
      <mask id="mask0_21327_17642" maskUnits="userSpaceOnUse" x="11" y="10" width="18" height="20">
        <path d="M13.7526 19.1866H26.2526C26.7128 19.1866 27.0859 19.5597 27.0859 20.02V27.52C27.0859 27.9802 26.7128 28.3533 26.2526 28.3533H13.7526C13.2924 28.3533 12.9193 27.9802 12.9193 27.52V20.02C12.9193 19.5597 13.2924 19.1866 13.7526 19.1866Z" fill="white" stroke="white" stroke-width="2.5" stroke-linejoin="round" />
        <path d="M24.168 19.1667V15.8354C24.1701 13.6958 22.5334 11.9029 20.3821 11.6879C18.2309 11.4729 16.2651 12.9058 15.8346 15.0025" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M20.0039 22.5V25" stroke="black" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
      </mask>
      <g mask="url(#mask0_21327_17642)">
        <path d="M30.0039 10H10.0039V30H30.0039V10Z" fill={color} />
      </g>
    </svg>
  );
};

export const CitedAuthorAchievementIcon = ({ height = 40, width = 40 }: Props) => {
  const color = "black";

  return (
    <svg width={width} height={height} viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="56" height="56" rx="28" stroke={color} stroke-width="4" />
      <path d="M39.3401 36.6891C41.4614 34.2891 41.2478 31.207 41.2411 31.1719V21.7969C41.2411 21.4861 41.1226 21.188 40.9118 20.9682C40.701 20.7485 40.4151 20.625 40.1169 20.625H33.372C32.132 20.625 31.1236 21.6762 31.1236 22.9688V31.1719C31.1236 31.4827 31.2421 31.7807 31.4529 32.0005C31.6637 32.2203 31.9496 32.3438 32.2478 32.3438H35.708C35.6842 32.9231 35.5181 33.4864 35.2257 33.9797C34.6546 34.9184 33.5788 35.5594 32.0263 35.8828L31.1236 36.0703V39.375H32.2478C35.3763 39.375 37.7629 38.4715 39.3401 36.6891ZM26.9665 36.6891C29.0889 34.2891 28.8742 31.207 28.8674 31.1719V21.7969C28.8674 21.4861 28.749 21.188 28.5382 20.9682C28.3274 20.7485 28.0414 20.625 27.7433 20.625H20.9983C19.7584 20.625 18.75 21.6762 18.75 22.9688V31.1719C18.75 31.4827 18.8684 31.7807 19.0793 32.0005C19.2901 32.2203 19.576 32.3438 19.8742 32.3438H23.3343C23.3106 32.9231 23.1445 33.4864 22.8521 33.9797C22.281 34.9184 21.2052 35.5594 19.6527 35.8828L18.75 36.0703V39.375H19.8742C23.0027 39.375 25.3893 38.4715 26.9665 36.6891Z" fill={color} />
    </svg>
  );
};