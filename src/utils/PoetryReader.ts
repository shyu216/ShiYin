abstract class BaseItem {
    title: string;
    author: string;
    content: string;

    constructor(title: string, author: string, content: string) {
        this.title = title;
        this.author = author;
        this.content = content;
    }

    toString(): string {
        return `${this.title} ${this.author} ${this.content}`;
    }

    getTuple(): Array<any> {
        return [];
    }

    getTags(): Array<string> {
        return [];
    }
}

class Ci extends BaseItem {
    tags: Array<string>;

    constructor(title: string, author: string, content: string, tags: Array<string>) {
        super(title, author, content);
        this.tags = tags;
    }

    getTuple(): Array<any> {
        return [this.title, this.author, this.content, "", ""];
    }

    getTags(): Array<string> {
        return [...this.tags, this.author];
    }
}

class ShiJing extends BaseItem {
    chapter: string;
    section: string;

    constructor(title: string, content: string, chapter: string, section: string) {
        super(title, "", content);
        this.chapter = chapter;
        this.section = section;
    }

    getTuple(): Array<any> {
        return [this.title, "", this.content, this.chapter, this.section];
    }

    getTags(): Array<string> {
        return [this.chapter, this.section, "诗经"];
    }
}

class Nalan extends BaseItem {
    constructor(title: string, author: string, content: string) {
        super(title, author, content);
    }

    getTuple(): Array<any> {
        return [this.title, this.author, this.content, "", ""];
    }

    getTags(): Array<string> {
        if (this.title.includes('·')) {
            return [this.title.split('·')[0], this.author];
        }
        return [this.author];
    }
}

class Poem extends BaseItem {
    tags: Array<string>;

    constructor(title: string, author: string, content: string, tags: Array<string>) {
        super(title, author, content);
        this.tags = tags;
    }

    getTuple(): Array<any> {
        return [this.title, this.author, this.content, "", ""];
    }

    getTags(): Array<string> {
        return [...this.tags, this.author];
    }
}

import { SQLiteDatabase } from 'react-native-sqlite-storage';

function processParagraphs(paragraphs: string[]): string {
    // Implement this function based on your Python version
    return paragraphs.join('\n');
}


import ci from './../assets/chinese-poetry/宋词/宋词三百首.json';
import shijing from './../assets/chinese-poetry/诗经/shijing.json';
import nalan from './../assets/chinese-poetry/纳兰性德/纳兰性德诗集.json';
import poem from './../assets/chinese-poetry/全唐诗/唐诗三百首.json';

async function handleCi(): Promise<Ci[]> {
    // console.log(`handle ${ci}`);
    const lst: Ci[] = [];
    for (const item of ci) {
        const author = item['author'];
        const rhythmic = item['rhythmic'];
        const paragraphs = processParagraphs(item['paragraphs']);
        const tags = item['tags'];
        lst.push(new Ci(rhythmic, author, paragraphs, tags));
    }
    return lst;
}

async function handleShijing(): Promise<ShiJing[]> {
    // console.log(`handle ${shijing}`);
    const lst: ShiJing[] = [];

    for (const item of shijing) {
        const title = item['title'];
        const content = processParagraphs(item['content']);
        const chapter = item['chapter'];
        const section = item['section'];
        lst.push(new ShiJing(title, content, chapter, section));
    }
    return lst;
}

async function handleNalan(): Promise<Nalan[]> {
    // console.log(`handle ${nalan}`);
    const lst: Nalan[] = [];

    for (const item of nalan) {
        const title = item['title'];
        const author = item['author'];
        const para = processParagraphs(item['para']);
        lst.push(new Nalan(title, author, para));
    }
    return lst;
}

async function handlePoem(): Promise<Poem[]> {
    // console.log(`handle ${poem}`);
    const lst: Poem[] = [];

    for (const item of poem) {
        const title = item['title'];
        const author = item['author'];
        const content = processParagraphs(item['paragraphs']);
        const tags = item['tags'];
        lst.push(new Poem(title, author, content, tags));
    }
    return lst;
}

export async function insertData(db: SQLiteDatabase, lst: any[], tags: string[]) {
    await new Promise<void>((resolve, reject) => {
        db.transaction((tx) => {
            for (let i = 0; i < lst.length; i++) {
                console.log(`add poet ${i} ${lst[i].toString()}`);
                tx.executeSql("INSERT INTO Poems VALUES (?, ?, ?, ?, ?, ?)", [i, ...lst[i].getTuple()]);

                for (let tag of lst[i].getTags()) {
                    if (tags.indexOf(tag) === -1) {
                        console.log(`add tag ${tag}`);
                        tags.push(tag);
                        tx.executeSql("INSERT INTO Tags VALUES (?, ?)", [tags.length, tag]);
                    }
                    console.log(`add poet ${i} tag ${tag}`);
                    tx.executeSql("INSERT INTO Poet_Tags VALUES (?, ?)", [i, tags.indexOf(tag) + 1]);
                }
            }
        }, (e) => {
            console.log('transaction error: ', e);
            reject(e);
        }, () => {
            console.log('insert data : ', 'Poems, Tags, Poet_Tags inserted successfully');
            resolve();
        });
    });

    await new Promise<void>((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql("SELECT * FROM Poems", [], (_, { rows }) =>
                console.log(`poems: ${rows.length}`)
            );
            tx.executeSql("SELECT * FROM Tags", [], (_, { rows }) =>
                console.log(`tags: ${rows.length}`)
            );
            tx.executeSql("SELECT * FROM Poet_Tags", [], (_, { rows }) =>
                console.log(`poet_tags: ${rows.length}`)
            );
        }, (e) => {
            console.log('transaction error: ', e);
            reject(e);
        }, () => {
            resolve();
        });
    });

    console.log(`载入${lst.length}条记录`);
}

export async function readPoems(db: SQLiteDatabase) {
    let ci: Ci[] = [], shijing: ShiJing[] = [], nalan: Nalan[] = [], poem: Poem[] = [];

    ci = await handleCi();
    shijing = await handleShijing();
    nalan = await handleNalan();
    poem = await handlePoem();

    const lst = [...ci, ...shijing, ...nalan, ...poem];
    const tags: any[] = [];

    await insertData(db, lst, tags);
}