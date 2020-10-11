const css = require('css')

const EOF = Symbol("EOF"); // 利用symbol的唯一性，设置一个结束标识

let currentToken = null;

let currentAttribute = null

let stack = [{type: 'document',children: []}] // 构建dom树
let currentTextNode = null

// 加入一个新的函数，addCSSRule，这里把css规则暂存在一个数组里
let rules = []
function addCSSRule(text) {
  var ast = css.parse(text)
  console.log(JSON.stringify(ast, null, "   "))
  rules.push(...ast.stylesheet.rules) // ... 方式可取消才采用apply方法
}

// 计算是否与当前的元素匹配
function match(element, selector) {
  if(!selector || !element.attributes) {
    return false
  }
  if(selector.charAt(0) == '#') {
    var attr = element.attributes.filter(attr => attr.name === 'id')[0]
    if(attr && attr.value === selector.replace('#', '')) {
      return true
    }
  } else if(selector.charAt(0) == '.') {
    var attr = element.attributes.filter(attr => attr.name === 'class')[0]
    if(attr && attr.value === selector.replace('#', '')) {
      return true
    }
  } else {
    if(element.tagName === selector) {
      return true
    }
  }
  return false
}

// specificity的计算逻辑
function specificity(selector) {
  var p = [0, 0, 0, 0]
  var selectorParts = selector.split(' ') // 分割选择器
  for(var part of selectorParts) {
    if(part.charAt(0) == '#') {
      p[1] += 1
    } else if(part.charAt(0) == '.') {
      p[2] += 1
    } else {
      p[3] += 1
    }
    // 解析复合选择器div.cls#id ????
  }
  return p
} 

function compare(sp1, sp2) {
  if(sp1[0] - sp2[0]) {
    return sp1[0] - sp2[0]
  } 
  if(sp1[1] - sp2[1]) {
    return sp1[1] - sp2[1]
  }
  if(sp1[2] - sp2[2]) {
    return sp1[2] - sp2[2]
  }

  return sp1[3] - sp2[3]
}

// 处理简单选择器
function computeCSS(element) {
  // 对父元素的序列进行reverse
  var elements = stack.slice().reverse() // 不影响原始数组，对数组进行反转
  if(!element.computedStyle) {
    element.computedStyle = {}
  }

  for(let rule of rules) {
    var selectorParts = rule.selectors[0].split(' ').reverse()

    if(!match(element, selectorParts[0])) {
      continue
    }
    let matched = false
    var j = 1
    for(var i = 0; i < elements.length; i++) {
      if(match(elements[i]), selectorParts[j]) {
        j++;
      }
    }
    // 判断选择器是否都被匹配到
    if(j >= selectorParts.length) {
      matched = true
    }
    if(matched) {
      var sp = specificity(rule.selectors[0])
      //选择匹配，就应用选择器到元素上，形成computedStyle
      var computedStyle = element.computedStyle
      for(var declaration of rule.declarations) {
        if(!computedStyle[declaration.property]) {
          computedStyle[declaration.property] = {}
        }

        // 选择器优先级的判断
        if(!computedStyle[declaration.property].specificity) {
            computedStyle[declaration.property].value = declaration.value
            computedStyle[declaration.property].specificity = sp
        } else if(compare(computedStyle[declaration.property].specificity, sp) < 0) {
          computedStyle[declaration.property].value = declaration.value
          computedStyle[declaration.property].specificity = sp
        }
      }

      console.log(element.computedStyle)
    }
  }
}

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

    computeCSS(element) // 添加调用

    // 对偶操作
    top.children.push(element)
    // element.parent = top

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
      // ---------遇到style结束标签时，执行添加css规则的操作 -------
      if(top.tagName === 'style') {
        // 此只考虑一种css引入的方式
        addCSSRule(top.children[0].content) // 传入style内的规则
      }
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