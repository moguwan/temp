# -*- coding: utf-8 -*-
"""压缩图床素材中过大的文件，目标 < 10MB"""
import os
from PIL import Image

TARGET_DIR = r"d:\Webmoguone\project\制药工程\图床素材"
MAX_MB = 10
MAX_BYTES = MAX_MB * 1024 * 1024

# 需要处理的文件
FILES = [
    "11_K.png",
    "15_back-to-top.svg",
    "23_人类实践2.png",
    "24_人类实践3.png",
    "25_人类实践4.png",
    "26_人类实践5.png",
    "27_人类实践6.png",
]

def compress_png(path):
    """将 PNG 压缩到 10MB 以下，必要时转为 JPEG"""
    img = Image.open(path).convert("RGB")  # 去掉透明通道，便于转 JPEG
    out_path = path.replace(".png", ".jpg")
    
    # 从 quality 85 开始，若仍超限则逐步降低
    for q in [85, 80, 75, 70, 65]:
        img.save(out_path, "JPEG", quality=q, optimize=True)
        if os.path.getsize(out_path) <= MAX_BYTES:
            os.remove(path)
            return out_path
    # 若仍超限，尝试缩小尺寸
    w, h = img.size
    for scale in [0.8, 0.6, 0.5]:
        nw, nh = int(w * scale), int(h * scale)
        resized = img.resize((nw, nh), Image.Resampling.LANCZOS)
        resized.save(out_path, "JPEG", quality=80, optimize=True)
        if os.path.getsize(out_path) <= MAX_BYTES:
            os.remove(path)
            return out_path
    os.remove(out_path)
    raise RuntimeError(f"无法将 {path} 压缩到 {MAX_MB}MB 以下")

def svg_to_png(path):
    """将 back-to-top.svg 转为 PNG（图床不支持 SVG，用 Pillow 重绘）"""
    from PIL import ImageDraw
    out_path = path.replace(".svg", ".png")
    size = 120  # 2x 原 60px，适配高清屏
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    # 圆角矩形背景（渐变近似为 #5b8a9e）
    margin = 4
    draw.rounded_rectangle(
        [margin, margin, size - margin, size - margin],
        radius=24,
        fill="#5b8a9e",
        outline="#94c5d4",
        width=2,
    )
    # 白色向上箭头 V 形
    cx, top, bottom = size // 2, size * 20 // 60, size * 40 // 60
    left_x, right_x = cx - 16, cx + 16
    mid_y = size * 28 // 60
    draw.line([(cx, top), (cx, bottom)], fill="white", width=5, joint="curve")
    draw.line([(left_x, mid_y), (cx, top), (right_x, mid_y)], fill="white", width=5, joint="curve")
    img.save(out_path, "PNG", optimize=True)
    os.remove(path)
    return out_path

def main():
    for name in FILES:
        path = os.path.join(TARGET_DIR, name)
        if not os.path.isfile(path):
            print(f"跳过（不存在）: {name}")
            continue
        size_mb = os.path.getsize(path) / 1024 / 1024
        print(f"处理: {name} ({size_mb:.2f} MB)")
        try:
            if name.endswith(".svg"):
                new_path = svg_to_png(path)
                new_size = os.path.getsize(new_path) / 1024 / 1024
                print(f"  -> {os.path.basename(new_path)} ({new_size:.2f} MB)")
            elif size_mb > MAX_MB:
                new_path = compress_png(path)
                new_size = os.path.getsize(new_path) / 1024 / 1024
                print(f"  -> {os.path.basename(new_path)} ({new_size:.2f} MB)")
            else:
                print(f"  -> 已小于 {MAX_MB}MB，跳过")
        except Exception as e:
            print(f"  错误: {e}")

if __name__ == "__main__":
    main()
