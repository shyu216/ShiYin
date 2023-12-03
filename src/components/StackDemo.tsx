import React from 'react';
import { Button, View, Text } from 'react-native';
import useAsyncStack from '../utils/stack';

function DemoPage() {
  const [stack, push, pop] = useAsyncStack();

  const handlePush = async () => {
    await push('新的元素');
  };

  const handlePop = async () => {
    const poppedItem = await pop();
    alert(`弹出的元素是: ${poppedItem}`);
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>栈的内容: {JSON.stringify(stack)}</Text>
      <Button title="添加元素" onPress={handlePush} />
      <Button title="弹出元素" onPress={handlePop} />
    </View>
  );
}

export default DemoPage;