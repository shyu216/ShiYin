import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView, TouchableOpacity, ImageBackground, Image } from 'react-native';
import Animated, { BounceIn, BounceInRight, Easing, FadeIn, FadeInLeft, FadeInRight, FadeOut, FadeOutLeft, FadeOutRight, RotateInDownLeft, RotateInDownRight, RotateOutUpLeft, RotateOutUpRight, interpolateColor, useAnimatedStyle, useSharedValue, withDelay, withRepeat, withSequence, withSpring, withTiming } from 'react-native-reanimated';
import Loading from '../Common/Loader';
import colors from '../../utils/settings/colors';
import usePoem from '../../utils/hooks/poem';
import RefreshBtn from '../UI/Home/RefreshBtn';
import GoBkBtn from '../UI/Home/GoBkBtn';
import TagButtons from '../UI/Home/TagBtns';
import Speaker from '../UI/Home/Speaker';



const PoemComponent: React.FC = () => {
    const { poem, tags, log: poemLog, loading, fetchRdmPoem, fetchOldPoem } = usePoem();

    useEffect(() => {
        fetchRdmPoem();
    }, []);
    const [log, setLog] = useState<string>("");
    useEffect(() => {
        if (poemLog) {
            setLog(poemLog);
        }
    }, [poemLog]);
    useEffect(() => {
        let timerId: NodeJS.Timeout;
        if (log) {
            timerId = setTimeout(() => {
                setLog('');
            }, 3000);
        }
        return () => {
            if (timerId) {
                clearTimeout(timerId);
            }
        };
    }, [log]);



    const processContent = (content: string) => {
        // split poem.content if one line is too long
        const lines = content.split('\n');

        const processedLines = lines.flatMap(line => {
            console.log('line', line);
            let subLines = line.split(/[，；？！、]/).map(s => s.trim()).join('\t').split(/[。]/).map(s => s.trim()).filter(Boolean);
            return subLines.join('\t');
        });

        console.log('processedLines', processedLines);
        return processedLines.join('\n');
    }

    const [isFetchNew, setIsFetchNew] = useState(true);



    const progress = useSharedValue(0);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            backgroundColor: interpolateColor(
                progress.value,
                [0, 1],
                [colors.bg1, colors.bg2]
            ),
        };
    });

    useEffect(() => {
        progress.value = withRepeat(withSequence(
            withTiming(progress.value + 1, { duration: 2000, easing: Easing.linear }),
            withDelay(200, withTiming(progress.value - 1, { duration: 2000, easing: Easing.linear }))), -1)
    }, []);


    return (
        <>
            <Animated.View style={[styles.page, animatedStyle]} >

                {loading ? <></> :

                    <Animated.View entering={
                        isFetchNew ? FadeInRight.delay(600) : FadeInLeft.delay(600)
                    } exiting={
                        isFetchNew ? FadeOutLeft : FadeOutRight
                    } >
                        <View style={styles.container}>
                            <ScrollView contentContainerStyle={{ alignItems: 'center', minHeight: "100%" }}>
                                {poem && <>

                                    <Text style={{ fontSize: 24 }}>{poem.title}</Text>
                                    {poem.author && <Text style={{ fontSize: 20 }}>{poem.author}</Text>}
                                    {poem.chapter && poem.section && <Text style={{ fontSize: 20 }}>{poem.chapter} {poem.section}</Text>}
                                    <Text style={{ fontSize: 18, textAlign: 'center', paddingTop: 20 }}>{processContent(poem.content)}</Text>
                                    <Text style={styles.poemId}>{poem.id}</Text>
                                </>}

                            </ScrollView>

                            <Image
                                source={require('../../assets/images/bg4.png')}
                                style={styles.bgImage}
                            />
                        </View>
                    </Animated.View>}

                <Speaker content={poem?.content ?? ''} style={styles.speakerButton} setLog={setLog} />
                <TagButtons tags={tags} style={styles.tagButton} color={colors.btn1} />
                <GoBkBtn setIsFetchNew={setIsFetchNew} fetchOldPoem={fetchOldPoem} style={styles.backwardButton} color={colors.btn1} />
                <RefreshBtn setIsFetchNew={setIsFetchNew} fetchRdmPoem={fetchRdmPoem} style={styles.refreshButton} color={colors.btn1} />

                {log && <Text style={styles.log}>{log}</Text>}

            </Animated.View>
        </>
    );
};

export const styles = StyleSheet.create({

    container: {
        backgroundColor: colors.white,
        borderRadius: 10, // 设置圆角的半径
        overflow: 'hidden', // 确保子组件不会溢出圆角边界
        margin: 100,
        padding: 10,
        // position: 'relative',

        width: 300,
        height: 500,
        minWidth: 300, // Set minWidth as a percentage
        minHeight: 500, // Set minHeight as a percentage

        position: 'relative',
    },

    refreshButton: {
        position: 'absolute',
        right: 24,
        bottom: 24,
    },

    backwardButton: {
        position: 'absolute',
        left: 22,
        bottom: 24,
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

    tagClsButton: {
        position: 'absolute',
        right: 24,
        top: 48,
    },

    poemId: {
        fontSize: 12,
        position: 'absolute',
        bottom: 5,
        textAlign: 'center', // Add this line
        width: '100%', // Add this line
    },

    speakerButton: {
        position: 'absolute',
        left: 24,
        top: 44,
    },

    loader: {
        position: 'absolute',
        bottom: 15,
    },

    log: {
        position: 'absolute',
        bottom: 35,
    },

    page: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    bgImage: {
        position: 'absolute',
        resizeMode: 'contain',
        width: 100,
        opacity: 0.5,
        bottom: -220,
        right: -14,
    }
});


export default PoemComponent;