let currentToken = null;

let currentAttribute = null

let stack = [{type: 'document',children: []}] // 构建dom树
let currentTextNode = null


// emit时构建dom树
function emit(token) {
  let top = stack[stack.length - 1] // 取栈顶
  if(token.type == 'startTag') {
    let element = {
      type: 'element',
      children: [],
      attributes: []
    }

    element.tagName = token.tagName
    for(let p in token) {
      if(p != 'type' && p != 'tagName') {
        element.attributes.push({
          name: p,
          value: token[p]
        })
      }
    }

    // 对偶操作
    top.children.push(element)
    element.parent = top

    if(!token.isSelfClosing) {
      stack.push(element)
    }

    currentTextNode = null
  } else if(token.type == 'endTag') {
    // 判断tagName 是否相等
    if(top.tagName != token.tagName) {
      // 此处未设置容错性处理，未配对标签直接抛异常
      throw new Error('Tag start end does not match!')
    } else {
      stack.pop()
    }
    currentTextNode = null

  } else if(token.type == 'text') {
    // 文本节点处理
    if(currentTextNode == null) {
      // 当前没有文本节点，创建一个新的
      currentTextNode = {
        type: 'text',
        content: ''
      }
      top.children.push(currentTextNode)
    }
    currentTextNode.content += token.content // 多个文本节点需要合并
  }
}

const EOF = Symbol("EOF"); // 利用symbol的唯一性，设置一个结束标识

function data(c) {
  if(c == '<') {
    return tagOpen
  } else if(c == EOF) {
    emit({
      type: 'EOF'
    })
    return ;
  } else {
    emit({
      type: 'text',
      content: c
    })
    return data
  }
}

function tagOpen(c) {
  if(c == '/') {
    return endTagOpen
  } else if(c.match(/^[a-zA-Z]$/)) {
    currentToken = {
      type: 'startTag',
      tagName: ''
    }
    return tagName(c)
  } else {
    return 
  }
}

function tagName(c) {
  if(c.match(/^\t\n\f ]$/)) {
    return beforeAttributeName
  } else if(c == '/') {
    return selfClosingStartTag
  } else if(c.match(/^[a-zA-Z]$/)) {
    currentToken.tagName += c 
    return tagName
  } else if(c == '>') {
    emit(currentToken)
    return data
  } else {
    return tagName
  }
}

function beforeAttributeName(c) {
  if(c.match(/^[\t\n\f ]$/)) {
    return beforeAttributeName
  } else if(c == '/' || c == '>' || c == EOF) {
    return afterAttributeName(c)
    return data
  } else if(c == '=') {

  } else {
    currentAttribute = {
      name: '',
      value: ''
    }
    return attributeName(c)
  }
}

function attributeName(c) {
  if(c.match(/^[\t\n\f ]$/ || c == '/' || c == '>' || c == EOF)) {
    return afterAttributeName(c)
  } else if(c == '=') {
    return beforeAttributeValue
  } else if(c == '\u0000') {

  } else if(c == '\"' || c == '\'' || c == '<') {

  } else {
    currentAttribute.name +=c
    return attributeName
  }
}

function beforeAttributeValue(c) {
  if(c.match(/^[\t\n\f ]$/) || c == '/' || c == '>' || c == 'EOF') {
    return beforeAttributeValue
  } else if(c == '\"') {
    return doubleQuotedAttributeValue;
  } else if(c == '\'') {
    return singleQuotedAttributeValue
  } else if(c == '>') {

  } else {
    return unQuotedAttributeValue(c)
  }
}

function doubleQuotedAttributeValue(c) {
  if(c == '\"') {
    currentToken[currentAttribute.name] = currentAttribute.value
    return afterQuotedAttributeValue
  } else if(c == '\u0000') {

  } else if( c == EOF) {

  } else {
    currentAttribute.value += c
    return doubleQuotedAttributeValue
  }
}

function singleQuotedAttributeValue(c) {
  if(c == '\'') {
    currentToken[currentAttribute.name] = currentAttribute.value
    return afterQuotedAttributeValue
  } else if(c == '\u0000') {

  } else if( c == EOF) {

  } else {
    currentAttribute.value += c
    return doubleQuotedAttributeValue
  }
}

function unQuotedAttributeValue(c) {
  if(c.match(/^[\t\n\f ]$/)) {
    currentToken[currentAttribute.name] = currentAttribute.value
    return beforeAttributeName
  } else if(c == '/') {
    currentToken[currentAttribute.name] = currentAttribute.value
    return selfClosingStartTag
  } else if( c == '>') {
    currentToken[currentAttribute.name] = currentAttribute.value
    emit(currentToken)
    return data
  } else if(c == '\u0000') {

  } else if(c == '\"' || c == '\'' || c == '<' || c == '=' || c == '`') {

  } else if(c == EOF) {

  } else {
    currentAttribute.value += c
    return unQuotedAttributeValue
  }
}

function afterQuotedAttributeValue(c) {
  if(c.match(/^[\t\n\f ]$/)) {
    return beforeAttributeName
  } else if(c == '/') {
    return selfClosingStartTag
  } else if(c == '>') {
    currentToken[currentAttribute.name] = currentAttribute.value
    emit(currentToken)
    return data
  } else if(c == EOF) {

  } else {
    currentAttribute.value += c
    return doubleQuotedAttributeValue
  }
}

function afterAttributeName(c) {
  if(c.match(/^[\t\n\f ]$/)) {
    return afterAttributeName
  } else if(c == '/') {
    return selfClosingStartTag
  } else if(c == '=') {
    return beforeAttributeValue
  } else if(c == '>') {
    currentToken[currentAttribute.name] = currentAttribute.value
    emit(currentToken)
    return data
  } else if(c == EOF) {

  } else {
    currentToken[currentAttribute.name] = currentAttribute.value
    currentAttribute = {
      name: '',
      value: ''
    }
    return attributeName(c)
  }
}

// 自结束
function selfClosingStartTag(c) {
  if(c == '>') {
    currentToken.isSelfClosing = true // 标识自结束标签
    return data
  } else if(c == 'EOF') {

  } else {

  }
}


function endTagOpen(c) {
  if(c.match(/^[a-zA-Z]$/)) {
    currentToken = {
      type: 'endTag',
      tagName: ''
    }
    return tagName(c)
  } else if(c == '>') {

  } else if(c == 'EOF') {

  } else {

  }
}

module.exports.parserHTML = function  parserHTML(html) {
  let state = data;
  for(let c of html) {
    state = state(c)
  }
  state = state(EOF)
}