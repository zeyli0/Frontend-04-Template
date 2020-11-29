学习笔记

轮播图 - 初步建立动画和时间线
常见浏览器动画 
1:setInterval( () => {}, 16)
2:
let tick = () => {
    setTimeout(tick, 16)
}
3:
let tick = () => {
    // 可用于自重复时间线的操作
    let handler = requestAnimationFrame(tick)
    cancelAnimationFrame(handler)
}