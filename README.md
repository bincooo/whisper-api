## 麦克风封装件

对麦克风监听，并对声音做简单的处理。
可以实时地对录音切片。

### 用于对接whisper
​	对应的 [COLAB](https://colab.research.google.com/github/bincooo/sd-webui-colab/blob/main/other/OpenAI_Whisper_ASR.ipynb)

1. 本机需要安装sox库，具体查看 [node-record-lpcm16](https://github.com/gillesdemey/node-record-lpcm16)

2. 需要COLAB中启动whisper，插件通过websocket连接

RUN:

```shell
npm i
npm run dev
```