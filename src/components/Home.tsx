import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { openDatabase, executeSql, initDatabase, } from '../utils/SQLiteHelper';

const PoemComponent: React.FC = () => {
    const [poem, setPoem] = useState<any>();
    const [id, setId] = useState<number>(0);
    useEffect(() => {
        // 打开数据库
        openDatabase();
        initDatabase();


        // 1 to 1000, random
        const num = Math.floor(Math.random() * 1000) + 1
        console.log('num', num);
        setId(num);



        // 执行 SQL 语句
        executeSql("SELECT * FROM Poems WHERE id = ?", [num]).then((results) => {
            console.log('results', results);
            const len = results.rows.length;
            console.log('len', len);
            setPoem(results.rows.item(0));
        }).catch((err) => {
            console.log(err);
        });




        // // 关闭数据库
        // return () => {
        //     closeDatabase();
        // };
    }, []);

    return (
        <View>
            <Text>Poem</Text>
            <Text>{poem && poem.id}</Text>
            <Text>{poem && poem.title}</Text>
            <Text>{poem && poem.author}</Text>
            <Text>{poem && poem.content}</Text>
        </View>
    );
};

export default PoemComponent;