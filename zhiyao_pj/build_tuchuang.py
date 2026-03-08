# -*- coding: utf-8 -*-
"""按名字排序，去重后复制网页引用的图片到图床素材文件夹"""
import os
import hashlib
import shutil

BASE = r"d:\Webmoguone\project\制药工程\01-code"
OUT = r"d:\Webmoguone\project\制药工程\图床素材"

# 每个引用：(显示名, 源路径) - 同名不同路径的分别列出
REFS = [
    ("back-to-top.svg", os.path.join(BASE, "back-to-top.svg")),
    ("background.jpg", os.path.join(BASE, "background.jpg")),
    ("logo.png", os.path.join(BASE, "logo.png")),
    ("A.png", os.path.join(BASE, "首页", "A.png")),
    ("配图1.png", os.path.join(BASE, "首页", "配图1.png")),
    ("配图2.png", os.path.join(BASE, "首页", "配图2.png")),
    ("配图3.png", os.path.join(BASE, "首页", "配图3.png")),
    ("配图4.png", os.path.join(BASE, "首页", "配图4.png")),
    ("配图5.png", os.path.join(BASE, "首页", "配图5.png")),
    ("配图6.png", os.path.join(BASE, "首页", "配图6.png")),
    ("配图7.png", os.path.join(BASE, "首页", "配图7.png")),
    ("配图8.png", os.path.join(BASE, "首页", "配图8.png")),
    ("配图9.png", os.path.join(BASE, "首页", "配图9.png")),
    ("B.png", os.path.join(BASE, "项目介绍", "B.png")),
    ("C.png", os.path.join(BASE, "项目介绍", "C.png")),
    ("D.png", os.path.join(BASE, "项目介绍", "D.png")),
    ("E.png", os.path.join(BASE, "项目介绍", "E.png")),
    ("F.png", os.path.join(BASE, "项目介绍", "F.png")),
    ("G.png", os.path.join(BASE, "项目介绍", "G.png")),
    ("H.png", os.path.join(BASE, "项目介绍", "H.png")),
    ("I.png", os.path.join(BASE, "项目介绍", "I.png")),
    ("J.png", os.path.join(BASE, "项目介绍", "J.png")),
    ("K.png", os.path.join(BASE, "项目介绍", "K.png")),
    ("L.png", os.path.join(BASE, "项目介绍", "L.png")),
    ("a.png", os.path.join(BASE, "项目设计", "a.png")),
    ("b.png", os.path.join(BASE, "项目设计", "b.png")),
    ("c.jpg", os.path.join(BASE, "项目设计", "c.jpg")),
    ("d.jpg", os.path.join(BASE, "项目设计", "d.jpg")),
    ("e.jpg", os.path.join(BASE, "项目设计", "e.jpg")),
    ("f.jpg", os.path.join(BASE, "项目设计", "f.jpg")),
    ("产品设计.png", os.path.join(BASE, "线路与元件", "产品设计.png")),
    ("a.png", os.path.join(BASE, "线路与元件", "a.png")),
    ("b.png", os.path.join(BASE, "线路与元件", "b.png")),
    ("干实验1.jpg", os.path.join(BASE, "实验设计", "干实验1.jpg")),
    ("干实验2.jpg", os.path.join(BASE, "实验设计", "干实验2.jpg")),
    ("干实验3.jpg", os.path.join(BASE, "实验设计", "干实验3.jpg")),
    ("干实验4.jpg", os.path.join(BASE, "实验设计", "干实验4.jpg")),
    ("干实验5.jpg", os.path.join(BASE, "实验设计", "干实验5.jpg")),
    ("人类实践1.png", os.path.join(BASE, "人类实践", "人类实践1.png")),
    ("人类实践2.png", os.path.join(BASE, "人类实践", "人类实践2.png")),
    ("人类实践3.png", os.path.join(BASE, "人类实践", "人类实践3.png")),
    ("人类实践4.png", os.path.join(BASE, "人类实践", "人类实践4.png")),
    ("人类实践5.png", os.path.join(BASE, "人类实践", "人类实践5.png")),
    ("人类实践6.png", os.path.join(BASE, "人类实践", "人类实践6.png")),
    ("建模1.jpg", os.path.join(BASE, "建模", "建模1.jpg")),
    ("建模2.jpg", os.path.join(BASE, "建模", "建模2.jpg")),
    ("建模3.jpg", os.path.join(BASE, "建模", "建模3.jpg")),
    ("建模4.png", os.path.join(BASE, "建模", "建模4.png")),
    ("成员介绍.jpg", os.path.join(BASE, "成员介绍", "成员介绍.jpg")),
]

def file_hash(path):
    with open(path, "rb") as f:
        return hashlib.md5(f.read()).hexdigest()

def main():
    os.makedirs(OUT, exist_ok=True)
    for f in os.listdir(OUT):
        os.remove(os.path.join(OUT, f))

    seen_hash = {}
    unique = []
    for name, path in REFS:
        if not os.path.isfile(path):
            print(f"跳过（不存在）: {path}")
            continue
        h = file_hash(path)
        if h in seen_hash:
            continue
        seen_hash[h] = path
        unique.append((name, path))

    # 按名字排序
    unique.sort(key=lambda x: x[0])

    lines = []
    for i, (name, path) in enumerate(unique, 1):
        new_name = f"{i:02d}_{name}"
        dst = os.path.join(OUT, new_name)
        shutil.copy2(path, dst)
        lines.append(f"{i}\t{new_name}\t{name}")
        print(lines[-1])

    # 写清单
    list_path = os.path.join(r"d:\Webmoguone\project\制药工程", "图床素材清单.md")
    with open(list_path, "w", encoding="utf-8") as f:
        f.write("# 图床素材清单（按名字排序，已去重）\n\n")
        f.write("| 序号 | 图床文件名 | 原名称 |\n|------|------------|--------|\n")
        for i, (name, path) in enumerate(unique, 1):
            f.write(f"| {i} | {i:02d}_{name} | {name} |\n")
    print(f"\n清单已保存: {list_path}")

if __name__ == "__main__":
    main()
