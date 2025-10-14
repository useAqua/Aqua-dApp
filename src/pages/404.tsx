import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/router";

import PageLayout from "~/components/layout/PageLayout";

const NotFound = () => {
  const router = useRouter();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      router.asPath,
    );
  }, [router.asPath]);

  return (
    <PageLayout title="404 - Page Not Found">
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <h1 className="text-foreground mb-4 text-4xl font-bold">404</h1>
          <p className="text-muted-foreground mb-4 text-xl">
            Oops! Page not found
          </p>
          <Link
            href="/"
            className="text-primary hover:text-primary/80 underline transition-colors"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </PageLayout>
  );
};

export default NotFound;
