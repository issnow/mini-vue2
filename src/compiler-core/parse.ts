import {ElementTypes, NodeTypes} from "./ast";

/*
计算机科学中，抽象语法树（Abstract Syntax Tree，AST），或简称语法树（Syntax tree），是源代码语法结构的一种抽象表示。它以树状的形式表现编程语言的语法结构，树上的每个节点都表示源代码中的一种结构。之所以说语法是“抽象”的，是因为这里的语法并不会表示出真实语法中出现的每个细节

主要解析template模版变成act 有限状态机
简单理解就是有限状态机用来描述对象的状态，以及响应外界变化所经历的状态序列变迁过程。
当对象的状态数量较多、状态变更比较复杂时，有限状态机能很好的描述整个过程。如果将状态单独抽象出来并构建成状态机，状态的变更都遵循状态机的描述，那么对象的状态及其变更过程就会可读性很强、更直观、更易维护。

解析template流程:
template -> parse -> transform -> generate
template经过parse得到ast,再经过transform得到ast,再经过generate得到render()函数

<div>name{{abc}}</div>
1.解析插值
2.解析element
3.解析text
4.解析上面三种联合类型
 */

enum TagType {
  Start,
  End
}

export function baseParse(content) {
  const context: any = createParserContext(content)
  return createRoot(parseChildren(context, []))
}

function parseChildren(context, ancestors) {
  //解析的过程中需要处理掉已经确认的内容,就是把context的内容一直往后推进
  const nodes: any = []
  while (!isEnd(context, ancestors)) {
    let node
    const s = context.source
    if (s.startsWith('{{')) {
      node = parseInterpolation(context)
    } else if (s.startsWith('<')) {
      if (/[a-z]/i.test(s[1])) {
        node = parseElement(context, ancestors)
      }
    }
    if (!node) {
      //以上都不成立,就认为是text
      node = parseText(context)
    }
    nodes.push(node)
  }
  return nodes
}

function isEnd(context, ancestors) {
  //结束解析,1.source没有值,2.遇到结束标签</div>
  //return !context.source || (parentTag && context.source.startsWith(`</${parentTag}>`))

  if (context.source.startsWith('</')) {
    for (let i = ancestors.length - 1; i >= 0; i--) {
      const tag = ancestors[i].tag
      if (context.source.slice(2, 2 + tag.length) === tag) {
        return true
      }
    }
  }
  // 看看 context.source 还有没有值
  return !context.source;
}

//解析插值 {{mseeage}}
function parseInterpolation(context) {
  //1.找到插值变量
  //2.推进,删除已经解析的部分
  const openDelimiter = "{{"
  const closeDelimiter = "}}"
  const closeIndex = context.source.indexOf(closeDelimiter, openDelimiter.length)
  advanceBy(context, openDelimiter.length)
  const rawContentLength = closeIndex - openDelimiter.length
  const rawContent = context.source.slice(0, rawContentLength)
  const content = rawContent.trim()
  // 最后在让代码前进2个长度，可以把 }} 干掉
  advanceBy(context, rawContentLength + closeDelimiter.length)
  return {
    type: NodeTypes.INTERPOLATION,
    content: {
      type: NodeTypes.SIMPLE_EXPRESSION,
      content,
    },
  }
}

//解析标签 <div></div>
function parseElement(context, ancestors) {
  //处理开始标签<div>
  const element: any = parseTag(context, TagType.Start)
  ancestors.push(element)
  element.children = parseChildren(context, ancestors)
  ancestors.pop()
  //开始标签与结束标签一样才能继续处理
  if (context.source.slice(2, 2 + element.tag.length) === element.tag) {
    //处理结束标签</div>
    parseTag(context, TagType.End)
  } else {
    //结束标签与开始的不一样则报错
    throw new Error(`缺少结束标签:${element.tag}`)
  }
  return element
}

function parseTag(context, tagType) {
  //1.解析div
  const match: any = /^<\/?([a-z]+)/i.exec(context.source)
  const tag = match[1]
  //2.删除处理完成的代码
  advanceBy(context, match[0].length)
  advanceBy(context, 1)
  if (tagType === TagType.Start) {
    return {
      type: NodeTypes.ELEMENT,
      tag,
      //tagType: ElementTypes.ELEMENT,
      //children: [
      //  {
      //    type: NodeTypes.TEXT,
      //    content: "hello",
      //  },
      //]
    }
  }
}


//解析text文本 'some text' ;'hi {{msg}}' '<p>hi</> some text'
function parseText(context) {
  let endIndex = context.source.length
  let endTokens = ['{{', '<']
  for (let i = 0; i < endTokens.length; i++) {
    let index = context.source.indexOf(endTokens[i])
    // endIndex > index 是需要要 endIndex 尽可能的小
    // 比如说：
    // hi, {{123}} <div></div>
    // 那么这里就应该停到 {{ 这里，而不是停到 <div 这里
    if (index !== -1 && index < endIndex) {
      endIndex = index
    }
  }

  //找到text
  //删除解析的部分
  const content = context.source.slice(0, endIndex)
  advanceBy(context, content.length)
  return {
    type: NodeTypes.TEXT,
    content,
  }
}

function advanceBy(context, length) {
  context.source = context.source.slice(length)
}


function createRoot(children) {
  return {
    children
  }
}

function createParserContext(content) {
  return {
    source: content
  }
}