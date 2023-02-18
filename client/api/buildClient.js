import axios from "axios"

const BuildClient = ({req}) => {
    if (typeof window === "undefined") {
        //on the server, reload, changing url etc...
        return axios.create({
            baseURL: "http://www.jim1984project.online/",
            headers: req.headers //passing host name and cookies etc...
        })
    } else {
        //on the browser, navigate within the same domain
        return axios.create({
            baseURL: "/",
        })
    }
}

export default BuildClient