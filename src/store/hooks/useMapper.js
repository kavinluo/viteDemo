import { computed } from 'vue'
import { useStore } from 'vuex'

export default function useMapper (mapper, mapFn) {
  // 拿到store独享
  const store = useStore()

  // 获得对应的对象
  // functions : { counter: function () {}, name: function() {}}
  const storeStateFns = mapFn(mapper)
  // 通过另外的方法实现
  const storeState = {}
  Object.keys(storeStateFns).forEach(fnKey => {
    const fn = storeStateFns[fnKey].bind({ $store: store }) // 这里读取的时候需要读取到this 或者store,所以拿不到 故绑定 bind()
    storeState[fnKey] = computed(fn)
  })
  return storeState
}
