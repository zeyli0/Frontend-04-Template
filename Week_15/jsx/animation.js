const TICK = Symbol('tick');
const TICK_HANDLER = Symbol('tick-handler');
const ANIMATIONS = Symbol('animations');
const START_TIME = Symbol('start_time');
const PAUSE_START = Symbol('pause-start');
const PAUSE_TIME = Symbol('pause-time');

export class Timeline {
    constructor() {
        this.state = "Inited";
        this[ANIMATIONS] = new Set();
        this[START_TIME] = new Map();
    }
    start() {
        if(this.state !== "Inited") {
            return ;
        }
        this.state = "started";
        let startTime = Date.now()
        this[PAUSE_TIME] = 0;
        this[TICK] = () => {
            let now = Date.now()
            for(let animation of this[ANIMATIONS]) {
                let t;
                
                if(this[START_TIME].get(animation) < startTime) {
                    t = now - startTime - this[PAUSE_TIME] - animation.delay 
                } else {
                    t = now - this[START_TIME].get(animation) - this[PAUSE_TIME] - animation.delay 
                }
                if(animation.duration < t) {
                    this[ANIMATIONS].delete(animation)
                    t = animation.duration
                }
                // t 是负的说明动画还没开始
                if( t > 0) {
                    animation.receiveTime(t)  
                }  
            }
            this[TICK_HANDLER] = requestAnimationFrame(this[TICK])
        }
        this[TICK]()
    }
    // set rate() {}
    // get rate() {}
    pause() {
        if(this.state !== "started") {
            return ;
        }
        this.state = "paused";
        this[PAUSE_START] = Date.now();
        cancelAnimationFrame(this[TICK_HANDLER]);

    }
    resume() {
        if(this.state !== "paused") {
            return ;
        }
        this.state = "started";
        this[PAUSE_TIME] += Date.now() - this[PAUSE_START]
        this[TICK]()
    }

    reset() {
        this.pause();
        this.state = "Inited";
        let startTime = Date.now()
        this[PAUSE_TIME] = 0;
        this[ANIMATIONS] = new Set();
        this[START_TIME] = new Map();
        this[TICK_HANDLER] = null;
        this[PAUSE_START] = 0;
    }

    add(animation, startTime) {
        if(arguments.length < 2) {
            startTime = Date.now()
        }
        this[ANIMATIONS].add(animation)
        this[ADD_TIME].set(animation, startTime);
    }
}

export class Animation {
    constructor(object, property, startValue, endValue, duration, delay, timingFunction, template) {
        timingFunction = timingFunction || (v => v);
        template = template || (v => v)
        this.object = object;
        this.property = property;
        this.startValue = startValue;
        this.endValue = endValue;
        this.duration = duration;
        this.delay = delay;
        this.timingFunction = timingFunction;
        this.template = template;
    }
    receiveTime(time) {
        console.log(time)
        let rang = this.endValue -this.startValue;
        // timingFunction 为返回0~1的函数
        // linear 三次贝塞尔曲线
        let progress = this.timingFunction(time / this.duration);
        this.object[this.property] = this.template(this.startValue + rang * progress );
    }
}