学习笔记

第一步总结
准备工作，处理flexDirection和wrap相关的属性
重点把具体的width和height，left，right，top，bottom等属性
给抽象成了main cross 相关的属性

第二步，收集元素进行
分行：根据主轴尺寸，把元素分进行
      若设置了no-wrap，则强行分配进第一行

第三步计算主轴
找出所有flex元素
把主轴方向的剩余尺寸按比例分配给这些元素
若剩余空间为负数，所有flex元素为0，等比例压缩剩余元素
没有flex元素根据justifyContent 计算每个元素的位置

第四步 计算交叉轴
根据每一行中最大元素尺寸计算行高
根据行高flex-align和item-align，确定元素具体位置

注： 计算交叉轴if(align === 'stretch')  中itemStyle[crossEnd] 后面代码未知？？？

第五步，绘制单个元素
准备一个图形环境 images库 npm install images
绘制在一个viewport上进行的
与绘制相关的属性： background-color， border， background-images等
低于gradient 用这个库实现不了，需要用到webGl 的方式才可



