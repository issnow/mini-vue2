import {ElementTypes, NodeTypes} from "./ast";

/*
主要解析template模版
<div>name{{abc}}</div>
 */

enum TagType {
  Start,
  End
}

export function baseParse(content) {
  const context: any = createParserContext(content)
  return createRoot(parseChildren(context))
}

function parseChildren(context) {
  //解析的过程中需要处理掉已经确认的内容,就是把context的内容一直往后推进
  const nodes: any = []
  let node
  const s = context.source
  if (s.startsWith('{{')) {
    node = parseInterpolation(context)
  } else if (s.startsWith('<')) {
    if (/[a-z]/i.test(s[1])) {
      node = parseElement(context)
    }
  }
  if (!node) {
    //以上都不成立,就认为是text
    node = parseText(context)
  }
  nodes.push(node)
  return nodes
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
  advanceBy(context, rawContentLength + closeDelimiter.length)
  console.log('content', content)
  return {
    type: NodeTypes.INTERPOLATION,
    content: {
      type: NodeTypes.SIMPLE_EXPRESSION,
      content,
    },
  }
}

//解析标签 <div></div>
function parseElement(context) {
  const element = parseTag(context, TagType.Start)
  parseTag(context, TagType.End)
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
      tag: tag,
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


//解析text文本 'some text'
function parseText(context) {
  //找到text
  //删除解析的部分
  const content = context.source.slice(0, context.source.length)
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