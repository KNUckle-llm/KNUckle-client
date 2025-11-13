import { Suspense } from "react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return <Suspense fallback={<FallbackUI />}>{children}</Suspense>;
};

const FallbackUI = () => {
  return <div>Loading...</div>;
};

export default Layout;
