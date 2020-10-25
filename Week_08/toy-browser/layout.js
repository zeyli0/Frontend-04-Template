
function layout(element) {
  if(!element.computedStyle) {
    return ;
  }

  let elementStyle = getStyle(element); // 预处理

  if(elementStyle.display !== 'flex') {
    return ;
  }

  let items = element.children.filter(e => e.type === 'element');
  items.sort(function(a, b) {
    return (a.order || 0) - (b.order || 0); // 支持order属性
  });
  let style = elementStyle;

  // 进行x轴交叉轴处理
  ['width', 'height'].forEach(size => {
    if(style[size] === 'auto' || style[size] === '') {
      style[size] = null;
    }
  })

  // 设置默认值
  if(!style.flexDirection || style.flexDirection === 'auto') {
    style.flexDirection = 'row';
  } 
  if(!style.alignItems || style.alignItems === 'auto') {
    style.alignItems = 'stretch';
  }
  if(!style.justifyContent || style.justifyContent === 'auto') {
    style.justifyContent = 'flex-start';
  }
  if(!style.flexWrap || style.flexWrap === 'auto') {
    style.flexWrap = 'nowrap';
  }
  if(!style.alignContent || style.alignContent === 'auto') {
    style.alignContent = 'stretch';
  }

  let mainSize, mainStart, mainEnd, mainSign, mainBase,
  crossSize, crossStart, crossEnd, crossSign, crossBase;
  if(style.flexDirection === 'row') {
    mainSize = 'width';
    mainStart = 'left';
    mainEnd = 'right';
    mainSign = +1;
    mainBase = 0;

    crossSize = 'height';
    crossStart = 'top';
    crossEnd = 'bottom';
  }

  if(style.flexDirection === 'row-reverse') {
    mainSize = 'width';
    mainStart = 'right';
    mainEnd = 'left';
    mainSign = -1;
    mainBase = style.width;

    crossSize = 'height';
    crossStart = 'top';
    crossEnd = 'bottom';
  }

  if(style.flexDirection === 'column') {
    mainSize = 'height';
    mainStart = 'top';
    mainEnd = 'bottom';
    mainSign = +1;
    mainBase = 0;

    crossSize = 'width';
    crossStart = 'left';
    crossEnd = 'right';
  }

  if(style.flexDirection === 'column-reverse') {
    mainSize = 'height';
    mainStart = 'bottom';
    mainEnd = 'top';
    mainSign = -1;
    mainBase = style.height;

    crossSize = 'width';
    crossStart = 'left';
    crossEnd = 'right';
  }

  // 反向交叉轴
  if(style.flexDirection === 'wrap-reverse') {
    let tmp = crossStart;
    crossStart = crossEnd;
    crossEnd = tmp;
    crossSign = -1
  } else {
    crossBase = 0;
    crossSign = 1;
  }

  // 收集元素进行
  
  // 此情况下如论如何子元素都会排列进同一行
  let isAutoMainSize = false;
  if(!style[mainSize]) { // auto sizing
    elementStyle[mainSize] = 0;
    for(let i =0; i< items.length; i++) {
      let item = items[i];
      let itemStyle = getStyle(item); // ???
      if(itemStyle[mainSize] !== null || itemStyle[mainSize]) { // ?
        elementStyle[mainSize] = elementStyle[mainSize]
      }
    }
    isAutoMainSize = true
  }

  let flexLine = []
  let flexLines = [flexLine]

  let mainSpace = elementStyle[mainSize];
  let crossSpace = 0;
  for(let i = 0; i< items.length; i++) {
    let item = items[i];
    let itemStyle = getStyle(item);
    if(itemStyle[mainSize] === null) {
      itemStyle[mainSize] = 0;
    }

    if(itemStyle.flex) {
      flexLine.push(item);
    } else if(style.flexWrap === 'nowrap' && isAutoMainSize) { // 不换行逻辑
      mainSpace -= itemStyle[mainSize];
      if(itemStyle[crossSize] !== null && itemStyle[crossSize] !== (void 0)) {
        crossSpace = Math.max(crossSpace, itemStyle[crossSize]); // 行高
      }
      flexLine.push(item);
    } else { // 换行逻辑
      // 有些元素比父元素还大，把它压到主轴尺寸一边大
      if(itemStyle[mainSize] > style[mainSize]) {
        itemStyle[mainSize] = style[mainSize]
      }
      // 主轴内剩下的空间不足以容纳每一个元素，则换行
      if(mainSpace < itemStyle[mainSize]) {
        flexLine.mainSpace = mainSpace;
        flexLine.crossSpace = crossSpace;
        flexLine = [item];
        flexLines.push(flexLine);
        mainSpace = style[mainSize]; // 重置
        crossSpace = 0;
      } else {
        flexLine.push(item);
      }

      // 计算主轴与交叉轴的尺寸
      if(itemStyle[crossSize] !== null && itemStyle[crossSize] !== (void 0)) {
        crossSpace = Math.max(crossSpace, itemStyle[crossSize])
      }
      mainSpace -= itemStyle[mainSize];
    }

  }
  flexLine.mainSpace = mainSpace; // 当flexLine 有剩余空间时，分配甚于的主轴空间

  if(style.flexWrap === 'nowrap' || isAutoMainSize) {
    flexLine.crossSpace = (style[crossSize] !== undefined) ? style[crossSize] : crossSpace;
  } else {
    flexLine.crossSpace = crossSpace;
  }
  // console.log(items)
  if(mainSpace < 0 ) {
    let scale = style[mainSize] / (style[mainSize] - mainSpace); // 等比压缩
    let currentMain = mainBase;
    for(let i=0; i< items.length; i++) {
      let item = items[i];
      let itemStyle = getStyle(item);

      if(!itemStyle.flex) {
        itemStyle[mainSize] = 0;
      }

      itemStyle[mainSize] = itemStyle[mainSize] + scale;

      itemStyle[mainStart] = currentMain;
      itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize];
      currentMain = itemStyle[mainEnd];
    }
  } else {
    flexLines.forEach(function(items) {
      let mainSpace = items.mainSpace;
      let flexTotal = 0;
      for(let i=0; i< items.length; i++) {
        let item = items[i];
        let itemStyle = getStyle(item);

        if((itemStyle.flex !== null) && (itemStyle.flex !== (void 0))) {
          flexTotal += itemStyle.flex;
          continue;
        }
      }

      if(flexTotal > 0) {
        // there is flexible flex items
        let currentMain = mainBase;
        for(var i=0; i< items.length; i++) {
          let item = items[i];
          let itemStyle = getStyle(item);

          if(itemStyle.flex) {
            // flex 元素 计算每一行主轴方向剩余空间，等比划分
            itemStyle[mainSize] = (mainSpace / flexTotal) * itemStyle.flex
          }

          itemStyle[mainStart] = currentMain;
          // 主轴方向的截止
          itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize];

          currentMain = itemStyle[mainEnd];
        }
      } else {
        //There is no flexible flex items, which means, justifyContent should work
        // 根据justifyContent规则分配主轴方向剩余空间
        if(style.justifyContent === 'flex-start') {
          var currentMain = mainBase;
          var step = 0;
        }
        if(style.justifyContent === 'flex-end') {
          var currentMain = mainSpace * mainSign + mainBase;
          var step = 0;
        }
        if(style.justifyContent === 'center') {
          var currentMain = mainSpace / 2 * mainSign + mainBase;
          var step = 0;
        }
        if(style.justifyContent === 'space-between') {
          var step = mainSpace / (items.length - 1) * mainSign;
          var currentMain = mainBase;
        }
        if(style.justifyContent === 'space-around') {
          var step = mainSpace / items.length * mainSign;
          var currentMain = step / 2 + mainBase;
        }
        for(var i=0; i< items.length; i++) {
          var item = items[i];
          itemStyle[mainStart] = currentMain;
          itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize];
          currentMain = itemStyle[mainEnd] + step
        }
      }
    })
  }

  // 计算交叉轴
  // compute the cross axis sizes
  // align-items， align-self
  var crossSpace;
  if(!style[crossSize]) {
    crossSpace = 0;
    elementStyle[crossSize] = 0;
    for(var i =0; i< flexLines.length; i++) {
      elementStyle[crossSize] = elementStyle[crossSize] + flexLines[i].crossSpace;
    }
  } else {
    crossSpace = style[crossSize];
    for(var i=0; i < flexLines.length; i++) {
      crossSpace -= flexLines[i].crossSpace;
    }
  }

  if(style.flexWrap === 'wrap-reverse') {
    crossBase = style[crossSize];
  } else {
    crossBase = 0;
  }
  var lineSize = style[crossSize]/ flexLines.length;
  var step;
  if(style.alignContent === 'flex-satrt') {
    crossBase += 0;
    step = 0;
  }
  if(style.alignContent === 'flex-end') {
    crossBase += crossSign * crossSpace;
    step = 0;
  }
  if(style.alignContent === 'center') {
    crossBase += crossSign * crossSpace / 2;
    step = 0;
  }
  if(style.alignContent === 'space-between') {
    crossBase += 0;
    step = crossSpace / (flexLines.length - 1);
  }
  if(style.alignContent === 'space-around') {
    step = crossSpace / (flexLines.length);
    crossBase += crossSign * step / 2;
  }
  if(style.alignContent === 'stretch') {
    crossBase += 0;
    step = 0;
  }
  flexLines.forEach(function(items) {
    // 这一行真实的交叉轴的尺寸
    var lineCrossSize = style.alignContent === 'stretch' ? 
    items.crossSpace + crossSpace / flexLines.length :
    items.crossSpace;
    // 循环
    for(var i=0; i< items.length; i++) {
      var item = items[i];
      var itemStyle = getStyle(item);
      var align = itemStyle.alignSelf || style.alignItems;
      if(itemStyle[crossSize] === null) {
        itemStyle[crossSize] = (align === 'stretch') ? 
        lineCrossSize : 0;
      }

      if(align === 'flex-start') {
        itemStyle[crossStart] = crossBase;
        itemStyle[crossEnd] = itemStyle[crossStart] + crossSign * itemStyle[crossSize];
      }
      if(align === 'flex-end') {
        itemStyle[crossEnd] = crossBase + crossSign * lineCrossSize;
        itemStyle[crossStart] = itemStyle[crossEnd] - crossSign * itemStyle[crossSize];
      }

      if(align === 'center') {
        itemStyle[crossStart] = crossBase + crossSign * (lineCrossSize - itemStyle[crossSize]) / 2;
        itemStyle[crossEnd] = itemStyle[crossStart] + crossSign * itemStyle[crossSize];
      }

      if(align === 'stretch') {
        itemStyle[crossStart] = crossBase;
        itemStyle[crossEnd] = crossBase + crossSign * ((itemStyle[crossSize] !== null && itemStyle[crossSize])); // ??? 
        itemStyle[crossSize] = crossSign * (itemStyle[crossEnd] - itemStyle[crossStart]);
      }
    }
    crossBase += crossSign * (lineCrossSize + step);
  })
}

function getStyle(element) {
  if(!element.style) {
    element.style = {}
  }

  for(let prop in element.computedStyle) {
    let p = element.computedStyle.value;
    element.style[prop] = element.computedStyle[prop].value;

    if(element.style[prop].toString().match(/px$/)) {
      element.style[prop] = parseInt(element.style[prop]);
    }

    if(element.style[prop].toString().match(/^[0-9\.]+$/)) { // 纯数字转换类型
      element.style[prop] = parseInt(element.style[prop])
    }
  }
  return element.style;
}

module.exports.layout = layout;