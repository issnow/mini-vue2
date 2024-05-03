import {createComponentInstance, setupComponent} from "./component";
//@ts-ignore
import {ShapeFlags} from "../shared/shapeFlags";
import {Fragment, Text} from "./vnode";
import {createAppApi} from "./createApp";
import {effect} from "../reactivity";
import {empty_obj} from "../shared";

//自定义渲染器,对于不同的宿主环境,是不同的api
export function createReaderer(opt) {
  const {createElement, patchProp, insert} = opt;

  //根据vnode和container渲染
  function render(vnode, container, parentInstance?) {
    //patch
    patch(null, vnode, container, parentInstance)
  }

  //n1 -> 旧的
  //n2 -> 新的
  function patch(n1, n2, container, parentInstance) {
    //去处理组件
    //shapeFlags vnode-> flag
    //string -> element
    //object -> 组件
    const {shapeFlag, type} = n2

    //Fragment -> 只渲染children

    switch (type) {
      case Fragment:
        processFragment(n1, n2, container, parentInstance)
        break;
      case Text:
        processText(n1, n2, container)
        break;
      default:
        //判断是不是element类型
        if (shapeFlag & ShapeFlags.element) {
          processElement(n1, n2, container, parentInstance);
        } else if (shapeFlag & ShapeFlags.stateful_component) {
          processComponent(n1, n2, container, parentInstance)
        }
    }
  }

  function processFragment(n1, n2, container, parentInstance) {
    mountChildren(n2.children, container, parentInstance)
  }

  function processText(n1, n2, container) {
    const text = n2.el = document.createTextNode(n2.children)
    container.appendChild(text)
  }

//处理元素类型
  function processElement(n1, n2, container, parentInstance) {
    if (!n1) {
      //mount
      mountElement(n2, container, parentInstance)
    } else {
      //update
      patchElement(n1, n2, container)
    }
  }

//处理组件类型
  function processComponent(n1, n2, container, parentInstance) {
    mountComponent(n2, container, parentInstance)
  }

  //vnode更新 对比新旧vnode
  function patchElement(n1, n2, container) {
    console.log(n1)
    console.log(n2)
    const oldProps = n1.props || empty_obj
    const newProps = n2.props || empty_obj
    const el = n2.el = n1.el
    //props改变
    patchProps(el, oldProps, newProps)
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
  function mountElement(vnode, container, parentInstance) {
    //element
    const el = vnode.el = createElement(vnode.type)
    const {props, children, shapeFlag} = vnode
    //children text 或者 array
    if (shapeFlag & ShapeFlags.text_children) {
      el.textContent = children
    } else if (shapeFlag & ShapeFlags.array_children) {
      mountChildren(children, el, parentInstance)
    }
    for (let prop in props) {
      //onclick -> click
      //const isOn = (key) => /^on[A-Z]/.test(key)
      //if (isOn(prop)) {
      //  const event = prop.substring(2).toLowerCase()
      //  el.addEventListener(event, props[prop])
      //} else {
      //  el.setAttribute(prop, props[prop])
      //} ⬇️
      patchProp(el, prop, null, props[prop])
    }
    //container.appendChild(el) ⬇️
    insert(el, container)
  }

  function mountChildren(children, container, parentInstance) {
    for (let node of children) {
      patch(null, node, container, parentInstance)
    }
  }

//组件类型-生成实例,处理数据
  function mountComponent(vnode, container, parentInstance) {
    const instance = createComponentInstance(vnode, parentInstance)
    setupComponent(instance)
    setupRenderEffect(instance, vnode, container)
  }

//主要递归处理render内容,也就是subtree
  function setupRenderEffect(instance, vnode, container) {
    effect(() => {
      if (instance.isMounted) {
        //mount阶段
        const {proxy} = instance
        const subtree = instance.subtree = instance.render.call(proxy)

        //vnode -> patch
        //vnode -> element -> mountElement
        patch(null, subtree, container, instance)
        //element mount之后
        vnode.el = subtree.el
        instance.isMounted = false
      } else {
        //update阶段
        const {proxy} = instance
        const subtree = instance.render.call(proxy)
        const prevSubtree = instance.subtree
        instance.subtree = subtree

        patch(prevSubtree, subtree, container, instance)

      }

    })
  }

  return {
    createApp: createAppApi(render)
  }
}
