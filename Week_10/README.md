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

BFC是一个独立的布局环境，其中的元素布局是不受外界的影响，并且在一个BFC中，块盒与行盒（行盒由一行中所有的内联元素所组成）都会垂直的沿着其父元素的边框排列。
BFC的布局规则：
1，内部的Box会在垂直方向，一个接一个地放置。
2，Box垂直方向的距离由margin决定。属于同一个BFC的两个相邻Box的margin会发生重叠。
3，每个盒子（块盒与行盒）的margin box的左边，与包含块border box的左边相接触(对于从左往右的格式化，否则相反)。即使存在浮动也是如此。
4，BFC的区域不会与float box重叠。
5，BFC就是页面上的一个隔离的独立容器，容器里面的子元素不会影响到外面的元素。反之也如此。
6，计算BFC的高度时，浮动元素也参与计算。
如何创建BFC：
1、float的值不是none。
2、position的值不是static或者relative。
3、display的值是inline-block、table-cell、flex、table-caption或者inline-flex
4、overflow的值不是visible
BFC的作用：
1.利用BFC避免margin重叠。
2.自适应两栏布局
3.清楚浮动。