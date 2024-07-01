import Axios from "@/lib/request";

const LOGIN = {
  authorize: (params: object) => Axios.get(`${window.env.erpHostname}/oidc/authorize`, { params, withCredentials: true }),
  login: (params: object) => Axios.get(`//${window.env.erpLoginCommonService}/erp/login`, { params }),
  logOut: (params: object) => Axios.get(`//${window.env.erpLoginCommonService}/erp/logout`, { params })
};

export default LOGIN;
