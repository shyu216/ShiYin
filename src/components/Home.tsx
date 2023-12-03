import React, { useCallback, useEffect, useState } from 'react';
import { Button, View, Text, ActivityIndicator } from 'react-native';
import { openDatabase, executeSql, initDatabase } from '../utils/SQLiteHelper';

const usePoemWithTags = () => {
    const [poem, setPoem] = useState<any>();
    const [tags, setTags] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchPoemWithTags = useCallback(async () => {
        setLoading(true);
        try {
            const poemResults = await executeSql("SELECT * FROM Poems ORDER BY RANDOM() LIMIT 1");
            const poem = poemResults.rows.item(0);
            setPoem(poem);

            const tagIdsResults = await executeSql("SELECT tag_id FROM Poet_Tags WHERE poet_id = ?", [poem.id]);
            const tagIds = tagIdsResults.rows.raw().map(row => row.tag_id);

            const tagsResults = await executeSql(`SELECT * FROM Tags WHERE id IN (${tagIds.join(',')})`);
            const tags = tagsResults.rows.raw();
            setTags(tags);

            setLoading(false);
        } catch (err) {
            console.log(err);
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        openDatabase();
        initDatabase();
        fetchPoemWithTags();
    }, [fetchPoemWithTags]);

    return { poem, tags, loading, fetchPoemWithTags };
};



const PoemComponent: React.FC = () => {
    const { poem, tags, fetchPoemWithTags } = usePoemWithTags();


    return (
        <View>
            <Text>Poem</Text>
            {poem && (
                <>
                    <Text>{poem.id}</Text>
                    <Text>{poem.title}</Text>
                    {poem.author && <Text>{poem.author}</Text>}
                    {poem.chapter && poem.section && <Text>{poem.chapter} {poem.section}</Text>}
                    <Text>{poem.content}</Text>
                </>
            )}
            {tags.map(tag => (
                <Text key={tag.id}>{tag.tag}</Text>
            ))}
            <Button title="Load new poem" onPress={fetchPoemWithTags} />
        </View>
    );
};


export default PoemComponent;