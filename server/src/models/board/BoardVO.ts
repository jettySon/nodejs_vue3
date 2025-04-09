// src/models/board/BoardVO.ts
export class BoardVO {
    public idx: number;
    public boardKey: string;
    public writerKey: string;
    public writer: string;
    public title: string;
    public contentText: string | null;
    public isUse: boolean;
    public createDate?: Date;

    constructor(
        idx: number,
        boardKey: string,
        writerKey: string,
        writer: string,
        title: string,
        contentText: string | null = null,
        isUse: boolean = true,
        createDate?: Date,
    ) {
        this.idx = idx;
        this.boardKey = boardKey;
        this.writerKey = writerKey;
        this.writer = writer;
        this.title = title;
        this.contentText = contentText;
        this.isUse = isUse;
        this.createDate = createDate;
    }
}