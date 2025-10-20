import type { IIconProps } from '@/interfaces/icon';

export function CircleUserIcon({ class_name }: IIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      className={class_name}
    >
      <path
        fill="currentColor"
        d="M391.9 391.6l-23.9-71.6-224 0-23.9 71.6C154.9 426.5 202.9 448 256 448s101.1-21.5 135.9-56.4zM0 256a256 256 0 1 1 512 0 256 256 0 1 1 -512 0zm256 16a72 72 0 1 0 0-144 72 72 0 1 0 0 144z"
      />
    </svg>
  );
}
