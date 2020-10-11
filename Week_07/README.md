学习笔记

浏览器架构
url ->HTTP-> 
HTML ->parser-> 
DOM ->css computing-> 
DOM with CSS ->layout-> 
DOM with position ->render->
Bitmap

HTML规则
第一步总结
1为了方便文件管理，吧parser单独拆分到文件
2parser接受HTML文本作为参数，返回一颗dom树

第二部总结
1利用有限状态机FSM来实现HTML的分析
2在HTML标准中，已经规定了HTML的状态
3toy-browser选择部分，实现一个最简的版本

第三步总结
1主要标签开始标签 结束标签 自封闭标签 状态机区分

第四步总结
1在状态机中，除了状态迁移，还加业务逻辑
2在标签结束状态提交标签token

第五步总结
1属性值分为单引号，双引号，无引号三种写法，因此需要较多状态处理
2处理属性的方式跟标签类似
3属性结束时，把属性加到标签Token上

第六步用栈构建dom树的原理
1从标签构建dom树的基本技巧是使用栈
2遇到开始标签是创建元素并入栈，遇到结束标签出栈
3自封闭节点可视为入栈后立刻出栈
4任何元素的父元素是它入栈前的栈顶

第七步总结
1文本节点与自封闭标签处理类似，不会真的入栈
2但多个文本节点需要合并

CSS规则
css计算(css computing)
环境准备 npm install css (现成的包  css parser)
第一步总结
1遇到style标签时，把css规则保存起来
2这里调用CSS parse 来分析css规则
3需要仔细研究此库分析css的格式

第二步总结
1当创建一个元素style元素后，立即计算css
2理论上，当分析一个匀速，所有css规则已经收集完毕
3在真实浏览器中，可能遇到写在body的style标签，需要重新css计算的情况，这里忽略

第三步总结
1在computeCSS中，必须知道元素的所有父元素才能判断元素与规则是否匹配
2从上一步骤的stack。可以获取本元素所有的父元素
3因首先获取的是“当前元素”，所以获得和计算父元素匹配的顺序是从内向外的 body div#myid

第四步总结
1选择器也要从当前语速向外排列
2复杂选择器拆成针对单个元素的选择器，用循环匹配父元素队列

第五步总结
1根据选择器的类型和元素数序星，计算是否与当前的元素匹配
2这里仅仅实现了三种基本选择器，实际浏览器中要处理符合选择器
3作业（可选）；实现复合选择器，实现带空格的class选择器
（提示，可用正则进行拆分成基本选择器再处理）

第六步总结
1一旦选择匹配，就应用选择器到元素上，形成computedStyle

第七步总结
specificity的计算逻辑
div div #id
[0,      1,  0,      2]
inline   id  class   tag

div #my #id
[0,      2,  0,      1]
inline   id  class   tag

div .cls #id
[0,      1,  1,      1]
inline   id  class   tag
1CSS规则根据specificity和后面有限规则覆盖
2specificity是个四元组，越左边权重越高
3一个css规则的specificity格局包含的简单选择器相加而成
