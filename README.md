# 想做一个UI好看的诗词卡片应用

多读书多看报，少吃零食多睡觉。

数据来自[chinese-poetry: 最全中文诗歌古典文集数据库](https://github.com/chinese-poetry/chinese-poetry)，感谢。

- [x] 支持唐诗三百首、宋词三百首、诗经、纳兰性德。
- [x] 随机刷新、历史回滚。
- [x] React Native + Sqlite。

# 截图

<img src="./snapshots/Screenshot_20240917_235234.png" width="300">

# 部署

```
yarn install

yarn start

// in another terminal
yarn android
```

# 打包

```
cd android
./gradlew assembleRelease
```