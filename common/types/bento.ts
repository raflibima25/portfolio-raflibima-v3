export type BentoItemProps = {
  title: string;
  description: string;
  label?: string;
  icon?: React.ReactElement;
  visual?: React.ReactNode;
  href?: string;
  colSpan?: number;
  className?: string;
  isShow?: boolean;
};
