import React from 'react';
import { TouchableOpacity, ViewStyle, StyleProp } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


interface RefreshBtnProps {
    setIsFetchNew: (value: boolean) => void;
    fetchRdmPoem: () => void;
    style: StyleProp<ViewStyle>;
    color: string;
}

const RefreshBtn: React.FC<RefreshBtnProps> = ({ setIsFetchNew, fetchRdmPoem, style, color }) => {

    const rotateAndFetch = () => {
        setIsFetchNew(true);
        fetchRdmPoem();
    };

    return (
        <TouchableOpacity style={style} onPress={rotateAndFetch}>
                <Icon name="arrow-right-bold-circle-outline" size={44} color={color} />
        </TouchableOpacity>
    );
};

export default RefreshBtn;