import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { openDatabase, executeSql, closeDatabase } from '../utils/SQLiteHelper';

const PoemComponent: React.FC = () => {
    const [poems, setPoems] = useState<any>();
    useEffect(() => {
        // 打开数据库
        openDatabase();

        // 执行 SQL 语句
        executeSql("SELECT * FROM sqlite_master WHERE type='table'").then((results) => {
            let rows = results.rows.raw();
            console.log(rows);
            setPoems(rows);
        });

        // 关闭数据库
        return () => {
            closeDatabase();
        };
    }, []);

    return (
        <View>
            <Text>Poem Component</Text>
            {poems && poems.map((poem: any) => {
                return (
                    <View key={poem.id}>
                        <Text>{poem.title}</Text>
                        <Text>{poem.author}</Text>
                        <Text>{poem.content}</Text>
                    </View>
                );
            })}
               
        </View>
    );
};

export default PoemComponent;