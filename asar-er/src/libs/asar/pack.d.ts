export function pack(src: string, dest: string, unpack?: RegExp | string | string[], onProgress?: (info: {
  currentFile: string
  total: string
  packed: string
  percent: number
  chunkLength: number
}) => void): Promise<void>
