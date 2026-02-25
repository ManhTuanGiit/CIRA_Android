# Cirarn - Photo Diary & Sharing App

> Ứng dụng chia sẻ ảnh hàng ngày theo phong cách **Locket**, được xây dựng bằng React Native CLI + TypeScript.
> Giao diện tối (dark theme), hỗ trợ streak tracking, camera flow, audience picker, subscription system.

---

## Mục lục

1. [Tổng quan dự án](#1-tổng-quan-dự-án)
2. [Tech Stack](#2-tech-stack)
3. [Cài đặt & Chạy dự án](#3-cài-đặt--chạy-dự-án)
4. [Cấu trúc thư mục chi tiết](#4-cấu-trúc-thư-mục-chi-tiết)
5. [Kiến trúc & Design Pattern](#5-kiến-trúc--design-pattern)
6. [Navigation (Điều hướng)](#6-navigation-điều-hướng)
7. [Các màn hình & Tính năng chi tiết](#7-các-màn-hình--tính-năng-chi-tiết)
8. [Domain Models (Data types)](#8-domain-models-data-types)
9. [Repository Pattern & Data Layer](#9-repository-pattern--data-layer)
10. [Hệ thống Icon tự vẽ](#10-hệ-thống-icon-tự-vẽ)
11. [Theme & Styling Conventions](#11-theme--styling-conventions)
12. [Các tính năng STUB (chưa hoàn thiện)](#12-các-tính-năng-stub-chưa-hoàn-thiện)
13. [Lưu ý quan trọng cho developer](#13-lưu-ý-quan-trọng-cho-developer)
14. [Quy ước code](#14-quy-ước-code)
15. [Roadmap](#15-roadmap)

---

## 1. Tổng quan dự án

**Cirarn** là ứng dụng nhật ký ảnh + chia sẻ ảnh hàng ngày, lấy cảm hứng từ ứng dụng **Locket**. Người dùng chụp ảnh mỗi ngày, theo dõi streak (chuỗi ngày liên tiếp), chia sẻ ảnh với bạn bè / gia đình, và tổ chức ảnh thành các chapter (câu chuyện).

**Tính năng chính:**

- **Home Screen**: Hiển thị streak stats + lịch ảnh hàng ngày dạng grid 7 cột theo tháng
- **Camera Screen**: Chụp ảnh kiểu Locket (viewfinder tròn, flash, zoom, flip camera)
- **Send Screen**: Gửi ảnh đến bạn bè với audience picker (Tất cả / Bạn bè / Gia đình)
- **Photo Detail**: Xem ảnh fullscreen, swipe ngang giữa ảnh trong ngày, thumbnail strip
- **My Story**: Tổ chức ảnh thành chapters, live view
- **Subscription**: 4 gói (Free / Personal 49k₫ / Family 99k₫ / Premium 199k₫)

---

## 2. Tech Stack

| Công nghệ | Phiên bản | Ghi chú |
|---|---|---|
| React Native (CLI) | **0.83.1** | KHÔNG dùng Expo |
| React | **19.2.0** | |
| TypeScript | **5.8.3** | Strict mode |
| @react-navigation/native | **^7.x** | Bottom Tabs + Native Stack |
| @react-navigation/bottom-tabs | **^7.x** | 4 tab chính |
| @react-navigation/native-stack | **^7.x** | Stack cho mỗi tab |
| react-native-safe-area-context | **^5.6.2** | SafeAreaView |
| react-native-screens | **^4.20.0** | Native screen containers |
| react-native-gesture-handler | **^2.30.0** | Gesture support |
| react-native-reanimated | **^4.2.1** | Animations |
| react-native-linear-gradient | **^2.8.3** | Gradient overlays |
| @shopify/flash-list | **^2.2.0** | High-perf list (chưa dùng) |
| @nozbe/watermelondb | **^0.28.0** | Local DB (chưa dùng) |
| react-native-fs | **^2.20.0** | File system access |

### Thư viện đã cài nhưng KHÔNG ĐƯỢC import trực tiếp

> ⚠️ **CẢNH BÁO**: Các thư viện sau đã có trong `package.json` nhưng **native module chưa linked đúng**. Import trực tiếp sẽ gây **CRASH ứng dụng**:

| Thư viện | Lý do |
|---|---|
| `react-native-vision-camera` ^4.7.3 | Native module chưa build thành công |
| `react-native-audio-recorder-player` ^4.5.0 | Native module chưa linked |

### Icon System

- **KHÔNG dùng** thư viện icon nào (`react-native-vector-icons`, `@expo/vector-icons`, v.v.)
- Tất cả icon được **vẽ thủ công bằng View + CSS** trong `src/core/ui/Icons.tsx`

---

## 3. Cài đặt & Chạy dự án

### Yêu cầu hệ thống

- **Node.js** >= 18
- **JDK** 17 (Android)
- **Android Studio** với Android SDK
- **Ruby** + Bundler (cho iOS CocoaPods)
- **Xcode** 15+ (cho iOS, macOS only)

### Cài đặt

```bash
# 1. Clone repo
git clone <repo-url>
cd cirarn

# 2. Cài dependencies
npm install

# 3. Cho iOS (macOS only)
cd ios && bundle install && bundle exec pod install && cd ..
```

### Chạy ứng dụng

```bash
# Khởi động Metro bundler
npm start

# Chạy trên Android (terminal mới)
npm run android

# Chạy trên iOS (macOS only, terminal mới)
npm run ios
```

### Debug / Hot Reload

- **Android**: Nhấn `R` 2 lần hoặc `Ctrl + M` → Reload
- **iOS**: Nhấn `R` trong Simulator
- Thay đổi code → tự động Fast Refresh

---

## 4. Cấu trúc thư mục chi tiết

```
cirarn/
├── App.tsx                          # Entry point → re-export từ src/app/App.tsx
├── index.js                         # React Native entry (AppRegistry)
├── package.json                     # Dependencies & scripts
├── tsconfig.json                    # TypeScript config (extends @react-native)
├── babel.config.js                  # Babel (reanimated plugin)
├── metro.config.js                  # Metro bundler config
│
├── android/                         # Android native project
│   ├── app/build.gradle             # App-level Gradle config
│   ├── build.gradle                 # Project-level Gradle config
│   └── ...
│
├── ios/                             # iOS native project
│   ├── Podfile                      # CocoaPods dependencies
│   └── cirarn/                      # iOS app source
│
└── src/                             # ← SOURCE CODE CHÍNH
    │
    ├── app/                         # App-level config
    │   ├── App.tsx                  # Root component (NavigationContainer + RootTabs)
    │   ├── navigation/              # Toàn bộ navigation config
    │   │   ├── RootTabs.tsx         # Bottom Tab Navigator (4 tabs)
    │   │   ├── HomeStack.tsx        # Stack cho tab Home (3 screens)
    │   │   ├── CameraStack.tsx      # Stack cho tab Camera (4 screens)
    │   │   ├── MyStoryStack.tsx     # Stack cho tab My Story (3 screens)
    │   │   └── types.ts            # ParamList types cho mọi navigator
    │   └── theme/
    │       ├── theme.ts             # Colors, spacing, typography, borderRadius
    │       └── index.ts             # Re-export
    │
    ├── core/                        # Shared code dùng xuyên suốt app
    │   ├── config/
    │   │   └── constants.ts         # APP_NAME, API_BASE_URL, STORAGE_KEYS
    │   ├── hooks/
    │   │   ├── index.ts             # Re-export hooks
    │   │   └── useDebounce.ts       # Debounce hook
    │   ├── ui/                      # Reusable UI components
    │   │   ├── Button.tsx           # Button (primary/secondary/outline + loading)
    │   │   ├── Card.tsx             # Card container (shadow, rounded)
    │   │   ├── Icons.tsx            # ← 16 CUSTOM ICONS vẽ bằng View
    │   │   └── index.ts            # Export Button, Card
    │   ├── utils/
    │   │   ├── formatters.ts        # formatDate, formatTime, formatDuration (vi-VN)
    │   │   └── logger.ts           # logger.info/error/warn/debug
    │   └── native/                  # Placeholder cho native modules
    │       ├── audio/               # (trống - chờ implement)
    │       ├── camera/              # (trống - chờ implement)
    │       └── filesystem/          # (trống - chờ implement)
    │
    ├── domain/                      # Business logic layer (PURE TypeScript)
    │   ├── models/
    │   │   └── index.ts            # TẤT CẢ interfaces & types (~290 dòng)
    │   ├── repositories/            # Repository INTERFACES (contracts)
    │   │   ├── ChapterRepository.ts # CRUD chapters
    │   │   ├── PhotoRepository.ts   # CRUD photos
    │   │   ├── PostRepository.ts    # Feed, like/unlike posts
    │   │   ├── StreakRepository.ts   # Streak tracking, daily photos
    │   │   └── index.ts            # Re-export all
    │   └── usecases/                # Use case classes
    │       ├── GetChaptersUsecase.ts
    │       ├── GetFeedUsecase.ts
    │       ├── CreatePostUsecase.ts
    │       └── index.ts
    │
    ├── data/                        # Data layer (implementations)
    │   ├── api/
    │   │   ├── ApiClient.ts         # HTTP client stub (GET/POST/PUT/DELETE)
    │   │   └── index.ts
    │   ├── repositories/            # Repository IMPLEMENTATIONS (mock data)
    │   │   ├── ChapterRepositoryImpl.ts   # Mock chapters
    │   │   ├── PhotoRepositoryImpl.ts     # Mock photos
    │   │   ├── PostRepositoryImpl.ts      # Mock posts
    │   │   ├── StreakRepositoryImpl.ts     # Mock streak + 37 days photos
    │   │   └── index.ts                   # Export singletons
    │   └── storage/                 # Local DB (chưa dùng)
    │       ├── db.ts
    │       ├── migrations/
    │       └── schema/
    │
    └── features/                    # Feature modules
        │
        ├── camera/                  # 📷 Camera Feature
        │   ├── screens/
        │   │   ├── CameraScreen.tsx        # Màn hình chụp ảnh (Locket-style)
        │   │   ├── SendScreen.tsx          # Gửi đến... (audience picker)
        │   │   ├── PreviewScreen.tsx       # Xem trước ảnh, chọn chapter
        │   │   └── ChapterPickerSheet.tsx  # Modal chọn chapter
        │   ├── viewModel/
        │   │   └── useCameraVM.ts          # Camera ViewModel hook
        │   └── components/                 # (trống - chờ thêm)
        │
        ├── home/                    # 🏠 Home Feature
        │   ├── screens/
        │   │   ├── HomeScreen.tsx           # Trang chủ (streak + calendar)
        │   │   └── DailyPhotoDetailScreen.tsx # Fullscreen photo viewer
        │   ├── viewModel/
        │   │   └── useHomeVM.ts            # Home ViewModel hook
        │   ├── components/
        │   │   ├── StreakHeader.tsx         # Header: avatar, streak stats
        │   │   ├── CalendarGrid.tsx        # Grid ảnh 7 cột + nút "+"
        │   │   └── DailyPhotoItem.tsx      # Cell ảnh trong calendar
        │   └── service/                    # (trống)
        │
        ├── mystory/                 # 📚 My Story Feature
        │   ├── screens/
        │   │   ├── MyStoryScreen.tsx       # Danh sách chapters
        │   │   ├── ChapterDetailScreen.tsx # Chi tiết 1 chapter (grid ảnh)
        │   │   └── LiveChapterScreen.tsx   # Xem ảnh fullscreen live
        │   ├── viewModel/
        │   │   └── useMyStoryVM.ts         # MyStory ViewModel hook
        │   └── components/
        │       └── ChapterCard.tsx         # Card hiển thị 1 chapter
        │
        ├── profile/                 # 👤 Profile Feature
        │   └── screens/
        │       └── ProfileScreen.tsx       # Thông tin cá nhân, settings
        │
        └── subscription/           # 💎 Subscription Feature
            └── screens/
                └── SubscriptionScreen.tsx  # 4 gói đăng ký (VND pricing)
```

---

## 5. Kiến trúc & Design Pattern

### Feature-First + Clean Architecture + MVVM

```
┌──────────────────────────────────────────────┐
│                   FEATURES                    │
│  (screens, viewModels, components)            │
│         ↓ sử dụng                             │
├──────────────────────────────────────────────┤
│                   DOMAIN                      │
│  (models, repository interfaces, usecases)    │
│         ↑ implement                           │
├──────────────────────────────────────────────┤
│                    DATA                       │
│  (repository implementations, API, storage)   │
├──────────────────────────────────────────────┤
│                    CORE                       │
│  (UI components, hooks, utils, config)        │
└──────────────────────────────────────────────┘
```

### Luồng dữ liệu (Data Flow)

```
Screen → gọi ViewModel (custom hook useXxxVM)
                ↓
        ViewModel → gọi UseCase hoặc Repository trực tiếp
                ↓
        Repository Interface (domain/) ← được implement bởi → RepositoryImpl (data/)
                ↓
        RepositoryImpl trả về dữ liệu (hiện tại là mock data)
                ↓
        ViewModel cập nhật state (useState/useEffect)
                ↓
Screen re-render với dữ liệu mới
```

### MVVM Pattern

Mỗi feature có **ViewModel** là một custom hook:

- `useCameraVM()` → quản lý state camera (facing, flash, photoUri, caption, permission)
- `useHomeVM()` → quản lý streak, daily photos, user data
- `useMyStoryVM()` → quản lý chapters, photos, statistics

ViewModel **KHÔNG** chứa JSX. Chỉ trả về `state` + `actions`.

---

## 6. Navigation (Điều hướng)

### Tổng quan Navigation Tree

```
NavigationContainer
└── RootTabs (Bottom Tab Navigator)
    ├── HomeTab (🏠)
    │   └── HomeStack (Native Stack)
    │       ├── HomeScreen              ← Trang chủ
    │       ├── SubscriptionScreen      ← Gói đăng ký
    │       └── DailyPhotoDetailScreen  ← Xem ảnh fullscreen (modal, fade)
    │
    ├── CameraTab (📷)
    │   └── CameraStack (Native Stack)
    │       ├── CameraScreen            ← Chụp ảnh
    │       ├── SendScreen              ← Gửi đến bạn bè (headerShown: false)
    │       ├── PreviewScreen           ← Xem trước ảnh
    │       └── ChapterPickerSheet      ← Chọn chapter (modal)
    │
    ├── MyStoryTab (📚)
    │   └── MyStoryStack (Native Stack)
    │       ├── MyStoryScreen           ← Danh sách chapters
    │       ├── ChapterDetailScreen     ← Chi tiết chapter (title động)
    │       └── LiveChapterScreen       ← Xem live (headerShown: false)
    │
    └── ProfileTab (👤)
        └── ProfileScreen               ← Trực tiếp, không có Stack
```

### Navigation Params (file `types.ts`)

```typescript
// Tab-level
type RootTabsParamList = {
  HomeTab: undefined;
  CameraTab: undefined;
  MyStoryTab: undefined;
  ProfileTab: undefined;
};

// HomeStack
type HomeStackParamList = {
  HomeScreen: undefined;
  SubscriptionScreen: undefined;
  DailyPhotoDetailScreen: {
    photos: any[];         // Serialized Photo[] (Date → ISO string)
    dateString: string;    // ISO date string
    initialIndex?: number; // Ảnh ban đầu hiển thị
  };
};

// CameraStack
type CameraStackParamList = {
  CameraScreen: undefined;
  SendScreen: { photoUri: string };  // URI ảnh vừa chụp
  PreviewScreen: { photoUri: string };
  ChapterPickerSheet: { photoUri: string };
};

// MyStoryStack
type MyStoryStackParamList = {
  MyStoryScreen: undefined;
  ChapterDetailScreen: { chapterId: string; chapterTitle: string };
  LiveChapterScreen: { chapterId: string };
};
```

### Cross-Tab Navigation

Trong `CameraScreen`, để navigate về HomeTab:

```typescript
(navigation as any).navigate('HomeTab');
```

Sử dụng `CompositeScreenProps` để type-check cross-tab navigation khi cần.

---

## 7. Các màn hình & Tính năng chi tiết

### 7.1 HomeScreen

**File**: `src/features/home/screens/HomeScreen.tsx`

**Mô tả**: Trang chủ kiểu Locket - hiển thị streak tracking và lịch ảnh theo tháng.

**Thành phần:**

- `StreakHeader` — Header với avatar (viền vàng), tên user, username, streak stats (💛 1.729 Locket, 🔥 37d chuỗi), nút Subscription
- `CalendarGrid` — Grid ảnh 7 cột nhóm theo tháng, nút "+" thêm ảnh, auto-padding hàng cuối
- `DailyPhotoItem` — Từng ô ảnh trong grid (badge số ảnh, indicator voice)
- Pull-to-refresh (vàng #FFD700)
- Infinite scroll load thêm tháng

**Dữ liệu**: `useHomeVM()` → `StreakRepositoryImpl` (mock 37 ngày, captions tiếng Việt)

**Khi nhấn vào ảnh**: Navigate → `DailyPhotoDetailScreen` (serialize Photos thành JSON, truyền qua params)

---

### 7.2 DailyPhotoDetailScreen

**File**: `src/features/home/screens/DailyPhotoDetailScreen.tsx`

**Mô tả**: Xem ảnh fullscreen kiểu Locket, swipe ngang giữa các ảnh trong ngày.

**Tính năng:**

- **Main photo**: FlatList horizontal paging (1 ảnh / page), `SCREEN_WIDTH - 48`, borderRadius 24
- **Thumbnail strip**: FlatList horizontal ở dưới, sync với main photo, viền trắng cho ảnh đang xem
- **Caption overlay**: Hiển thị ở bottom ảnh, text shadow
- **Header**: Nút ✕ (đóng), ngày tháng kiểu "tháng 2 thứ 11", nút share ⬆

**Bug đã fix:**

- Thumbnail đen khi scroll → giải quyết bằng `React.memo` + `removeClippedSubviews={false}` + `windowSize={21}`
- Stable callback qua `useRef` để `onViewableItemsChanged` không bị recreate

---

### 7.3 CameraScreen

**File**: `src/features/camera/screens/CameraScreen.tsx`

**Mô tả**: Màn hình chụp ảnh kiểu Locket với viewfinder, controls, và history badge.

**Layout (từ trên xuống):**

1. **Top bar**: Avatar tròn (viền #555) | Pill "33 người bạn" (PeopleIcon) | ChatBubbleIcon
2. **Viewfinder**: Khung ảnh `SCREEN_WIDTH - 24` x height `×1.15`, borderRadius 32, nền `#1A1A1A`
   - Flash overlay (góc trái trên): FlashIcon / FlashOffIcon
   - Zoom overlay (góc phải dưới): "1.0×" / "2.0×"
3. **Controls**: GalleryIcon (28px) | **Nút chụp** (vòng vàng 78px, inner trắng 64px) | CameraFlipIcon (26px)
4. **History badge**: "2" badge + "Lịch sử" text + ChevronDownIcon

**Flow sau chụp:**

```
Nhấn nút chụp → capturePhoto() (stub: picsum URL)
    → navigate('SendScreen', { photoUri })
    → clearPhoto() (reset camera state)
```

**ViewModel** (`useCameraVM`):

- **States**: `facing`, `flashOn`, `capturing`, `photoUri`, `caption`, `cameraPermission`
- **Actions**: `toggleCamera`, `toggleFlash`, `capturePhoto` (stub), `pickFromGallery` (stub Alert), `requestCameraPermission` (real PermissionsAndroid), `clearPhoto`, `setCaption`
- ⚠️ `capturePhoto` trả về URL picsum placeholder, cần thay bằng react-native-vision-camera khi linked
- ⚠️ `pickFromGallery` chỉ show Alert, cần react-native-image-picker

---

### 7.4 SendScreen

**File**: `src/features/camera/screens/SendScreen.tsx`

**Mô tả**: Màn hình "Gửi đến..." sau khi chụp ảnh — chọn audience và gửi.

**Layout:**

1. **Header**: "Gửi đến..." title + DownloadIcon (tải ảnh)
2. **Photo preview**: Ảnh vừa chụp, cùng kích thước viewfinder, borderRadius 32
3. **Caption**: TextInput overlay (khi bật) hoặc caption bubble trên ảnh
4. **Dot indicators**: 7 chấm (cosmetic, giả lập sticker pages)
5. **Control bar**: CloseIcon (X, huỷ) | SendPlaneIcon (nút gửi, vòng xám 64px) | "Aa+" (text tool)
6. **Audience picker**: 3 circle lớn:
   - **Tất cả** (PeopleIcon) — gửi cho tất cả
   - **Bạn bè** (PersonIcon) — gửi cho nhóm bạn
   - **Gia đình** (FamilyIcon) — gửi cho gia đình
   - Circle đang chọn có viền vàng `#FFD700`
7. **Friend list** (khi chọn Bạn bè/Gia đình): FlatList horizontal, avatar tròn với initials, checkmark badge khi selected, viền vàng

**Mock data:**

- `MOCK_FRIENDS`: 8 người (Minh, Hương, Tuấn, Linh, Đức, Mai, Nam, Thảo)
- `MOCK_FAMILY`: 4 người (Mẹ, Ba, Chị Hai, Em Út)

**Khi gửi**: Alert hiển thị target info → `navigation.popToTop()` (về CameraScreen)

---

### 7.5 SubscriptionScreen

**File**: `src/features/subscription/screens/SubscriptionScreen.tsx`

**Mô tả**: Trang chọn gói subscription, 4 tiers, giá VND.

| Gói | Giá | Giới hạn |
|---|---|---|
| Free Starter | Miễn phí | 20 ảnh, 1 AI story |
| Personal | 49,000₫/tháng | 500 ảnh, 10 AI stories, HD, cloud sync |
| Family | 99,000₫/tháng | Unlimited, 4K, 5 members, priority support |
| Premium Family | 199,000₫/tháng | All Family + AI voice, PDF/Book export, 10 members, API |

- Family có badge "PHỔ BIẾN NHẤT"
- Gói hiện tại hiển thị "✓ GÓI HIỆN TẠI" + viền vàng
- Thanh toán: VNPay, MoMo, Thẻ quốc tế (chưa implement)

---

### 7.6 MyStory Screens

#### MyStoryScreen (`src/features/mystory/screens/MyStoryScreen.tsx`)

- Grid 2 cột các `ChapterCard`
- Nút "+ New Chapter" tạo chapter mới
- Empty state khi chưa có chapter

#### ChapterDetailScreen (`src/features/mystory/screens/ChapterDetailScreen.tsx`)

- Title động (từ navigation param)
- Grid 3 cột ảnh (mock picsum)
- Nút "📖 Live View" → LiveChapterScreen

#### LiveChapterScreen (`src/features/mystory/screens/LiveChapterScreen.tsx`)

- Fullscreen ảnh trên nền đen
- Nút ✕ Close (overlay)

---

### 7.7 ProfileScreen

**File**: `src/features/profile/screens/ProfileScreen.tsx`

- Avatar circle (xanh #007AFF) + tên + email
- Card "Statistics": Chapters, Photos, Posts (mock numbers)
- Card "Settings": Edit Profile, Privacy, Notifications
- Nút Sign Out

---

## 8. Domain Models (Data types)

Tất cả models định nghĩa trong `src/domain/models/index.ts`:

| Model | Mô tả |
|---|---|
| `Photo` | Ảnh chụp: id, imageData, thumbnailData, message, voiceNoteId, chapterId, livePhotoMoviePath |
| `Chapter` | Album/Collection ảnh: name, coverImageData, photoIds, photoCount |
| `VoiceNote` | Ghi âm: duration, audioFileName, waveformData |
| `Post` | Post trên feed: type (single/chapter), photos, author, likeCount |
| `PhotoItem` | Item ảnh trong Post: imageURL, voiceNote |
| `Author` | Tác giả: username, avatarURL |
| `User` | Người dùng: name, email, username, avatar, subscription tier |
| `Streak` | Chuỗi streak: currentStreak, longestStreak, lastPhotoDate, totalPhotos |
| `DailyPhoto` | Ảnh 1 ngày: date, photos[], thumbnailUrl, photoCount, hasVoice |
| `MonthGroup` | Nhóm theo tháng: monthKey, monthDisplay, dailyPhotos[] |
| `Friend` | Bạn bè: name, username, avatar |
| `ShareGroup` | Nhóm chia sẻ: name, members (Friend[]) |
| `AudienceType` | `'all' \| 'friends' \| 'family'` |
| `SubscriptionTier` | `'free' \| 'personal' \| 'family' \| 'premium'` |
| `SubscriptionPlan` | Gói: name, price, features[], isPopular |
| `CameraFlashMode` | `'on' \| 'off' \| 'auto'` |
| `CameraPosition` | `'front' \| 'back'` |
| `CameraSettings` | flashMode, cameraPosition, isLivePhotoEnabled |
| `AudioSettings` | maxRecordingDuration, sampleRate, audioFormat |

---

## 9. Repository Pattern & Data Layer

### Interfaces (domain/repositories/)

Mỗi repository là **interface** thuần TypeScript, không phụ thuộc framework:

```
ChapterRepository  → getChapters, getChapterById, createChapter, updateChapter, deleteChapter
PhotoRepository    → getPhotos, getPhotosByChapter, savePhoto, deletePhoto
PostRepository     → getFeed, getPostById, createPost, deletePost, likePost, unlikePost
StreakRepository    → getStreak, getDailyPhotos, updateStreak, getPhotosForDate
```

### Implementations (data/repositories/)

Hiện tại tất cả implementations đều trả về **mock data**:

| File | Trạng thái |
|---|---|
| `StreakRepositoryImpl.ts` | ✅ Đầy đủ mock (37 ngày, captions VN, streak 37d, 1729 photos) |
| `ChapterRepositoryImpl.ts` | ⚠️ Basic mock (2 chapters cố định) |
| `PhotoRepositoryImpl.ts` | ⚠️ Stub (trả về mảng trống) |
| `PostRepositoryImpl.ts` | ⚠️ Stub (1 post placeholder) |

**Export singletons** từ `data/repositories/index.ts`:

```typescript
export const chapterRepository = new ChapterRepositoryImpl();
export const photoRepository = new PhotoRepositoryImpl();
export const postRepository = new PostRepositoryImpl();
export const streakRepository = new StreakRepositoryImpl();
```

### Use Cases (domain/usecases/)

| Use Case | Chức năng |
|---|---|
| `GetChaptersUsecase` | Lấy danh sách chapters của user |
| `GetFeedUsecase` | Lấy feed posts (phân trang) |
| `CreatePostUsecase` | Tạo post mới (photo + voice + caption) |

### API Client (`data/api/ApiClient.ts`)

Stub HTTP client với 4 methods: `get`, `post`, `put`, `delete`. Chưa triển khai fetch thật.

Config: `API_BASE_URL = 'https://api.cirarn.com'`, `API_TIMEOUT = 30000`.

---

## 10. Hệ thống Icon tự vẽ

File `src/core/ui/Icons.tsx` chứa **16 icon components** vẽ hoàn toàn bằng View + CSS borders/transforms:

| Icon | Mô tả | Dùng ở đâu |
|---|---|---|
| `FlashIcon` | ⚡ Bolt sét | CameraScreen (flash on) |
| `FlashOffIcon` | ⚡ Bolt + gạch chéo | CameraScreen (flash off) |
| `PeopleIcon` | 👥 Hai người | Camera top pill, SendScreen "Tất cả" |
| `ChatBubbleIcon` | 💬 Bong bóng chat | CameraScreen top-right |
| `GalleryIcon` | 🖼️ Hai card chồng | CameraScreen gallery button |
| `CameraFlipIcon` | 🔄 Hai mũi tên tròn | CameraScreen flip button |
| `CameraIcon` | 📷 Thân camera + lens | (sẵn dùng) |
| `ChevronDownIcon` | ∨ Mũi tên xuống | CameraScreen history badge |
| `SendIcon` | ↑ Mũi tên lên | (sẵn dùng) |
| `CloseIcon` | ✕ Hai đường chéo | SendScreen close button |
| `SendPlaneIcon` | ✈ Paper plane | SendScreen send button |
| `TextAaIcon` | Ⓐ Vòng tròn outline | SendScreen text tool |
| `DownloadIcon` | ↓ Arrow + tray | SendScreen download |
| `PersonIcon` | 👤 Một người | SendScreen "Bạn bè" |
| `HomeIcon` | 🏠 Nhà | (sẵn dùng) |
| `FamilyIcon` | 👨‍👩‍👧 Ba người | SendScreen "Gia đình" |

**Props chung**: `{ size?: number; color?: string }`

**Cách thêm icon mới:**

```tsx
export function NewIcon({ size = 20, color = '#FFF' }: IconProps) {
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      {/* Vẽ bằng View + border tricks */}
    </View>
  );
}
```

---

## 11. Theme & Styling Conventions

### Dark Theme Colors (kiểu Locket)

| Biến | Màu | Dùng cho |
|---|---|---|
| Background | `#000000` | Nền chính các screen |
| Card | `#1C1C1E` | Card background, sections |
| Surface | `#2C2C2E` | Elevated surfaces, inputs |
| Gold / Accent | `#FFD700` | Streak, viền avatar, nút active, highlights |
| Text Primary | `#FFFFFF` | Text chính |
| Text Secondary | `#8E8E93` | Text phụ, labels |
| Primary Blue | `#007AFF` | Nút CTA, links |
| Success Green | `#34C759` | Checkmarks, success states |
| Viewfinder BG | `#1A1A1A` | Camera viewfinder background |

### Spacing

- `xs`: 4, `sm`: 8, `md`: 16, `lg`: 24, `xl`: 32

### Typography

- `h1`: 32 bold, `h2`: 24 bold, `h3`: 18 semibold, `body`: 16 regular

### Conventions

- **StyleSheet.create()** cho tất cả styles (không inline trừ Icons.tsx)
- `SafeAreaView` từ `react-native-safe-area-context` (KHÔNG dùng từ react-native)
- Viewfinder size: `SCREEN_WIDTH - 24`, height ratio `×1.15`, borderRadius `32`

---

## 12. Các tính năng STUB (chưa hoàn thiện)

| Tính năng | Trạng thái | Cần làm |
|---|---|---|
| **Camera thật** | ❌ Stub (picsum URL) | Link `react-native-vision-camera`, thay `capturePhoto()` trong `useCameraVM` |
| **Chọn ảnh từ gallery** | ❌ Stub (Alert) | Cài `react-native-image-picker`, thay `pickFromGallery()` trong `useCameraVM` |
| **Ghi âm** | ❌ Chưa có | Link `react-native-audio-recorder-player`, implement trong `core/native/audio/` |
| **API thật** | ❌ Stub | Implement `ApiClient.ts` với fetch/axios, kết nối Supabase |
| **Authentication** | ❌ Chưa có | Supabase Auth hoặc Firebase Auth |
| **Database local** | ❌ Stub | Kích hoạt WatermelonDB hoặc SQLite |
| **Thanh toán** | ❌ Mock | VNPay / MoMo SDK integration |
| **Push notifications** | ❌ Chưa có | Firebase Cloud Messaging |
| **Share ảnh thật** | ❌ Mock (Alert) | Implement send logic trong SendScreen |
| **Friend system** | ❌ Mock data | Backend API + real friend list |
| **Live Photo** | ❌ Chưa có | iOS Live Photo capture + playback |

---

## 13. Lưu ý quan trọng cho developer

### ⚠️ KHÔNG import trực tiếp các thư viện này

```typescript
// ❌ SẼ CRASH:
import { Camera } from 'react-native-vision-camera';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';

// ✅ Thay vào đó, dùng stub trong useCameraVM:
const { capturePhoto } = useCameraVM(); // Trả về picsum URL
```

### ⚠️ Navigation type safety

- Luôn dùng types từ `src/app/navigation/types.ts`
- Cross-tab navigation dùng `(navigation as any).navigate('TabName')`
- DailyPhotoDetailScreen nhận Photos đã serialize (Date → ISO string), phải parse lại

### ⚠️ Serialization Photos qua navigation

```typescript
// Trước khi navigate:
const serializedPhotos = dailyPhoto.photos.map(p => ({
  ...p,
  createdAt: p.createdAt instanceof Date ? p.createdAt.toISOString() : p.createdAt,
}));

// Trong DailyPhotoDetailScreen:
const photoList = photos.map(p => ({ ...p, createdAt: new Date(p.createdAt) }));
```

### ⚠️ FlatList Performance

- `removeClippedSubviews={false}` cho thumbnail FlatList (tránh ảnh đen)
- `windowSize={21}` cho danh sách ảnh
- Dùng `React.memo` với custom comparator cho list items
- `getItemLayout` cho mọi FlatList có scroll-to-index

### ⚠️ Tab Icons dùng emoji

Bottom tabs hiện dùng emoji (🏠📷📚👤) thay vì icon component. Nếu muốn chuyển sang custom icon, sửa `TabIcon` trong `RootTabs.tsx`.

---

## 14. Quy ước code

### File & Folder

- **Screens**: `PascalCase` → `HomeScreen.tsx`
- **Components**: `PascalCase` → `StreakHeader.tsx`
- **ViewModels**: `camelCase` hook → `useHomeVM.ts`
- **Models/Types**: `PascalCase` interface → `Photo`, `Chapter`
- **Repositories**: Interface `XxxRepository.ts`, Impl `XxxRepositoryImpl.ts`

### Component Pattern

```tsx
// Screen component (function declaration)
export function HomeScreen({ navigation }: Props) { ... }

// Reusable component (const + React.FC)
export const StreakHeader: React.FC<StreakHeaderProps> = ({ ... }) => { ... };

// Memoized component
const ThumbItem = React.memo(function ThumbItem({ ... }: ThumbItemProps) { ... });
```

### ViewModel Pattern

```typescript
export function useXxxVM() {
  const [state, setState] = useState<XxxState>({ ... });

  // Actions
  const doSomething = useCallback(async () => { ... }, []);

  // Side effects
  useEffect(() => { loadData(); }, []);

  return { ...state, doSomething };
}
```

### Import Order

1. React / React Native
2. Third-party libraries
3. Navigation types
4. Domain models
5. Repositories / Usecases
6. Components
7. ViewModels
8. Theme / Utils

---

## 15. Roadmap

### Phase 1 - MVP (Hiện tại) ✅

- [x] Navigation structure (4 tabs + stacks)
- [x] Home screen với streak calendar
- [x] Camera UI (Locket-style)
- [x] Send screen với audience picker
- [x] Photo detail viewer
- [x] My Story chapters
- [x] Subscription UI
- [x] Custom icon system
- [x] Dark theme

### Phase 2 - Camera & Media

- [ ] Link react-native-vision-camera (build native)
- [ ] Link react-native-image-picker (gallery)
- [ ] Real photo capture thay stub picsum
- [ ] Link react-native-audio-recorder-player
- [ ] Voice note recording + waveform
- [ ] Live Photo support (iOS)

### Phase 3 - Backend & Auth

- [ ] Supabase project setup
- [ ] Authentication (email + social)
- [ ] Real API client (ApiClient.ts)
- [ ] Cloud photo storage (Supabase Storage)
- [ ] Real friend system / contacts sync
- [ ] Real streak tracking (server-side)

### Phase 4 - Payment & Premium

- [ ] VNPay / MoMo SDK integration
- [ ] In-app purchase (Google Play / App Store)
- [ ] Subscription management
- [ ] Feature gating by tier

### Phase 5 - Polish & Launch

- [ ] AI story generation
- [ ] PDF/Book export
- [ ] Push notifications
- [ ] Deep linking
- [ ] Analytics (Firebase / Mixpanel)
- [ ] App Store / Google Play submission

---

## Liên hệ

- **Project**: EXE201 - Cirarn
- **Stack**: React Native CLI + TypeScript
- **Source gốc**: Migrated from Swift iOS (CIRA_Swift_C) → React Native cross-platform
