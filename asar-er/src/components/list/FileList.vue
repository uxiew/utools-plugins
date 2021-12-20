<template>
  <div
    class="file-list"
    :class="{ resize: point }"
    @mousemove="onMouseMove"
    @mouseup.stop="onMouseUp"
  >
    <FileListItem
      class="head"
      :value="{}"
      :columns="[
        {
          className: 'name-column cell',
          style: { width: nameWidth + 'px' },
          text: '名称',
        },
        {
          className: 'size-column cell',
          style: { width: `calc(100% - ${nameWidth}px)` },
          text: '大小',
        },
      ]"
    />
    <div class="body">
      <FileListItem
        v-for="item in list"
        :key="item.path"
        @doubleclick="onItemDoubleClicked"
        @click="onItemClicked($event, item)"
        @dragstart="onDragStart"
        :value="item"
        :class="{ focused: item.focused }"
        :columns="[
          {
            className: 'name-column cell' + (isFolder(item) ? ' folder' : ' file'),
            style: { width: nameWidth + 'px' },
            text: item.name,
          },
          {
            className: 'size-column cell' + (isFolder(item) ? ' folder' : ' file'),
            style: { width: `calc(100% - ${nameWidth}px)` },
            text: item.node && typeof item.node.size === 'number' ? formatSize(item.node.size) : '',
          },
        ]"
      />
    </div>
    <div class="resize" :style="{ left: `${nameWidth - 4}px` }" @mousedown.stop="onMouseDown"></div>
  </div>
</template>

<style lang="scss">
.file-list {
  width: 100%;
  font-size: 14px;
  border: none;
  position: relative;
  height: 100%;
  overflow: auto;
  &.resize {
    cursor: ew-resize;
  }
  .head {
    display: flex;
    width: 100%;
    position: absolute;
    top: 0;
    .cell {
      height: 24px;
      line-height: 24px;
    }
  }
  .body {
    margin-top: 24px;
    height: calc(100% - 24px);
    overflow: auto;
    .row {
      &:hover {
        background: #e5f3ff;
      }
    }
  }
  .row {
    display: flex;
  }
  .size-column {
    text-align: right;
  }
  .cell {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    padding: 2px 5px;
    height: 22px;
    line-height: 22px;
  }
  .name-column {
    &.cell {
      &.folder {
        &::before {
          display: inline-block;
          content: '';
          height: 16px;
          width: 16px;
          margin-right: 5px;
          vertical-align: text-bottom;
          background-image: url('~@/assets/images/Folder_16x.svg');
        }
      }
      &.file {
        &::before {
          display: inline-block;
          content: '';
          height: 16px;
          width: 16px;
          margin-right: 5px;
          vertical-align: text-bottom;
          background-image: url('~@/assets/images/Document_16x.svg');
        }
      }
    }
  }
  & > .resize {
    width: 4px;
    height: 100%;
    position: absolute;
    cursor: ew-resize;
    top: 0;
    border-right: 1px solid #ebf4fe;
  }
}
.file-list .row.focused,
.file-list .row.focused:hover {
  background: #cce8ff;
}
</style>

<script lang="ts" src="./file_list.ts"></script>
