namespace BookMark {
    //文件夹数据项
    export enum BookMarkDataItemState {
        Normal,
        New,
        Rename
    }

    export type BookMarkDataItem = {
        id: number
        pid: number
        title: string
        state?: BookMarkDataItemState
        isOpen?: Boolean
    };

    //链接数据项
    export interface BookMarkPageDataItem {
        id: string,
        title: string,
        url: string,
        cid: number
    }
}