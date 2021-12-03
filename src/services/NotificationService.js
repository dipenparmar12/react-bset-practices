import { toast } from 'react-toastify'
import Type from '../js_utils/Type'

const isString = Type.isString

/**
 * @src https://fkhadra.github.io/react-toastify/introduction/
 * @param obj
 */
let Notify = (
  obj = {
    message: '',
    type: 'success',
  },
) => {
  console.log('notificationService.js::9 Notify:::', obj)
  let notiOptions = {
    type: 'success', // info, success, warning, error, default, dark
    position: 'bottom-center',
    delay: 7,
    message: 'Thank you',
    autoClose: 7000,
  }

  // is object
  if ((typeof obj === 'object' || typeof obj === 'function') && obj !== null) {
    // console.log('notificationService.js::18 object ', obj)
    notiOptions = Object.assign(notiOptions, obj)
  }

  // is String
  if (isString(obj)) {
    notiOptions.message = obj
  }

  // msg not str then do it
  if (!isString(notiOptions.message)) {
    // console.log('notificationService.js::24 not str', obj)
    notiOptions.message = JSON.stringify(notiOptions.message)
  }

  toast(notiOptions.message, notiOptions)

  // if (typeof window !== 'undefined') {
  //   window.alert(notiOptions.message)
  // }
}

export default Notify

export const NotifyTypes = {
  SUCCESS: 'success',
  INFO: 'info',
  ERROR: 'error',
}
