import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useMemo } from "react";

export function useRedirectUnauthorizedUser() {
  const router = useRouter();

  const { data: sessionData, status } = useSession();
  const auth = useMemo(() => sessionData != null, [sessionData]);

  useEffect(() => {
    if (status !== "loading") {
      if (!auth) {
        void router.push("/");
      }
    }
  }, [auth, router, status]);
}
