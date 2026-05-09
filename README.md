# TMDB CLI

命令行工具，用于查询 TMDB (The Movie Database) 的电影、剧集、演员等数据。

## 安装

```bash
git clone https://github.com/akirco/tmdb
cd tmdb
cargo install --path .
```

## 配置

设置 TMDB API Key：

```bash
export TMDB_API_KEY="your_api_key"
```

获取 API Key: https://www.themoviedb.org/settings/api

## 使用

### 搜索

```bash
tmdb --wd "流浪地球"
tmdb -w "Inception" -t movie
```

### 查看详情

```bash
tmdb --id 550 -t movie        # 电影详情
tmdb --id 1396 -t tv          # 剧集详情
tmdb --id 1396 -S 1 -t tv     # 剧集第一季详情
```

### 浏览列表

```bash
tmdb --list popular -t movie
tmdb --list top-rated -t tv
tmdb --list now-playing
```

### 热门趋势

```bash
tmdb --trend day
tmdb --trend week -t movie
```

### 发现模式（筛选）

```bash
tmdb --discover -t movie --genre 878,28 --year 2020-2025 --sort vote-average-desc
```

### 类型列表

```bash
tmdb --genres -t movie
tmdb --genres -t tv
```

## 选项

| 简写 | 全称       | 说明                                                 |
| ---- | ---------- | ---------------------------------------------------- |
| -w   | --wd       | 搜索关键词                                           |
| -p   | --pg       | 页码                                                 |
| -L   | --lang     | 语言 (zh-CN, en-US, ja-JP 等)                        |
| -a   | --adult    | 包含成人内容                                         |
| -t   | --type     | 媒体类型 (multi/movie/tv/person/collection/company)  |
| -i   | --id       | TMDB ID                                              |
| -S   | --season   | 季号 (需配合 --id，自动将 --type 设为 tv)            |
| -l   | --list     | 分类列表 (popular/top-rated/now-playing/upcoming 等) |
| -r   | --trend    | 趋势 (day/week)                                      |
| -d   | --discover | 发现模式                                             |
| -g   | --genre    | 类型 ID (逗号分隔)                                   |
| -y   | --year     | 年份筛选 (2023, 2020-2025, 2020-, -2025)             |
| -s   | --size     | 图片尺寸 (w92/w154/w185/w342/w500/w780/original)     |
|      | --raw      | 输出原始 JSON                                        |
|      | --compact  | 仅输出 results 数组                                  |

## Shell 自动完成

```bash
# 方式1: 生成脚本并重定向
tmdb --completions bash > ~/.local/share/bash-completion/completions/tmdb
tmdb --completions zsh > ~/.zsh/completions/_tmdb
tmdb --completions fish > ~/.config/fish/completions/tmdb.fish

# 方式2: eval 初始化 (推荐)
eval "$(tmdb --init bash)"
eval "$(tmdb --init zsh)"
tmdb --init fish | source
```
