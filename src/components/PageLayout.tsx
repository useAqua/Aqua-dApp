import Head from "next/head";
import Header from "~/components/Header";
import Footer from "~/components/Footer";

interface PageLayoutProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

const PageLayout = ({
  title = "AQUA DeFi",
  description = "Decentralized Finance Protocol",
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

      <div className="bg-background flex min-h-screen flex-col">
        <Header />

        <main className={`container mx-auto flex-1 px-4 py-8 ${className}`}>
          {children}
        </main>

        <Footer />
      </div>
    </>
  );
};

export default PageLayout;
