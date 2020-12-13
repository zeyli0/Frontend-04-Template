import { Component, STATE, ATTRIBUTE, createElement} from './framework.js'
import { enableGesture } from './gesture/gesture.js'

export { STATE, ATTRIBUTE} from './framework.js';  // 其他组件会继承carousel需要用到

export class Button  extends Component{
    constructor() {
        super();
    }
    render() {
        this.childContainer = (<span />);
        this.root = (<div>{ this.childContainer }</div>).render();
        return this.root;
    }

    // 重载
    appendChild(child) {
        if(!this.childContainer) {
            this.render();
        }
        this.childContainer.appendChild(child)
    }
}