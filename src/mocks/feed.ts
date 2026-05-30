import type { EngagementStats, FeedVideo } from '../types';
import { coverAsset, videoAsset } from '../config/assets';

export const feedVideos: FeedVideo[] = [
  {
    id: '超大里脊肉饼',
    type: 'video',
    title: '放假回来继续卖超大里脊肉饼，今天又有哪些同学过来点单呢？#南科大 #校园小吃',
    videoUrl: videoAsset('video2.mp4'),
    coverUrl: coverAsset('20260528-162431.jpg')
  },
  {
    id: '朱莉吃深圳',
    type: 'video',
    title: '南科大附近的宝藏美食，量大管饱。你来看看更喜欢哪一家吧。#深圳美食 #南科大',
    videoUrl: videoAsset('video1.mp4'),
    coverUrl: coverAsset('20260528-162439.jpg')
  },
  { id: 'biteback_slot', type: 'biteback' },
  {
    id: '聪哥说留学',
    type: 'video',
    title: '探店南科大的食堂，看看学生党一顿饭怎么吃得舒服又划算。#南科大 #大学食堂',
    videoUrl: videoAsset('video3.mp4'),
    coverUrl: coverAsset('20260528-162445.jpg')
  },
  {
    id: '老外小博',
    type: 'video',
    title: '探店南科大的校园美食，第一次来就被食堂和周边小店惊喜到了。#南科大 #校园美食',
    videoUrl: videoAsset('video4.mp4'),
    coverUrl: coverAsset('20260528-162452.jpg')
  }
];

export const fallbackFeedVideos: FeedVideo[] = [
  {
    id: '聪哥说留学',
    type: 'video',
    title: '探店南科大的食堂，看看学生党一顿饭怎么吃得舒服又划算。#南科大 #大学食堂',
    videoUrl: videoAsset('video3.mp4'),
    coverUrl: coverAsset('20260528-162459.jpg')
  },
  {
    id: '老外小博',
    type: 'video',
    title: '探店南科大的校园美食，第一次来就被食堂和周边小店惊喜到了。#南科大 #校园美食',
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
