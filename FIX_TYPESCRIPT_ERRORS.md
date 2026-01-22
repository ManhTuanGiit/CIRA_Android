# Fix TypeScript Errors in VS Code

## Vấn Đề
Bạn đang thấy các lỗi import màu đỏ trong VS Code như:
```
Cannot find module '../../features/camera/screens/CameraScreen'
```

## Nguyên Nhân
Đây là lỗi **cache** của TypeScript Language Server trong VS Code. Các file thực tế đã tồn tại và code đúng (đã verify bằng `tsc`).

## Giải Pháp

### Cách 1: Restart TypeScript Server (Nhanh nhất)

1. Mở Command Palette:
   - Windows/Linux: `Ctrl + Shift + P`
   - Mac: `Cmd + Shift + P`

2. Gõ và chọn: `TypeScript: Restart TS Server`

3. Đợi vài giây để TypeScript server restart

### Cách 2: Reload VS Code Window

1. Mở Command Palette (Ctrl/Cmd + Shift + P)
2. Gõ: `Developer: Reload Window`
3. Enter

### Cách 3: Close và Open lại VS Code

1. Thoát VS Code hoàn toàn
2. Mở lại project

### Cách 4: Xóa và Rebuild TypeScript Cache

```bash
# Xóa node_modules và reinstall
rm -rf node_modules
npm install

# Xóa TypeScript cache (nếu có)
rm -rf tsconfig.tsbuildinfo
```

## Xác Nhận

Sau khi làm một trong các cách trên, bạn sẽ thấy:
- ✅ Các import không còn màu đỏ
- ✅ Auto-complete hoạt động bình thường
- ✅ Go to Definition (F12) hoạt động

## Kiểm Tra

Nếu vẫn thấy lỗi, hãy verify bằng TypeScript CLI:

```bash
# Kiểm tra TypeScript errors
npx tsc --noEmit

# Nếu không có output = không có lỗi thực sự
```

## Lưu Ý

- Lỗi này chỉ ảnh hưởng VS Code editor, không ảnh hưởng build
- App vẫn chạy bình thường (`npm run android` / `npm run ios`)
- Đây là vấn đề phổ biến với TypeScript + React Native
