import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

function useQueue(maxLength = 100) {
  const [queue, setQueue] = useState<string[]>([]);

  // Load the queue from AsyncStorage when the component mounts
  useEffect(() => {
    const loadQueue = async () => {
      const storedQueue = await AsyncStorage.getItem('queue');
      if (storedQueue) {
        setQueue(JSON.parse(storedQueue));
      }
    };

    loadQueue();
  }, []);

  const enqueue = async (item: string) => {
    await setQueue((prevQueue) => {
      let newQueue;
      if (prevQueue.length >= maxLength) {
        // Remove the oldest item
        newQueue = [...prevQueue.slice(1), item];
      } else {
        newQueue = [...prevQueue, item];
      }

      // Store the queue in AsyncStorage
      AsyncStorage.setItem('queue', JSON.stringify(newQueue));

      return newQueue;
    });
  };

  const dequeue = async () => {
    await setQueue((prevQueue) => {
      const newQueue = prevQueue.slice(1);

      // Store the queue in AsyncStorage
      AsyncStorage.setItem('queue', JSON.stringify(newQueue));

      return newQueue;
    });
  };

  return [queue, enqueue, dequeue] as const;
}

export default useQueue;