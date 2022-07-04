
console.log('fabric', fabric)

// 全局状态
let mousePressed = false // 鼠标按压状态
let currentMode = '' // 当前的行为

const canvas = new fabric.Canvas('canvas', {
  width: 1000,
  height: 800,
  backgroundColor: '#eeeeee',
})

// 为画布添加背景图
// 通过fabric.Image 通过一个url创建实例
fabric.Image.fromURL('https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.jj20.com%2Fup%2Fallimg%2F1114%2F0G020114924%2F200G0114924-15-1200.jpg&refer=http%3A%2F%2Fimg.jj20.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1658737545&t=b2b374cbbd20d4d294269d8d4754fd10', (img) => {
  canvas.backgroundImage = img
  canvas.renderAll()
})

// 监听画布事件
// canvas.on('mouse:over', (e) => {
//   console.log('event, mouse:over', e)
// })

const models = {
  pan: 'pan',
  drawing: 'drawing'
}

// 更新属性类
const updateProps = {
  drawing: (options) => {
    const {color, width, brushType} = options
    if (brushType === 'circle') {
      canvas.freeDrawingBrush = new fabric.CircleBrush(canvas)
    } else if (brushType === 'spray') {
      canvas.freeDrawingBrush = new fabric.SprayBrush(canvas)
    } else if (brushType === 'eraser') {
      canvas.freeDrawingBrush = new fabric.EraserBrush(canvas)
    }
    canvas.freeDrawingBrush.color = color
    canvas.freeDrawingBrush.width = width
  }
}

// Shapes类

const shapes = {
  rect: {
    create: () => {
      const rect = new fabric.Rect({
        width: 100,
        height: 100,
        fill: 'green',
        cornerColor: 'white',
        // objectCaching: false
      })
      // shape 添加事件
      rect.on('selected', () => {
        rect.set('fill', '#ad8b00')
        canvas.renderAll()
      })
      rect.on('deselected', () => {
        rect.set('fill', 'green')
        canvas.renderAll()
      })
      canvas.add(rect)
      renderAll()
      // socket.draw(JSON.stringify(canvas.toJSON()))
    }
  },
  circle: {
    create: () => {
      const canvasCenter = canvas.getCenter()
      const circle = new fabric.Circle({
        radius: 50,
        fill: '#096dd9',
        left: canvasCenter.left,
        // top: canvasCenter.top,
        cornerColor: 'white'
      })
      canvas.add(circle)
      renderAll()
      circle.animate('top', 500, {
        onChange: canvas.renderAll.bind(canvas),
        easing: fabric.util.ease.easeOutBounce(),
        duration: 1000,
        onComplete: () => {}
      })
      socket.draw(JSON.stringify(canvas.toJSON()))
    }
  },
  ellipse: {
    create: () => {
      const ellipse = new fabric.Ellipse({
        fill: '#002329',
        rx: 70,
        ry: 30,
      })
      canvas.add(ellipse)
      renderAll()
      // socket.draw(JSON.stringify(canvas.toJSON()))

      // 同步一个object
      // const objects = canvas.getObjects()
      // const object = objects[objects.length -1]
      // syncBoard({
      //   type: 'ellipse',
      //   object: JSON.stringify(object),
      // })
    }
  }
}

// 添加平移画布功能
canvas.on('mouse:move', (event) => {
  // if (mousePressed) {
  //   console.log('mouse:move', event)
  // }
  
  // if (mousePressed && currentMode === models.pan) {
  //   canvas.setCursor('grab') // 修改画布手势
  //   canvas.renderAll()
  //   const mEvent = event.e
  //   const delta = new fabric.Point(mEvent.movementX, mEvent.movementY)
  //   canvas.relativePan(delta) // 平移
  // }
})

// 监听render事件
canvas.on('after:render', (event) => {
  console.log('after:render', canvas.getObjects())
  // const shape = canvas.getObjects().pop()
  // const object = new fabric.Object()
  // object.add(shape)
  // canvas.add(shape)
  // canvas.renderAll()
})
canvas.on('object:modified', (event) => {
  console.log('object:modified', event)
})
canvas.on('object:moving', (event) => {
  console.log('object:moving', event)
  console.log('canvas.Objects', canvas.getObjects())
})

canvas.on('object:added', (event) => {
  console.log('object:added', event, event.target.toString())
  // 获取新添加的object
  // const objects = canvas.getObjects()
  // const object = objects[objects.length -1]
  // console.log('objets', objects)
})

canvas.on('mouse:down', (e) => {
  mousePressed = true
  canvas.setCursor('grab') // 修改画布手势
  renderAll()
})

canvas.on('mouse:up', (e) => {
  mousePressed = false
  canvas.setCursor('default') // 修改画布手势
  renderAll()
  // socket.draw(JSON.stringify(canvas.toJSON()))
})


/** ---------------------对外Apis---------------------------------------- */

// 修改当前mode
function setMode (type) {
  if (!type) {
    canvas.isDrawingMode = false
  }
  if (type === models.drawing) {
    canvas.isDrawingMode = true // 开启自由绘制模式
  }
  currentMode = type
}

// 设置mode属性
function setModelProps (options) {
  updateProps[currentMode](options)
}

// 清除画布
function canvasClear () {
  canvas.getObjects().forEach(object => {
    if (object !== canvas.backgroundImage) {
      canvas.remove(object)
    }
  })
  socket.draw(JSON.stringify(canvas.toJSON()))
}

// 创建Shape
function createShape (shape) {
  shapes[shape].create()
}


// 发送socket
function syncBoard (obj) {
  socket.draw(obj)
}

// render 收口
function renderAll () {
  canvas.renderAll()
  // const canvasJson = canvas.toJSON()
  // socket.draw({canvasJson})
}
