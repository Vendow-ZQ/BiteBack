import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 8004;

app.use(cors());
app.use(express.json());

// 静态文件服务 - 用于访问上传的视频/图片
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Mock 数据存储
let mockData = {
  userProfile: {
    userId: "u_001",
    locationAuthorized: true,
    biteBackExposureToday: 0,
    negativeFeedbackTags: [],
    closedBiteBack: false
  },
  foodMemories: [
    {
      memoryId: "m_001",
      videoId: "v_001",
      coverUrl: "/uploads/covers/video1.jpg",
      videoUrl: "/uploads/videos/video1.mp4",
      title: "这家牛肉面真的香迷糊了",
      shopName: "老巷牛肉面",
      poiId: "poi_001",
      businessArea: "南科大",
      category: "面馆",
      dishTags: ["牛肉面", "红油抄手"],
      memoryLevel: "A",
      memoryStrength: 0.82,
      poiConfidence: 0.91,
      distanceM: 900,
      price: 38,
      isOpen: true,
      shopQuality: 0.88,
      dealAvailable: true,
      lastInteractionDays: 43
    }
  ]
};

// 获取用户信息
app.get('/api/user/profile', (req, res) => {
  res.json(mockData.userProfile);
});

// 获取 Food Memories
app.get('/api/memories', (req, res) => {
  res.json(mockData.foodMemories);
});

// 搜索接口
app.post('/api/search', (req, res) => {
  const { query } = req.body;
  res.json({
    query,
    queryIntent: query.includes('猫咪') ? 'other' : 'food_decision',
    searchedAt: Date.now(),
    results: mockData.foodMemories.filter(m =>
      m.shopName.includes(query) ||
      m.category.includes(query) ||
      m.businessArea.includes(query)
    )
  });
});

// Gate 检查接口
app.post('/api/gate/check', (req, res) => {
  const { searchSession, feedState } = req.body;

  // 六大 Gate 逻辑
  const within15m = searchSession.returnedToFeedAt - searchSession.searchedAt <= 15 * 60 * 1000;
  const foodIntent = searchSession.queryIntent === 'food_decision';
  const noConversion = !searchSession.completedPoiAction && !searchSession.completedDealAction;
  const hasQualifiedMemory = mockData.foodMemories.some(m =>
    ['S', 'A', 'B'].includes(m.memoryLevel) && m.poiConfidence >= 0.85
  );

  res.json({
    eligibility: within15m && foodIntent && noConversion && hasQualifiedMemory,
    attribution: noConversion,
    feedGuardrail: feedState.normalVideosConsumed >= 2,
    quality: true,
    frequency: true,
    business: true,
    allPassed: within15m && foodIntent && noConversion && hasQualifiedMemory && feedState.normalVideosConsumed >= 2
  });
});

// 上传接口（用于接收用户上传的抖音视频/图片）
app.post('/api/upload', (req, res) => {
  // 这里简化处理，实际应该用 multer
  res.json({ message: '上传功能待实现，请将文件放入 backend/uploads 目录' });
});

app.listen(PORT, () => {
  console.log(`🚀 BiteBack Backend running on http://localhost:${PORT}`);
  console.log(`📁 Uploads directory: ${path.join(__dirname, 'uploads')}`);
});
