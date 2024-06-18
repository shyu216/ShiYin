import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import PoemCard from './PoemCard';


const Home: React.FC = () => {

    return (
        <>
            <View style={styles.page}>
                <Image
                    source={require('../../assets/images/bg4.png')}
                    style={styles.bgImage}
                />

                <PoemCard />
                
            </View>
           
        </>
    );
};

export const styles = StyleSheet.create({

    page: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    bgImage: {
        position: 'absolute',
        resizeMode: 'contain',
        width: 150,
        opacity: 0.5,
        bottom: -190,
        right: -0,
    }
});


export default Home;