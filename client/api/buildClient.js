import axios from "axios"

const buildClient = ({req}) => {
    if (typeof window === "undefined") {
        //on the server, reload, changing url etc...
        return axios.create({
            baseURL: "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local",
            headers: req.headers
        })
    } else {
        //on the browser, navigate within the same domain
        return axios.create({
            baseURL: "/",
        })
    }
}

export default buildClient