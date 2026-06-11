export type MenuItemProps = {
  title: string;
  href: string;
  icon: React.ReactElement;
  onClick?: () => void;
  className?: string;
  isShow?: boolean;
  isExternal: boolean;
  eventName?: string;
  isHover?: boolean;
  children?: React.ReactNode
  isExclusive?: boolean;
};
