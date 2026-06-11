import type { ReactElement } from "react";

export type SocialMediaProps = {
  title: string;
  description?: string;
  name: string;
  href: string;
  icon: ReactElement;
  backgroundIcon?: ReactElement;
  isShow?: boolean;
  isExternal?: boolean;
  backgroundColor?: string;
  backgroundGradientColor?: string;
  borderColor?: string;
  textColor?: string;
  colSpan?: string;
};
