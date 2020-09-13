学习笔记

1：创建棋盘，循环遍历生成3x3
2：每个格子有3中状态，0，1，2
3：给每个格子添加点击事件，点击空白落子
4: check校验成功三行，三列，两对角
5：预测是否会赢，复制新数组然后check当前成功
6：找最优并剪枝
// -----------------------------
el.addEventListener(type, listener, {
    capture: false, // === useCapture
    once: false,    // 是否设置单次监听
    passive: false  // 是否让 阻止默认行为(preventDefault()) 失效
})
