/*
 * @Author: kevin
 * @Date: 2022-03-31 09:31:10
 * @LastEditors: kevin
 * @LastEditTime: 2022-08-08 15:40:46
 * @Description: 按钮防抖
 */

export default (app) => {
  app.directive('noAntiShake', {
    mounted (el, binding) {
      el.addEventListener('click', e => {
        el.classList.add('disabled')
        el.disabled = true
        setTimeout(() => {
          el.disabled = false
          el.classList.remove('disabled')
        }, 2000)
      })
    }
  })
}
