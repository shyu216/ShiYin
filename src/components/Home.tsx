import React, { useCallback, useEffect, useState } from 'react';
import { Button, View, Text, ActivityIndicator, StyleSheet, FlatList, ScrollView } from 'react-native';
import { openDatabase, executeSql, initDatabase } from '../utils/SQLiteHelper';

const usePoemWithTags = () => {
    const [poem, setPoem] = useState<any>();
    const [tags, setTags] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchPoemWithTags = useCallback(async () => {
        console.log('fetchPoemWithTags');
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

    useEffect(() => {
        console.log('handleEffect');
        fetchPoemWithTags();
    }, [fetchPoemWithTags]);

    return { poem, tags, log, loading, fetchPoemWithTags };
};



const PoemComponent: React.FC = () => {
    const { poem, tags, log, loading, fetchPoemWithTags } = usePoemWithTags();

    const [count, setCount] = useState(0);

    return (
        <ScrollView>
            <Text>Poem</Text>
            {poem && <>
                <Text>{poem.id}</Text>
                <Text>{poem.title}</Text>
                {poem.author && <Text>{poem.author}</Text>}
                {poem.chapter && poem.section && <Text>{poem.chapter} {poem.section}</Text>}
                <Text>{poem.content}</Text>
            </>}
            <FlatList
                data={tags}
                renderItem={({ item: tag, index }) => (
                    <View style={styles.item} key={index}>
                        <Text>{tag.tag}</Text>
                    </View>
                )}
                keyExtractor={(item, index) => index.toString()}
            />
            <Button title="刷新" onPress={fetchPoemWithTags} />
            <Text>{count}</Text>
            <Button title="计数" onPress={() => setCount(count + 1)} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    item: {
        marginBottom: 10, // Adjust this value as needed
    },
});

export default PoemComponent;