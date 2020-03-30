

class Adpcm extends AudioCoder
{
    constructor(wasm, importObj)
    {
        super(wasm, importObj);
        this._indexDe = Adpcm._currentIndex;
        this._indexEn = Adpcm._currentIndex + 1;
        Adpcm._currentIndex = (Adpcm._currentIndex + 2) & 0x3F;
        this._wasm.instance.exports._initAdpcmState(this._indexDe);
        this._wasm.instance.exports._initAdpcmState(this._indexEn);
    }

    resetDecodeState(state)
    {
        this._wasm.instance.exports._resetAdpcmState(this._indexDe, state.valprev, state.index);
    }

    resetEncodeState(state)
    {
        this._wasm.instance.exports._resetAdpcmState(this._indexEn, state.valprev, state.index);
    }

    getDecodeState()
    {
        this._wasm.instance.exports._getAdpcmState(this._indexDe, 10236, 10238);
        return new Adpcm.State(this._memory[10236] + (this._memory[10237] << 8), this._memory[10238]);
    }

    getEncodeState()
    {
        this._wasm.instance.exports._getAdpcmState(this._indexEn, 10236, 10238);
        return new Adpcm.State(this._memory[10236] + (this._memory[10237] << 8), this._memory[10238]);
    }

    decode(data)
    {
        this._copyToMemory(data);
        this._wasm.instance.exports._decodeAdpcm(this._indexDe, 0, 10240, data.byteLength << 1);
        return new Int16Array(this._memory.buffer, 10240, data.byteLength << 1);
    }

    encode(data)
    {
        this._copyToMemory(data);
        this._wasm.instance.exports._encodeAdpcm(this._indexEn, 0, 10240, data.byteLength >>> 1);
        return new Uint8Array(this._memory.buffer, 10240, data.byteLength >>> 2);
    }
}

Adpcm._currentIndex = 0;

Adpcm.State = class
{
    constructor(valprev, index)
    {
        this.valprev = valprev;
        this.index = index;
    }
}
