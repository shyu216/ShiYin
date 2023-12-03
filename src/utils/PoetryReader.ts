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

import RNFS from 'react-native-fs';

function processParagraphs(paragraphs: string[]): string {
    // Implement this function based on your Python version
    return paragraphs.join('\n');
}

async function handleCi(pathCi: string): Promise<Ci[]> {
    console.log(`handle ${pathCi}`);
    const ci = JSON.parse(await RNFS.readFile(pathCi, 'utf8'));
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

async function handleShijing(pathShijing: string): Promise<ShiJing[]> {
    console.log(`handle ${pathShijing}`);
    const shijing = JSON.parse(await RNFS.readFile(pathShijing, 'utf8'));
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

async function handleNalan(pathNalan: string): Promise<Nalan[]> {
    console.log(`handle ${pathNalan}`);
    const nalan = JSON.parse(await RNFS.readFile(pathNalan, 'utf8'));
    const lst: Nalan[] = [];

    for (const item of nalan) {
        const title = item['title'];
        const author = item['author'];
        const para = processParagraphs(item['para']);
        lst.push(new Nalan(title, author, para));
    }
    return lst;
}

async function handlePoem(pathPoem: string): Promise<Poem[]> {
    console.log(`handle ${pathPoem}`);
    const poem = JSON.parse(await RNFS.readFile(pathPoem, 'utf8'));
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

export async function readPoems() {
    const pathCi = '../chinese-poetry/宋词/宋词三百首.json';
    const pathShijing = '../chinese-poetry/诗经/shijing.json';
    const pathNalan = '../chinese-poetry/纳兰性德/纳兰性德诗集.json';
    const pathPoem = '../chinese-poetry/全唐诗/唐诗三百首.json';

    console.log("dir", RNFS.readDir('./'));

    let ci: Ci[] = [], shijing: ShiJing[] = [], nalan: Nalan[] = [], poem: Poem[] = [];

    if (await RNFS.exists(pathCi)) {
        ci = await handleCi(pathCi);
    } else {
        console.log(`path ${pathCi} not exists`);
    }

    if (await RNFS.exists(pathShijing)) {
        shijing = await handleShijing(pathShijing);
    } else {
        console.log(`path ${pathShijing} not exists`);
    }

    if (await RNFS.exists(pathNalan)) {
        nalan = await handleNalan(pathNalan);
    } else {
        console.log(`path ${pathNalan} not exists`);
    }

    if (await RNFS.exists(pathPoem)) {
        poem = await handlePoem(pathPoem);
    } else {
        console.log(`path ${pathPoem} not exists`);
    }

    const lst = [...ci, ...shijing, ...nalan, ...poem];
    const tags = [];

    // ...
}