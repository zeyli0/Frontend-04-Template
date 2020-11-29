import { Component } from './framework.js'

export class Carousel  extends Component{
    constructor() {
        super();
        this.attributes = Object.create(null);
    }
    setAttribute(name, value) {
        this.attributes[name] = value;
    }
    render() {
        // console.log(this.attributes.src)
        this.root = document.createElement("div");
        this.root.classList.add('carousel');
        const { width } = this.root.getBoundingClientRect()

        let intervalTimer = null;
        let timeoutTimer = null;


        for(let record of this.attributes.src) {
            let child = document.createElement("div");
            child.style.backgroundImage = `url('${record}')`;
            this.root.appendChild(child);
        }
        
        let isCarousel = true;

        let noCarouselFun = function(root) {
            let position = 0;
            root.addEventListener("mousedown", event => {
                let children = root.children;
                let startX = event.clientX
                let move = event => {
                    let x = event.clientX - startX

                    let current = position - Math.round((x - x % 500) / 500);

                    // 来回拖拽
                    for(let offset of [-1, 0, 1]) {
                        let pos = current + offset;

                        // 取余运算处理循环
                        //  把-1变成3，-2变成2，-3变成1
                        pos = (pos + children.length) % children.length 
                        
                        children[pos].style.transition = 'none';
                        children[pos].style.transform = `translateX(${- pos * 500 + offset * 500 + (x % 500)}px)`;
                    
                    }
                }

                let up = event => {
                    let x = event.clientX - startX;
                    // 拖够了一半就显示后一个位置，否则为前一个位置
                    position = position - Math.round(x / 500);
                    // for(let child of children) {
                    //     child.style.transition = '';
                    //     child.style.transform = `translateX(${- position * 500 + x}px)`;
                    // }

                    for(let offset of [0, -Math.sign(Math.round(x / 500) - x + 250 * Math.sign(x))]) {
                        let pos = position + offset;

                        // 取余运算处理循环
                        pos = (pos + children.length) % children.length 
                        
                        children[pos].style.transition = '';
                        // 从第二张开始的translate
                        children[pos].style.transform = `translateX(${- pos * 500 + offset * 500 }px)`;
                    
                    }
                    document.removeEventListener("mousemove", move);
                    document.removeEventListener("mouseup", up);
                }
                document.addEventListener("mousemove", move)
                document.addEventListener("mouseup", up)
            })
        
        }

        let carouselFun = function(root) {
            let currentIndex = 0;
            intervalTimer = setInterval(() => {
                let children = root.children;
                let nextIndex =  (currentIndex + 1) % children.length;

                let current = children[currentIndex];
                let next = children[nextIndex];

                next.style.transition= 'none';
                next.style.transform = `translateX(${100 - nextIndex * 100}%)`
                
                setTimeout(() => {
                    next.style.transition = ""
                    current.style.transform = `translateX(${-100 - currentIndex * 100}%)`
        
                    next.style.transform = `translateX(${ - nextIndex * 100}%)`;
                    
                    currentIndex = nextIndex
                }, 16)

                // for(let child of children) {
                //     child.style.transform = `translateX(-${current * 100}%)` 
                // }
            }, 1500)
            
        }

        this.root.addEventListener("mouseenter", event => {
            console.log("mouseenter")
            clearInterval(intervalTimer)
            noCarouselFun(this.root)
        })

        this.root.addEventListener("mouseleave", event => {
            console.log("mouseleave")
            carouselFun(this.root)
        })

        

        // console.log(isCarousel)
        // if(!isCarousel) {
           
        // } else {
         
        // }   
        return this.root
    }
    mountTo(parent) {
        parent.appendChild(this.render());
    }
}
