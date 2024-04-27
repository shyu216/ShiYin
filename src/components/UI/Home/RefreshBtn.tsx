import React from 'react';
import { TouchableOpacity, ViewStyle, StyleProp } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome6';
// import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';


interface RefreshBtnProps {
    setIsFetchNew: (value: boolean) => void;
    fetchRdmPoem: () => void;
    style: StyleProp<ViewStyle>;
    color: string;
}

const RefreshBtn: React.FC<RefreshBtnProps> = ({ setIsFetchNew, fetchRdmPoem, style, color }) => {
    // const rotate = useSharedValue(0);

    // const rotateStyles = useAnimatedStyle(() => {
    //     return {
    //         transform: [{ rotate: `${rotate.value * 360}deg` }],
    //     };
    // });

    const rotateAndFetch = () => {
        setIsFetchNew(true);

        // const duration = 2000;
        // const easing = Easing.bezier(0.25, -0.5, 0.25, 1);

        // rotate.value = withTiming(rotate.value + 1, { duration, easing });
        fetchRdmPoem();
    };

    return (
        <TouchableOpacity style={style} onPress={rotateAndFetch}>
            {/* <Animated.View style={rotateStyles}> */}
                <Icon name="angles-right" size={44} color={color} />
            {/* </Animated.View> */}
        </TouchableOpacity>
    );
};

export default RefreshBtn;