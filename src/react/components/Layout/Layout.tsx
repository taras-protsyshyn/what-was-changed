import * as s from "./Layout.module.css";

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return <div className={s.container}>{children}</div>;
};
