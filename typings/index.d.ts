declare module 'node-record-lpcm16' {
    function record(options: {
        /**
         * 采样率，单位Hz
         */
        sampleRate: number
        /**
         * 音量阈值，0到1之间
         */
        threshold: number
        /**
         * 是否打印日志信息
         */
        verbose: boolean
        /**
         * 使用的录音程序，可以是'rec'或'sox'
         */
        recordProgram: string
        /**
         * 使用的录音程序，可以是'rec'或'sox'
         */
        recorder: string
        /**
         * 自定义sox参数
         */
        soxArgs: any[]
        /**
         * 静音检测时间，单位秒
         */
        silence: string
    })
}

declare module 'node-vad' {
    function createStream(options: {
        /**
         * 模式
         */
        mode: number
        /**
         * 音频频率
         */
        audioFrequency: number
        debounceTime: number
    })

    const Mode = {
        /**
         * 正常的
         */
        NORMAL: 0,
        /**
         * 低比特率
         */
        LOW_BITRATE: 1,
        /**
         * 较好的
         */
        AGGRESSIVE: 2,
        /**
         * 非常好的
         */
        VERY_AGGRESSIVE: 3
    }
}