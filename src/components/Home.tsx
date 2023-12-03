import React, { useCallback, useEffect, useState } from 'react';
import { Button, View, Text, StyleSheet, FlatList, ScrollView, TouchableOpacity } from 'react-native';
import { openDatabase, executeSql, initDatabase } from '../utils/SQLiteHelper';
import { BounceIn, FadeOut } from 'react-native-reanimated';
import Animated from 'react-native-reanimated';
import Loading from './Loader';
import Icon from 'react-native-vector-icons/Fontisto'; // FontAwesome is an example, use the icon set that contains your icon
import Icon6 from 'react-native-vector-icons/FontAwesome6';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useQueue from '../utils/queue';
import useStack from '../utils/stack';


const usePoem = () => {
    const [poem, setPoem] = useState<any>();
    const [tags, setTags] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [stack, push, pop] = useStack();

    const fetchRdmPoem = useCallback(async () => {
        console.log('fetchRdmPoem');
        setLoading(true);
        try {
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
            console.log(err);
            setLoading(false);
        }
    }, [push]);

    const fetchOldPoem = useCallback(async () => {
        console.log('fetchOldPoem');
        setLoading(true);
        try {
            const popedPoemId = await pop();

            if (!popedPoemId) {
                setLoading(false);
                setLog('没有更多的诗了');
                return;
            }
            console.log('popedPoemId', popedPoemId);

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
            console.log(err);
            setLoading(false);
        }
    }, [pop, push]);

    useEffect(() => {
        console.log('stack', stack);
    }, [stack]);

    const [log, setLog] = useState<string>();
    useEffect(() => {
        setTimeout(() => {
            setLog('');
        }, 3000);
    }, [log]);


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



const PoemComponent: React.FC = () => {
    const { poem, tags, log, loading, fetchRdmPoem, fetchOldPoem } = usePoem();

    useEffect(() => {
        fetchRdmPoem();
    }, []);

    return (
        <>
            {log && <Text>{log}</Text>}

            {loading ? <Loading /> :
                <Animated.View entering={BounceIn} exiting={FadeOut} >

                    <View style={styles.container}>
                        <ScrollView>
                            <Text>Poem</Text>
                            {poem && <>
                                <Text>{poem.id}</Text>
                                <Text>{poem.title}</Text>
                                {poem.author && <Text>{poem.author}</Text>}
                                {poem.chapter && poem.section && <Text>{poem.chapter} {poem.section}</Text>}
                                <Text>{poem.content}</Text>
                            </>}
                        </ScrollView>

                        <FlatList
                            data={tags}
                            renderItem={({ item: tag, index }) => (
                                <View style={styles.item} key={index}>
                                    <Text>{tag.tag}</Text>
                                </View>
                            )}
                            keyExtractor={(item, index) => index.toString()}
                        />
                    </View>
                </Animated.View>}

            <TouchableOpacity style={styles.backwardButton} onPress={fetchOldPoem}>
                <Icon6 name="backward-step" size={48} color="rgb(255, 127, 80)" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.refreshButton} onPress={fetchRdmPoem}>
                <Icon name="spinner-refresh" size={48} color="rgb(255, 127, 80)" />
            </TouchableOpacity>
        </>
    );
};

const styles = StyleSheet.create({
    item: {
        marginBottom: 10, // Adjust this value as needed
    },

    container: {
        backgroundColor: '#FFFFFF',
        borderRadius: 10, // 设置圆角的半径
        overflow: 'hidden', // 确保子组件不会溢出圆角边界
        margin: 100,
        padding: 10,

        width: 300,
        height: 600,
    },

    refreshButton: {
        position: 'absolute',
        right: 20,
        bottom: 20,
    },

    backwardButton: {
        position: 'absolute',
        left: 20,
        bottom: 20,
    },
});

export default PoemComponent;