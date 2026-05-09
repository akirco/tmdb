use anyhow::{Context, Result, bail};
use clap::{
    ArgGroup, CommandFactory, Parser, ValueEnum,
    builder::{Styles, styling::AnsiColor},
};
use clap_complete::Shell;
use reqwest::header::{AUTHORIZATION, HeaderMap, HeaderValue};
use std::str::FromStr;
use url::Url;

const TMDB_BASE_URL: &str = "https://upxgo.deno.dev/tmdb/3";
const TMDB_IMAGE_BASE: &str = "https://image.tmdb.org/t/p";
const STYLES: Styles = Styles::styled()
    .header(AnsiColor::Yellow.on_default().bold())
    .usage(AnsiColor::Yellow.on_default().bold())
    .literal(AnsiColor::Cyan.on_default().bold())
    .placeholder(AnsiColor::Cyan.on_default());

/// TMDB CLI – 简易的tmdb命令行工具，支持搜索、详情查询、列表浏览、趋势查看和高级发现功能。
#[derive(Parser, Debug)]
#[command(name = "tmdb")]
#[command(version = "1.4.1",styles = STYLES)]
#[command(
    after_help = "shell completion:\n  # 方式1: 生成 completion 脚本 (手动重定向)\n  tmdb --completions bash > ~/.local/share/bash-completion/completions/tmdb\n  tmdb --completions zsh > ~/.zsh/completions/_tmdb\n  tmdb --completions fish > ~/.config/fish/completions/tmdb.fish\n\n  # 方式2: eval 初始化 (推荐)\n  eval \"$(tmdb --init bash)\"\n  eval \"$(tmdb --init zsh)\"\n  tmdb --init fish | source"
)]
#[clap(group = ArgGroup::new("modes").required(true).args(&["wd", "id", "list", "trend", "discover", "genres"]))]
struct Cli {
    /// 搜索关键词
    #[arg(
        short,
        long,
        value_name = "QUERY",
        help = "在 TMDB 中搜索电影、剧集、演员等"
    )]
    wd: Option<String>,

    /// 页码
    #[arg(short, long, default_value = "1", help = "搜索结果/列表的页码")]
    pg: u32,

    /// 语言 (例如: zh-CN, en-US, ja-JP)
    #[arg(
        short = 'L',
        long,
        default_value = "zh-CN",
        help = "API 返回数据的语言"
    )]
    lang: String,

    /// 包含成人内容 (仅搜索时有效)
    #[arg(short, long, help = "是否包含成人内容")]
    adult: bool,

    /// 媒体类型
    #[arg(
        short = 't',
        long = "type",
        value_enum,
        default_value = "multi",
        help = "媒体类型"
    )]
    ty: MediaType,

    /// TMDB ID (查看详情)
    #[arg(
        short,
        long,
        value_name = "ID",
        help = "根据 ID 查询电影/剧集/演员详情"
    )]
    id: Option<u64>,

    /// 季号 (与 --id 和 --type tv 配合使用，查询指定季信息)
    #[arg(short = 'S', long, help = "查询指定季的信息 (需要 --id)")]
    season: Option<u32>,

    /// 列表浏览 (流行/高评分/正在上映等)
    #[arg(
        short = 'l',
        long,
        value_enum,
        help = "浏览分类列表，例如: popular, top_rated, now_playing"
    )]
    list: Option<Category>,

    /// Trending 时间窗口
    #[arg(short = 'r', long, value_enum, help = "查询热门趋势 (day / week)")]
    trend: Option<TimeWindow>,

    // ---------- discover / genre 相关参数 ----------
    /// 获取类型列表 (需要 --type movie 或 --type tv)
    #[arg(short='G', long, help = "输出当前媒体类型支持的所有分类及其 ID", conflicts_with_all = ["wd", "id", "list", "trend", "discover"])]
    genres: bool,

    /// 使用发现功能 (按条件筛选电影/剧集)
    #[arg(
        short,
        long,
        help = "开启高级筛选模式 (可配合 --genre, --year, --sort 等)"
    )]
    discover: bool,

    /// 类型 ID (逗号分隔，例如 28,12)，用于 --discover
    #[arg(
        short,
        long,
        value_delimiter = ',',
        help = "筛选类型 ID (多个用逗号分隔)"
    )]
    genre: Vec<u32>,

    /// 发行年份筛选，支持格式：2023（精确年份）、2021-2025（区间）、2021-（之后）、-2025（之前）
    #[arg(short = 'y', long, value_parser = parse_year_filter, allow_hyphen_values = true, help = "筛选发行年份，支持：2023, 2021-2025, 2021-, -2025")]
    year: Option<YearFilter>,

    /// 排序方式 (默认 popularity.desc)
    #[arg(
        long,
        value_enum,
        default_value = "popularity-desc",
        help = "排序字段.次序，例如 vote_average.desc"
    )]
    sort: SortBy,

    /// 图片尺寸
    #[arg(
        short = 's',
        long,
        value_enum,
        default_value = "w500",
        help = "图片尺寸"
    )]
    size: ImageSize,

    /// 输出原始 JSON（不格式化）
    #[arg(long, help = "输出未格式化的紧凑 JSON")]
    raw: bool,

    /// 只输出 results 数组 (若存在)
    #[arg(long, help = "仅输出结果数组（要求存在 results 字段）")]
    compact: bool,
}

fn parse_year_filter(s: &str) -> Result<YearFilter, String> {
    YearFilter::from_str(s)
}

#[derive(Debug, Clone, ValueEnum)]
enum MediaType {
    Multi,
    Movie,
    Tv,
    Person,
    Collection,
    Company,
}

impl MediaType {
    fn api_endpoint(&self, id: Option<u64>) -> Result<String> {
        match self {
            MediaType::Movie => Ok(format!("movie/{}", id.context("缺少 ID")?)),
            MediaType::Tv => Ok(format!("tv/{}", id.context("缺少 ID")?)),
            MediaType::Person => Ok(format!("person/{}", id.context("缺少 ID")?)),
            other => bail!("详情查询不支持类型: {:?}", other),
        }
    }
}

#[derive(Debug, Clone, ValueEnum)]
enum Category {
    Popular,
    TopRated,
    NowPlaying,
    Upcoming,
    AiringToday,
    OnTheAir,
}

#[derive(Debug, Clone, ValueEnum)]
enum TimeWindow {
    Day,
    Week,
}

impl TimeWindow {
    fn as_str(&self) -> &'static str {
        match self {
            TimeWindow::Day => "day",
            TimeWindow::Week => "week",
        }
    }
}

#[derive(Debug, Clone, ValueEnum)]
enum ImageSize {
    W92,
    W154,
    W185,
    W342,
    W500,
    W780,
    Original,
}

impl ImageSize {
    fn as_str(&self) -> &'static str {
        match self {
            ImageSize::W92 => "w92",
            ImageSize::W154 => "w154",
            ImageSize::W185 => "w185",
            ImageSize::W342 => "w342",
            ImageSize::W500 => "w500",
            ImageSize::W780 => "w780",
            ImageSize::Original => "original",
        }
    }
}

#[derive(Debug, Clone, ValueEnum)]
#[clap(rename_all = "kebab-case")]
enum SortBy {
    PopularityDesc,
    PopularityAsc,
    VoteAverageDesc,
    VoteAverageAsc,
    VoteCountDesc,
    VoteCountAsc,
    RevenueDesc,
    RevenueAsc,
    ReleaseDateDesc,
    ReleaseDateAsc,
    PrimaryReleaseDateDesc,
    PrimaryReleaseDateAsc,
    OriginalTitleDesc,
    OriginalTitleAsc,
}

impl SortBy {
    fn as_str(&self) -> &'static str {
        match self {
            SortBy::PopularityDesc => "popularity.desc",
            SortBy::PopularityAsc => "popularity.asc",
            SortBy::VoteAverageDesc => "vote_average.desc",
            SortBy::VoteAverageAsc => "vote_average.asc",
            SortBy::VoteCountDesc => "vote_count.desc",
            SortBy::VoteCountAsc => "vote_count.asc",
            SortBy::RevenueDesc => "revenue.desc",
            SortBy::RevenueAsc => "revenue.asc",
            SortBy::ReleaseDateDesc => "release_date.desc",
            SortBy::ReleaseDateAsc => "release_date.asc",
            SortBy::PrimaryReleaseDateDesc => "primary_release_date.desc",
            SortBy::PrimaryReleaseDateAsc => "primary_release_date.asc",
            SortBy::OriginalTitleDesc => "original_title.desc",
            SortBy::OriginalTitleAsc => "original_title.asc",
        }
    }
}

struct TmdbClient {
    client: reqwest::Client,
}

impl TmdbClient {
    fn new(api_key: &str) -> Result<Self> {
        let mut headers = HeaderMap::new();
        let header_value =
            HeaderValue::from_str(&format!("Bearer {}", api_key)).context("无效的 API Key")?;
        headers.insert(AUTHORIZATION, header_value);

        let client = reqwest::Client::builder()
            .default_headers(headers)
            .timeout(std::time::Duration::from_secs(30))
            .build()
            .context("构建 HTTP 客户端失败")?;

        Ok(Self { client })
    }

    async fn search(
        &self,
        query: &str,
        media_type: &MediaType,
        page: u32,
        lang: &str,
        adult: bool,
    ) -> Result<serde_json::Value> {
        let endpoint = match media_type {
            MediaType::Multi => "search/multi",
            MediaType::Movie => "search/movie",
            MediaType::Tv => "search/tv",
            MediaType::Person => "search/person",
            MediaType::Collection => "search/collection",
            MediaType::Company => "search/company",
        };

        let url = build_url(
            &format!("{}/{}", TMDB_BASE_URL, endpoint),
            &[
                ("query", query),
                ("page", &page.to_string()),
                ("language", lang),
                ("include_adult", &adult.to_string()),
            ],
        )?;

        self.client
            .get(url)
            .send()
            .await?
            .json()
            .await
            .map_err(Into::into)
    }

    async fn detail(
        &self,
        id: u64,
        media_type: &MediaType,
        lang: &str,
    ) -> Result<serde_json::Value> {
        let endpoint = media_type.api_endpoint(Some(id))?;
        let url = build_url(
            &format!("{}/{}", TMDB_BASE_URL, endpoint),
            &[("language", lang)],
        )?;
        self.client
            .get(url)
            .send()
            .await?
            .json()
            .await
            .map_err(Into::into)
    }

    async fn season_detail(
        &self,
        tv_id: u64,
        season_number: u32,
        lang: &str,
    ) -> Result<serde_json::Value> {
        let url = build_url(
            &format!("{}/tv/{}/season/{}", TMDB_BASE_URL, tv_id, season_number),
            &[("language", lang)],
        )?;
        self.client
            .get(url)
            .send()
            .await?
            .json()
            .await
            .map_err(Into::into)
    }

    async fn category_list(
        &self,
        media_type: &MediaType,
        category: &Category,
        page: u32,
        lang: &str,
    ) -> Result<serde_json::Value> {
        let endpoint = match (media_type, category) {
            (MediaType::Movie, Category::Popular) => "movie/popular",
            (MediaType::Movie, Category::TopRated) => "movie/top_rated",
            (MediaType::Movie, Category::NowPlaying) => "movie/now_playing",
            (MediaType::Movie, Category::Upcoming) => "movie/upcoming",
            (MediaType::Tv, Category::Popular) => "tv/popular",
            (MediaType::Tv, Category::TopRated) => "tv/top_rated",
            (MediaType::Tv, Category::AiringToday) => "tv/airing_today",
            (MediaType::Tv, Category::OnTheAir) => "tv/on_the_air",
            _ => bail!(
                "不支持的媒体类型与分类组合: {:?} / {:?}",
                media_type,
                category
            ),
        };
        let url = build_url(
            &format!("{}/{}", TMDB_BASE_URL, endpoint),
            &[("page", &page.to_string()), ("language", lang)],
        )?;
        self.client
            .get(url)
            .send()
            .await?
            .json()
            .await
            .map_err(Into::into)
    }

    async fn trending(
        &self,
        media_type: &MediaType,
        window: &TimeWindow,
        page: u32,
        lang: &str,
    ) -> Result<serde_json::Value> {
        let media = match media_type {
            MediaType::Movie => "movie",
            MediaType::Tv => "tv",
            MediaType::Person => "person",
            _ => "all",
        };
        let window_str = window.as_str();

        let url = build_url(
            &format!("{}/trending/{}/{}", TMDB_BASE_URL, media, window_str),
            &[("page", &page.to_string()), ("language", lang)],
        )?;
        self.client
            .get(url)
            .send()
            .await?
            .json()
            .await
            .map_err(Into::into)
    }

    async fn genre_list(&self, media_type: &MediaType) -> Result<serde_json::Value> {
        let endpoint = match media_type {
            MediaType::Movie => "genre/movie/list",
            MediaType::Tv => "genre/tv/list",
            _ => bail!("类型列表仅支持 movie 或 tv"),
        };
        let url = format!("{}/{}", TMDB_BASE_URL, endpoint);
        self.client
            .get(&url)
            .send()
            .await?
            .json()
            .await
            .map_err(Into::into)
    }

    async fn discover(
        &self,
        media_type: &MediaType,
        page: u32,
        lang: &str,
        genre_ids: &[u32],
        sort: &str,
        year_filter: Option<&YearFilter>,
    ) -> Result<serde_json::Value> {
        let base = match media_type {
            MediaType::Movie => format!("{}/discover/movie", TMDB_BASE_URL),
            MediaType::Tv => format!("{}/discover/tv", TMDB_BASE_URL),
            _ => bail!("discover 仅支持 movie 或 tv"),
        };

        let mut params: Vec<(&str, String)> = vec![
            ("page", page.to_string()),
            ("language", lang.to_string()),
            ("sort_by", sort.to_string()),
        ];

        if !genre_ids.is_empty() {
            let ids = genre_ids
                .iter()
                .map(|id| id.to_string())
                .collect::<Vec<_>>()
                .join(",");
            params.push(("with_genres", ids));
        }

        if let Some(filter) = year_filter {
            match filter {
                YearFilter::Exact(year) => {
                    params.push(("primary_release_year", year.to_string()));
                }
                YearFilter::Range { from, to } => {
                    if let Some(yf) = from {
                        params.push(("primary_release_date.gte", format!("{}-01-01", yf)));
                    }
                    if let Some(yt) = to {
                        params.push(("primary_release_date.lte", format!("{}-12-31", yt)));
                    }
                }
            }
        }

        let url = build_url_dynamic(&base, &params)?;
        self.client
            .get(url)
            .send()
            .await?
            .json()
            .await
            .map_err(Into::into)
    }
}

fn build_url(base: &str, params: &[(&str, &str)]) -> Result<Url> {
    let mut url = Url::parse(base).with_context(|| format!("无效的基础 URL: {}", base))?;
    {
        let mut pairs = url.query_pairs_mut();
        for (k, v) in params {
            pairs.append_pair(k, v);
        }
    }
    Ok(url)
}

fn build_url_dynamic(base: &str, params: &[(&str, String)]) -> Result<Url> {
    let mut url = Url::parse(base).with_context(|| format!("无效的基础 URL: {}", base))?;
    {
        let mut pairs = url.query_pairs_mut();
        for (k, v) in params {
            pairs.append_pair(k, v);
        }
    }
    Ok(url)
}

fn inject_image_urls(value: &mut serde_json::Value, size: &ImageSize) {
    const IMAGE_FIELDS: &[&str] = &[
        "poster_path",
        "backdrop_path",
        "profile_path",
        "still_path",
        "logo_path",
        "file_path",
    ];

    match value {
        serde_json::Value::Object(map) => {
            for field in IMAGE_FIELDS {
                if let Some(serde_json::Value::String(path)) = map.get(*field) {
                    let full_url = make_image_url(path, size);
                    if let Some(url) = full_url {
                        map.insert(format!("{}_url", field), serde_json::Value::String(url));
                    }
                }
            }
            for v in map.values_mut() {
                inject_image_urls(v, size);
            }
        }
        serde_json::Value::Array(arr) => {
            for v in arr {
                inject_image_urls(v, size);
            }
        }
        _ => {}
    }
}

fn make_image_url(path: &str, size: &ImageSize) -> Option<String> {
    if !path.is_empty() && path.starts_with('/') {
        Some(format!("{}/{}{}", TMDB_IMAGE_BASE, size.as_str(), path))
    } else {
        None
    }
}

fn print_json(value: &serde_json::Value, raw: bool) {
    if raw {
        println!("{}", value);
    } else {
        let output = serde_json::to_string_pretty(value).expect("JSON 序列化失败，这不应当发生");
        println!("{}", output);
    }
}

// 年份过滤器
#[derive(Debug, Clone)]
enum YearFilter {
    /// 精确年份
    Exact(i32),
    /// 年份区间 (from, to)，两端均包含
    Range { from: Option<i32>, to: Option<i32> },
}

impl FromStr for YearFilter {
    type Err = String;
    fn from_str(s: &str) -> Result<Self, Self::Err> {
        if s.is_empty() {
            return Err("年份不能为空".to_string());
        }
        // 尝试解析单个数字
        if let Ok(year) = s.parse::<i32>() {
            return Ok(YearFilter::Exact(year));
        }
        // 解析区间：可能形式 "from-to", "from-", "-to"
        if s.contains('-') {
            let parts: Vec<&str> = s.splitn(2, '-').collect();
            let left = parts[0].trim();
            let right = parts[1].trim();
            let from = if left.is_empty() {
                None
            } else {
                Some(
                    left.parse::<i32>()
                        .map_err(|_| format!("无效的起始年份: {}", left))?,
                )
            };
            let to = if right.is_empty() {
                None
            } else {
                Some(
                    right
                        .parse::<i32>()
                        .map_err(|_| format!("无效的结束年份: {}", right))?,
                )
            };
            if from.is_none() && to.is_none() {
                return Err("年份区间无效".to_string());
            }
            return Ok(YearFilter::Range { from, to });
        }
        Err(format!("无效的年份格式: {}", s))
    }
}

fn print_init(shell: Shell) {
    match shell {
        Shell::Bash => {
            println!(
                r#"_tmdb_completions() {{
    local cur prev
    COMPREPLY=()
    cur="${{COMP_WORDS[COMP_CWORD]}}"
    prev="${{COMP_WORDS[COMP_CWORD-1]}}"
    case $prev in
        --type|-t)
            COMPREPLY=($(compgen -W "multi movie tv person collection company" -- "$cur"))
            ;;
        --list|-l)
            COMPREPLY=($(compgen -W "popular top-rated now-playing upcoming airing-today on-the-air" -- "$cur"))
            ;;
        --trend|-r)
            COMPREPLY=($(compgen -W "day week" -- "$cur"))
            ;;
        --sort)
            COMPREPLY=($(compgen -W "popularity-desc popularity-asc vote-average-desc vote-average-asc vote-count-desc vote-count-asc revenue-desc revenue-asc release-date-desc release-date-asc primary-release-date-desc primary-release-date-asc original-title-desc original-title-asc" -- "$cur"))
            ;;
        --size|-s)
            COMPREPLY=($(compgen -W "w92 w154 w185 w342 w500 w780 original" -- "$cur"))
            ;;
    esac
    return 0
}}
complete -F _tmdb_completions tmdb
"#
            );
        }
        Shell::Zsh => {
            println!(
                r#"# tmdb zsh completion
tmdb_completion() {{
    local -a opts
    opts=(
        '(-w --wd)'{{-w,--wd}}'[搜索关键词]'
        '(-p --pg)'{{-p,--pg}}'[页码]'
        '(-L --lang)'{{-L,--lang}}'[语言]'
        '(-a --adult)'{{-a,--adult}}'[包含成人内容]'
        '(-t --type)'{{-t,--type}}'[媒体类型]: :(multi movie tv person collection company)'
        '(-i --id)'{{-i,--id}}'[TMDB ID]'
        '(-S --season)'{{-S,--season}}'[季号]'
        '(-l --list)'{{-l,--list}}'[列表]: :(popular top-rated now-playing upcoming airing-today on-the-air)'
        '(-r --trend)'{{-r,--trend}}'[趋势]: :(day week)'
        '--genres[类型列表]'
        '(-d --discover)'{{-d,--discover}}'[发现模式]'
        '(-g --genre)'{{-g,--genre}}'[类型ID]'
        '(-y --year)'{{-y,--year}}'[年份]'
        '--sort[排序]: :(popularity-desc popularity-asc vote-average-desc vote-average-asc vote-count-desc vote-count-asc revenue-desc revenue-asc release-date-desc release-date-asc primary-release-date-desc primary-release-date-asc original-title-desc original-title-asc)'
        '(-s --size)'{{-s,--size}}'[图片尺寸]: :(w92 w154 w185 w342 w500 w780 original)'
        '--raw[原始JSON]'
        '--compact[仅输出results]'
    )
    _arguments -s "$opts[@]" '*:query:_null'
}}
compdef tmdb_completion tmdb
"#
            );
        }
        Shell::Fish => {
            println!(
                r#"complete -c tmdb -n '__fish_use_subcommand' -s w -l wd -d '搜索关键词'
complete -c tmdb -n '__fish_use_subcommand' -s p -l pg -d '页码'
complete -c tmdb -n '__fish_use_subcommand' -s L -l lang -d '语言'
complete -c tmdb -n '__fish_use_subcommand' -s a -l adult -d '包含成人内容'
complete -c tmdb -n '__fish_use_subcommand' -s t -l type -r -a 'multi movie tv person collection company' -d '媒体类型'
complete -c tmdb -n '__fish_use_subcommand' -s i -l id -d 'TMDB ID'
complete -c tmdb -n '__fish_use_subcommand' -s S -l season -d '季号'
complete -c tmdb -n '__fish_use_subcommand' -s l -l list -r -a 'popular top-rated now-playing upcoming airing-today on-the-air' -d '列表'
complete -c tmdb -n '__fish_use_subcommand' -s r -l trend -r -a 'day week' -d '趋势'
complete -c tmdb -n '__fish_use_subcommand' --long genres -d '类型列表'
complete -c tmdb -n '__fish_use_subcommand' -s d -l discover -d '发现模式'
complete -c tmdb -n '__fish_use_subcommand' -s g -l genre -d '类型ID'
complete -c tmdb -n '__fish_use_subcommand' -s y -l year -d '年份'
complete -c tmdb -n '__fish_use_subcommand' -l sort -r -a 'popularity-desc popularity-asc vote-average-desc vote-average-asc vote-count-desc vote-count-asc revenue-desc revenue-asc release-date-desc release-date-asc primary-release-date-desc primary-release-date-asc original-title-desc original-title-asc' -d '排序'
complete -c tmdb -n '__fish_use_subcommand' -s s -l size -r -a 'w92 w154 w185 w342 w500 w780 original' -d '图片尺寸'
complete -c tmdb -n '__fish_use_subcommand' --long raw -d '原始JSON'
complete -c tmdb -n '__fish_use_subcommand' --long compact -d '仅输出results'
"#
            );
        }
        _ => {
            eprintln!("Unsupported shell: {:?}", shell);
        }
    }
}

fn main() -> Result<()> {
    // 检测 completion 参数
    let args: Vec<String> = std::env::args().collect();

    // --completions
    if let Some(pos) = args.iter().position(|a| a == "--completions") {
        if let Some(shell_str) = args.get(pos + 1) {
            if let Ok(shell) = shell_str.parse::<Shell>() {
                clap_complete::generate(shell, &mut Cli::command(), "tmdb", &mut std::io::stdout());
                return Ok(());
            }
        }
    }

    // --init
    if let Some(pos) = args.iter().position(|a| a == "--init") {
        if let Some(shell_str) = args.get(pos + 1) {
            if let Ok(shell) = shell_str.parse::<Shell>() {
                print_init(shell);
                return Ok(());
            }
        }
        // 默认 bash
        print_init(Shell::Bash);
        return Ok(());
    }

    // 正常解析参数
    let mut args = Cli::parse();

    // --season 自动将 type 设为 tv
    if args.season.is_some() && !matches!(args.ty, MediaType::Tv) {
        args.ty = MediaType::Tv;
    }
    // --discover 默认设为 movie
    if args.discover && matches!(args.ty, MediaType::Multi) {
        args.ty = MediaType::Movie;
    }

    let api_key = std::env::var("TMDB_API_KEY").context(
        "请设置环境变量 TMDB_API_KEY\n获取方式: https://www.themoviedb.org/settings/api",
    )?;
    let client = TmdbClient::new(&api_key)?;

    let rt = tokio::runtime::Runtime::new()?;
    rt.block_on(async {
        let result = if args.genres {
            client.genre_list(&args.ty).await
        } else if args.discover {
            client
                .discover(
                    &args.ty,
                    args.pg,
                    &args.lang,
                    &args.genre,
                    args.sort.as_str(),
                    args.year.as_ref(),
                )
                .await
        } else if let Some(category) = args.list {
            client
                .category_list(&args.ty, &category, args.pg, &args.lang)
                .await
        } else if let Some(trend) = args.trend {
            client.trending(&args.ty, &trend, args.pg, &args.lang).await
        } else if let Some(id) = args.id {
            match args.season {
                Some(season) => client.season_detail(id, season, &args.lang).await,
                None => client.detail(id, &args.ty, &args.lang).await,
            }
        } else if let Some(query) = &args.wd {
            client
                .search(query, &args.ty, args.pg, &args.lang, args.adult)
                .await
        } else {
            unreachable!()
        };

        match result {
            Ok(mut json) => {
                inject_image_urls(&mut json, &args.size);
                if args.compact && json.get("results").is_some() {
                    if let Some(results) = json.get("results") {
                        print_json(results, args.raw);
                    }
                } else {
                    print_json(&json, args.raw);
                }
                Ok(())
            }
            Err(e) => {
                eprintln!("请求失败: {:#}", e);
                std::process::exit(1);
            }
        }
    })
}
