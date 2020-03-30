
class Std
{
    constructor()
    {}

    static memmem(data1, data1Offset, data2)
    {
        for (let i = 0; i <= data1.byteLength - data2.byteLength - data1Offset; ++i)
        {
            let j = 0;
            for (; j != data2.byteLength; ++j)
            {
                if(data1[i + j + data1Offset] != data2[j])
                {
                    break;
                }
            }
            if(j >= data2.byteLength)
            {
                return i + data1Offset;
            }
        }
        return -1;
    }

    static memcmp(data1, data1Offset, data2)
    {
        for(let i = 0; i != data2.byteLength; ++i)
        {
            if(data1[i + data1Offset] != data2[i])
            {
                return -1;
            }
        }
        return 0;
    }

    static memcpy(data1, data1Offset, data2, data2Begin, data2End)
    {
        data1.set(data2.subarray(data2Begin, data2End), data1Offset);
    }

    static milliSecondTime()
    {
        return new Date().getTime();
    }

    static shortToFloatData(input)
    {
        let inputSamples = input.length;
        let output = new Float32Array(inputSamples);
        for(let i = 0; i != inputSamples; ++i)
        {
            output[i] = input[i] / 32768;
        }
        return output;
    }

    static floatToShortData(input)
    {
        let inputSamples = input.length;
        let output = new Int16Array(inputSamples);
        for(let i = 0; i != inputSamples; ++i)
        {
            output[i] = input[i] * 32768;
        }
        return output;
    }

    static downsampleBuffer(buffer, rate, sampleRate)
    {
        if(rate == sampleRate)
        {
            return buffer;
        }
        else if(rate > sampleRate)
        {
            throw "rate > sampleRate error !!";
        }
        let sampleRateRatio = sampleRate / rate;
        let newLength = Math.ceil(buffer.length / sampleRateRatio) & 0xFFFC;
        let result = new Float32Array(newLength);
        let offsetResult = 0;
        let offsetBuffer = 0;
        while (offsetResult != result.length) 
        {
            let nextOffsetBuffer = offsetBuffer + sampleRateRatio;
            let accum = 0;
            let count = 0;
            let currentOffset = Math.ceil(offsetBuffer);
            let currentNextOffset = Math.ceil(nextOffsetBuffer);
            for (let i = currentOffset; i != currentNextOffset && i != buffer.length; ++i)
            {
                accum += buffer[i];
                ++count;
            }
            result[offsetResult] = accum / count;
            ++offsetResult;
            offsetBuffer = nextOffsetBuffer;
        }
        return result;
    }
}

class Result
{
    constructor(data, type, time, errorCode, duration = 20) 
    {
        this.data = data;
        this.type = type;
        this.time = time;
        this.duration = duration;
        this.errorCode = errorCode;
    }

    static makeErrorResult(errorCode)
    {
        return new Result(null, -1, -1, errorCode);
    }     
}

Result.ErrorCode = class
{
    constructor() 
    {}
}

Result.ErrorCode.SUCCESS = 0;
Result.ErrorCode.PARAM_ERROR = 1000;
Result.ErrorCode.PARAM_CHANGE = 2000;
Result.ErrorCode.FAIL = 3000;
Result.ErrorCode.NO_INIT_ERROR = Result.ErrorCode.FAIL + 1;
Result.ErrorCode.CACHE_MAX_ERROR = Result.ErrorCode.FAIL + 2;

Result.Type = class
{
    constructor()
    {}
}

Result.Type.H264_I_FRAME = 0;
Result.Type.H264_P_FRAME = 1;
Result.Type.H264_B_FRAME = 2;
Result.Type.AUDIO = 3;
Result.Type.TRANS_DATA = 4;
Result.Type.FMP4_HEAD = 5;
Result.Type.FMP4_BODY = 6;

class AudioCoder
{
    constructor(wasm, importObj)
    {
        if(importObj.memoryBase < 102400)
        {
            throw new Error("too small");
        }
        this._importObj = importObj;
        this._wasm = wasm;
        this._memory = new Uint8Array(this._importObj.env.memory.buffer);
    }

    _copyToMemory(data)
    {
        if(data.byteLength > (this._importObj.env.memoryBase >>> 6))
        {
            throw new Error("overflow");
        }
        this._memory.set(new Uint8Array(data.buffer, data.byteOffset, data.byteLength));
    }
}
