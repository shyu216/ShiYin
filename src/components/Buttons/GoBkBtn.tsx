import React from 'react';
import { TouchableOpacity, ViewStyle, StyleProp } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface GoBkBtnProps {
    setIsFetchNew: (value: boolean) => void;
    fetchOldPoem: () => void;
    style: StyleProp<ViewStyle>;
    color: string;
}

const GoBkBtn: React.FC<GoBkBtnProps> = ({ setIsFetchNew, fetchOldPoem, style, color }) => {

    const rotateAndFetch = () => {
        setIsFetchNew(false);

        // const duration = 2000;
        // const easing = Easing.bezier(0, -0.20, 0, 1.20);

        // rotate.value = withTiming(rotate.value - 1, { duration, easing });
        fetchOldPoem();
    };

    return (
        <TouchableOpacity style={style} onPress={rotateAndFetch}>
                <Icon name="arrow-left-bold-circle-outline" size={44} color={color} />
        </TouchableOpacity>
    );
};

export default GoBkBtn;