import React, { useCallback, useEffect, useRef, useState } from 'react';
import { openDatabase, executeSql, initDatabase } from '../SQLiteHelper';
import useStack from './stack';


const usePoem = () => {
    const [poem, setPoem] = useState<any>();
    const [tags, setTags] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [stack, push, pop] = useStack();

    const fetchRdmPoem = useCallback(async () => {
        console.log('fetchRdmPoem');
        setLoading(true);
        try {
            setTags([]);
            if (poem) {
                await push(poem.id);
            }


            const poemResults = await executeSql("SELECT * FROM Poems ORDER BY RANDOM() LIMIT 1");
            const newPoem = poemResults.rows.item(0);
            setPoem(newPoem);

            const tagIdsResults = await executeSql("SELECT tag_id FROM Poet_Tags WHERE poet_id = ?", [newPoem.id]);
            const tagIds = tagIdsResults.rows.raw().map(row => row.tag_id);

            const tagsResults = await executeSql(`SELECT * FROM Tags WHERE id IN (${tagIds.join(',')})`);
            const newTags = tagsResults.rows.raw();
            setTags(newTags);

            setLoading(false);
        } catch (err) {
            // console.log(err);
            setLog(err as string);
            setLoading(false);
        }
    }, [push]);

    const fetchOldPoem = useCallback(async () => {
        console.log('fetchOldPoem');
        setLoading(true);
        try {
            setTags([]);
            const popedPoemId = await pop();

            if (!popedPoemId) {
                setLoading(false);
                setLog('没有更多的诗了');
                return;
            }
            // console.log('popedPoemId', popedPoemId);

            const poemResults = await executeSql("SELECT * FROM Poems WHERE id = ?", [popedPoemId]);
            const newPoem = poemResults.rows.item(0);
            setPoem(newPoem);

            const tagIdsResults = await executeSql("SELECT tag_id FROM Poet_Tags WHERE poet_id = ?", [newPoem.id]);
            const tagIds = tagIdsResults.rows.raw().map(row => row.tag_id);

            const tagsResults = await executeSql(`SELECT * FROM Tags WHERE id IN (${tagIds.join(',')})`);
            const newTags = tagsResults.rows.raw();
            setTags(newTags);

            setLoading(false);
        } catch (err) {
            // console.log(err);
            setLog(err as string);
            setLoading(false);
        }
    }, [pop, push]);

    useEffect(() => {
        // console.log('stack', stack);
    }, [stack]);

    const [log, setLog] = useState<string>();

    useEffect(() => {
        const init = async () => {
            const openResult = await openDatabase();
            setLog(openResult);
            const initResult = await initDatabase();
            setLog(initResult);
        };
        init();
    }, []);

    return { poem, tags, log, loading, fetchRdmPoem, fetchOldPoem };
};

export default usePoem;