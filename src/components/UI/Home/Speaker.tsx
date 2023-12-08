import React, { useEffect, useState } from 'react';
import { TouchableOpacity, Animated, StyleProp, ViewStyle } from 'react-native';
import Tts from 'react-native-tts';
import { Easing } from 'react-native-reanimated';
import { useSharedValue, withSpring, withTiming, withSequence, withRepeat, useAnimatedStyle } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/FontAwesome6'; // Assuming you're using FontAwesome. Replace with your actual icon library.
import styles from '../../Containers/Home'; // Assuming you have a styles.js file. Replace with your actual style file.
import colors from '../../../utils/settings/colors'; // Assuming you have a colors.js file. Replace with your actual color file.


interface SpeakerProps {
    content: string;
    style: StyleProp<ViewStyle>;
    setLog: (value: string) => void;
}

const Speaker: React.FC<SpeakerProps> = ({ content, style, setLog }) => {

    // const ANGLE = 20;
    // const TIME = 500;
    // const EASING = Easing.inOut(Easing.ease);
    useEffect(() => {
        Tts.addEventListener('tts-finish', event => {
            setSpeaking(false);
        });
    }, []);


    useEffect(() => {
        Tts.setDefaultLanguage('zh-HK');
        Tts.setDucking(true);
        Tts.engines().then(engines => setLog(engines[0].name));
        Tts.voices().then(voices => setLog(voices[0].name));
    }, []);
    const speak = () => {
        Tts.getInitStatus().then(() => {
            Tts.speak(content, {
                iosVoiceId: 'com.apple.ttsbundle.Moira-compact',
                rate: 0.5,
                androidParams: {
                    KEY_PARAM_PAN: -1,
                    KEY_PARAM_VOLUME: 0.5,
                    KEY_PARAM_STREAM: 'STREAM_MUSIC',
                }
            });
        }).catch(err => {
            setLog(err);
        });
    }
    const stop = () => {
        Tts.stop();
    }
    const speakValue2 = useSharedValue(0);
    const [speaking, setSpeaking] = useState(false);
    // useEffect(() => {
    //     if (speaking) {
    //         speakValue2.value = withSequence(
    //             // deviate left to start from -ANGLE
    //             withTiming(-ANGLE, { duration: TIME / 2, easing: EASING }),
    //             // wobble between -ANGLE and ANGLE 7 times
    //             withRepeat(
    //                 withTiming(ANGLE, {
    //                     duration: TIME,
    //                     easing: EASING,
    //                 }),
    //                 -1,
    //                 true
    //             )
    //         );
    //     } else {
    //         // speakerValue.value = withSpring(// speakerValue.value === 1 ? 0.7 : 1);

    //         // go back to 0 at the end
    //         speakValue2.value = withTiming(0, { duration: TIME / 2, easing: EASING })
    //     }
    // }, [speaking]);
    const speakerOnPress = () => {
        // speakerValue.value = withSpring(// speakerValue.value === 1 ? 0.7 : 1);
        if (!content) {
            return;
        }
        if (speaking) {
            stop();
            setSpeaking(false);
            // speakValue2.value = withTiming(0, { duration: TIME / 2, easing: EASING })
        } else {
            speak();
            setSpeaking(true);
        }
    }
    // const speakerValue = useSharedValue(1);
    // const speakerStyles = useAnimatedStyle(() => {
    //     return {
    //         // transform: [{ scale: // speakerValue.value }, { rotateZ: `${speakValue2.value}deg` }],
    //     };
    // });

    return (
        <TouchableOpacity style={style} onPress={speakerOnPress}>
            {/* <Animated.View style={speakerStyles}> */}
                <Icon name="headphones" size={38} color={colors.btn1} />
            {/* </Animated.View> */}
        </TouchableOpacity>
    );
};

export default Speaker;
