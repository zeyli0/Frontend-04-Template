学习笔记
一：
CSS语法: 普通规则
@规则
@charset
@import
@media
@page
@keyframes
@fontface // 写列表定制列表形状
@support
@counter-style
@namespace

CSS @规则结构

选择器 selector:  
selector_group, 
selector (>, <sp>, +, ~), 
simple_selector (type, * . # [] : :: :not())

declaration
声明
key: variables, properties
value: calc, number, length

CSS收集标准
https://www.w3.org/TR/
Array.prototype.slice.call(document.querySelector("#container").children).filter(e => e.getAttribute("data-tag").match(/css/)).map(e => ({name: e.children[1].innerText,url: e.children[1].children[0].href }))

https://www.w3.org/TR/?Tag=css


二：
选择器语法
1 简单选择器
*
div svg|a (css namespace(|): html, svg, MathMl)
.cls
#id
[attr=value]
:hover
::berfore
复合选择器
<简单选择器><简单选择器><简单选择器>
* 或者div必须写在最前面
复杂选择器
"<sp>": 空格
<复合选择器><sp><复合选择器>
<复合选择器>">"<复合选择器>
<复合选择器>"~"<复合选择器>
<复合选择器>"+"<复合选择器>
<复合选择器>"||"<复合选择器>

简单选择器计数
#id div.a#id {  // [0, 2, 1, 1]
  // ...
}
S = 0*N³ + 2*N² + 1*N¹ + 1
取N = 1000000
S = 2000001000001
请写出下面选择器的优先级：
div#a.b .c[id=x]  0 1 3 1 
#a:not(#b)  0 2 0 0 
div.a  0 0 1 1
*.a  0 0 1 0 

伪类
链接/行为
:any-link
:link :visited
:hover
:active
:foucus
:target
树结构
:empty
:nth-child() // even, odd
:nth-last-child()
:first-child :last-child :only-child
逻辑型
:not伪类
:where :has // css4

伪元素
::berfore
::after
::first-line // 选择第一行
::first-letter // 选择第一个文字

<div>
  <::berfoe/>
    contentcontentcontentcontentcontent
  <::after/>
</div>
<div>
  <::first-letter>C</::first-letter>
    contentcontentcontentcontentcontent
  <::after/>
</div>
可用属性
first-line 
{
  font系列
  color系列
  background系列
  word-spacing
  letter-spacing
  text-decoration
  text-tranform
  line-height
}

first-letter
{
  font系列
  color系列
  background系列
  text-decoration
  text-transform
  letter-spacing
  word-spacing
  line-height
  float
  vertical-align
  盒模型系列：margin， padding， border
}


问：为什么 first-letter 可以设置 float 之类的，而 first-line 不行呢？
答：first-line 是针对排版之后的 line


