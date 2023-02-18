import { useRouter } from 'next/router'
import { useEffect } from "react";
import useRequest from "../../hooks/useRequest";

const Signout = () => {
    
    const router = useRouter()
    const { doRequest} = useRequest({
        url: '/api/users/signout',
        method: 'post',
        body: {},
        onSuccess: () => router.push('/')
    })

  useEffect(() => {
    doRequest();
  }, []);

  return <div>Signing out...</div>;
};

export default Signout
