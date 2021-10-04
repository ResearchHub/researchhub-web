import { acceptInviteToOrg } from "~/config/fetch";
import { useEffect } from "react";
import { useRouter } from "next/router";


const Index = () => {
  const router = useRouter();

  useEffect(() => {
    console.log(router.query);
    acceptInviteToOrg({ token: router.query.token })
  }, [])

  return null;
}

export default Index;