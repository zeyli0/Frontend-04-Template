学习笔记

HTML代码中可以书写开始_标签___，结束_标签___ ，和自封闭_标签___ 。

一对起止_标签___ ，表示一个_元素___ 。

DOM树中存储的是__元素__和其它类型的节点（Node）。

CSS选择器选中的是__元素__ 。

CSS选择器选中的__元素__ ，在排版时可能产生多个_盒___ 。

排版和渲染的基本单位是_盒___ 。

1，正常流
2，正常流行级  IFC vertical-align
3，正常流块级  BFC float clear: left/right
margin collapse 只存在于正常流BFC 如flex是不存在的
4，正常流BFC合并
Block contianer: 里面有BFC的
能容纳正常流的盒，里面就有BFC,想想有哪些？
Block-level Box： 外面有BFC
Block Box = Block Container + Block-level Box:
里外都有BFC的
