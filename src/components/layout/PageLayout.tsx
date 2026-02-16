import Head from "next/head";
import Header from "~/components/layout/Header";
import Footer from "~/components/layout/Footer";

interface PageLayoutProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

const PageLayout = ({
  title = "AQUA",
  description = "Your Gateway to Onchain Yield",
  children,
  className = "",
}: PageLayoutProps) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex min-h-screen flex-col">
        <Header />

        <main className={`flex-1 px-5 py-10 ${className}`}>{children}</main>

        <Footer />
      </div>
    </>
  );
};

export default PageLayout;
