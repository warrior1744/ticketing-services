<<<<<<< HEAD
import Router from "next/router";
import { useEffect } from "react";
import useRequest from "../../hooks/useRequest";

const signout = () => {
  const { doRequest } = useRequest({
    url: "/api/users/signout",
    method: "post",
    body: {},
    onSuccess: () => Router.push("/"),
  });
=======
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
>>>>>>> master

  useEffect(() => {
    doRequest();
  }, []);

  return <div>Signing out...</div>;
};

<<<<<<< HEAD
export default signout;
=======

}

export default Signout
>>>>>>> master
