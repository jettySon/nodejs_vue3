// src/models/board/BoardVO.ts
export class BoardVO {
    public id: number;
    public boardKey: string;
    public writerKey: string;
    public writer: string;
    public title: string;
    public contentText: string | null;
    public isUse: boolean;
    public createdAt?: Date;
    public updatedAt?: Date;

    constructor(
        id: number,
        boardKey: string,
        writerKey: string,
        writer: string,
        title: string,
        contentText: string | null = null,
        isUse: boolean = true,
        createdAt?: Date,
        updatedAt?: Date
    ) {
        this.id = id;
        this.boardKey = boardKey;
        this.writerKey = writerKey;
        this.writer = writer;
        this.title = title;
        this.contentText = contentText;
        this.isUse = isUse;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}