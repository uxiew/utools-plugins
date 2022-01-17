/* eslint-disable no-redeclare */
/* eslint-disable no-dupe-class-members */

import * as Asar from './asar'

declare class AsarHeader implements Asar.AsarNodeDirectory {
  files: {
    [name: string]: Asar.AsarNode
  }

  constructor (node?: Asar.AsarNodeDirectory)

  insertNode (path: string, node: Asar.AsarNode): boolean
  removeNode (path: string): boolean
  getNode (path: string): Asar.AsarNode | null
}

declare namespace AsarHeader {}

export = AsarHeader
