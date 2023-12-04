import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView, TouchableOpacity } from 'react-native';
import { openDatabase, executeSql, initDatabase } from '../utils/SQLiteHelper';
import Animated, { BounceIn, BounceInRight, FadeOut, FadeOutRight, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import Loading from './Loader';
import Icon from 'react-native-vector-icons/Fontisto'; // FontAwesome is an example, use the icon set that contains your icon
import Icon6 from 'react-native-vector-icons/FontAwesome6';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useQueue from '../utils/queue';
import useStack from '../utils/stack';
import { Badge, Button } from '@rneui/themed';
import LinearGradient from 'react-native-linear-gradient';

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
            console.log(err);
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

    const rotate = useSharedValue(0);

    const rotateStyles = useAnimatedStyle(() => {
        return {
            transform: [{ rotate: `${rotate.value}deg` }],
        };
    });

    const rotateAndFetch = () => {
        rotate.value = withTiming(rotate.value + 360, { duration: 1000 });
        fetchRdmPoem();
    };

    const scale = useSharedValue(1);

    const scaleStyles = useAnimatedStyle(() => {
        return {
            transform: [{ scale: scale.value }],
        };
    });

    const scaleAndFetch = () => {
        scale.value = withSpring(0.5, {}, () => {
            scale.value = withSpring(1);
        });
        fetchOldPoem();
    };

    const [showTag, setShowTag] = useState(false);

    return (
        <>
            {log && <Text>{log}</Text>}

            {loading ? <Loading /> :
                <Animated.View entering={BounceIn.delay(100)} exiting={FadeOut} >
                    <View style={styles.container}>
                        <ScrollView contentContainerStyle={{ alignItems: 'center', minHeight: "100%" }}>
                            {poem && <>

                                <Text style={{ fontSize: 22 }}>{poem.title}</Text>
                                {poem.author && <Text style={{ fontSize: 20 }}>{poem.author}</Text>}
                                {poem.chapter && poem.section && <Text style={{ fontSize: 18 }}>{poem.chapter} {poem.section}</Text>}
                                <Text style={{ fontSize: 16 }}>{poem.content}</Text>
                                <Text style={styles.poemId}>{poem.id}</Text>
                            </>}

                        </ScrollView>


                    </View>
                </Animated.View>}

            {showTag && <>

                <View style={styles.tags} >
                    {tags.map((tag, index) => (<Animated.View entering={BounceInRight.delay(100 * index)} exiting={FadeOutRight.delay(100 * index)} style={styles.item} key={index}>
                        <View >
                            <Button
                                ViewComponent={LinearGradient} // Don't forget this!
                                linearGradientProps={{
                                    colors: ["#FF9800", "#F44336"],
                                    start: { x: 0, y: 0.5 },
                                    end: { x: 1, y: 0.5 },
                                }}
                                buttonStyle={{
                                    borderColor: 'transparent',
                                    borderWidth: 0,
                                    borderRadius: 30,
                                }}
                                containerStyle={{
                                    marginHorizontal: 0,
                                    marginVertical: 0,
                                }}
                            >
                                {tag.tag}
                            </Button>
                        </View>
                    </Animated.View>
                    ))}
                </View>

            </>}

            <TouchableOpacity style={styles.tagButton} onPress={() => { setShowTag(!showTag) }}>
                <Animated.View style={scaleStyles}>
                    <Icon6 name="tags" size={48} color="rgb(255, 127, 80)" />
                </Animated.View>
            </TouchableOpacity>


            <TouchableOpacity style={styles.backwardButton} onPress={scaleAndFetch}>
                <Animated.View style={scaleStyles}>
                    <Icon6 name="backward-step" size={48} color="rgb(255, 127, 80)" />
                </Animated.View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.refreshButton} onPress={rotateAndFetch}>
                <Animated.View style={rotateStyles}>
                    <Icon name="spinner-refresh" size={48} color="rgb(255, 127, 80)" />
                </Animated.View>
            </TouchableOpacity>
        </>
    );
};

const styles = StyleSheet.create({
    item: {
        marginBottom: 10, // Adjust this value as needed
    },

    container: {
        backgroundColor: '#EFEFEF',
        borderRadius: 10, // 设置圆角的半径
        overflow: 'hidden', // 确保子组件不会溢出圆角边界
        margin: 100,
        padding: 10,
        // position: 'relative',

        width: '80%',
        height: '70%',
        minWidth: '80%', // Set minWidth as a percentage
        minHeight: '70%', // Set minHeight as a percentage

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

    tags: {
        position: 'absolute',
        right: 20,
        top: 100,
    },

    tagButton: {
        position: 'absolute',
        right: 20,
        top: 40,
    },

    poemId: {
        fontSize: 12,
        position: 'absolute',
        bottom: 5,
        textAlign: 'center', // Add this line
        width: '100%', // Add this line
    }
});

export default PoemComponent;