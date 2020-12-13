export function createElement(type, attributes, ...children) {
    let element;
    if(typeof type === "string") {
        element = new ElementWrapper(type);
    } else {
        element = new type;
    }
    
    for(let name in attributes) {
        element.setAttribute(name, attributes[name]);
    }

    let processChildren = (children) => {
        for(let child of children) {
            // 是数组需递归调用创建zi元素
            if(typeof child === "object" && child instanceof Array) {
                processChildren(child);
                continue;
            }
            if(typeof child === "string") {
                child = new TextWrapper(child);
            }
            element.appendChild(child)
        }
    }
    processChildren(children);

    return element
}

export const STATE = Symbol("state");
export const ATTRIBUTE = Symbol("attribute");

export class Component {
    constructor(type) {
        this[ATTRIBUTE] = Object.create(null);
        this[STATE] = Object.create(null);
    }
    render() { 
        return this.root;
    }
    setAttribute(name, value) {
        this[ATTRIBUTE][name] = value;
    }
    appendChild(child) {
        child.mountTo(this.root)
    }
    mountTo(parent){
        if(!this.root) {
            this.render()
        }
        parent.appendChild(this.root)
    }
    // 可以查看播放到那一帧
    triggerEvent(type, args) {
        // CustomEvent 浏览器天然的event事件
        this[ATTRIBUTE]["on" + type.replace(/^[\s\S]/, s => s.toUpperCase())](new CustomEvent(type, {detail: args}))
    }
}

class ElementWrapper extends Component{
    constructor(type) {
        super();
        this.root = document.createElement(type);
    }
    // 设置子元素时的属性值
    setAttribute(name, value) {
        this.root.setAttribute(name, value);
    }
}
class TextWrapper extends Component{
    constructor(content) {
        super();
        this.root = document.createTextNode(content);
    }
}


// class Div {
//     constructor() {
//         this.root = document.createElement("div");
//     }
//     setAttribute(name, value) {
//         this.root.setAttribute(name, value);
//     }
//     appendChild(child) {
//         child.mountTo(this.root)
//     }
//     mountTo(parent){
//         parent.appendChild(this.root)
//     }
// }

// let a = <Div id="a">
//         <span>a</span>
//         <span>b</span>
//         <span>c</span>
//     </Div>

// document.body.appendChild(a);

// a.mountTo(document.body);
