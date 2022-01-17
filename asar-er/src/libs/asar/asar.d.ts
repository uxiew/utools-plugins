/* eslint-disable no-redeclare */
/* eslint-disable no-dupe-class-members */

import 'node'

declare class Asar {
  constructor ()
  constructor (asar: Asar.IAsarNullable)
  constructor (asar: Asar)
  constructor (src: string)
  constructor (src: string, headerSize: number)
  constructor (src: string, headerSize: number, fileSize: number)
  constructor (src: string, headerSize: number, fileSize: number, header: Asar.AsarNodeDirectory)
  constructor (src: string, headerSize: number, fileSize: number, header: Asar.AsarNodeDirectory, tmp: string)

  getTempDir (): string
  getTempPath (path: string): string
  isOpened (): boolean
  close (): void
  open (asarPath?: string): void
  getSrc (): string
  getFileSize (): number

  getNodeSize (node: Asar.AsarNode): number
  getNodeSize (path: string): number

  getHeaderSize (): number
  getHeader (copy?: boolean): Asar.AsarNodeDirectory
  getNode (...path: string[]): Asar.AsarNode | null
  copyNode (...path: string[]): Asar.AsarNode | null
  existsSync (...path: string[]): boolean
  readdirSync (...path: string[]): string[]

  readFileSync (path: string): Buffer
  readFileSync (path: string, encoding: 'binary'): Buffer
  readFileSync (path: string, encoding: string): string

  readFile (path: string): Promise<Buffer>
  readFile (path: string, encoding: 'binary'): Promise<Buffer>
  readFile (path: string, encoding: 'binary', callback: (err: Error | null, data?: Buffer) => void): void
  readFile (path: string, encoding: string): Promise<string>
  readFile (path: string, encoding: string, callback: (err: Error | null, data?: string) => void): void

  walk (callback?: (node: Asar.AsarNode, path: string) => any, path?: string): void
  asyncWalk (callback?: (node: Asar.AsarNode, path: string) => any, path?: string): Promise<void>
  extractTemp (path: string, onProgress?: (progress: Asar.ExtractProgress) => void): Promise<void>
  extract (path: string, dest: string, onProgress?: (progress: Asar.ExtractProgress) => void): Promise<void>

  write (path: string, src: string, isUnpack?: boolean): Promise<void>
  erase (path: string): Promise<void>
  unpack (paths: string[]): Promise<void>
  list (): string[]

  static open (asarPath: string): Asar
  static validate (node: any): boolean
  static getNode (rootNode: Asar.AsarNodeDirectory, ...path: string[]): Asar.AsarNode | null
  static copyNode (rootNode: Asar.AsarNodeDirectory, ...path: string[]): Asar.AsarNode | null
  static getNodeSize (node: Asar.AsarNode): number
  static getNodeSize (node: Asar.AsarNodeDirectory, path: string): number
  static existsSync (rootNode: Asar.AsarNodeDirectory, ...path: string[]): boolean
  static readdirSync (rootNode: Asar.AsarNodeDirectory, ...path: string[]): string[]
  static walk (rootNode: Asar.AsarNodeDirectory, callback?: (node: Asar.AsarNode, path: string) => any, path?: string): void
  static asyncWalk (rootNode: Asar.AsarNodeDirectory, callback?: (node: Asar.AsarNode, path: string) => any, path?: string): Promise<void>

  static pack (src: string, dest: string): Promise<Asar.IAsar>
  static pack (src: string, dest: string, onProgress: (progress: Asar.PackProgress) => void): Promise<Asar.IAsar>
  static pack (src: string, dest: string, unpack: RegExp | string | string[]): Promise<Asar.IAsar>
  static pack (src: string, dest: string, unpack: RegExp | string | string[], onProgress: (progress: Asar.PackProgress) => void): Promise<Asar.IAsar>

  static list (node: Asar.AsarNodeDirectory): string[]

  static enableNodeModulesAsar (root: string, force?: boolean): void
  static isNodeModulesAsarEnabled (): boolean
  static getNodeModuleAsarPath (): string
}

declare namespace Asar {
  export interface AsarNodeDirectory {
    files: {
      [item: string]: AsarNode
    }
  }

  export type AsarNodeFile = {
    size: number
    offset: string
    unpacked?: boolean
    executable?: boolean
  } | {
    link: string
  }

  export type AsarNode = AsarNodeDirectory | AsarNodeFile

  export interface IAsar {
    src: string
    fileSize: number
    headerSize: number
    header: AsarNodeDirectory
    tmp: string
  }

  export interface IAsarNullable {
    src?: string
    fileSize?: number
    headerSize?: number
    header?: AsarNodeDirectory
    tmp?: string
  }

  export interface ExtractProgress {
    filename: string
    total: number
    current: number
    size: number
  }

  export interface PackProgress {
    currentFile: string
    total: string
    packed: string
    percent: number
    chunkLength: number
  }

  export interface PackOptions {
    globOptions?: any
    dot?: boolean
    pattern?: string
    ordering?: string
    unpackDir?: string
    unpack?: string
    [key: string]: any
  }
}

export = Asar
