import io, { Socket } from 'socket.io-client'
import delay from 'delay'
import fs from 'fs'

class Whisper {
    private io: Socket
    constructor(wss: string) {
        if (!wss) {
            throw new Error("exit0")
        }
        this.io = io(wss)
    }

    async begin(model?: string): Promise<boolean> {
        if (!await this.wait()) {
            return false
        }
        const data: any = {
            type: 'wav',
            model: 'small'
        }
        if (model) {
            data['model'] = model
        }
        this.io.send(JSON.stringify(data))
        return true
    }

    private async wait(): Promise<boolean> {
        return new Promise<boolean>(async (resolve, reject) => {
            let waitTimeout = 5 // 5秒
            while (waitTimeout > 0) {
                waitTimeout --
                if (this.io.connected) {
                    resolve(true)
                    return
                }
                await delay(1000)
            }
            return resolve(false)
        })
    }

    createHandler(): (buf: Buffer, talking: boolean) => void {
        const wav = fs.createWriteStream(`sox.wav`, { encoding: 'binary' })
        return (buf: Buffer, talking: boolean) => {
            if (talking) {
                wav.write(buf)
            } else {
                wav.end()
                fs.readFile(wav.path, (err: any, data: Buffer) => {
                    if (err) {
                        console.log('err:', err)
                        return
                    }
                    this.io.send(data)
                })
            }
        }
    }

    event(type: string, cb: (params: any) => void) {
        this.io.on(type, (params) => {
            cb(params)
        })
    }

    close() {
        this.io.close()
    }
}


export default Whisper