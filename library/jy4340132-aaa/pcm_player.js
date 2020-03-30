
class PCMPlayer 
{
    constructor(channels, sampleRate)
    {
        this._samples = new Float32Array();
        this._flushingTime = 200;
        this._channels = channels;
        this._sampleRate = sampleRate;
        this._flush = this._flush.bind(this);
        this._audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        this._gainNode = this._audioCtx.createGain();
        this._gainNode.gain.value = 1;
        this._gainNode.connect(this._audioCtx.destination);
        this._startTime = this._audioCtx.currentTime;
        this._interval = setInterval(this._flush, this._flushingTime);
    }

    setVolume(volume)
    {
        this._gainNode.gain.value = volume;
    }

    close()
    {
        if(this._interval)
        {
            clearInterval(this._interval);
        }
        this._audioCtx.close();
    };

    feed(data) 
    {
        let tmp = new Float32Array(this._samples.length + data.length);
        tmp.set(this._samples, 0);
        tmp.set(data, this._samples.length);
        this._samples = tmp;
    };

    _flush() 
    {
        if(!this._channels || !this._sampleRate || !this._samples.length) 
        {
            return;
        }
        let bufferSource = this._audioCtx.createBufferSource();
        let length = this._samples.length / this._channels;
        let audioBuffer = this._audioCtx.createBuffer(this._channels, length, this._sampleRate);
        for (let channel = 0; channel != this._channels; ++channel) 
        {
            let audioData = audioBuffer.getChannelData(channel);
            let offset = channel;
            let decrement = 50;
            for (let i = 0; i != length; ++i) 
            {
                audioData[i] = this._samples[offset];
                if (i < 50) 
                {
                    audioData[i] =  (audioData[i] * i) / 50;
                }
                if (i >= (length - 51)) 
                {
                    audioData[i] =  (audioData[i] * decrement--) / 50;
                }
                offset += this._channels;
            }
        }
        
        if (this._startTime < this._audioCtx.currentTime) 
        {
            this._startTime = this._audioCtx.currentTime;
        }
        bufferSource.buffer = audioBuffer;
        bufferSource.connect(this._gainNode);
        bufferSource.start(this._startTime);
        this._startTime += audioBuffer.duration;
        this._samples = new Float32Array();
    }
}
