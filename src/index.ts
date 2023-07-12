import record from 'node-record-lpcm16'
import VAD from 'node-vad'
import Emitter from 'events'
import Whisper from './whisper'

class Micro {

    /**
     * 音频头信息
     */
    private H :any = null

    /**
     * 是否有声音
     */
    private talking :boolean = false

    /**
     * 麦克风实例
     */
    private recording = record.record({
        sampleRate: 16000,
        threshold: 0.8,
        verbose: true,
        recordProgram: 'sox',
        recorder: 'sox',
        soxArgs: ['-t', 'waveaudio', '-d', '-p', 'noisered', 'noise.prof', '0.21'],
        silence: '1.0',
    })

    /**
     * 声音流处理器
     */
    private stream = VAD.createStream({
        mode: VAD.Mode.NORMAL,
        audioFrequency: 16000,
        debounceTime: 1000
    })

    /**
     * 事件
     */
    private events = new Emitter()

    constructor() {
        this.recording
            .stream()
            .pipe(this.stream)
        this.start()
    }

    private start() {
        this.stream.on('data', (data: any) => {
            const {
                start,
                end,
                startTime,
            } = data.speech ?? {}
            const audioData = data.audioData

            if (start) {
                if (startTime == 0) {
                    this.H = audioData
                    console.log('Start listening...')
                    return
                }
                this.talking = true
            }

            if (this.talking) {
                this.events.emit('event', audioData, true)
            }

            if (end) {
                this.talking = false
                this.events.emit('event', audioData, false)
            }
        })
    }

    event(handle: (buf: Buffer, talking: boolean) => void) {
        this.events.on('event', handle)
    }

    /**
     * 音频头部魔数
     * @returns 
     */
    magic(): Buffer {
        return this.H
    }

    /**
     * 关闭监听
     */
    close() {
        this.recording
            .stop()
    }
}


export default Micro
export {
    Micro,
    Whisper,
}