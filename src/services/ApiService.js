import axios from "axios";
import Cookie from "js-cookie";
import queryEncoder from "utils/queryEncoder";
import { format_str } from "../utils/capitalize";
import isString from "../utils/isString";
import Notify from "./notificationService";

// CLIENT_BASE_URL
export const CLIENT_BASE_URL =
  process.env.NEXT_PUBLIC_CLIENT_PANEL_BASE_URL || "https://www.minthnt.com";

let baseURL = process.env.NEXT_PUBLIC_API_DOMAIN + "/api/v1";

try {
  if (typeof window !== "undefined") {
    const url = new URLSearchParams(window.location.search).get("baseURL");
    baseURL = url ? window.localStorage.setItem("baseURL", url) : baseURL;
  }
  if (typeof window !== "undefined" && window.localStorage.getItem("baseURL")) {
    baseURL = window.localStorage.getItem("baseURL") || baseURL;
  }
} catch (error) {
  console.log("ApiService.js::[17] error", error);
}

const axiosApp = axios.create({ baseURL: baseURL });

// API_BASE_URL
// axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_DOMAIN + '/api/v1'

// Add a request interceptor
axiosApp.interceptors.request.use(function (config) {
  if (Cookie.get("token")) {
    config.headers.Authorization = `Token ${Cookie.get("token")}`;
  }
  return config;
});

export const auth = {
  get: async (d) => await axiosApp.get(`/app_data?${queryEncoder(d)}`),
  profile: async (d) => await axiosApp.get(`/hosts/profile?${queryEncoder(d)}`),
  updateHostDetails: async (data, config) =>
    axiosApp.put(`/hosts/profile`, data, config),
  intercom: async (d) =>
    await axiosApp
      .create()
      .post(`${CLIENT_BASE_URL}/api/intercom?${queryEncoder(d)}`),
  login: async (d) => await axiosApp.post(`/hosts/login`, d),
  logout: async (d) => await axiosApp.post(`/auth/logout`),
  forgotPassword: async (d) =>
    await axiosApp.post(`/hosts/forgot`, queryEncoder(d)),
  changePassword: async (token, d) =>
    await axiosApp.post(`/hosts/forgot/${token}`, JSON.stringify(d), {
      headers: { "Content-Type": "application/json" }
    }),
  forgotPasswordTokenVerify: async (token) =>
    await axiosApp.get(`/hosts/forgot/${token}`),

  getHostByToken: async (token) =>
    await axios.create().get(`${baseURL}/app_data`, {
      headers: { Authorization: `Token ${token}` }
    })
};

export const host = {
  profile: async (d) => await axiosApp.get(`/hosts/profile`),
  app_data: async (d) => await axiosApp.get(`/app_data?${queryEncoder(d)}`),
  partner_search: async (d) =>
    await axiosApp.get(`/hosts/partners?${queryEncoder(d)}`)
};

export const addresses = {
  get: async (d) => await axiosApp.get(`/hosts/addresses?${queryEncoder(d)}`),
  update: async (d, id) => await axiosApp.patch(`/addresses/${id}`, d),

  partner: async (d) =>
    await axiosApp.get(`/hosts/partner/addresses?${queryEncoder(d)}`),
  create: async (data) => await axiosApp.post(`/hosts/addresses`, data)
};

export const hotspots = {
  return: async (hotspotId, d) =>
    await axiosApp.post(`/returns/${hotspotId}`, d),
  update: async (d, id) =>
    await axiosApp.patch(`/hotspots/host/update/${id}`, d)
};

export const preOrders = {
  get: async (d) => await axiosApp.get(`/host/preorders?${queryEncoder(d)}`),
  post: async (id, d) => await axiosApp.post(`/host/preorders/address/${id}`, d)
};

export const leads = {
  create: async (data) => await axiosApp.post("/leads", data)
};

export const dashboard = {
  hostingEarnings: async (d) =>
    await axiosApp.get(`/earning_details?${queryEncoder(d)}`)
};

export const helium = {
  get_current_price: async () =>
    await axios.create().get("https://api.helium.io/v1/oracle/prices/current")
};

export const test = {
  get: async (d) => await axiosApp.post(`/app_data?`),
  create: async (d) => await axiosApp.post(`/app_data?`)
};

export const utils = {
  getErrorMessage: (error, fallbackErrMsg = "Something went wrong!") => {
    console.log("ApiService.js::[135] error", {
      errorMessage: error?.message,
      line: error?.line,
      lineNumber: error?.lineNumber,
      error: error
    });

    let errorMessage = (error && error?.message) || fallbackErrMsg;

    if (error?.response?.headers?.["content-type"] === "application/json") {
      const { field = "", display_msg = null } =
        error?.response?.data?.errors?.[0] || {};
      errorMessage = display_msg || fallbackErrMsg;
      if (field && isString(field)) {
        errorMessage = `'${format_str(field)}'` + " " + errorMessage;
      }
    }

    if (
      error?.headers &&
      error?.headers?.["content-type"] === "application/json"
    ) {
      const { field = "", display_msg = null } = error?.data?.errors?.[0] || {};
      console.log("ApiService.js::[130] field", field);
      errorMessage = display_msg || fallbackErrMsg;
      if (field && isString(field)) {
        errorMessage = `'${format_str(field)}'` + " " + errorMessage;
      }
    }

    return errorMessage;
  },
  catchError: (error) => {
    console.log("ApiService.js::97 API CALL error", Object.assign({}, error));
    const description = httpApi.utils.getErrorMessage(error?.response);
    Notify({ message: description, type: "error" });
    // dispatch(dashboardSlice.actions?._setLoading(false))
  }
};

export const others = {
  validate_wallet: async (d) =>
    await axios
      .create()
      .get(`${CLIENT_BASE_URL}/api/validate_wallet_address?${queryEncoder(d)}`),
  validate_paypal_username: async (d) =>
    await axios
      .create()
      .get(`${CLIENT_BASE_URL}/api/validate_paypal_address?${queryEncoder(d)}`)
};

export const statusMsg = {
  success: "SUCCESS",
  fail: "FAILURE"
};

export const statusCode = {
  success: 200,
  fail: 400,
  error: 500
};

// default export
const httpApi = {
  test,
  host,
  addresses,
  leads,
  auth,
  utils,
  dashboard,
  helium,
  statusMsg,
  others,
  hotspots,
  preOrders
};

export default httpApi;

/* 
========================================================
  dump
======================================================== 
  // changePassword: async (token, d) => {
  //   const options = {
  //     method: 'POST',
  //     headers: {'Content-Type': 'application/json'},
  //     data:  JSON.stringify(d),
  //     url: `/hosts/forgot/${token}`,
  //   };
  //   return axios(options)
  // }

httpApi.test
  .create(values)
  .then(function ({ data }) {
    console.log('index.js::[105] data', data)
  })
  .catch(function (error) {
    // console.log('index.js::[108] error', Object.assign({}, error))
    console.log('index.js::[109] error', error.response?.data)
    toast({
      title: error.response?.data?.errors[0].type,
      description: error.response?.data?.errors[0].display_msg,
      status: 'error',
      duration: 9000,
      isClosable: true,
      position: 'bottom-right',
    })
  })
      
/// Multiple API Call
Promise.all([
  httpApi.hotspotReturns.get({
    shipping_label_url__isnull: true,
  }),
  httpApi.preOrders.get({
    status: preOrderTypes.NEEDS_ATTENTION,
  }),
])
  // .then((res) => res?.data?.data || res?.data || res)
  .then((data) => data?.map((res) => res?.data?.data || res?.data || res))
  .then(([resReturns, resPreOrders]) => {
    dispatch(
      _setState({
        notifications: {
          hotspots: resReturns?.count || 0,
          preOrders: resPreOrders?.count || 0,
        },
      }),
    )
  })
  .catch((error) => console.log(error))  
*/
