// @ts-nocheck
// 使用 Vue.mixin 的方法拦截了路由离开事件，并在该拦截方法中实现了销毁页面缓存的功能。
export default {
  beforeRouteLeave: function(to, from, next) {
    // 默认是缓存的 在来清除
    // 1.用tag标记控制 判断上下级
    // if (from && from.meta.tag && to.meta.tag && (from.meta.tag-to.meta.tag<1))

    const { name, params } = to; // 进入对象
    const { cache, keys } = this.$vnode.parent.componentInstance; // 进入对象
    // const curKey = this.$vnode.componentOptions.Ctor.cid; // 计算当前 key 值，与缓存的 keys 对应
    // const cashViews = ['List', 'Detail']; //  缓存的组件

    // Tab 键切换时
    if (params.tabKey || params.enterKey) {
      if (keys.length < 2) return; // 首次进入不能切换
      for (let i of keys) {
        const ins = cache[i].componentInstance;
        if (ins.$options.name === name) {
          ins.utoolSetInput();
          params.selectText && utools.setSubInputValue(params.selectText);
        }
      }
    } else {
      if (cache) {
        if (this.$vnode.componentOptions) {
          for (let i of keys) {
            const ins = cache[i].componentInstance;
            if (ins.$options.name === name) {
              if (ins.pkgDetail && params.name === ins.pkgDetail.name) break; // 在判断 是否是 原来的pkg。就不需要再去查询了
              const index = keys.indexOf(i);
              if (index > -1) {
                keys.splice(index, 1);
              }
              delete cache[i];
              break;
            }
          }
        }
        // from.meta.keepAlive = true;
      }
    }
    next();
  }
};
