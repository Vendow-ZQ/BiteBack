import type { SearchResultCard } from '../types';
import { coverAsset } from '../config/assets';

export const defaultSearchQuery = '南科大美食';

export const searchSuggestions = [
  '南科大美食',
  '南科大附近晚饭',
  '南科大附近美食推荐',
  '南科大宝能城美食',
  '南山烧烤',
  '猫咪视频'
];

export const searchTabs = ['综合', '视频', '直播', '团购', '图文', '用户'];

export const relatedSearches = [
  '南科大美食一条街',
  '南科大附近美食推荐',
  '南科大宝能城美食',
  '南科大小吃街',
  '南科大美食探店',
  '南科大小吃街'
];

export const searchResultCards: SearchResultCard[] = [
  {
    id: 'r1',
    image: coverAsset('20260528-162431.jpg'),
    title: '在南方科技大学食堂，吃饭多少钱？ #今天吃什么 #南科大',
    author: '聪哥留学探校',
    date: '2024.10.16',
    likes: 407,
    duration: '01:31',
    multi: false
  },
  {
    id: 'r2',
    image: coverAsset('20260528-162439.jpg'),
    title: '很不错的高校合作 临时档口就是人人都爱逛',
    author: '尖叫鸡',
    date: '2天前',
    likes: 26,
    multi: true
  },
  {
    id: 'r3',
    image: coverAsset('20260528-162452.jpg'),
    title: '介绍在南科食堂以及点外卖遇到的好吃的 #校园美食',
    author: '日落前',
    date: '2022.09.14',
    likes: 208,
    multi: true
  },
  {
    id: 'r4',
    image: coverAsset('20260528-162504.jpg'),
    title: '桃喜南科大店 6月即将开业！#深圳探店 #桃喜',
    author: '桃喜TOSEE',
    date: '2025.05.27',
    likes: 2,
    multi: true
  },
  {
    id: 'r5',
    image: coverAsset('20260528-162510.jpg'),
    title: '南科Vlog｜又是纯摆的一天 这个系列快更完',
    author: '善良牛角包',
    date: '04.18',
    likes: 517,
    duration: '03:43',
    multi: false
  }
];
