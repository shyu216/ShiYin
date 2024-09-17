import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {PanGestureHandler, State} from 'react-native-gesture-handler';
import usePoem from './utils/hooks/poem';
import colors from './utils/settings/colors';

const Home: React.FC = () => {
  const {
    poem,
    tags,
    log: poemLog,
    loading,
    fetchRdmPoem,
    fetchOldPoem,
  } = usePoem();

  useEffect(() => {
    fetchRdmPoem();
  }, []);

  const [log, setLog] = useState<string>('');
  useEffect(() => {
    if (poemLog) {
      setLog(poemLog);
    }
  }, [poemLog]);

  useEffect(() => {
    let timerId: NodeJS.Timeout;
    if (log) {
      timerId = setTimeout(() => {
        setLog('');
      }, 3000);
    }
    return () => {
      if (timerId) {
        clearTimeout(timerId);
      }
    };
  }, [log]);

  const handleGesture = (event: any) => {
    if (event.nativeEvent.state === State.END) {
      const {translationX} = event.nativeEvent;
      if (translationX > 50) {
        // Right swipe
        fetchOldPoem();
      } else if (translationX < -50) {
        // Left swipe
        fetchRdmPoem();
      }
    }
  };

  return (
    <PanGestureHandler onHandlerStateChange={handleGesture}>
      <View style={styles.container}>
        {loading ? (
          <></>
        ) : (
          poem && (
            <>
              <Text style={{fontSize: 36, paddingTop: 40}}>
                {poem.title} <Text style={{fontSize: 10}}>{poem.id}</Text>
              </Text>
              {poem.author && <Text style={{fontSize: 20}}>{poem.author}</Text>}
              {poem.chapter && poem.section && (
                <Text style={{fontSize: 20}}>
                  {poem.chapter} {poem.section}
                </Text>
              )}
              <ScrollView
                contentContainerStyle={{minHeight: '70%'}}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                horizontal={false}>
                <Text style={{fontSize: 18, textAlign: 'left', paddingTop: 20}}>
                  {poem.content}
                </Text>
              </ScrollView>
            </>
          )
        )}
      </View>
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    backgroundColor: colors.white,
  },
});

export default Home;
