import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

function useAsyncStack() {
    const [stack, setStack] = useState<string[]>([]);

    // Load the stack from AsyncStorage when the component mounts
    useEffect(() => {
        const loadStack = async () => {
            console.log("loadStack");
            const storedStack = await AsyncStorage.getItem('records');
            if (storedStack) {
                setStack(JSON.parse(storedStack));
            }
        };

        loadStack();
    }, []);

    useEffect(() => {
        AsyncStorage.setItem('records', JSON.stringify(stack));
      }, [stack]);

    const push = async (item: string) => {
        console.log("push: ", item);
        const newStack = [...stack, item];
        setStack(newStack);
    };

    const pop = async (): Promise<string> => {
        if (stack.length === 0) {
            return '';
        }
        const poppedItem = stack[stack.length - 1];
        console.log("pop: ", poppedItem);
        const newStack = stack.slice(0, -1);
        setStack(newStack);
        return poppedItem;
    };

    return [stack, push, pop] as const;
}

export default useAsyncStack;