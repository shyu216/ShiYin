import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import usePoem from './utils/hooks/poem';

const Home: React.FC = () => {
  const { poem, log: poemLog, loading, fetchRdmPoem } = usePoem();
  const [log, setLog] = useState<string>('');

  useEffect(() => {
    fetchRdmPoem();
  }, []);

  useEffect(() => {
    if (poemLog) setLog(poemLog);
  }, [poemLog]);

  useEffect(() => {
    if (log) {
      const timerId = setTimeout(() => setLog(''), 3000);
      return () => clearTimeout(timerId);
    }
  }, [log]);

  return (
    <View style={styles.page}>
      {!loading && poem && (
        <View style={styles.container}>
          <Text style={{ fontSize: 24 }}>
            {poem.title} <Text style={{ fontSize: 10 }}>{poem.id}</Text>
          </Text>
          {poem.author && <Text style={{ fontSize: 20 }}>{poem.author}</Text>}
          {poem.chapter && poem.section && (
            <Text style={{ fontSize: 20 }}>
              {poem.chapter} {poem.section}
            </Text>
          )}
          <ScrollView
            contentContainerStyle={{ minHeight: '70%' }}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
          >
            <Text style={{ fontSize: 18, textAlign: 'left', paddingTop: 20 }}>
              {poem.content}
            </Text>
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00FCFF',
  },
  container: {
    overflow: 'hidden',
    margin: 100,
    padding: 30,
    width: '100%',
    height: '100%',
    minWidth: '100%',
    minHeight: '100%',
    position: 'relative',
  },
  log: {
    position: 'absolute',
    bottom: 35,
  },
});

export default Home;