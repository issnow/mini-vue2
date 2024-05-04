import {NodeTypes} from "./ast";

/*
<div>hi,{{msg}}</div>
{
  type: NodeTypes.ELEMENT,
  tag: "div",
  children: [
    {
      type: NodeTypes.TEXT,
      content: "hi,",
    },
    {
      type: NodeTypes.INTERPOLATION,
      content: {
        type: NodeTypes.SIMPLE_EXPRESSION,
        content: "msg",
      },
    },
  ],
}
*/

export function transform(root, options) {
  const context = createTransformContext(root, options);
  //1.遍历 -深度优先遍历
  traverseNode(root, context)
  //2.修改 - text context

}

function createTransformContext(root, options) {
  const context = {
    root,
    nodeTransforms: options.nodeTransforms || []
  }
  return context
}

/*
traverse - 百度翻译
vt.穿过;横越;横过;横渡;
n.(在陡坡上的)侧向移动，横过，横越;可横越的地方;
v.穿过;横越;横过;横渡;
 */

function traverseNode(node, context) {
  const nodeTransforms = context.nodeTransforms
  for (let i = 0; i < nodeTransforms.length; i++) {
    const transform = nodeTransforms[i]
    transform(node, context)
  }
  traverseChildren(node, context)
}

function traverseChildren(node, context) {
  const children = node.children
  if (children) {
    for (let i = 0; i < children.length; i++) {
      const node = children[i]
      traverseNode(node, context)
    }
  }
}