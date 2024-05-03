import {createComponentInstance, setupComponent} from "./component";
//@ts-ignore
import {ShapeFlags} from "../shared/shapeFlags";
import {Fragment, Text} from "./vnode";
import {createAppApi} from "./createApp";
import {effect} from "../reactivity";
import {empty_obj} from "../shared";
import {insert} from "../runtime-dom";

//自定义渲染器,对于不同的宿主环境,是不同的api
export function createReaderer(opt) {
  const {createElement, patchProp, insert, remove, setElementText} = opt;

  //首次渲染入口,根据vnode和container渲染
  function render(vnode, container) {
    //patch
    patch(null, vnode, container, null, null)
  }

  /**
   *
   * @param n1 旧vnode
   * @param n2 新vnode
   * @param container 容器(父元素)
   * @param parentInstance 父组件实例
   * @param anchor 在此元素之前插入元素
   */
  function patch(n1, n2, container, parentInstance, anchor) {
    //去处理组件
    //shapeFlags vnode-> flag
    //string -> element
    //object -> 组件
    const {shapeFlag, type} = n2

    //Fragment -> 只渲染children

    switch (type) {
      case Fragment:
        processFragment(n1, n2, container, parentInstance, anchor)
        break;
      case Text:
        processText(n1, n2, container)
        break;
      default:
        //判断是不是element类型
        if (shapeFlag & ShapeFlags.element) {
          processElement(n1, n2, container, parentInstance, anchor);
        } else if (shapeFlag & ShapeFlags.stateful_component) {
          processComponent(n1, n2, container, parentInstance, anchor)
        }
    }
  }

  function processFragment(n1, n2, container, parentInstance, anchor) {
    mountChildren(n2.children, container, parentInstance, anchor)
  }

  function processText(n1, n2, container) {
    const text = n2.el = document.createTextNode(n2.children)
    container.appendChild(text)
  }

//处理元素类型
  function processElement(n1, n2, container, parentInstance, anchor) {
    if (!n1) {
      //mount
      mountElement(n2, container, parentInstance, anchor)
    } else {
      //update
      patchElement(n1, n2, container, parentInstance, anchor)
    }
  }

//处理组件类型
  function processComponent(n1, n2, container, parentInstance, anchor) {
    mountComponent(n2, container, parentInstance, anchor)
  }

  //vnode更新 对比新旧vnode
  function patchElement(n1, n2, container, parentInstance, anchor) {
    console.log(n1)
    console.log(n2)
    const oldProps = n1.props || empty_obj
    const newProps = n2.props || empty_obj
    const el = n2.el = n1.el
    //props改变
    patchProps(el, oldProps, newProps)
    //children改变
    patchChildren(el, n1, n2, parentInstance, anchor)
  }

  function patchChildren(el, n1, n2, parentInstance, anchor) {
    const {shapeFlag: oldShapeFlag, children: oldChildren} = n1
    const {shapeFlag, children} = n2
    //节点的children改变
    //情况1:array -> text
    if (shapeFlag & ShapeFlags.text_children) {
      if (oldShapeFlag & ShapeFlags.array_children) {
        //1.把老的children清空
        unmountChildren(n1.children)
        //2.设置新的文本text
        setElementText(el, n2.children)
      } else {
        //情况2:text -> text
        if (oldChildren !== children) {
          //2.直接设置新的文本text
          setElementText(el, n2.children)
        }
      }
    } else {
      if (oldShapeFlag & ShapeFlags.array_children) {
        //情况3:array -> array 比较复杂
        patchKeyedChildren(oldChildren, children, el, parentInstance, anchor)
      } else {
        //情况4:text -> array
        setElementText(el, '')
        mountChildren(n2.children, el, parentInstance, anchor)
      }
    }
  }

  function patchKeyedChildren(c1, c2, container, parentInstance, parentAnchor) {
    //i e1 e2 核心是确定节点不一样的范围
    //i 表示第一次节点不一样的位置索引,e1 旧children最后一位, e2新children最后一位
    let i = 0
    let e1 = c1.length - 1
    let e2 = c2.length - 1

    function isSomeVnodeType(n1, n2) {
      return n1.key === n2.key && n1.type === n2.type
    }

    // 遍历新children,找到新旧节点不一样的位置,为i

    //1.左侧一样,向右查找,确定i的位置
    while (i <= e1 && i <= e2) {
      const n1 = c1[i]
      const n2 = c2[i]
      if (isSomeVnodeType(n1, n2)) {
        patch(n1, n2, container, parentInstance, parentAnchor)
      } else {
        break
      }
      i++
    }
    //2.右侧一样,向左查找,确定e1 e2的位置
    while (i <= e1 && i <= e2) {
      const n1 = c1[e1]
      const n2 = c2[e2]
      if (isSomeVnodeType(n1, n2)) {
        patch(n1, n2, container, parentInstance, parentAnchor)
      } else {
        break
      }
      e1--
      e2--
    }
    console.log('i', i)
    console.log('e1', e1)
    console.log('e2', e2)
    if (i > e1 && i <= e2) {
      //3.新的比旧的长,创建新的
      // 如果是这种情况的话就说明 e2 也就是新节点的数量大于旧节点的数量
      // 也就是说新增了 vnode
      // 应该循环 c2
      // 锚点的计算：新的节点有可能需要添加到尾部，也可能添加到头部，所以需要指定添加的问题
      // 要添加的位置是当前的位置(e2 开始)+1
      // 因为对于往左侧添加的话，应该获取到 c2 的第一个元素
      // 所以我们需要从 e2 + 1 取到锚点的位置
      const nextPos = e2 + 1
      const anchor = nextPos < c2.length ? c2[nextPos].el : null
      while (i <= e2) {
        patch(null, c2[i], container, parentInstance, anchor)
        i++
      }
    } else if (i > e2 && i <= e1) {
      //4.旧的比新的长,删除旧的
      while (i <= e1) {
        remove(c1[i].el)
        i++
      }
    } else {
      // 左右两边都比对完了，然后剩下的就是中间部位顺序变动的
      // 例如下面的情况
      // a,b,[c,d,e],f,g
      // a,b,[e,c,d],f,g
      // 思路:创建新的,删除老的,移动
      let s1 = i
      let s2 = i
      let toBePatched = e2 - s2 + 1
      let patched = 0
      let keyToNewIndexMap = new Map()
      //最长递增子序列
      let newIndexToOldIndexMap = new Array(toBePatched)
      let moved = false
      let maxNewIndexSoFar = 0
      for (let i = 0; i < toBePatched; i++) {
        newIndexToOldIndexMap[i] = 0
      }
      // 先把 key 和 newIndex 绑定好，方便后续基于 key 找到 newIndex
      for (let i = s2; i <= e2; i++) {
        keyToNewIndexMap.set(c2[i].key, i)
      }
      for (let i = s1; i <= e1; i++) {
        if (patched >= toBePatched) {
          remove(c1[i].el)
          continue
        }
        let newIndex
        if (c1[i].key) {
          newIndex = keyToNewIndexMap.get(c1[i].key)
        } else {
          for (let j = s2; j <= e2; j++) {
            if (isSomeVnodeType(c1[i], c2[j])) {
              newIndex = j
              break
            }
          }
        }
        if (newIndex === undefined) {
          remove(c1[i].el)
        } else {
          if (newIndex >= maxNewIndexSoFar) {
            maxNewIndexSoFar = newIndex
          } else {
            moved = true
          }
          newIndexToOldIndexMap[newIndex - s2] = i + 1
          patch(c1[i], c2[newIndex], container, parentInstance, null)
          patched++
        }
      }
      // 利用最长递增子序列来优化移动逻辑
      // 因为元素是升序的话，那么这些元素就是不需要移动的
      // 而我们就可以通过最长递增子序列来获取到升序的列表
      // 在移动的时候我们去对比这个列表，如果对比上的话，就说明当前元素不需要移动
      // 通过 moved 来进行优化，如果没有移动过的话 那么就不需要执行算法
      // getSequence 返回的是 newIndexToOldIndexMap 的索引值
      // 所以后面我们可以直接遍历索引值来处理，也就是直接使用 toBePatched 即可
      const increasingNewIndexSequence = moved ? getSequence(newIndexToOldIndexMap) : []
      let j = increasingNewIndexSequence.length - 1
      for (let i = toBePatched - 1; i >= 0; i--) {
        const nextIndex = i + s2
        const nextChild = c2[nextIndex]
        const anchor = nextIndex + 1 < c2.length ? c2[nextIndex + 1].el : null
        if (newIndexToOldIndexMap[i] === 0) {
          patch(null, nextChild, container, parentInstance, anchor)
        } else if (moved) {
          if (j < 0 || i !== increasingNewIndexSequence[j]) {
            console.log('移动位置')
            insert(nextChild.el, container, anchor)
          } else {
            j--
          }
        }

      }
    }
  }

  function unmountChildren(children) {
    children.forEach(child => remove(child.el))
  }

  function patchProps(el, oldProps, newProps) {
    if (oldProps !== newProps) {
      for (const newPropsKey in newProps) {
        const prevProp = oldProps[newPropsKey]
        const nextProp = newProps[newPropsKey]
        if (prevProp !== nextProp) {
          patchProp(el, newPropsKey, prevProp, nextProp)
        }
      }
      if (oldProps !== empty_obj) {
        //旧的props不存在了
        for (const oldPropsKey in oldProps) {
          if (!newProps[oldPropsKey]) {
            patchProp(el, oldPropsKey, oldProps[oldPropsKey], null)
          }
        }
      }
    }
  }

//元素类型-mount阶段,构建dom,添加文本和属性,递归处理children
  function mountElement(vnode, container, parentInstance, anchor) {
    //element
    const el = vnode.el = createElement(vnode.type)
    const {props, children, shapeFlag} = vnode
    //children text 或者 array
    if (shapeFlag & ShapeFlags.text_children) {
      el.textContent = children
    } else if (shapeFlag & ShapeFlags.array_children) {
      mountChildren(children, el, parentInstance, anchor)
    }
    for (let prop in props) {
      patchProp(el, prop, null, props[prop])
    }
    insert(el, container, anchor)
  }

  function mountChildren(children, container, parentInstance, anchor) {
    for (let node of children) {
      patch(null, node, container, parentInstance, anchor)
    }
  }

//组件类型-生成实例,处理数据
  function mountComponent(vnode, container, parentInstance, anchor) {
    const instance = createComponentInstance(vnode, parentInstance)
    setupComponent(instance)
    setupRenderEffect(instance, vnode, container, anchor)
  }

//主要递归处理render内容,也就是subtree
  function setupRenderEffect(instance, vnode, container, anchor) {
    effect(() => {
      if (instance.isMounted) {
        //mount阶段
        const {proxy} = instance
        const subtree = instance.subtree = instance.render.call(proxy)

        //vnode -> patch
        //vnode -> element -> mountElement
        patch(null, subtree, container, instance, anchor)
        //element mount之后
        vnode.el = subtree.el
        instance.isMounted = false
      } else {
        //update阶段
        const {proxy} = instance
        const subtree = instance.render.call(proxy)
        const prevSubtree = instance.subtree
        instance.subtree = subtree
        patch(prevSubtree, subtree, container, instance, anchor)
      }
    })
  }

  return {
    createApp: createAppApi(render)
  }
}

function getSequence(arr: number[]): number[] {
  const p = arr.slice();
  const result = [0];
  let i, j, u, v, c;
  const len = arr.length;
  for (i = 0; i < len; i++) {
    const arrI = arr[i];
    if (arrI !== 0) {
      j = result[result.length - 1];
      if (arr[j] < arrI) {
        p[i] = j;
        result.push(i);
        continue;
      }
      u = 0;
      v = result.length - 1;
      while (u < v) {
        c = (u + v) >> 1;
        if (arr[result[c]] < arrI) {
          u = c + 1;
        } else {
          v = c;
        }
      }
      if (arrI < arr[result[u]]) {
        if (u > 0) {
          p[i] = result[u - 1];
        }
        result[u] = i;
      }
    }
  }
  u = result.length;
  v = result[u - 1];
  while (u-- > 0) {
    result[u] = v;
    v = p[v];
  }
  return result;
}