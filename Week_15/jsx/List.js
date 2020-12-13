import { Component, STATE, ATTRIBUTE, createElement} from './framework.js'
import { enableGesture } from './gesture/gesture.js'

export { STATE, ATTRIBUTE} from './framework.js';  // 其他组件会继承carousel需要用到

export class List  extends Component{
    constructor() {
        super();
    }
    render() {
        this.children = this[ATTRIBUTE].data.map(this.template);
        this.root = (<div>{ this.children }</div>).render();
        return this.root;
    }

    // 重载
    appendChild(child) {
        this.template = child;
        // this.render()
    }
}