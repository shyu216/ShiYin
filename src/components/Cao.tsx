import { Text, ScrollView, FlatList, View, StyleSheet } from 'react-native';
import caocao from '../assets/chinese-poetry/曹操诗集/caocao.json';

const Cao: React.FC = () => {
    return (
        <FlatList
            data={caocao}
            renderItem={({ item: poem, index }) => (
                <View style={styles.item} key={index}>
                    <Text>{poem.title}</Text>
                    <Text>{poem.paragraphs}</Text>
                </View>
            )}
            keyExtractor={(item, index) => index.toString()}
        />
    );
}


const styles = StyleSheet.create({
    item: {
        marginBottom: 10, // Adjust this value as needed
    },
});

export default Cao;