const validDateReg = /^\d{4}-\d{1,2}-\d{1,2}$/
export default function(dateString) {
  return validDateReg.test(dateString)
}