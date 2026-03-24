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

        <main
          className={`mx-auto w-full max-w-250 flex-1 p-5 xl:max-w-280 2xl:max-w-300 ${className}`}
        >
          {children}
        </main>

        <Footer />
      </div>
    </>
  );
};

export default PageLayout;
