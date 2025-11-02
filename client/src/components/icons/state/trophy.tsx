import type { IconProps } from "../types";

export const TrophyIcon = ({
  size = "md",
  variant = "line",
  className,
}: IconProps) => {
  const sizes = {
    sm: 16,
    md: 24,
    lg: 32,
  };

  const iconSize = sizes[size];

  return (
    <svg
      width={iconSize}
      height={iconSize}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M12 15C15.866 15 19 11.866 19 8V5H5V8C5 11.866 8.13401 15 12 15ZM12 15V19M12 19H15M12 19H9M7 19H17M19 5H20C20.5304 5 21.0391 5.21071 21.4142 5.58579C21.7893 5.96086 22 6.46957 22 7C22 7.53043 21.7893 8.03914 21.4142 8.41421C21.0391 8.78929 20.5304 9 20 9H19M5 5H4C3.46957 5 2.96086 5.21071 2.58579 5.58579C2.21071 5.96086 2 6.46957 2 7C2 7.53043 2.21071 8.03914 2.58579 8.41421C2.96086 8.78929 3.46957 9 4 9H5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
