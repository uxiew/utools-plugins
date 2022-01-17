interface FBAsar {
  name: string;
  type: 'file' | 'directory';
  files?: FBAsar[];
  [key: string]: any;
}
declare interface AsarNode {
  _open?: boolean;
  _active?: boolean;
  // _focused?: boolean
  // _path?: string
  files?: {
    [item: string]: AsarNode;
  };
  size?: number;
  offset?: string;
  unpacked?: boolean;
  executable?: boolean;
  link?: string;
}

declare interface IAsar {
  src: string;
  header: AsarNode;
  headerSize: number;
  fd?: number;
}

declare interface TreeItem {
  title: string;
  data: AsarNode;
  indent: number;
  key: string;
}

declare interface ListItem {
  node: AsarNode | null;
  path: string;
  name: string;
  focused?: boolean;
}
