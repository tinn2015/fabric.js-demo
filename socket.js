class Socket {
    constructor (options) {
        this.socket = io(options.url, {query: options.query});
        this.socket.on("connect", () => {
            console.log('socket connect', this.socket.id); // x8WIv7-mJelg7on_ALbx
        });

        // 同步其他白板
        this.socket.on('syncRoomDraw', (data) => {
            console.log('canvas', canvas)
            console.log('socket 接收', data)
            // 获取新添加的object
            // const object = new fabric.Object.toObject(data.object)
            // const objects = canvas.getObjects()
            // objects.push(data.object)
            // console.log('objects', object, objects)

            const canvasJson = data.canvasJson
            canvas.loadFromJSON(canvasJson)
            canvas.renderAll()
            // if (data.type === 'ellipse') {
            //     const shape = new fabric.Ellipse(JSON.parse(data.object))
            //     console.log('shape', shape)
            //     canvas.add(shape)
            //     canvas.renderAll()
            // }
            
        })

        // 接受命令
        this.socket.on('cmd', (data) => {
            console.log('cmd 接收', data)
        })

        this.socket.on("disconnect", () => {
            console.log(this.socket.id); // undefined
        });
    }
    draw (object) {
        this.socket.emit('draw', {msg: '我是客户端发来的消息', roomId: this.socketValue, ...object})
    }
    // 发送cmd
    sendCmd () {
        this.socket.emit('cmd', {msg: '我是客户端发来的消息', roomId: this.socketValue})
    }
}