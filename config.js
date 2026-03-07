/**
 * 加载屏配置
 */

/** 左上角服务器 LOGO：填图片路径（如 images/logo.png），留空则不显示 */
window.LOADSCREEN_LOGO_URL = 'images/logo.png';

/** 可选：图片列表方式（不写则自动尝试 list.txt → 本配置 → 1~80）
 * 方式一：在 images/ 下放 list.txt，每行一个路径，如 images/logo.png 或 logo.png
 * 方式二：设置下面数组为「无后缀」文件名，自动识别 png/jpg/jpeg/webp/gif/bmp，如 ['logo','bg','intro']
 */
// window.LOADSCREEN_IMAGE_LIST_URL = 'images/list.txt';
// window.LOADSCREEN_IMAGE_NAMES = ['logo', 'bg', 'intro'];

/** 背景音乐：填外部链接，留空则不播放 */
window.LOADSCREEN_BGM_URL = 'http://music.163.com/song/media/outer/url?id=2756582166.mp3';

/** 底部提示文案（可多条轮播，每 3 秒自动切换）- 格式：'中文' 或 [中文, 英文]，英文会显示在下方括号内 */
window.LOADSCREEN_TIPS = [
    ['自然之州——职责与社区在此交汇。', 'The Natural State — where duty and community meet.'],
    ['心怀敬畏进入，带着使命履职。', 'Enter with respect, serve with purpose.'],
    ['阿肯色：同一社区，同一标准。', 'Arkansas: One community, one standard.'],
    ['准备。响应。守护。', 'Prepare. Respond. Protect.'],
    ['你的使命，从这里开始。', 'Your mission begins here.'],
    ['欢迎来到自然之州，以荣誉立身。', 'Welcome to the Natural State. Stand with honor.'],
    ['正直。职责。自然之州之道。', 'Integrity. Duty. The Arkansas way.'],
    ['徽章因付出而获得，非轻易授予。', 'The badge is earned, not given.'],
    ['正在连接阿肯色。', 'Connecting to Arkansas...'],
    ['自然之州，静候你的到来。', 'The Natural State awaits you.'],
    ['遵守规则，尊重他人，享受角色。', 'Follow the rules, respect others, enjoy the role.'],
    ['每一次出警都是一次故事。', 'Every call is a story.'],
    ['警灯亮起时，责任重于一切。', 'When the lights go on, duty comes first.'],
    ['社区安全，从你我做起。', 'Community safety starts with us.'],
    ['以角色之名，书写阿肯色故事。', 'In character, we write the Arkansas story.'],
    ['耐心加载，精彩即将开始。', 'Loading... the best is yet to come.'],
    ['连接中，请稍候…', 'Connecting, please wait...'],
    ['我们在这里等你。', 'We are here for you.']
];
