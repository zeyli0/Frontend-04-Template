学习笔记

一： js表达式
语法树 优先级
Expressions
Member 
  a.b
  a[b]
  foo`string`
  super.b
  super['b']
  new.target
  new Foo()
New 
  new Foo

Example:
  new a()()  - new Foo()
  new new a()  - new Foo

refernce  引用
  