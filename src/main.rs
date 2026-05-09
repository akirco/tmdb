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

/// TMDB CLI - Query movies, TV shows, actors from The Movie Database
#[derive(Parser, Debug)]
#[command(name = "tmdb")]
#[command(version = "0.1.0",styles = STYLES)]
#[command(
    after_help = "Shell completion:\n  # Method 1: Generate completion script (manual redirect)\n  tmdb --completions bash > ~/.local/share/bash-completion/completions/tmdb\n  tmdb --completions zsh > ~/.zsh/completions/_tmdb\n  tmdb --completions fish > ~/.config/fish/completions/tmdb.fish\n\n  # Method 2: eval init (recommended)\n  eval \"$(tmdb --init bash)\"\n  eval \"$(tmdb --init zsh)\"\n  tmdb --init fish | source"
)]
#[clap(group = ArgGroup::new("modes").required(true).args(&["wd", "id", "list", "trend", "discover", "genres"]))]
struct Cli {
    /// Search query
    #[arg(
        short,
        long,
        value_name = "QUERY",
        help = "Search movies, TV shows, actors in TMDB"
    )]
    wd: Option<String>,

    /// Page number
    #[arg(
        short,
        long,
        default_value = "1",
        help = "Page number for results/list"
    )]
    pg: u32,

    /// Language (e.g., zh-CN, en-US, ja-JP)
    #[arg(
        short = 'L',
        long,
        default_value = "zh-CN",
        help = "API response language"
    )]
    lang: String,

    /// Include adult content (only works with search)
    #[arg(short, long, help = "Include adult content")]
    adult: bool,

    /// Media type
    #[arg(
        short = 't',
        long = "type",
        value_enum,
        default_value = "multi",
        help = "Media type"
    )]
    ty: MediaType,

    /// TMDB ID (for details)
    #[arg(
        short,
        long,
        value_name = "ID",
        help = "Get movie/TV/actor details by ID"
    )]
    id: Option<u64>,

    /// Season number
    #[arg(
        short = 'S',
        long,
        help = "Get specific season info (use with --id or --wd)"
    )]
    season: Option<u32>,

    /// Browse category lists
    #[arg(
        short = 'l',
        long,
        value_enum,
        help = "Browse category lists: popular, top-rated, now-playing"
    )]
    list: Option<Category>,

    /// Trending time window
    #[arg(
        short = 'r',
        long,
        value_enum,
        help = "Trending time window (day / week)"
    )]
    trend: Option<TimeWindow>,

    // ---------- discover / genre options ----------
    /// Get genre list
    #[arg(short='G', long, help = "Output all genres for current media type", conflicts_with_all = ["wd", "id", "list", "trend", "discover"])]
    genres: bool,

    /// Use discover mode
    #[arg(
        short,
        long,
        help = "Enable advanced filter mode (use with --genre, --year, --sort)"
    )]
    discover: bool,

    /// Genre ID (comma-separated, e.g., 28,12), for --discover
    #[arg(
        short,
        long,
        value_delimiter = ',',
        help = "Filter by genre IDs (comma-separated)"
    )]
    genre: Vec<u32>,

    /// Release year filter
    #[arg(short = 'y', long, value_parser = parse_year_filter, allow_hyphen_values = true, help = "Filter by year: 2023, 2021-2025, 2021-, -2025")]
    year: Option<YearFilter>,

    /// Sort by field (default: popularity.desc)
    #[arg(
        long,
        value_enum,
        default_value = "popularity-desc",
        help = "Sort field.order, e.g., vote_average.desc"
    )]
    sort: SortBy,

    /// Image size
    #[arg(
        short = 's',
        long,
        value_enum,
        default_value = "w500",
        help = "Image size"
    )]
    size: ImageSize,

    /// Output raw JSON (no formatting)
    #[arg(long, help = "Output raw compact JSON")]
    raw: bool,

    /// Only output results array (if exists)
    #[arg(long, help = "Only output results array (requires results field)")]
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
            MediaType::Movie => Ok(format!("movie/{}", id.context("ID is required")?)),
            MediaType::Tv => Ok(format!("tv/{}", id.context("ID is required")?)),
            MediaType::Person => Ok(format!("person/{}", id.context("ID is required")?)),
            other => bail!("Detail query not supported for type: {:?}", other),
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
            HeaderValue::from_str(&format!("Bearer {}", api_key)).context("Invalid API Key")?;
        headers.insert(AUTHORIZATION, header_value);

        let client = reqwest::Client::builder()
            .default_headers(headers)
            .timeout(std::time::Duration::from_secs(30))
            .build()
            .context("Failed to build HTTP client")?;

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
                "Unsupported media type and category combination: {:?} / {:?}",
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
            _ => bail!("Genre list only supports movie or tv"),
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
            _ => bail!("Discover only supports movie or tv"),
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
    let mut url = Url::parse(base).with_context(|| format!("Invalid base URL: {}", base))?;
    {
        let mut pairs = url.query_pairs_mut();
        for (k, v) in params {
            pairs.append_pair(k, v);
        }
    }
    Ok(url)
}

fn build_url_dynamic(base: &str, params: &[(&str, String)]) -> Result<Url> {
    let mut url = Url::parse(base).with_context(|| format!("Invalid base URL: {}", base))?;
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
        let output = serde_json::to_string_pretty(value).expect("JSON serialization failed");
        println!("{}", output);
    }
}

// Year filter
#[derive(Debug, Clone)]
enum YearFilter {
    /// Exact year
    Exact(i32),
    /// Year range (from, to), both inclusive
    Range { from: Option<i32>, to: Option<i32> },
}

impl FromStr for YearFilter {
    type Err = String;
    fn from_str(s: &str) -> Result<Self, Self::Err> {
        if s.is_empty() {
            return Err("Year cannot be empty".to_string());
        }
        // Try parsing single number
        if let Ok(year) = s.parse::<i32>() {
            return Ok(YearFilter::Exact(year));
        }
        // Parse range: "from-to", "from-", "-to"
        if s.contains('-') {
            let parts: Vec<&str> = s.splitn(2, '-').collect();
            let left = parts[0].trim();
            let right = parts[1].trim();
            let from = if left.is_empty() {
                None
            } else {
                Some(
                    left.parse::<i32>()
                        .map_err(|_| format!("Invalid start year: {}", left))?,
                )
            };
            let to = if right.is_empty() {
                None
            } else {
                Some(
                    right
                        .parse::<i32>()
                        .map_err(|_| format!("Invalid end year: {}", right))?,
                )
            };
            if from.is_none() && to.is_none() {
                return Err("Invalid year range".to_string());
            }
            return Ok(YearFilter::Range { from, to });
        }
        Err(format!("Invalid year format: {}", s))
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
        '(-w --wd)'{{-w,--wd}}'[Search query]'
        '(-p --pg)'{{-p,--pg}}'[Page number]'
        '(-L --lang)'{{-L,--lang}}'[Language]'
        '(-a --adult)'{{-a,--adult}}'[Include adult content]'
        '(-t --type)'{{-t,--type}}'[Media type]: :(multi movie tv person collection company)'
        '(-i --id)'{{-i,--id}}'[TMDB ID]'
        '(-S --season)'{{-S,--season}}'[Season number]'
        '(-l --list)'{{-l,--list}}'[Category list]: :(popular top-rated now-playing upcoming airing-today on-the-air)'
        '(-r --trend)'{{-r,--trend}}'[Trend]: :(day week)'
        '--genres[Genre list]'
        '(-d --discover)'{{-d,--discover}}'[Discover mode]'
        '(-g --genre)'{{-g,--genre}}'[Genre ID]'
        '(-y --year)'{{-y,--year}}'[Year]'
        '--sort[Sort]: :(popularity-desc popularity-asc vote-average-desc vote-average-asc vote-count-desc vote-count-asc revenue-desc revenue-asc release-date-desc release-date-asc primary-release-date-desc primary-release-date-asc original-title-desc original-title-asc)'
        '(-s --size)'{{-s,--size}}'[Image size]: :(w92 w154 w185 w342 w500 w780 original)'
        '--raw[Raw JSON]'
        '--compact[Only results]'
    )
    _arguments -s "$opts[@]" '*:query:_null'
}}
compdef tmdb_completion tmdb
"#
            );
        }
        Shell::Fish => {
            println!(
                r#"complete -c tmdb -n '__fish_use_subcommand' -s w -l wd -d 'Search query'
complete -c tmdb -n '__fish_use_subcommand' -s p -l pg -d 'Page number'
complete -c tmdb -n '__fish_use_subcommand' -s L -l lang -d 'Language'
complete -c tmdb -n '__fish_use_subcommand' -s a -l adult -d 'Include adult content'
complete -c tmdb -n '__fish_use_subcommand' -s t -l type -r -a 'multi movie tv person collection company' -d 'Media type'
complete -c tmdb -n '__fish_use_subcommand' -s i -l id -d 'TMDB ID'
complete -c tmdb -n '__fish_use_subcommand' -s S -l season -d 'Season number'
complete -c tmdb -n '__fish_use_subcommand' -s l -l list -r -a 'popular top-rated now-playing upcoming airing-today on-the-air' -d 'Category list'
complete -c tmdb -n '__fish_use_subcommand' -s r -l trend -r -a 'day week' -d 'Trend'
complete -c tmdb -n '__fish_use_subcommand' --long genres -d 'Genre list'
complete -c tmdb -n '__fish_use_subcommand' -s d -l discover -d 'Discover mode'
complete -c tmdb -n '__fish_use_subcommand' -s g -l genre -d 'Genre ID'
complete -c tmdb -n '__fish_use_subcommand' -s y -l year -d 'Year'
complete -c tmdb -n '__fish_use_subcommand' -l sort -r -a 'popularity-desc popularity-asc vote-average-desc vote-average-asc vote-count-desc vote-count-asc revenue-desc revenue-asc release-date-desc release-date-asc primary-release-date-desc primary-release-date-asc original-title-desc original-title-asc' -d 'Sort'
complete -c tmdb -n '__fish_use_subcommand' -s s -l size -r -a 'w92 w154 w185 w342 w500 w780 original' -d 'Image size'
complete -c tmdb -n '__fish_use_subcommand' --long raw -d 'Raw JSON'
complete -c tmdb -n '__fish_use_subcommand' --long compact -d 'Only results'
"#
            );
        }
        _ => {
            eprintln!("Unsupported shell: {:?}", shell);
        }
    }
}

fn main() -> Result<()> {
    // Check completion flag
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
        // Default to bash
        print_init(Shell::Bash);
        return Ok(());
    }

    // Normal parsing
    let mut args = Cli::parse();

    // --season auto set type to tv
    if args.season.is_some() && !matches!(args.ty, MediaType::Tv) {
        args.ty = MediaType::Tv;
    }
    // --discover default to movie
    if args.discover && matches!(args.ty, MediaType::Multi) {
        args.ty = MediaType::Movie;
    }

    let api_key = std::env::var("TMDB_API_KEY").context(
        "Please set TMDB_API_KEY environment variable\nGet it at: https://www.themoviedb.org/settings/api",
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
                eprintln!("Request failed: {:#}", e);
                std::process::exit(1);
            }
        }
    })
}
