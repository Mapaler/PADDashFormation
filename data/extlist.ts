export interface Extlist {
  numMons: number;
  numCards: number;
  checksum: number;
  entries: ExtlistEntry[];
}

export interface ExtlistEntry {
  isCards: boolean;
  id: number;
  width: number;
  height: number;
  numFrames: number;
  frameRate: number;
  checksum: number;
  size: number;
  lastUpdate: number;
  compressedSize: number;
  compressedChecksum: number;
}

export const Extlist = {
  load(buf: Buffer): Extlist {
    const numMons = buf.readUInt32LE(0);
    const numCards = buf.readUInt32LE(4);
    const sig = buf.readUInt32LE(8);
    const checksum = buf.readUInt32LE(12);
    if (sig !== 0x31545845) {  // EXT1
      throw new Error('invalid extlist.bin signature');
    }

    const entries: ExtlistEntry[] = [];
    const numEntries = numMons + numCards;
    const compressedInfoOffset = 0x10 + numEntries * 24;
    for (let i = 0; i < numEntries; i++) {
      const flags = buf.readUInt16LE(0x10 + i * 24 + 0);
      const isCards = (flags & 0x4000) !== 0;
      const id = flags & ~0x4000;
      if (id === 0) continue;

      entries.push({
        isCards,
        id,
        width: buf.readUInt16LE(0x10 + i * 24 + 6),
        height: buf.readUInt16LE(0x10 + i * 24 + 8),
        numFrames: buf.readUInt16LE(0x10 + i * 24 + 10),
        frameRate: buf.readUInt16LE(0x10 + i * 24 + 12),
        checksum: buf.readUInt16LE(0x10 + i * 24 + 14),
        size: buf.readUInt32LE(0x10 + i * 24 + 16),
        lastUpdate: buf.readUInt32LE(0x10 + i * 24 + 20),
        compressedSize: buf.readUInt32LE(compressedInfoOffset + i * 8 + 0),
        compressedChecksum: buf.readUInt32LE(compressedInfoOffset + i * 8 + 4),
      });
    }

    return {
      numMons,
      numCards,
      checksum,
      entries,
    };
  },
};
