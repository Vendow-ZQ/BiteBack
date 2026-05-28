import type { EngagementStats, FeedVideo } from '../types';
import { coverAsset, videoAsset } from '../config/assets';

export const feedVideos: FeedVideo[] = [
  {
    id: '南科大食堂观察',
    type: 'video',
    title: '南方科技大学食堂吃一顿饭多少钱？今天带你实测一下 #南科大 #大学食堂 #深圳',
    videoUrl: videoAsset('video2.mp4'),
    coverUrl: coverAsset('20260528-162431.jpg')
  },
  {
    id: '京鼎香铜锅涮',
    type: 'video',
    title: '距南科大地铁站395m，晚饭想吃热乎的可以看这家 #深圳美食 #铜锅涮',
    videoUrl: videoAsset('video1.mp4'),
    coverUrl: coverAsset('20260528-162439.jpg')
  },
  { id: 'biteback_slot', type: 'biteback' },
  {
    id: '善良牛角包',
    type: 'video',
    title: '南科大学生餐厅上新奶龙炒饭！这也太可爱了吧 #南科大 #大学食堂 #奶龙',
    videoUrl: videoAsset('video3.mp4'),
    coverUrl: coverAsset('20260528-162445.jpg')
  },
  {
    id: '桃喜TOSEE',
    type: 'video',
    title: '南科大店6月即将开业！大家期待一下 #桃喜 #南科大 #新店开业',
    videoUrl: videoAsset('video4.mp4'),
    coverUrl: coverAsset('20260528-162452.jpg')
  }
];

export const fallbackFeedVideos: FeedVideo[] = [
  {
    id: '南科大食堂观察',
    type: 'video',
    title: '深圳美食探店｜今天吃什么 #南科大 #校园美食',
    videoUrl: videoAsset('video3.mp4'),
    coverUrl: coverAsset('20260528-162459.jpg')
  },
  {
    id: '桃喜TOSEE',
    type: 'video',
    title: '大学生日常｜干饭人的一天',
    videoUrl: videoAsset('video4.mp4'),
    coverUrl: coverAsset('20260528-162504.jpg')
  }
];

export const feedEngagements: EngagementStats[] = [
  { likes: 125000, comments: 3200, shares: 1500 },
  { likes: 83000, comments: 1100, shares: 892 },
  { likes: 256000, comments: 5800, shares: 3200 },
  { likes: 32000, comments: 892, shares: 567 },
  { likes: 567000, comments: 12300, shares: 8900 }
];

export const videoCovers = [
  coverAsset('20260528-162431.jpg'),
  coverAsset('20260528-162439.jpg'),
  coverAsset('20260528-162445.jpg'),
  coverAsset('20260528-162452.jpg'),
  coverAsset('20260528-162459.jpg'),
  coverAsset('20260528-162504.jpg'),
  coverAsset('20260528-162510.jpg')
];
