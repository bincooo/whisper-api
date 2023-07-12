import { exit } from 'process'
import Micro, { Whisper } from '../src'


async function main() {
    const trycloudflare = "fotos-cumulative-commodities-dover.trycloudflare.com"
    const whisper = new Whisper("wss://" + trycloudflare + "/websocket")
    if (!await whisper.begin("large")) {
        console.log("连接失败.")
        return
    }

    const micro = new Micro()
    let handle: ((buf: Buffer, talking: boolean) => void) | undefined = undefined

    micro.event((buf: Buffer, talking: boolean) => {
        if (talking) {
            if (!handle) {
                handle = whisper.createHandler()
                handle(micro.magic(), talking)
            }
            // console.log("开始讲话.")
        }

        if (handle) {
            handle(buf, talking)
        }
        
        if (!talking) {
            // console.log("停止讲话.")
            handle = undefined
        }
    })

    whisper.event('error', (params: any) => {
        console.log('error', params)
    })

    whisper.event('my_response_message', (params: any) => {
        console.log('my_response_message', params)
    })

    whisper.event('raw_message', (params: any) => {
        console.log('raw_message', params)
    })

    // 录音20秒
    // setTimeout(() => {
    //     micro.close()
    //     whisper.close()
    //     exit(0)
    // }, 20000)
}

main()
// .then(() => {
//     console.log('退出。')
//     exit(0)
// })