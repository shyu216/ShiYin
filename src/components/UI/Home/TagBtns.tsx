import { useState } from 'react';
// import Animated, { useSharedValue, useAnimatedStyle, withTiming, FadeIn, BounceInRight, FadeOutRight } from 'react-native-reanimated';
import React from 'react';
import { TouchableOpacity, ViewStyle, StyleProp, View } from 'react-native';
import IconMC from 'react-native-vector-icons/MaterialCommunityIcons';
import IconA from 'react-native-vector-icons/AntDesign';
import LinearGradient from 'react-native-linear-gradient';
import colors from '../../../utils/settings/colors';
import { Badge, Button } from '@rneui/themed';


interface TagButtonsProps {
    tags: any[];
    style: StyleProp<ViewStyle>;
    color: string;
}

const TagButtons: React.FC<TagButtonsProps> = ({ tags, style, color }) => {
    const [showTag, setShowTag] = useState(false);
    // const tagAniValue = useSharedValue(0);

    // const tagAniStyles = useAnimatedStyle(() => {
    //     return {
    //         transform: [{ translateX: tagAniValue.value }],
    //     };
    // });

    const tagOnPress = () => {
        // tagAniValue.value = withTiming(tagAniValue.value === 0 ? 100 : 0, { duration: 1000 });
        setShowTag(!showTag);
    };

    return (
        <>
            <View style={style}>
                <TouchableOpacity style={{
                    position: 'relative',
                }} onPress={tagOnPress}>
                    {/* <Animated.View style={tagAniStyles}> */}
                        <IconMC name="tag-multiple-outline" size={54} color={color} />
                    {/* </Animated.View> */}
                </TouchableOpacity>
                <TouchableOpacity style={{
                    position: 'absolute',
                    right: 10,
                    top: 10,
                }} onPress={tagOnPress}>
                    {showTag && (
                        // <Animated.View entering={FadeIn.delay(600)}>
                            <IconA name="closecircleo" size={36} color={color} />
                        // </Animated.View>
                    )}
                </TouchableOpacity>
                {showTag &&
                    <View style={{
                        position: 'absolute',
                        paddingVertical: 60,
                        right: 0,
                    }} >

                        {tags.map((tag, index) => (
                            // <Animated.View entering={BounceInRight.delay(100 * index)} exiting={FadeOutRight.delay(100 * index)} style={{
                            //     marginBottom: 10, // Adjust this value as needed
                            // }} key={index}>
                                <Button style={{
                                    width: 100
                                }}
                                    ViewComponent={LinearGradient} // Don't forget this!
                                    linearGradientProps={{
                                        colors: [colors.btn1, colors.btn2],
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
                            // </Animated.View>
                        ))}
                    </View>
                }
            </View>
        </>
    );
};

export default TagButtons;

