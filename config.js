/**
 * Loadscreen Configuration
 */

/** Whether to use video as the first slide: true=use video, false=use image */
window.LOADSCREEN_USE_VIDEO = true;

/** Video file path (only effective when LOADSCREEN_USE_VIDEO = true): supports mp4, webm, ogg, etc. */
window.LOADSCREEN_VIDEO_URL = 'videos/intro.mp4';

/** Whether to play video muted: true=muted, false=with sound (Note: browser may require user interaction to play videos with sound) */
window.LOADSCREEN_VIDEO_MUTED = true;

/** Whether to loop video: true=loop, false=play once */
window.LOADSCREEN_VIDEO_LOOP = true;

/** Whether to show server custom logo: true=show, false=hide (quick toggle) */
window.LOADSCREEN_LOGO_ENABLED = false;

/** Server logo in top-left corner: fill in image path (e.g., images/logo.png), leave empty to hide (only effective when LOADSCREEN_LOGO_ENABLED = true) */
window.LOADSCREEN_LOGO_URL = 'images/logo.png';

/** Optional: Image list method (If not set, automatically try list.txt → this config → 1~80)
 * Method 1: Place list.txt in images/, one path per line, e.g., images/logo.png or logo.png
 * Method 2: Set the array below to "no suffix" filenames, auto-detects png/jpg/jpeg/webp/gif/bmp, e.g., ['logo','bg','intro']
 */
// window.LOADSCREEN_IMAGE_LIST_URL = 'images/list.txt';
// window.LOADSCREEN_IMAGE_NAMES = ['logo', 'bg', 'intro'];

/** Whether to enable background music: true=enable, false=disable (quick toggle) */
window.LOADSCREEN_BGM_ENABLED = false;

/** Background music source type:
 * 1 - Use video audio (only effective when video is enabled)
 * 2 - Use local audio file
 * 3 - Use external URL
 */
window.LOADSCREEN_BGM_SOURCE = 1;

/** Local audio file path (only effective when LOADSCREEN_BGM_SOURCE = 2): supports mp3, wav, ogg, etc. */
window.LOADSCREEN_BGM_LOCAL_URL = 'audio/bgm.mp3';

/** 外部链接音频（仅在 LOADSCREEN_BGM_SOURCE = 3 时生效） */
window.LOADSCREEN_BGM_URL = '';

/** 默认音量（0-100）：设置初始音量大小 */
window.LOADSCREEN_DEFAULT_VOLUME = 50;

/** 是否启用樱花点击特效：true=启用，false=关闭（默认关闭） */
window.LOADSCREEN_SAKURA_ENABLED = false;

/** Bottom tip text (can have multiple, auto-switches every 3 seconds) - format: 'Text' or ['Chinese', 'English'], English will display in parentheses below */
window.LOADSCREEN_TIPS = [
    ['天使之城——秩序与机遇并行.', 'City of Angels — where order meets opportunity.'],
    ['欢迎来到洛杉矶，新的故事即将开始.', 'Welcome to Los Angeles, your story starts now.'],
    ['准备上岗，L.A. 的每个街区都需要你.', 'Suit up, every block in L.A. needs you.'],
    ['在这座不夜城，责任从不下线.', 'In this city that never sleeps, duty never signs off.'],
    ['从市中心到海岸线，保持专业.', 'From Downtown to the coastline, stay professional.'],
    ['尊重角色，尊重规则，尊重每一位玩家.', 'Respect the role, the rules, and every player.'],
    ['每一次呼叫，都是一段新的剧情.', 'Every call is a new chapter.'],
    ['警灯亮起，洛圣都进入响应状态.', 'When the lights flash, Los Santos is in response mode.'],
    ['你的一言一行，塑造这座城市.', 'Your actions shape this city.'],
    ['连接洛杉矶网络中…', 'Connecting to Los Angeles network...'],
    ['保持冷静，加载很快完成.', 'Stay calm, loading will finish soon.'],
    ['遵循流程，团队协作优先.', 'Follow procedure, teamwork first.'],
    ['守住底线，才能守住城市.', 'Hold the line, hold the city.'],
    ['这里是洛杉矶，节奏快，标准更高.', 'This is Los Angeles: fast pace, higher standards.'],
    ['白天巡逻，夜晚值守，随时待命.', 'Patrol by day, stand watch by night.'],
    ['海风吹过港口，任务正在靠近.', 'Sea breeze over the port, another task inbound.'],
    ['请稍候，正在进入洛杉矶.', 'Please wait, entering Los Angeles...'],
    ['准备完毕后，舞台属于你.', 'When ready, the stage is yours.']
];
