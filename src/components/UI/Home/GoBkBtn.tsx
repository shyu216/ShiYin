import React from 'react';
import { TouchableOpacity, ViewStyle, StyleProp } from 'react-native';
import Icon6 from 'react-native-vector-icons/FontAwesome6';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';

interface GoBkBtnProps {
    setIsFetchNew: (value: boolean) => void;
    fetchOldPoem: () => void;
    style: StyleProp<ViewStyle>;
    color: string;
}

const GoBkBtn: React.FC<GoBkBtnProps> = ({ setIsFetchNew, fetchOldPoem, style, color }) => {
    const rotate = useSharedValue(0);

    const rotateStyles = useAnimatedStyle(() => {
        return {
            transform: [{ rotate: `${rotate.value * 360}deg` }],
        };
    });

    const rotateAndFetch = () => {
        setIsFetchNew(false);

        const duration = 2000;
        const easing = Easing.bezier(0, -0.20, 0, 1.20);

        rotate.value = withTiming(rotate.value - 1, { duration, easing });
        fetchOldPoem();
    };

    return (
        <TouchableOpacity style={style} onPress={rotateAndFetch}>
            {/* <Animated.View style={rotateStyles}> */}
                <Icon6 name="angles-left" size={44} color={color} />
            {/* </Animated.View> */}
        </TouchableOpacity>
    );
};

export default GoBkBtn;