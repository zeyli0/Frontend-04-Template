
// let element = document.documentElement;


// 事件派发
export class Dispatcher{
    constructor(element) {
        this.element = element;
    }
    dispatch(type, properties) {
        let event = new Event(type);
        for(let name in properties) {
            event[name] = properties[name];
        }
        this.element.dispatchEvent(event);
    }
}
// 封装
// listen => recognize => dispatch
// new Listener(new Recognizer(dispatch))
export class Listener {
    constructor(element, recognizer) {
        let isListeningMouse = false; // 处理监听，end时候会连续触发两次
        let contexts = new Map();
        // 左右键拖拽
        element.addEventListener("mousedown", event => {

            // event.button 判断鼠标那个键

            let context = Object.create(null);
            // 1 移位为1(0b00001)，2(0b00010)，4(0b00100)，8(0b01000)，16(0b10000)
            contexts.set("mouse" + (1 << event.button), context)

            recognizer.start(event, context);
            
            let mousemove = event => {
                let button = 1;

                // 无event.button 有event.buttons表示有哪些按键被按下了
                // event.buttons = 0b00001 // 采用掩码（二进制）
                // console.log(event.clientX, event.clientY)
                while(button <= event.buttons) {
                    // 采用掩码 与运算
                    if(button & event.buttons) {
                        // 鼠标中键和右键掩码是反的,顺序不一样，需换回来
                        // order of buttons & button property is not same
                        let key;
                        if(button === 2) key = 4;
                        else if(button === 4) key = 2;
                        else key = button;
                        // -----------

                        let context = contexts.get("mouse"+ key);
                        recognizer.move(event, context);
                    }
                    button = button << 1;
                }
            }
            let mouseup = event => {
                let context = contexts.get("mouse" + (1 << event.button));
                recognizer.end(event, context);
                contexts.delete("mouse" + (1 << event.button))

                if(event.buttons === 0) {
                    // 当无鼠标事件才取消监听
                    document.removeEventListener("mousemove", mousemove);
                    document.removeEventListener("mouseup", mouseup);
                    isListeningMouse = false;
                }
            }
            if(!isListeningMouse) {
                document.addEventListener("mousemove", mousemove);
                document.addEventListener("mouseup", mouseup);
                isListeningMouse = true;
            }
        });

        // 触屏
        element.addEventListener("touchstart", event => {
            for(let touch of event.changedTouches) {
                let context = Object.create(null);
                contexts.set(touch.identifier, context);
                recognizer.start(touch, context);
            }
        })
        element.addEventListener("touchmove", event => {
            for(let touch of event.changedTouches) {
                let context = contexts.get(touch.identifier);
                recognizer.move(touch, context);
            }
        })
        element.addEventListener("touchend", event => {
            for(let touch of event.changedTouches) {
                let context = contexts.get(touch.identifier);
                recognizer.end(touch, context);
                contexts.delete(touch.identifier);
            }
        })
        // 打断move直接cancel
        element.addEventListener("touchcancel", event => {
            for(let touch of event.changedTouches) {
                let context = contexts.get(touch.identifier);
                recognizer.cancel(touch, context);
                contexts.delete(touch.identifier);
            }
        })

    }

}

export class Recognizer {
    constructor(dispatcher) {
        this.dispatcher = dispatcher
    }
    start(point, context) {
        // console.log("start", point.clientX, point.clientY)
        context.startX = point.clientX, context.startY = point.clientY

        this.dispatcher.dispatch("start", {
            clientX: point.clientX,
            clientY: point.clientY,
        })

        context.points = [{
            t: Date.now(),
            x: point.clientX,
            y: point.clientY
        }];
    
        context.isTap = true;
        context.isPan = false;
        context.isPress = false;
    
        handler = setTimeout(() => {
            context.isTap = false;
            context.isPan = false;
            context.isPress = true;
            context.handler = null; // 避免多次clear报错
            // console.log("press")
            this.dispatcher.dispatch("press", {})
        }, 500)
    }
    // flick 事件需要计算速度， 根据一段时间内计算平均值
    move(point, context) {
        let dx = point.clientX - context.startX, dy = point.clientY - context.startY;

        // 移动10px后
        if(!context.isPan && dx ** 2 + dy ** 2 > 100) {
            context.isTap = false;
            context.isPan = true;
            context.isPress = false;
            context.isVertical = Match.abs(dx) < Math.abs(dy); // 区分上下滑动还是左右滑动
            // console.log("panstart");
            this.dispatcher.dispatch("panstart", {
                startX: context.startX,
                startY: context.startY,
                clientX: point.clientX,
                clientY: point.clientY,
                isVertical: context.isVertical 
            })
            clearTimeout(context.handler);
        }
        if(context.isPan) {
            console.log(dx, dy);
            // console.log("pan")
            this.dispatcher.dispatch("pan", {
                startX: context.startX,
                startY: context.startY,
                clientX: point.clientY,
                clientY: point.clientY,
                isVertical: context.isVertical 
            })
        }

        // flick 计算半秒内值
        context.points = context.points.filter(point => (Date.now - point.t) < 500)
        context.points.push({
            t: Date.now(),
            x: point.clientX,
            y: point.clientY
        })
        // console.log("move", point.clientX, point.clientY)
    }
    end(point, context) {
        if(context.isTap) {
            // console.log("tap");
            this.dispatcher.dispatch("tap", {});
            clearTimeout(context.handler);
        }
        if(context.isPress) {
            this.dispatcher.dispatch("pressend", {})
            // console.log("pressend")
        }
    
        context.points = context.points.filter(point => (Date.now - point.t) < 500)
        let d, v; // 速度
        if(!context.points.length) {
            v = 0;
        } else {
            d = Math.sqrt((point.clientX - context.points[0].x) ** 2 +
                (point.clientY - context.points[0].y) ** 2 );
            v = d / (Date.now() - context.points[0].t);
        }
    
        // 默认认为大于1.5为快速的
        if(v > 1.5) {
            this.dispatcher.dispatch("flick", {
                startX: context.startX,
                startY: context.startY,
                clientX: point.clientY,
                clientY: point.clientY,
                isVertical: context.isVertical,
                isFlick: context.isFlick,
                velocity: v
            })
            context.isFlick = true; // 大于1.5为快速的
        } else {
            context.isFlick = false;
        }

        if(context.isPan) {
            // console.log("panend")
            this.dispatcher.dispatch("panend", {
                startX: context.startX,
                startY: context.startY,
                clientX: point.clientY,
                clientY: point.clientY,
                isVertical: context.isVertical,
                isFlick: context.isFlick,
                velocity: v
            })
            this.dispatcher.dispatch("end", {
                startX: context.startX,
                startY: context.startY,
                clientX: point.clientY,
                clientY: point.clientY,
                isVertical: context.isVertical,
                isFlick: context.isFlick,
                velocity: v
            })
        }
        // console.log("end", point.clientX, point.clientY)
    }
    cancel = (point, context) => {
        clearTimeout(context.handler);
        this.dispatcher.dispatch("cancel", {})
        // console.log("cancel", point.clientX, point.clientY)
    }
}

export function enableGesture(element) {
    new Listener(element, new Recognizer(new Dispatcher(element)) )
}

