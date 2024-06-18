import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView, TouchableOpacity, ImageBackground, Image } from 'react-native';
import colors from '../../utils/settings/colors';
import usePoem from '../../utils/hooks/poem';
import RefreshBtn from '../Buttons/RefreshBtn';
import GoBkBtn from '../Buttons/GoBkBtn';



const PoemCard: React.FC = () => {
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


    const [isFetchNew, setIsFetchNew] = useState(true);


    return (
        <>
            {loading ? <></> :

                <View style={styles.container}>
                    {poem && <>
                        <Text style={{ fontSize: 24 }}>{poem.title} <Text style={{ fontSize: 10 }}>{poem.id}</Text></Text>
                        {poem.author && <Text style={{ fontSize: 20 }}>{poem.author}</Text>}
                        {poem.chapter && poem.section && <Text style={{ fontSize: 20 }}>{poem.chapter} {poem.section}</Text>}
                        <ScrollView contentContainerStyle={{ minHeight: "70%" }}
                            showsVerticalScrollIndicator={false}
                            showsHorizontalScrollIndicator={false}
                            horizontal={false}
                        >
                            <Text style={{ fontSize: 18, textAlign: 'left', paddingTop: 20 }}>{poem.content}</Text>
                        </ScrollView>
                    </>}
                </View>
            }

            <GoBkBtn setIsFetchNew={setIsFetchNew} fetchOldPoem={fetchOldPoem} style={styles.backwardButton} color={colors.btn1} />
            <RefreshBtn setIsFetchNew={setIsFetchNew} fetchRdmPoem={fetchRdmPoem} style={styles.refreshButton} color={colors.btn1} />
        </>
    );
};

export const styles = StyleSheet.create({

    container: {
        // backgroundColor: colors.white,
        // borderRadius: 10, // 设置圆角的半径
        overflow: 'hidden', // 确保子组件不会溢出圆角边界
        margin: 100,
        padding: 30,

        width: '100%',
        height: '100%',
        minWidth: '100%', // Set minWidth as a percentage
        minHeight: '100%', // Set minHeight as a percentage

        position: 'relative',
    },

    refreshButton: {
        position: 'absolute',
        right: 24,
        bottom: 24,
    },

    backwardButton: {
        position: 'absolute',
        right: 24,
        bottom: 72,
    },

    log: {
        position: 'absolute',
        bottom: 35,
    }
});


export default PoemCard;