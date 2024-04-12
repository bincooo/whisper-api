import { exit } from 'process'
import Micro, { Whisper } from '../src'


async function main() {
    // 远程whisper： https://colab.research.google.com/github/bincooo/sd-webui-colab/blob/main/other/OpenAI_Whisper_ASR.ipynb
    const trycloudflare = "tr-components-men-touched.trycloudflare.com"
    const whisper = new Whisper("wss://" + trycloudflare + "/websocket")
    if (!await whisper.begin()) {
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
                console.log("开始讲话.")
            }
        }

        if (handle) {
            handle(buf, talking)
        }
        
        if (!talking) {
            console.log("停止讲话.")
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
        try {
            const data = JSON.parse(params)
            if (data.ok && !filter(data.message)) {
                return
            }
        } catch(err) {
            // ignore
        }
        console.log('raw_message', params)
    })

    // 录音20秒
    // setTimeout(() => {
    //     micro.close()
    //     whisper.close()
    //     exit(0)
    // }, 20000)
}

function filter(message: string): boolean {
    if (message.startsWith("字幕by")) {
        return false
    }
    for (let index = 0; index < EQS.length; index++) {
        const element = EQS[index]
        if (element === message) {
            return false
        }
    }
    if (message.length == 1) {
        return false
    }
    return true
}

const EQS = [
    "謝謝",
    "谢谢",
    "謝謝收看",
    "謝謝大家收看",
]

main()
// .then(() => {
//     console.log('退出。')
//     exit(0)
// })