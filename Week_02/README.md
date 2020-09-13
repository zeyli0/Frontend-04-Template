学习笔记

div最小高度的2种写法

1.第一种写法：
原理：在IE6中，使用CSS定义div的高度的时候经常遇到这个问题，当div的最小高度小于一定的值以后，无论你怎么设置最小高度，div的高度会固定在一个值不再发生变动。这是因为在IE6中，系统默认的并非是div有一个默认的高度，而是你没有解决一个隐藏的参数：font-size。这个是IE6中对于div属性中的font-size大小和你系统css中定义的font-size有很大关系，因此必须单独定义这个div的font-size，这样才能解决这个问题。
#container {
  width: 701px;
  /* line-height: 7px; */
  font-size: 0;
}

2.第二种写法：
跳过IE6中对font-size的限定，使用line-height来进行定义，但是div里必须填写内容，如果没有内容，用 &nbsp; 替换，取消选中user-select:none
#container {
  width: 701px;
  line-height: 7px;
  /* font-size: 0; */
}

广度优先搜索
深度优先搜索

启发式搜索 
A* 寻找最优路径：
1，f(n)=g(n)+h(n),其中设h(n)＝节点n和目标节点之间的最小代价路径的实际代价，g(n)=从开始点start到节点n的一个最小代价的路径。
在这里，取
2，h(n)=sqrt( (n.x-end.x)*(n.x-end.x)+(n.y-end.y)*(n.y-end.y) ) 
取g(n)=从开始点start到n的实际距离，这样能保证满足总能找到最短路径

LL算法构建语法树(AST)
词法分析
语法分析  LL(left, left)