import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/router";

import PageLayout from "~/components/PageLayout";

const NotFound = () => {
  const router = useRouter();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", router.asPath);
  }, [router.asPath]);

  return (
    <PageLayout title="404 - Page Not Found">
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-bold text-foreground">404</h1>
          <p className="mb-4 text-xl text-muted-foreground">Oops! Page not found</p>
          <Link href="/" className="text-primary underline hover:text-primary/80 transition-colors">
            Return to Home
          </Link>
        </div>
      </div>
    </PageLayout>
  );
};

export default NotFound;
