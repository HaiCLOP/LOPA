/// App categorization engine — maps known applications to categories
/// Categories: productive, communication, entertainment, other

pub fn categorize_app(app_name: &str) -> &'static str {
    let name = app_name.to_lowercase();

    // ═══════════════════════════════════════════
    // Productive
    // ═══════════════════════════════════════════
    if name.contains("code") // VS Code, Visual Studio Code
        || name.contains("visual studio")
        || name.contains("intellij")
        || name.contains("pycharm")
        || name.contains("webstorm")
        || name.contains("rider")
        || name.contains("clion")
        || name.contains("goland")
        || name.contains("datagrip")
        || name.contains("sublime")
        || name.contains("notepad++")
        || name.contains("vim")
        || name.contains("nvim")
        || name.contains("emacs")
        || name.contains("atom")
        || name.contains("figma")
        || name.contains("sketch")
        || name.contains("adobe")
        || name.contains("photoshop")
        || name.contains("illustrator")
        || name.contains("premiere")
        || name.contains("after effects")
        || name.contains("blender")
        || name.contains("unity")
        || name.contains("unreal")
        || name.contains("terminal")
        || name.contains("powershell")
        || name.contains("cmd")
        || name.contains("windowsterminal")
        || name.contains("wt")
        || name.contains("git")
        || name.contains("postman")
        || name.contains("insomnia")
        || name.contains("docker")
        || name.contains("obsidian")
        || name.contains("notion")
        || name.contains("excel")
        || name.contains("word")
        || name.contains("powerpoint")
        || name.contains("onenote")
        || name.contains("libreoffice")
        || name.contains("google docs")
        || name.contains("sheets")
        || name.contains("dbgate")
        || name.contains("dbeaver")
        || name.contains("pgadmin")
        || name.contains("cursor")
        || name.contains("zed")
        || name.contains("windsurf")
    {
        return "productive";
    }

    // ═══════════════════════════════════════════
    // Communication
    // ═══════════════════════════════════════════
    if name.contains("discord")
        || name.contains("slack")
        || name.contains("teams")
        || name.contains("zoom")
        || name.contains("skype")
        || name.contains("telegram")
        || name.contains("whatsapp")
        || name.contains("signal")
        || name.contains("thunderbird")
        || name.contains("outlook")
        || name.contains("gmail")
        || name.contains("mail")
        || name.contains("meet")
        || name.contains("webex")
    {
        return "communication";
    }

    // ═══════════════════════════════════════════
    // Entertainment
    // ═══════════════════════════════════════════
    if name.contains("spotify")
        || name.contains("netflix")
        || name.contains("youtube")
        || name.contains("twitch")
        || name.contains("vlc")
        || name.contains("media player")
        || name.contains("steam")
        || name.contains("epic games")
        || name.contains("game")
        || name.contains("music")
        || name.contains("itunes")
        || name.contains("plex")
        || name.contains("disney")
        || name.contains("hbo")
        || name.contains("prime video")
        || name.contains("reddit")
        || name.contains("twitter")
        || name.contains("instagram")
        || name.contains("tiktok")
        || name.contains("facebook")
    {
        return "entertainment";
    }

    // ═══════════════════════════════════════════
    // Browsers — categorize as productive by default
    // (users typically use browsers for work)
    // ═══════════════════════════════════════════
    if name.contains("chrome")
        || name.contains("firefox")
        || name.contains("edge")
        || name.contains("brave")
        || name.contains("opera")
        || name.contains("arc")
        || name.contains("safari")
        || name.contains("vivaldi")
    {
        return "productive";
    }

    "other"
}

/// Get visual styling for an app (color + icon identifier)
pub fn get_app_visual(app_name: &str) -> (&'static str, &'static str) {
    let name = app_name.to_lowercase();

    if name.contains("code") || name.contains("cursor") || name.contains("zed") {
        return ("#007ACC", "vscode");
    }
    if name.contains("chrome") {
        return ("#4285F4", "chrome");
    }
    if name.contains("firefox") {
        return ("#FF7139", "firefox");
    }
    if name.contains("edge") {
        return ("#0078D4", "edge");
    }
    if name.contains("brave") {
        return ("#FB542B", "brave");
    }
    if name.contains("figma") {
        return ("#A259FF", "figma");
    }
    if name.contains("spotify") {
        return ("#1DB954", "spotify");
    }
    if name.contains("discord") {
        return ("#5865F2", "discord");
    }
    if name.contains("slack") {
        return ("#4A154B", "slack");
    }
    if name.contains("teams") {
        return ("#6264A7", "teams");
    }
    if name.contains("notion") {
        return ("#000000", "notion");
    }
    if name.contains("obsidian") {
        return ("#7C3AED", "obsidian");
    }
    if name.contains("terminal") || name.contains("powershell") || name.contains("cmd") || name.contains("wt") {
        return ("#1E1E1E", "terminal");
    }
    if name.contains("excel") {
        return ("#217346", "excel");
    }
    if name.contains("word") {
        return ("#2B579A", "word");
    }
    if name.contains("explorer") {
        return ("#F0C800", "explorer");
    }
    if name.contains("photoshop") {
        return ("#31A8FF", "photoshop");
    }
    if name.contains("postman") {
        return ("#FF6C37", "postman");
    }

    // Default: generate color from category
    let category = categorize_app(app_name);
    match category {
        "productive" => ("#22c55e", "default"),
        "communication" => ("#3b82f6", "default"),
        "entertainment" => ("#f59e0b", "default"),
        _ => ("#9ca3af", "default"),
    }
}
