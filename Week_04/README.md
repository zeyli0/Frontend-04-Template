学习笔记

js语法通识
一：语言按照语法分类
1、非形式语言：中文 英文 ...
2、形式语言：乔姆斯基谱系（四种文法 上下文包含文法）
0型 无限制文法
1型 上下文相关文法
2型 上下文无关文法
3型 正则文法

二：产生式(BNF)：
1)用尖括号括起来的名称来表示语法结构名
2)语法结构分成基础机构和需要用其他语法结构定义的复合结构
  基础结构终结符 
  复合结构非终结符
3)引号和中间的字符表示终结符
4)可以有括号
5)*表示重复多次
6)| 表示或
7)+表示至少一次

终结符：
Number
+ - * /
非终结符
MultiplicativeExpression
AdditiveExpression

练习：创建一个带括号的四则运算产生式
（1+2）*3
参考地址 https://esprima.org/demo/parse.html#
https://tomcopeland.blogs.com/EcmaScript.html

<PrimaryExpression>	::=	"this" |	( "(" <Expression> ")" )
<AdditiveExpression>	::=	<MultiplicativeExpression> "+"|"-" <MultiplicativeExpression> 
<MultiplicativeExpression> ::= <PrimaryExpression> |<AdditiveExpression> <MultiplicativeExpression> "*" | "%" <MultiplicativeExpression>

三：计算机语言分类
1形式语言-用途
数据描述语言
josn,html,xaml,sql,css
编程语言
Python,C,Java,C++,Visual Basic.NET,Javascript,C#,PHP,Ruby,Go,
Lisp,Perl,T-SQL, Clojure, Haskell,Scala,Erlang,R,Visual Basic,
2形式语言-表达式
声明式语言
JSON,html,xaml,sql,css,lisp,clojure，Haskell
命令型语言
C,C++,C#,Java,Python,Ruby,Perl,Javascript,matlab

四：JS类型
Undefined；Null；Boolean；String；Number；Symbol；Object。

let str = "hello , wolrd!"
let regexp = /^\d|\D|\w|\W|\s|\S|\n|\r|\v|\u|\b|\B$/g

对象的行为应该是改变
class Human {
  hurt(damage) {
    console.log(damage)
  }
}

对象的两类属性
第一类数据属性。它比较接近于其它语言的属性概念。
数据属性具有四个特征。
value：就是属性的值。
writable：决定属性能否被赋值。
enumerable：决定 for in 能否枚举该属性。
configurable：决定该属性能否被删除或者改变特征值。

第二类属性是访问器（getter/setter）属性，它也有四个特征。
getter：函数或 undefined，在取属性值时被调用。
setter：函数或 undefined，在设置属性值时被调用。
enumerable：决定 for in 能否枚举该属性。
configurable：决定该属性能否被删除或者改变特征值。


Object
Object API/Grammar
1 {}.[] Object.defineProperty
2 Object.create / Object.setPrototypeOf / Object.etPrototypeOf
3 new / class / extends
4 new / function / prototype



函数对象与构造器对象
函数对象的定义是：具有[[call]]私有字段的对象，
构造器对象的定义是：具有私有字段[[construct]]的对象。

特殊行为的对象
Array：Array 的 length 属性根据最大的下标自动发生变化。
Object.prototype：作为所有正常对象的默认原型，不能再给它设置原型了。
String：为了支持下标运算，String 的正整数属性访问会去字符串里查找。
Arguments：arguments 的非负整数型下标属性跟对应的变量联动。
模块的 namespace 对象：特殊的地方非常多，跟一般对象完全不一样，尽量只用于 import 吧。
类型数组和数组缓冲区：跟内存块相关联，下标运算比较特殊。
bind 后的 function：跟原来的函数相关联。 
