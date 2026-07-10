let sudoPassword = ''
// 扫描出来的清理列表
let scanData = {}
// 默认仪表盘界面
let currentView = 'dashboard'
// 白名单列表
let userWhiteList = []

// 预设白名单
const defaultWhitelist = [
  // KeePassXC 配置
  '~/Library/Caches/KeePassXC',
  // VPN 代理服务配置
  '/private/var/log/privoxy',
  // 本地同步状态缓存
  '~/Library/Caches/CloudKit',
  '~/Library/HTTPStorages/com.apple.itunescloudd',
  // Apple 认证票据管理
  '~/Library/HTTPStorages/com.apple.akd',
  // 媒体服务账户
  '~/Library/HTTPStorages/com.apple.amsaccountsd',
  // Apple ID 账户服务持久化
  '~/Library/HTTPStorages/com.apple.appleaccountd'
]

// 清理目录配置表
const categories = {
  用户缓存: [
    '~/Library/iTunes/iPhone\\ Software\\ Updates',
    '~/Library/Containers/*/Data/Library/Caches',
    '~/Library/Containers/*/Data/tmp',
    '~/Movies/*.fcpbundle/*/Render\\ Files/*',
    '~/Movies/Final\\ Cut\\ Backups.localized',
    '~/Movies/JianyingPro/User\\ Data/Cache',
    '~/Library/HTTPStorages/*',
    '~/Library/WebKit',
    '~/Library/Application\\ Support/MobileSync/Backup',
    '~/Library/Application\\ Support/*/Cache',
    '~/Library/Application\\ Support/*/Caches',
    '~/Library/Application\\ Support/*/GPUCache',
    '~/Library/Application\\ Support/*/DawnGraphiteCache',
    '~/Library/Application\\ Support/*/DawnWebGPUCache',
    '~/Library/Application\\ Support/*/DawnCache',
    '~/Library/Application\\ Support/*/Service\\ Worker',
    '~/Library/Application\\ Support/coreMLCache',
    '~/Library/Application\\ Support/Combo\\ Cleaner',
    '~/Library/Application\\ Support/CleanShot',
    // 会导致 Finder 收藏列表被重置
    // '~/Library/Application\\ Support/com.apple.sharedfilelist/*.sfl*',
    '~/Library/Group\\ Containers/*.com.apple.videoProApps/com.apple.FinalCut/Caches',
    '~Library/Group\\ Containers/group.com.apple.CoreSpeech/Caches/onDeviceCompilationCaches',
    '~/Library/Group\\ Containers/group.com.apple.storekit/Library/Caches',
    '~/Library/Group\\ Containers/group.com.apple.CoreSpeech/Caches/onDeviceCompilationCaches',
    '~/Library/Group\\ Containers/*.ru.keepcoder.Telegram/stable/account-*/postbox/media ',
    '~/Library/Containers/com.bitdefender.BitdefenderVirusScanner/Data/Library/Application\\ Support/Bitdefender\\ Virus\\ Scanner/antivirus.bundle',
    '~/Library/Containers/com.bitdefender.BitdefenderVirusScanner/Data/Library/Caches/com.bitdefender.BitdefenderVirusScanner',
    '~/Library/Saved Application\\ State'
  ],
  系统缓存: [
    '~/Library/Caches',
    '/Library/Caches/Desktop\\ Pictures/*/*',
    '/private/var/folders/*/*/*/*/*.exe',
    '/private/var/folders/*/*/*/clang/ModuleCache',
    '/private/var/folders/*/*/*/com.google.Chrome.helper',
    '/private/var/folders/*/*/*/SpeechModelCache',
    '/private/var/folders/*/*/*/*/com.apple.metal',
    '/private/var/folders/*/*/*/com.apple.metal',
    '/private/var/folders/*/*/*/*/com.apple.metalfe',
    '/private/var/folders/*/*/*/*/com.apple.gpuarchiver',
    '/private/var/folders/*/*/*/com.apple.Safari.SafeBrowsing',
    '/private/var/folders/*/*/*/com.apple.DeveloperTools',
    '/private/var/folders/*/*/*/com.apple.FinalCut',
    '/private/var/folders/*/*/*/com.apple.FontRegistry',
    '/private/var/folders/*/*/*/com.apple.avconferenced',
    '/private/var/folders/*/*/*/com.apple.QuickTimePlayerX',
    '/private/var/folders/*/*/*/com.apple.mediaanalysisd',
    '/private/var/folders/*/*/*/com.apple.weather',
    '/private/var/folders/*/*/*/node-compile-cache',
    '/private/var/folders/*/*/*/com.apple.notificationcenterui',
    '/private/var/folders/*/*/*/org.photoscape.PhotoScapeX',
    '/private/var/folders/*/*/*/com.vmware.mksSandbox',
    '/private/var/folders/*/*/*/com.apple.replayd',
    '/private/var/folders/*/*/*/com.apple.quicklook.QuickLookUIService',
    '/private/var/folders/*/*/*/com.goodsnooze.MacWhisper',
    '/private/var/folders/*/*/*/com.apple.AvatarUI.AvatarPickerMemojiPicker',
    '/private/var/folders/*/*/*/com.apple.Photos',
    '/private/var/folders/*/*/*/com.apple.PaperKit.extension.ui',
    '/private/var/folders/*/*/*/com.apple.WebPrivacy',
    '/private/var/folders/*/*/*/com.apple.Preview',
    '/private/var/folders/*/*/*/com.apple.iconservices',
    '/private/var/folders/*/*/*/com.apple.Notes',
    '/private/var/folders/*/*/*/com.apple.reminders',
    '/private/var/folders/*/*/*/com.apple.mail',
    '/private/var/folders/*/*/*/com.apple.VoiceMemos',
    '/private/var/folders/*/*/*/com.apple.podcasts',
    '/private/var/folders/*/*/*/com.apple.wallpaper.extension.macintosh',
    '/private/var/folders/*/*/*/com.apple.WorkflowKit.BackgroundShortcutRunner',
    '/private/var/folders/*/*/*/com.apple.photos.ImageConversionService',
    '/private/var/folders/*/*/*/com.apple.tccd',
    '/private/var/folders/*/*/*/com.apple.shortcuts',
    '/private/var/folders/*/*/*/com.apple.Chess',
    '/private/var/folders/*/*/*/com.apple.freeform',
    '/private/var/tmp/com.apple.messages',
    '/private/tmp/gzexe*',
    '/Library/Caches/com.microsoft.autoupdate',
    '/Library/Application\\ Support/Logi/LogiOptionsPlus/cache',
    '/private/var/folders/*/*/*/*.tmp'
  ],
  浏览器: [
    // Blink
    // Google Chrome
    '~/Library/Application\\ Support/Google/Chrome/*/GPUCache',
    '~/Library/Application\\ Support/Google/Chrome/*/Storage/ext/*/def/GPUCache',
    '~/Library/Application\\ Support/Google/Chrome/*/*-journal',
    '~/Library/Application\\ Support/Google/Chrome/*/databases/*-journal',
    '~/Library/Application\\ Support/Google/Chrome/*/Visited\\ Links',
    '~/Library/Application\\ Support/Google/Chrome/*/Top\\ Sites',
    '~/Library/Application\\ Support/Google/Chrome/*/History\\ Provider\\ Cache',
    '~/Library/Application\\ Support/Google/Chrome/*/Current\\ Tabs',
    '~/Library/Application\\ Support/Google/Chrome/*/Network\\ Action\\ Predictor',
    '~/Library/Application\\ Support/Google/Chrome/*/*.ldb',
    '~/Library/Application\\ Support/Google/Chrome/*/*.log',
    '~/Library/Application\\ Support/Google/Chrome/*/Extension\\ State',
    '~/Library/Application\\ Support/Google/Chrome/*/Session\\ Storage',
    '~/Library/Application\\ Support/Google/Chrome/*/Current\\ Session',
    '~/Library/Application\\ Support/Google/Chrome/*/Storage/ext',
    '~/Library/Application\\ Support/Google/Chrome/*/*/Cache',
    '~/Library/Application\\ Support/Google/Chrome/*/GrShaderCache',
    '~/Library/Application\\ Support/Google/Chrome/*/Service\\ Worker/CacheStorage',
    '~/Library/Application\\ Support/Google/Chrome/*/shared_proto_db',
    '~/Library/Application\\ Support/Google/Chrome/*/Service\\ Worker',
    '~/Library/Application\\ Support/Google/Chrome/ShaderCache',
    '~/Library/Application\\ Support/Google/Chrome/component_crx_cache',
    // Chrome Canary
    '~/Library/Application\\ Support/Google/Chrome\\ Canary/*/GPUCache',
    '~/Library/Application\\ Support/Google/Chrome\\ Canary/*/Storage/ext/*/def/GPUCache',
    '~/Library/Application\\ Support/Google/Chrome\\ Canary/*/*-journal',
    '~/Library/Application\\ Support/Google/Chrome\\ Canary/*/databases/*-journal',
    '~/Library/Application\\ Support/Google/Chrome\\ Canary/*/Visited\\ Links',
    '~/Library/Application\\ Support/Google/Chrome\\ Canary/*/Top\\ Sites',
    '~/Library/Application\\ Support/Google/Chrome\\ Canary/*/History\\ Provider\\ Cache',
    '~/Library/Application\\ Support/Google/Chrome\\ Canary/*/Current\\ Tabs',
    '~/Library/Application\\ Support/Google/Chrome\\ Canary/*/Network\\ Action\\ Predictor',
    '~/Library/Application\\ Support/Google/Chrome\\ Canary/*/*.ldb',
    '~/Library/Application\\ Support/Google/Chrome\\ Canary/*/*.log',
    '~/Library/Application\\ Support/Google/Chrome\\ Canary/*/Extension\\ State',
    '~/Library/Application\\ Support/Google/Chrome\\ Canary/*/Session\\ Storage',
    '~/Library/Application\\ Support/Google/Chrome\\ Canary/*/Current\\ Session',
    '~/Library/Application\\ Support/Google/Chrome\\ Canary/*/Storage/ext',
    '~/Library/Application\\ Support/Google/Chrome\\ Canary/*/*/Cache',
    '~/Library/Application\\ Support/Google/Chrome\\ Canary/*/GrShaderCache',
    '~/Library/Application\\ Support/Google/Chrome\\ Canary/*/Service\\ Worker/CacheStorage',
    '~/Library/Application\\ Support/Google/Chrome\\ Canary/*/shared_proto_db',
    '~/Library/Application\\ Support/Google/Chrome\\ Canary/*/Service\\ Worker',
    '~/Library/Application\\ Support/Google/Chrome\\ Canary/ShaderCache',
    '~/Library/Application\\ Support/Google/Chrome\\ Canary/component_crx_cache',
    // Chromium
    '~/Library/Application\\ Support/Chromium/*/GPUCache',
    '~/Library/Application\\ Support/Chromium/*/Storage/ext/*/def/GPUCache',
    '~/Library/Application\\ Support/Chromium/*/*-journal',
    '~/Library/Application\\ Support/Chromium/*/databases/*-journal',
    '~/Library/Application\\ Support/Chromium/*/Visited\\ Links',
    '~/Library/Application\\ Support/Chromium/*/Top\\ Sites',
    '~/Library/Application\\ Support/Chromium/*/History\\ Provider\\ Cache',
    '~/Library/Application\\ Support/Chromium/*/Current\\ Tabs',
    '~/Library/Application\\ Support/Chromium/*/Network\\ Action\\ Predictor',
    '~/Library/Application\\ Support/Chromium/*/*.ldb',
    '~/Library/Application\\ Support/Chromium/*/*.log',
    '~/Library/Application\\ Support/Chromium/*/Extension\\ State',
    '~/Library/Application\\ Support/Chromium/*/Session\\ Storage',
    '~/Library/Application\\ Support/Chromium/*/Current\\ Session',
    '~/Library/Application\\ Support/Chromium/*/Storage/ext',
    '~/Library/Application\\ Support/Chromium/*/*/Cache',
    '~/Library/Application\\ Support/Chromium/*/GrShaderCache',
    '~/Library/Application\\ Support/Chromium/*/Service\\ Worker/CacheStorage',
    '~/Library/Application\\ Support/Chromium/*/shared_proto_db',
    '~/Library/Application\\ Support/Chromium/*/Service\\ Worker',
    '~/Library/Application\\ Support/Chromium/ShaderCache',
    '~/Library/Application\\ Support/Chromium/component_crx_cache',
    // Thorium
    '~/Library/Application\\ Support/Thorium/*/GPUCache',
    '~/Library/Application\\ Support/Thorium/*/Storage/ext/*/def/GPUCache',
    '~/Library/Application\\ Support/Thorium/*/*-journal',
    '~/Library/Application\\ Support/Thorium/*/databases/*-journal',
    '~/Library/Application\\ Support/Thorium/*/Visited\\ Links',
    '~/Library/Application\\ Support/Thorium/*/Top\\ Sites',
    '~/Library/Application\\ Support/Thorium/*/History\\ Provider\\ Cache',
    '~/Library/Application\\ Support/Thorium/*/Current\\ Tabs',
    '~/Library/Application\\ Support/Thorium/*/Network\\ Action\\ Predictor',
    '~/Library/Application\\ Support/Thorium/*/*.ldb',
    '~/Library/Application\\ Support/Thorium/*/*.log',
    '~/Library/Application\\ Support/Thorium/*/Extension\\ State',
    '~/Library/Application\\ Support/Thorium/*/Session\\ Storage',
    '~/Library/Application\\ Support/Thorium/*/Current\\ Session',
    '~/Library/Application\\ Support/Thorium/*/Storage/ext',
    '~/Library/Application\\ Support/Thorium/*/*/Cache',
    '~/Library/Application\\ Support/Thorium/*/GrShaderCache',
    '~/Library/Application\\ Support/Thorium/*/Service\\ Worker/CacheStorage',
    '~/Library/Application\\ Support/Thorium/*/shared_proto_db',
    '~/Library/Application\\ Support/Thorium/*/Service\\ Worker',
    '~/Library/Application\\ Support/Thorium/ShaderCache',
    '~/Library/Application\\ Support/Thorium/component_crx_cache',
    // Brave Browser
    '~/Library/Application\\ Support/BraveSoftware/Brave-Browser/*/GPUCache',
    '~/Library/Application\\ Support/BraveSoftware/Brave-Browser/*/Storage/ext/*/def/GPUCache',
    '~/Library/Application\\ Support/BraveSoftware/Brave-Browser/*/*-journal',
    '~/Library/Application\\ Support/BraveSoftware/Brave-Browser/*/databases/*-journal',
    '~/Library/Application\\ Support/BraveSoftware/Brave-Browser/*/Visited\\ Links',
    '~/Library/Application\\ Support/BraveSoftware/Brave-Browser/*/Top\\ Sites',
    '~/Library/Application\\ Support/BraveSoftware/Brave-Browser/*/History\\ Provider\\ Cache',
    '~/Library/Application\\ Support/BraveSoftware/Brave-Browser/*/Current\\ Tabs',
    '~/Library/Application\\ Support/BraveSoftware/Brave-Browser/*/Network\\ Action\\ Predictor',
    '~/Library/Application\\ Support/BraveSoftware/Brave-Browser/*/*.ldb',
    '~/Library/Application\\ Support/BraveSoftware/Brave-Browser/*/*.log',
    '~/Library/Application\\ Support/BraveSoftware/Brave-Browser/*/Extension\\ State',
    '~/Library/Application\\ Support/BraveSoftware/Brave-Browser/*/Session\\ Storage',
    '~/Library/Application\\ Support/BraveSoftware/Brave-Browser/*/Current\\ Session',
    '~/Library/Application\\ Support/BraveSoftware/Brave-Browser/*/Storage/ext',
    '~/Library/Application\\ Support/BraveSoftware/Brave-Browser/*/*/Cache',
    '~/Library/Application\\ Support/BraveSoftware/Brave-Browser/*/GrShaderCache',
    '~/Library/Application\\ Support/BraveSoftware/Brave-Browser/*/Service\\ Worker/CacheStorage',
    '~/Library/Application\\ Support/BraveSoftware/Brave-Browser/*/shared_proto_db',
    '~/Library/Application\\ Support/BraveSoftware/Brave-Browser/*/Service\\ Worker',
    '~/Library/Application\\ Support/BraveSoftware/Brave-Browser/ShaderCache',
    '~/Library/Application\\ Support/BraveSoftware/Brave-Browser/component_crx_cache',
    // Microsoft Edge
    '~/Library/Application\\ Support/Microsoft\\ Edge/*/GPUCache',
    '~/Library/Application\\ Support/Microsoft\\ Edge/*/Storage/ext/*/def/GPUCache',
    '~/Library/Application\\ Support/Microsoft\\ Edge/*/*-journal',
    '~/Library/Application\\ Support/Microsoft\\ Edge/*/databases/*-journal',
    '~/Library/Application\\ Support/Microsoft\\ Edge/*/Visited\\ Links',
    '~/Library/Application\\ Support/Microsoft\\ Edge/*/Top\\ Sites',
    '~/Library/Application\\ Support/Microsoft\\ Edge/*/History\\ Provider\\ Cache',
    '~/Library/Application\\ Support/Microsoft\\ Edge/*/Current\\ Tabs',
    '~/Library/Application\\ Support/Microsoft\\ Edge/*/Network\\ Action\\ Predictor',
    '~/Library/Application\\ Support/Microsoft\\ Edge/*/*.ldb',
    '~/Library/Application\\ Support/Microsoft\\ Edge/*/*.log',
    '~/Library/Application\\ Support/Microsoft\\ Edge/*/Extension\\ State',
    '~/Library/Application\\ Support/Microsoft\\ Edge/*/Session\\ Storage',
    '~/Library/Application\\ Support/Microsoft\\ Edge/*/Current\\ Session',
    '~/Library/Application\\ Support/Microsoft\\ Edge/*/Storage/ext',
    '~/Library/Application\\ Support/Microsoft\\ Edge/*/*/Cache',
    '~/Library/Application\\ Support/Microsoft\\ Edge/*/GrShaderCache',
    '~/Library/Application\\ Support/Microsoft\\ Edge/*/Service\\ Worker/CacheStorage',
    '~/Library/Application\\ Support/Microsoft\\ Edge/*/shared_proto_db',
    '~/Library/Application\\ Support/Microsoft\\ Edge/*/Service\\ Worker',
    '~/Library/Application\\ Support/Microsoft\\ Edge/ShaderCache',
    '~/Library/Application\\ Support/Microsoft\\ Edge/component_crx_cache',
    // Arc
    '~/Library/Application\\ Support/Arc/User\\ Data/*/GPUCache',
    '~/Library/Application\\ Support/Arc/User\\ Data/*/Storage/ext/*/def/GPUCache',
    '~/Library/Application\\ Support/Arc/User\\ Data/*/*-journal',
    '~/Library/Application\\ Support/Arc/User\\ Data/*/databases/*-journal',
    '~/Library/Application\\ Support/Arc/User\\ Data/*/Visited\\ Links',
    '~/Library/Application\\ Support/Arc/User\\ Data/*/Top\\ Sites',
    '~/Library/Application\\ Support/Arc/User\\ Data/*/History\\ Provider\\ Cache',
    '~/Library/Application\\ Support/Arc/User\\ Data/*/Current\\ Tabs',
    '~/Library/Application\\ Support/Arc/User\\ Data/*/Network\\ Action\\ Predictor',
    '~/Library/Application\\ Support/Arc/User\\ Data/*/*.ldb',
    '~/Library/Application\\ Support/Arc/User\\ Data/*/*.log',
    '~/Library/Application\\ Support/Arc/User\\ Data/*/Extension\\ State',
    '~/Library/Application\\ Support/Arc/User\\ Data/*/Session\\ Storage',
    '~/Library/Application\\ Support/Arc/User\\ Data/*/Current\\ Session',
    '~/Library/Application\\ Support/Arc/User\\ Data/*/Storage/ext',
    '~/Library/Application\\ Support/Arc/User\\ Data/*/*/Cache',
    '~/Library/Application\\ Support/Arc/User\\ Data/*/GrShaderCache',
    '~/Library/Application\\ Support/Arc/User\\ Data/*/Service\\ Worker/CacheStorage',
    '~/Library/Application\\ Support/Arc/User\\ Data/*/shared_proto_db',
    '~/Library/Application\\ Support/Arc/User\\ Data/*/Service\\ Worker',
    '~/Library/Application\\ Support/Arc/User\\ Data/ShaderCache',
    '~/Library/Application\\ Support/Arc/User\\ Data/*/component_crx_cache',
    // Ecosia Browser
    '~/Library/Application\\ Support/EcosiaBrowser/*/GPUCache',
    '~/Library/Application\\ Support/EcosiaBrowser/*/Storage/ext/*/def/GPUCache',
    '~/Library/Application\\ Support/EcosiaBrowser/*/*-journal',
    '~/Library/Application\\ Support/EcosiaBrowser/*/databases/*-journal',
    '~/Library/Application\\ Support/EcosiaBrowser/*/Visited\\ Links',
    '~/Library/Application\\ Support/EcosiaBrowser/*/Top\\ Sites',
    '~/Library/Application\\ Support/EcosiaBrowser/*/History\\ Provider\\ Cache',
    '~/Library/Application\\ Support/EcosiaBrowser/*/Current\\ Tabs',
    '~/Library/Application\\ Support/EcosiaBrowser/*/Network\\ Action\\ Predictor',
    '~/Library/Application\\ Support/EcosiaBrowser/*/*.ldb',
    '~/Library/Application\\ Support/EcosiaBrowser/*/*.log',
    '~/Library/Application\\ Support/EcosiaBrowser/*/Extension\\ State',
    '~/Library/Application\\ Support/EcosiaBrowser/*/Session\\ Storage',
    '~/Library/Application\\ Support/EcosiaBrowser/*/Current\\ Session',
    '~/Library/Application\\ Support/EcosiaBrowser/*/Storage/ext',
    '~/Library/Application\\ Support/EcosiaBrowser/*/*/Cache',
    '~/Library/Application\\ Support/EcosiaBrowser/*/GrShaderCache',
    '~/Library/Application\\ Support/EcosiaBrowser/*/Service\\ Worker/CacheStorage',
    '~/Library/Application\\ Support/EcosiaBrowser/*/shared_proto_db',
    '~/Library/Application\\ Support/EcosiaBrowser/*/Service\\ Worker',
    '~/Library/Application\\ Support/EcosiaBrowser/ShaderCache',
    '~/Library/Application\\ Support/EcosiaBrowser/component_crx_cache',
    // Yandex
    '~/Library/Application\\ Support/Yandex/YandexBrowser/*/GPUCache',
    '~/Library/Application\\ Support/Yandex/YandexBrowser/*/Storage/ext/*/def/GPUCache',
    '~/Library/Application\\ Support/Yandex/YandexBrowser/*/*-journal',
    '~/Library/Application\\ Support/Yandex/YandexBrowser/*/databases/*-journal',
    '~/Library/Application\\ Support/Yandex/YandexBrowser/*/Visited\\ Links',
    '~/Library/Application\\ Support/Yandex/YandexBrowser/*/Top\\ Sites',
    '~/Library/Application\\ Support/Yandex/YandexBrowser/*/History\\ Provider\\ Cache',
    '~/Library/Application\\ Support/Yandex/YandexBrowser/*/Current\\ Tabs',
    '~/Library/Application\\ Support/Yandex/YandexBrowser/*/Network\\ Action\\ Predictor',
    '~/Library/Application\\ Support/Yandex/YandexBrowser/*/*.ldb',
    '~/Library/Application\\ Support/Yandex/YandexBrowser/*/*.log',
    '~/Library/Application\\ Support/Yandex/YandexBrowser/*/Extension\\ State',
    '~/Library/Application\\ Support/Yandex/YandexBrowser/*/Session\\ Storage',
    '~/Library/Application\\ Support/Yandex/YandexBrowser/*/Current\\ Session',
    '~/Library/Application\\ Support/Yandex/YandexBrowser/*/Storage/ext',
    '~/Library/Application\\ Support/Yandex/YandexBrowser/*/*/Cache',
    '~/Library/Application\\ Support/Yandex/YandexBrowser/*/GrShaderCache',
    '~/Library/Application\\ Support/Yandex/YandexBrowser/*/Service\\ Worker/CacheStorage',
    '~/Library/Application\\ Support/Yandex/YandexBrowser/*/shared_proto_db',
    '~/Library/Application\\ Support/Yandex/YandexBrowser/*/Service\\ Worker',
    '~/Library/Application\\ Support/Yandex/YandexBrowser/ShaderCache',
    '~/Library/Application\\ Support/Yandex/YandexBrowser/component_crx_cache',
    // Vivaldi
    '~/Library/Application\\ Support/Vivaldi/*/GPUCache',
    '~/Library/Application\\ Support/Vivaldi/*/Storage/ext/*/def/GPUCache',
    '~/Library/Application\\ Support/Vivaldi/*/*-journal',
    '~/Library/Application\\ Support/Vivaldi/*/databases/*-journal',
    '~/Library/Application\\ Support/Vivaldi/*/Visited\\ Links',
    '~/Library/Application\\ Support/Vivaldi/*/Top\\ Sites',
    '~/Library/Application\\ Support/Vivaldi/*/History\\ Provider\\ Cache',
    '~/Library/Application\\ Support/Vivaldi/*/Current\\ Tabs',
    '~/Library/Application\\ Support/Vivaldi/*/Network\\ Action\\ Predictor',
    '~/Library/Application\\ Support/Vivaldi/*/*.ldb',
    '~/Library/Application\\ Support/Vivaldi/*/*.log',
    '~/Library/Application\\ Support/Vivaldi/*/Extension\\ State',
    '~/Library/Application\\ Support/Vivaldi/*/Session\\ Storage',
    '~/Library/Application\\ Support/Vivaldi/*/Current\\ Session',
    '~/Library/Application\\ Support/Vivaldi/*/Storage/ext',
    '~/Library/Application\\ Support/Vivaldi/*/*/Cache',
    '~/Library/Application\\ Support/Vivaldi/*/GrShaderCache',
    '~/Library/Application\\ Support/Vivaldi/*/Service\\ Worker/CacheStorage',
    '~/Library/Application\\ Support/Vivaldi/*/shared_proto_db',
    '~/Library/Application\\ Support/Vivaldi/*/Service\\ Worker',
    '~/Library/Application\\ Support/Vivaldi/ShaderCache',
    '~/Library/Application\\ Support/Vivaldi/component_crx_cache',
    // Tabbit
    '~/Library/Application\\ Support/Tabbit/*/GPUCache',
    '~/Library/Application\\ Support/Tabbit/*/Storage/ext/*/def/GPUCache',
    '~/Library/Application\\ Support/Tabbit/*/*-journal',
    '~/Library/Application\\ Support/Tabbit/*/databases/*-journal',
    '~/Library/Application\\ Support/Tabbit/*/Visited\\ Links',
    '~/Library/Application\\ Support/Tabbit/*/Top\\ Sites',
    '~/Library/Application\\ Support/Tabbit/*/History\\ Provider\\ Cache',
    '~/Library/Application\\ Support/Tabbit/*/Current\\ Tabs',
    '~/Library/Application\\ Support/Tabbit/*/Network\\ Action\\ Predictor',
    '~/Library/Application\\ Support/Tabbit/*/*.ldb',
    '~/Library/Application\\ Support/Tabbit/*/*.log',
    '~/Library/Application\\ Support/Tabbit/*/Extension\\ State',
    '~/Library/Application\\ Support/Tabbit/*/Session\\ Storage',
    '~/Library/Application\\ Support/Tabbit/*/Current\\ Session',
    '~/Library/Application\\ Support/Tabbit/*/Storage/ext',
    '~/Library/Application\\ Support/Tabbit/*/*/Cache',
    '~/Library/Application\\ Support/Tabbit/*/GrShaderCache',
    '~/Library/Application\\ Support/Tabbit/*/Service\\ Worker/CacheStorage',
    '~/Library/Application\\ Support/Tabbit/*/shared_proto_db',
    '~/Library/Application\\ Support/Tabbit/*/Service\\ Worker',
    '~/Library/Application\\ Support/Tabbit/ShaderCache',
    '~/Library/Application\\ Support/Tabbit/component_crx_cache',
    // Lunascape
    '~/Library/Application\\ Support/Lunascape/*/GPUCache',
    '~/Library/Application\\ Support/Lunascape/*/Storage/ext/*/def/GPUCache',
    '~/Library/Application\\ Support/Lunascape/*/*-journal',
    '~/Library/Application\\ Support/Lunascape/*/databases/*-journal',
    '~/Library/Application\\ Support/Lunascape/*/Visited\\ Links',
    '~/Library/Application\\ Support/Lunascape/*/Top\\ Sites',
    '~/Library/Application\\ Support/Lunascape/*/History\\ Provider\\ Cache',
    '~/Library/Application\\ Support/Lunascape/*/Current\\ Tabs',
    '~/Library/Application\\ Support/Lunascape/*/Network\\ Action\\ Predictor',
    '~/Library/Application\\ Support/Lunascape/*/*.ldb',
    '~/Library/Application\\ Support/Lunascape/*/*.log',
    '~/Library/Application\\ Support/Lunascape/*/Extension\\ State',
    '~/Library/Application\\ Support/Lunascape/*/Session\\ Storage',
    '~/Library/Application\\ Support/Lunascape/*/Current\\ Session',
    '~/Library/Application\\ Support/Lunascape/*/Storage/ext',
    '~/Library/Application\\ Support/Lunascape/*/*/Cache',
    '~/Library/Application\\ Support/Lunascape/*/GrShaderCache',
    '~/Library/Application\\ Support/Lunascape/*/Service\\ Worker/CacheStorage',
    '~/Library/Application\\ Support/Lunascape/*/shared_proto_db',
    '~/Library/Application\\ Support/Lunascape/*/Service\\ Worker',
    '~/Library/Application\\ Support/Lunascape/ShaderCache',
    '~/Library/Application\\ Support/Lunascape/component_crx_cache',

    '~/Library/Application\\ Support/Lunascape/Partitions/*/GPUCache',
    '~/Library/Application\\ Support/Lunascape/Partitions/*/Storage/ext/*/def/GPUCache',
    '~/Library/Application\\ Support/Lunascape/Partitions/*/*-journal',
    '~/Library/Application\\ Support/Lunascape/Partitions/*/databases/*-journal',
    '~/Library/Application\\ Support/Lunascape/Partitions/*/Visited\\ Links',
    '~/Library/Application\\ Support/Lunascape/Partitions/*/Top\\ Sites',
    '~/Library/Application\\ Support/Lunascape/Partitions/*/History\\ Provider\\ Cache',
    '~/Library/Application\\ Support/Lunascape/Partitions/*/Current\\ Tabs',
    '~/Library/Application\\ Support/Lunascape/Partitions/*/Network\\ Action\\ Predictor',
    '~/Library/Application\\ Support/Lunascape/Partitions/*/*.ldb',
    '~/Library/Application\\ Support/Lunascape/Partitions/*/*.log',
    '~/Library/Application\\ Support/Lunascape/Partitions/*/Extension\\ State',
    '~/Library/Application\\ Support/Lunascape/Partitions/*/Session\\ Storage',
    '~/Library/Application\\ Support/Lunascape/Partitions/*/Current\\ Session',
    '~/Library/Application\\ Support/Lunascape/Partitions/*/Storage/ext',
    '~/Library/Application\\ Support/Lunascape/Partitions/*/Cache',
    '~/Library/Application\\ Support/Lunascape/Partitions/*/*/Cache',
    '~/Library/Application\\ Support/Lunascape/Partitions/*/GrShaderCache',
    '~/Library/Application\\ Support/Lunascape/Partitions/*/Service\\ Worker/CacheStorage',
    '~/Library/Application\\ Support/Lunascape/Partitions/*/shared_proto_db',
    '~/Library/Application\\ Support/Lunascape/Partitions/*/Service\\ Worker',
    '~/Library/Application\\ Support/Lunascape/Partitions/ShaderCache',
    '~/Library/Application\\ Support/Lunascape/Partitions/component_crx_cache',

    '~/Library/Application\\ Support/Lunascape/GPUCache',
    '~/Library/Application\\ Support/Lunascape/Storage/ext/*/def/GPUCache',
    '~/Library/Application\\ Support/Lunascape/*-journal',
    '~/Library/Application\\ Support/Lunascape/databases/*-journal',
    '~/Library/Application\\ Support/Lunascape/Visited\\ Links',
    '~/Library/Application\\ Support/Lunascape/Top\\ Sites',
    '~/Library/Application\\ Support/Lunascape/History\\ Provider\\ Cache',
    '~/Library/Application\\ Support/Lunascape/Current\\ Tabs',
    '~/Library/Application\\ Support/Lunascape/Network\\ Action\\ Predictor',
    '~/Library/Application\\ Support/Lunascape/*.ldb',
    '~/Library/Application\\ Support/Lunascape/*.log',
    '~/Library/Application\\ Support/Lunascape/Extension\\ State',
    '~/Library/Application\\ Support/Lunascape/Session\\ Storage',
    '~/Library/Application\\ Support/Lunascape/Current\\ Session',
    '~/Library/Application\\ Support/Lunascape/Storage/ext',
    '~/Library/Application\\ Support/Lunascape/*/Cache',
    '~/Library/Application\\ Support/Lunascape/GrShaderCache',
    '~/Library/Application\\ Support/Lunascape/Service\\ Worker/CacheStorage',
    '~/Library/Application\\ Support/Lunascape/shared_proto_db',
    '~/Library/Application\\ Support/Lunascape/Service\\ Worker',
    '~/Library/Application\\ Support/Lunascape/ShaderCache',
    '~/Library/Application\\ Support/Lunascape/component_crx_cache',
    // ChatGPT Atlas
    '~/Library/Application\\ Support/com.openai.atlas/browser-data/host/*/GPUCache',
    '~/Library/Application\\ Support/com.openai.atlas/browser-data/host/*/Storage/ext/*/def/GPUCache',
    '~/Library/Application\\ Support/com.openai.atlas/browser-data/host/*/*-journal',
    '~/Library/Application\\ Support/com.openai.atlas/browser-data/host/*/databases/*-journal',
    '~/Library/Application\\ Support/com.openai.atlas/browser-data/host/*/Visited\\ Links',
    '~/Library/Application\\ Support/com.openai.atlas/browser-data/host/*/Top\\ Sites',
    '~/Library/Application\\ Support/com.openai.atlas/browser-data/host/*/History\\ Provider\\ Cache',
    '~/Library/Application\\ Support/com.openai.atlas/browser-data/host/*/Current\\ Tabs',
    '~/Library/Application\\ Support/com.openai.atlas/browser-data/host/*/Network\\ Action\\ Predictor',
    '~/Library/Application\\ Support/com.openai.atlas/browser-data/host/*/*.ldb',
    '~/Library/Application\\ Support/com.openai.atlas/browser-data/host/*/*.log',
    '~/Library/Application\\ Support/com.openai.atlas/browser-data/host/*/Extension\\ State',
    '~/Library/Application\\ Support/com.openai.atlas/browser-data/host/*/Session\\ Storage',
    '~/Library/Application\\ Support/com.openai.atlas/browser-data/host/*/Current\\ Session',
    '~/Library/Application\\ Support/com.openai.atlas/browser-data/host/*/Storage/ext',
    '~/Library/Application\\ Support/com.openai.atlas/browser-data/host/*/*/Cache',
    '~/Library/Application\\ Support/com.openai.atlas/browser-data/host/*/GrShaderCache',
    '~/Library/Application\\ Support/com.openai.atlas/browser-data/host/*/Service\\ Worker/CacheStorage',
    '~/Library/Application\\ Support/com.openai.atlas/browser-data/host/*/shared_proto_db',
    '~/Library/Application\\ Support/com.openai.atlas/browser-data/host/*/Service\\ Worker',
    '~/Library/Application\\ Support/com.openai.atlas/browser-data/host/ShaderCache',
    '~/Library/Application\\ Support/com.openai.atlas/browser-data/host/component_crx_cache',
    // Opera
    '~/Library/Application\\ Support/com.operasoftware.Opera/*/GPUCache',
    '~/Library/Application\\ Support/com.operasoftware.Opera/*/Storage/ext/*/def/GPUCache',
    '~/Library/Application\\ Support/com.operasoftware.Opera/*/*-journal',
    '~/Library/Application\\ Support/com.operasoftware.Opera/*/databases/*-journal',
    '~/Library/Application\\ Support/com.operasoftware.Opera/*/Visited\\ Links',
    '~/Library/Application\\ Support/com.operasoftware.Opera/*/Top\\ Sites',
    '~/Library/Application\\ Support/com.operasoftware.Opera/*/History\\ Provider\\ Cache',
    '~/Library/Application\\ Support/com.operasoftware.Opera/*/Current\\ Tabs',
    '~/Library/Application\\ Support/com.operasoftware.Opera/*/Network\\ Action\\ Predictor',
    '~/Library/Application\\ Support/com.operasoftware.Opera/*/*.ldb',
    '~/Library/Application\\ Support/com.operasoftware.Opera/*/*.log',
    '~/Library/Application\\ Support/com.operasoftware.Opera/*/Extension\\ State',
    '~/Library/Application\\ Support/com.operasoftware.Opera/*/Session\\ Storage',
    '~/Library/Application\\ Support/com.operasoftware.Opera/*/Current\\ Session',
    '~/Library/Application\\ Support/com.operasoftware.Opera/*/Storage/ext',
    '~/Library/Application\\ Support/com.operasoftware.Opera/*/*/Cache',
    '~/Library/Application\\ Support/com.operasoftware.Opera/*/GrShaderCache',
    '~/Library/Application\\ Support/com.operasoftware.Opera/*/Service\\ Worker/CacheStorage',
    '~/Library/Application\\ Support/com.operasoftware.Opera/*/shared_proto_db',
    '~/Library/Application\\ Support/com.operasoftware.Opera/*/Service\\ Worker',
    '~/Library/Application\\ Support/com.operasoftware.Opera/ShaderCache',
    '~/Library/Application\\ Support/com.operasoftware.Opera/component_crx_cache',
    // OperaGX
    '~/Library/Application\\ Support/com.operasoftware.OperaGX/*/GPUCache',
    '~/Library/Application\\ Support/com.operasoftware.OperaGX/*/Storage/ext/*/def/GPUCache',
    '~/Library/Application\\ Support/com.operasoftware.OperaGX/*/*-journal',
    '~/Library/Application\\ Support/com.operasoftware.OperaGX/*/databases/*-journal',
    '~/Library/Application\\ Support/com.operasoftware.OperaGX/*/Visited\\ Links',
    '~/Library/Application\\ Support/com.operasoftware.OperaGX/*/Top\\ Sites',
    '~/Library/Application\\ Support/com.operasoftware.OperaGX/*/History\\ Provider\\ Cache',
    '~/Library/Application\\ Support/com.operasoftware.OperaGX/*/Current\\ Tabs',
    '~/Library/Application\\ Support/com.operasoftware.OperaGX/*/Network\\ Action\\ Predictor',
    '~/Library/Application\\ Support/com.operasoftware.OperaGX/*/*.ldb',
    '~/Library/Application\\ Support/com.operasoftware.OperaGX/*/*.log',
    '~/Library/Application\\ Support/com.operasoftware.OperaGX/*/Extension\\ State',
    '~/Library/Application\\ Support/com.operasoftware.OperaGX/*/Session\\ Storage',
    '~/Library/Application\\ Support/com.operasoftware.OperaGX/*/Current\\ Session',
    '~/Library/Application\\ Support/com.operasoftware.OperaGX/*/Storage/ext',
    '~/Library/Application\\ Support/com.operasoftware.OperaGX/*/*/Cache',
    '~/Library/Application\\ Support/com.operasoftware.OperaGX/*/GrShaderCache',
    '~/Library/Application\\ Support/com.operasoftware.OperaGX/*/Service\\ Worker/CacheStorage',
    '~/Library/Application\\ Support/com.operasoftware.OperaGX/*/shared_proto_db',
    '~/Library/Application\\ Support/com.operasoftware.OperaGX/*/Service\\ Worker',
    '~/Library/Application\\ Support/com.operasoftware.OperaGX/ShaderCache',
    '~/Library/Application\\ Support/com.operasoftware.OperaGX/component_crx_cache',

    '~/Library/Application\\ Support/com.operasoftware.OperaGX/_side_profiles/*/GPUCache',
    '~/Library/Application\\ Support/com.operasoftware.OperaGX/_side_profiles/*/Storage/ext/*/def/GPUCache',
    '~/Library/Application\\ Support/com.operasoftware.OperaGX/_side_profiles/*/*-journal',
    '~/Library/Application\\ Support/com.operasoftware.OperaGX/_side_profiles/*/databases/*-journal',
    '~/Library/Application\\ Support/com.operasoftware.OperaGX/_side_profiles/*/Visited\\ Links',
    '~/Library/Application\\ Support/com.operasoftware.OperaGX/_side_profiles/*/Top\\ Sites',
    '~/Library/Application\\ Support/com.operasoftware.OperaGX/_side_profiles/*/History\\ Provider\\ Cache',
    '~/Library/Application\\ Support/com.operasoftware.OperaGX/_side_profiles/*/Current\\ Tabs',
    '~/Library/Application\\ Support/com.operasoftware.OperaGX/_side_profiles/*/Network\\ Action\\ Predictor',
    '~/Library/Application\\ Support/com.operasoftware.OperaGX/_side_profiles/*/*.ldb',
    '~/Library/Application\\ Support/com.operasoftware.OperaGX/_side_profiles/*/*.log',
    '~/Library/Application\\ Support/com.operasoftware.OperaGX/_side_profiles/*/Extension\\ State',
    '~/Library/Application\\ Support/com.operasoftware.OperaGX/_side_profiles/*/Session\\ Storage',
    '~/Library/Application\\ Support/com.operasoftware.OperaGX/_side_profiles/*/Current\\ Session',
    '~/Library/Application\\ Support/com.operasoftware.OperaGX/_side_profiles/*/Storage/ext',
    '~/Library/Application\\ Support/com.operasoftware.OperaGX/_side_profiles/*/*/Cache',
    '~/Library/Application\\ Support/com.operasoftware.OperaGX/_side_profiles/*/GrShaderCache',
    '~/Library/Application\\ Support/com.operasoftware.OperaGX/_side_profiles/*/Service\\ Worker/CacheStorage',
    '~/Library/Application\\ Support/com.operasoftware.OperaGX/_side_profiles/*/shared_proto_db',
    '~/Library/Application\\ Support/com.operasoftware.OperaGX/_side_profiles/*/Service\\ Worker',

    '~/Library/Application\\ Support/com.operasoftware.OperaGX/_side_profiles/*/*/GPUCache',
    '~/Library/Application\\ Support/com.operasoftware.OperaGX/_side_profiles/*/*/Storage/ext/*/def/GPUCache',
    '~/Library/Application\\ Support/com.operasoftware.OperaGX/_side_profiles/*/*/*-journal',
    '~/Library/Application\\ Support/com.operasoftware.OperaGX/_side_profiles/*/*/databases/*-journal',
    '~/Library/Application\\ Support/com.operasoftware.OperaGX/_side_profiles/*/*/Visited\\ Links',
    '~/Library/Application\\ Support/com.operasoftware.OperaGX/_side_profiles/*/*/Top\\ Sites',
    '~/Library/Application\\ Support/com.operasoftware.OperaGX/_side_profiles/*/*/History\\ Provider\\ Cache',
    '~/Library/Application\\ Support/com.operasoftware.OperaGX/_side_profiles/*/*/Current\\ Tabs',
    '~/Library/Application\\ Support/com.operasoftware.OperaGX/_side_profiles/*/*/Network\\ Action\\ Predictor',
    '~/Library/Application\\ Support/com.operasoftware.OperaGX/_side_profiles/*/*/*.ldb',
    '~/Library/Application\\ Support/com.operasoftware.OperaGX/_side_profiles/*/*/*.log',
    '~/Library/Application\\ Support/com.operasoftware.OperaGX/_side_profiles/*/*/Extension\\ State',
    '~/Library/Application\\ Support/com.operasoftware.OperaGX/_side_profiles/*/*/Session\\ Storage',
    '~/Library/Application\\ Support/com.operasoftware.OperaGX/_side_profiles/*/*/Current\\ Session',
    '~/Library/Application\\ Support/com.operasoftware.OperaGX/_side_profiles/*/*/Storage/ext',
    '~/Library/Application\\ Support/com.operasoftware.OperaGX/_side_profiles/*/*/*/Cache',
    '~/Library/Application\\ Support/com.operasoftware.OperaGX/_side_profiles/*/*/GrShaderCache',
    '~/Library/Application\\ Support/com.operasoftware.OperaGX/_side_profiles/*/*/Service\\ Worker/CacheStorage',
    '~/Library/Application\\ Support/com.operasoftware.OperaGX/_side_profiles/*/*/shared_proto_db',
    '~/Library/Application\\ Support/com.operasoftware.OperaGX/_side_profiles/*/*/Service\\ Worker',
    // Helium
    '~/Library/Application\\ Support/net.imput.helium/*/GPUCache',
    '~/Library/Application\\ Support/net.imput.helium/*/Storage/ext/*/def/GPUCache',
    '~/Library/Application\\ Support/net.imput.helium/*/*-journal',
    '~/Library/Application\\ Support/net.imput.helium/*/databases/*-journal',
    '~/Library/Application\\ Support/net.imput.helium/*/Visited\\ Links',
    '~/Library/Application\\ Support/net.imput.helium/*/Top\\ Sites',
    '~/Library/Application\\ Support/net.imput.helium/*/History\\ Provider\\ Cache',
    '~/Library/Application\\ Support/net.imput.helium/*/Current\\ Tabs',
    '~/Library/Application\\ Support/net.imput.helium/*/Network\\ Action\\ Predictor',
    '~/Library/Application\\ Support/net.imput.helium/*/*.ldb',
    '~/Library/Application\\ Support/net.imput.helium/*/*.log',
    '~/Library/Application\\ Support/net.imput.helium/*/Extension\\ State',
    '~/Library/Application\\ Support/net.imput.helium/*/Session\\ Storage',
    '~/Library/Application\\ Support/net.imput.helium/*/Current\\ Session',
    '~/Library/Application\\ Support/net.imput.helium/*/Storage/ext',
    '~/Library/Application\\ Support/net.imput.helium/*/*/Cache',
    '~/Library/Application\\ Support/net.imput.helium/*/GrShaderCache',
    '~/Library/Application\\ Support/net.imput.helium/*/Service\\ Worker/CacheStorage',
    '~/Library/Application\\ Support/net.imput.helium/*/shared_proto_db',
    '~/Library/Application\\ Support/net.imput.helium/*/Service\\ Worker',
    '~/Library/Application\\ Support/net.imput.helium/ShaderCache',
    '~/Library/Application\\ Support/net.imput.helium/component_crx_cache',
    // Ulaa
    '~/Library/Application\\ Support/Zoho/Ulaa/*/GPUCache',
    '~/Library/Application\\ Support/Zoho/Ulaa/*/Storage/ext/*/def/GPUCache',
    '~/Library/Application\\ Support/Zoho/Ulaa/*/*-journal',
    '~/Library/Application\\ Support/Zoho/Ulaa/*/databases/*-journal',
    '~/Library/Application\\ Support/Zoho/Ulaa/*/Visited\\ Links',
    '~/Library/Application\\ Support/Zoho/Ulaa/*/Top\\ Sites',
    '~/Library/Application\\ Support/Zoho/Ulaa/*/History\\ Provider\\ Cache',
    '~/Library/Application\\ Support/Zoho/Ulaa/*/Current\\ Tabs',
    '~/Library/Application\\ Support/Zoho/Ulaa/*/Network\\ Action\\ Predictor',
    '~/Library/Application\\ Support/Zoho/Ulaa/*/*.ldb',
    '~/Library/Application\\ Support/Zoho/Ulaa/*/*.log',
    '~/Library/Application\\ Support/Zoho/Ulaa/*/Extension\\ State',
    '~/Library/Application\\ Support/Zoho/Ulaa/*/Session\\ Storage',
    '~/Library/Application\\ Support/Zoho/Ulaa/*/Current\\ Session',
    '~/Library/Application\\ Support/Zoho/Ulaa/*/Storage/ext',
    '~/Library/Application\\ Support/Zoho/Ulaa/*/*/Cache',
    '~/Library/Application\\ Support/Zoho/Ulaa/*/GrShaderCache',
    '~/Library/Application\\ Support/Zoho/Ulaa/*/Service\\ Worker/CacheStorage',
    '~/Library/Application\\ Support/Zoho/Ulaa/*/shared_proto_db',
    '~/Library/Application\\ Support/Zoho/Ulaa/*/Service\\ Worker',
    '~/Library/Application\\ Support/Zoho/Ulaa/ShaderCache',
    '~/Library/Application\\ Support/Zoho/Ulaa/component_crx_cache',
    // Min
    '~/Library/Application\\ Support/Min/GPUCache',
    '~/Library/Application\\ Support/Min/Storage/ext/*/def/GPUCache',
    '~/Library/Application\\ Support/Min/*-journal',
    '~/Library/Application\\ Support/Min/databases/*-journal',
    '~/Library/Application\\ Support/Min/Visited\\ Links',
    '~/Library/Application\\ Support/Min/Top\\ Sites',
    '~/Library/Application\\ Support/Min/History\\ Provider\\ Cache',
    '~/Library/Application\\ Support/Min/Current\\ Tabs',
    '~/Library/Application\\ Support/Min/Network\\ Action\\ Predictor',
    '~/Library/Application\\ Support/Min/*.ldb',
    '~/Library/Application\\ Support/Min/*.log',
    '~/Library/Application\\ Support/Min/Extension\\ State',
    '~/Library/Application\\ Support/Min/Session\\ Storage',
    '~/Library/Application\\ Support/Min/Current\\ Session',
    '~/Library/Application\\ Support/Min/Storage/ext',
    '~/Library/Application\\ Support/Min/*/Cache',
    '~/Library/Application\\ Support/Min/GrShaderCache',
    '~/Library/Application\\ Support/Min/Service\\ Worker/CacheStorage',
    '~/Library/Application\\ Support/Min/shared_proto_db',
    '~/Library/Application\\ Support/Min/Service\\ Worker',
    '~/Library/Application\\ Support/Min/ShaderCache',
    '~/Library/Application\\ Support/Min/component_crx_cache',

    '~/Library/Application\\ Support/Min/Partitions/*/GPUCache',
    '~/Library/Application\\ Support/Min/Partitions/*/Storage/ext/*/def/GPUCache',
    '~/Library/Application\\ Support/Min/Partitions/*/*-journal',
    '~/Library/Application\\ Support/Min/Partitions/*/databases/*-journal',
    '~/Library/Application\\ Support/Min/Partitions/*/Visited\\ Links',
    '~/Library/Application\\ Support/Min/Partitions/*/Top\\ Sites',
    '~/Library/Application\\ Support/Min/Partitions/*/History\\ Provider\\ Cache',
    '~/Library/Application\\ Support/Min/Partitions/*/Current\\ Tabs',
    '~/Library/Application\\ Support/Min/Partitions/*/Network\\ Action\\ Predictor',
    '~/Library/Application\\ Support/Min/Partitions/*/*.ldb',
    '~/Library/Application\\ Support/Min/Partitions/*/*.log',
    '~/Library/Application\\ Support/Min/Partitions/*/Extension\\ State',
    '~/Library/Application\\ Support/Min/Partitions/*/Session\\ Storage',
    '~/Library/Application\\ Support/Min/Partitions/*/Current\\ Session',
    '~/Library/Application\\ Support/Min/Partitions/*/Storage/ext',
    '~/Library/Application\\ Support/Min/Partitions/*/Cache',
    '~/Library/Application\\ Support/Min/Partitions/*/*/Cache',
    '~/Library/Application\\ Support/Min/Partitions/*/GrShaderCache',
    '~/Library/Application\\ Support/Min/Partitions/*/Service\\ Worker/CacheStorage',
    '~/Library/Application\\ Support/Min/Partitions/*/shared_proto_db',
    '~/Library/Application\\ Support/Min/Partitions/*/Service\\ Worker',
    // Avast Secure Browser
    '~/Library/Application\\ Support/AvastSecureBrowser/Browser/*/GPUCache',
    '~/Library/Application\\ Support/AvastSecureBrowser/Browser/*/Storage/ext/*/def/GPUCache',
    '~/Library/Application\\ Support/AvastSecureBrowser/Browser/*/*-journal',
    '~/Library/Application\\ Support/AvastSecureBrowser/Browser/*/databases/*-journal',
    '~/Library/Application\\ Support/AvastSecureBrowser/Browser/*/Visited\\ Links',
    '~/Library/Application\\ Support/AvastSecureBrowser/Browser/*/Top\\ Sites',
    '~/Library/Application\\ Support/AvastSecureBrowser/Browser/*/History\\ Provider\\ Cache',
    '~/Library/Application\\ Support/AvastSecureBrowser/Browser/*/Current\\ Tabs',
    '~/Library/Application\\ Support/AvastSecureBrowser/Browser/*/Network\\ Action\\ Predictor',
    '~/Library/Application\\ Support/AvastSecureBrowser/Browser/*/*.ldb',
    '~/Library/Application\\ Support/AvastSecureBrowser/Browser/*/*.log',
    '~/Library/Application\\ Support/AvastSecureBrowser/Browser/*/Extension\\ State',
    '~/Library/Application\\ Support/AvastSecureBrowser/Browser/*/Session\\ Storage',
    '~/Library/Application\\ Support/AvastSecureBrowser/Browser/*/Current\\ Session',
    '~/Library/Application\\ Support/AvastSecureBrowser/Browser/*/Storage/ext',
    '~/Library/Application\\ Support/AvastSecureBrowser/Browser/*/*/Cache',
    '~/Library/Application\\ Support/AvastSecureBrowser/Browser/*/GrShaderCache',
    '~/Library/Application\\ Support/AvastSecureBrowser/Browser/*/Service\\ Worker/CacheStorage',
    '~/Library/Application\\ Support/AvastSecureBrowser/Browser/*/shared_proto_db',
    '~/Library/Application\\ Support/AvastSecureBrowser/Browser/*/Service\\ Worker',
    '~/Library/Application\\ Support/AvastSecureBrowser/Browser/ShaderCache',
    '~/Library/Application\\ Support/AvastSecureBrowser/Browser/component_crx_cache',
    // Incogniton
    '~/Library/Application\\ Support/Incogniton/config/*/*/GPUCache',
    '~/Library/Application\\ Support/Incogniton/config/*/*/Storage/ext/*/def/GPUCache',
    '~/Library/Application\\ Support/Incogniton/config/*/*/*-journal',
    '~/Library/Application\\ Support/Incogniton/config/*/*/databases/*-journal',
    '~/Library/Application\\ Support/Incogniton/config/*/*/Visited\\ Links',
    '~/Library/Application\\ Support/Incogniton/config/*/*/Top\\ Sites',
    '~/Library/Application\\ Support/Incogniton/config/*/*/History\\ Provider\\ Cache',
    '~/Library/Application\\ Support/Incogniton/config/*/*/Current\\ Tabs',
    '~/Library/Application\\ Support/Incogniton/config/*/*/Network\\ Action\\ Predictor',
    '~/Library/Application\\ Support/Incogniton/config/*/*/*.ldb',
    '~/Library/Application\\ Support/Incogniton/config/*/*/*.log',
    '~/Library/Application\\ Support/Incogniton/config/*/*/Extension\\ State',
    '~/Library/Application\\ Support/Incogniton/config/*/*/Session\\ Storage',
    '~/Library/Application\\ Support/Incogniton/config/*/*/Current\\ Session',
    '~/Library/Application\\ Support/Incogniton/config/*/*/Storage/ext',
    '~/Library/Application\\ Support/Incogniton/config/*/*/*/Cache',
    '~/Library/Application\\ Support/Incogniton/config/*/*/GrShaderCache',
    '~/Library/Application\\ Support/Incogniton/config/*/*/Service\\ Worker/CacheStorage',
    '~/Library/Application\\ Support/Incogniton/config/*/*/shared_proto_db',
    '~/Library/Application\\ Support/Incogniton/config/*/*/Service\\ Worker',
    '~/Library/Application\\ Support/Incogniton/config/*/ShaderCache',
    '~/Library/Application\\ Support/Incogniton/config/*/component_crx_cache',
    // 360 极速浏览器
    '~/Library/Application\\ Support/360Chrome/*/GPUCache',
    '~/Library/Application\\ Support/360Chrome/*/Storage/ext/*/def/GPUCache',
    '~/Library/Application\\ Support/360Chrome/*/*-journal',
    '~/Library/Application\\ Support/360Chrome/*/databases/*-journal',
    '~/Library/Application\\ Support/360Chrome/*/Visited\\ Links',
    '~/Library/Application\\ Support/360Chrome/*/Top\\ Sites',
    '~/Library/Application\\ Support/360Chrome/*/History\\ Provider\\ Cache',
    '~/Library/Application\\ Support/360Chrome/*/Current\\ Tabs',
    '~/Library/Application\\ Support/360Chrome/*/Network\\ Action\\ Predictor',
    '~/Library/Application\\ Support/360Chrome/*/*.ldb',
    '~/Library/Application\\ Support/360Chrome/*/*.log',
    '~/Library/Application\\ Support/360Chrome/*/Extension\\ State',
    '~/Library/Application\\ Support/360Chrome/*/Session\\ Storage',
    '~/Library/Application\\ Support/360Chrome/*/Current\\ Session',
    '~/Library/Application\\ Support/360Chrome/*/Storage/ext',
    '~/Library/Application\\ Support/360Chrome/*/*/Cache',
    '~/Library/Application\\ Support/360Chrome/*/GrShaderCache',
    '~/Library/Application\\ Support/360Chrome/*/Service\\ Worker/CacheStorage',
    '~/Library/Application\\ Support/360Chrome/*/shared_proto_db',
    '~/Library/Application\\ Support/360Chrome/*/Service\\ Worker',
    '~/Library/Application\\ Support/360Chrome/ShaderCache',
    '~/Library/Application\\ Support/360Chrome/component_crx_cache',
    // QQ 浏览器
    '~/Library/Application\\ Support/QQBrowser*/*/GPUCache',
    '~/Library/Application\\ Support/QQBrowser*/*/Storage/ext/*/def/GPUCache',
    '~/Library/Application\\ Support/QQBrowser*/*/*-journal',
    '~/Library/Application\\ Support/QQBrowser*/*/databases/*-journal',
    '~/Library/Application\\ Support/QQBrowser*/*/Visited\\ Links',
    '~/Library/Application\\ Support/QQBrowser*/*/Top\\ Sites',
    '~/Library/Application\\ Support/QQBrowser*/*/History\\ Provider\\ Cache',
    '~/Library/Application\\ Support/QQBrowser*/*/Current\\ Tabs',
    '~/Library/Application\\ Support/QQBrowser*/*/Network\\ Action\\ Predictor',
    '~/Library/Application\\ Support/QQBrowser*/*/*.ldb',
    '~/Library/Application\\ Support/QQBrowser*/*/*.log',
    '~/Library/Application\\ Support/QQBrowser*/*/Extension\\ State',
    '~/Library/Application\\ Support/QQBrowser*/*/Session\\ Storage',
    '~/Library/Application\\ Support/QQBrowser*/*/Current\\ Session',
    '~/Library/Application\\ Support/QQBrowser*/*/Storage/ext',
    '~/Library/Application\\ Support/QQBrowser*/*/*/Cache',
    '~/Library/Application\\ Support/QQBrowser*/*/GrShaderCache',
    '~/Library/Application\\ Support/QQBrowser*/*/Service\\ Worker/CacheStorage',
    '~/Library/Application\\ Support/QQBrowser*/*/shared_proto_db',
    '~/Library/Application\\ Support/QQBrowser*/*/Service\\ Worker',
    '~/Library/Application\\ Support/QQBrowser*/ShaderCache',
    '~/Library/Application\\ Support/QQBrowser*/component_crx_cache',
    // UC 浏览器
    '~/Library/Application\\ Support/UC/*/GPUCache',
    '~/Library/Application\\ Support/UC/*/Storage/ext/*/def/GPUCache',
    '~/Library/Application\\ Support/UC/*/*-journal',
    '~/Library/Application\\ Support/UC/*/databases/*-journal',
    '~/Library/Application\\ Support/UC/*/Visited\\ Links',
    '~/Library/Application\\ Support/UC/*/Top\\ Sites',
    '~/Library/Application\\ Support/UC/*/History\\ Provider\\ Cache',
    '~/Library/Application\\ Support/UC/*/Current\\ Tabs',
    '~/Library/Application\\ Support/UC/*/Network\\ Action\\ Predictor',
    '~/Library/Application\\ Support/UC/*/*.ldb',
    '~/Library/Application\\ Support/UC/*/*.log',
    '~/Library/Application\\ Support/UC/*/Extension\\ State',
    '~/Library/Application\\ Support/UC/*/Session\\ Storage',
    '~/Library/Application\\ Support/UC/*/Current\\ Session',
    '~/Library/Application\\ Support/UC/*/Storage/ext',
    '~/Library/Application\\ Support/UC/*/*/Cache',
    '~/Library/Application\\ Support/UC/*/GrShaderCache',
    '~/Library/Application\\ Support/UC/*/Service\\ Worker/CacheStorage',
    '~/Library/Application\\ Support/UC/*/shared_proto_db',
    '~/Library/Application\\ Support/UC/*/Service\\ Worker',
    '~/Library/Application\\ Support/UC/ShaderCache',
    '~/Library/Application\\ Support/UC/component_crx_cache',
    // 115 浏览器
    '~/Library/Application\\ Support/115Browser/*/GPUCache',
    '~/Library/Application\\ Support/115Browser/*/Storage/ext/*/def/GPUCache',
    '~/Library/Application\\ Support/115Browser/*/*-journal',
    '~/Library/Application\\ Support/115Browser/*/databases/*-journal',
    '~/Library/Application\\ Support/115Browser/*/Visited\\ Links',
    '~/Library/Application\\ Support/115Browser/*/Top\\ Sites',
    '~/Library/Application\\ Support/115Browser/*/History\\ Provider\\ Cache',
    '~/Library/Application\\ Support/115Browser/*/Current\\ Tabs',
    '~/Library/Application\\ Support/115Browser/*/Network\\ Action\\ Predictor',
    '~/Library/Application\\ Support/115Browser/*/*.ldb',
    '~/Library/Application\\ Support/115Browser/*/*.log',
    '~/Library/Application\\ Support/115Browser/*/Extension\\ State',
    '~/Library/Application\\ Support/115Browser/*/Session\\ Storage',
    '~/Library/Application\\ Support/115Browser/*/Current\\ Session',
    '~/Library/Application\\ Support/115Browser/*/Storage/ext',
    '~/Library/Application\\ Support/115Browser/*/*/Cache',
    '~/Library/Application\\ Support/115Browser/*/GrShaderCache',
    '~/Library/Application\\ Support/115Browser/*/Service\\ Worker/CacheStorage',
    '~/Library/Application\\ Support/115Browser/*/shared_proto_db',
    '~/Library/Application\\ Support/115Browser/*/Service\\ Worker',
    '~/Library/Application\\ Support/115Browser/ShaderCache',
    '~/Library/Application\\ Support/115Browser/component_crx_cache',
    // 夸克浏览器
    '~/Library/Application\\ Support/Quark/*/GPUCache',
    '~/Library/Application\\ Support/Quark/*/Storage/ext/*/def/GPUCache',
    '~/Library/Application\\ Support/Quark/*/*-journal',
    '~/Library/Application\\ Support/Quark/*/databases/*-journal',
    '~/Library/Application\\ Support/Quark/*/Visited\\ Links',
    '~/Library/Application\\ Support/Quark/*/Top\\ Sites',
    '~/Library/Application\\ Support/Quark/*/History\\ Provider\\ Cache',
    '~/Library/Application\\ Support/Quark/*/Current\\ Tabs',
    '~/Library/Application\\ Support/Quark/*/Network\\ Action\\ Predictor',
    '~/Library/Application\\ Support/Quark/*/*.ldb',
    '~/Library/Application\\ Support/Quark/*/*.log',
    '~/Library/Application\\ Support/Quark/*/Extension\\ State',
    '~/Library/Application\\ Support/Quark/*/Session\\ Storage',
    '~/Library/Application\\ Support/Quark/*/Current\\ Session',
    '~/Library/Application\\ Support/Quark/*/Storage/ext',
    '~/Library/Application\\ Support/Quark/*/*/Cache',
    '~/Library/Application\\ Support/Quark/*/GrShaderCache',
    '~/Library/Application\\ Support/Quark/*/Service\\ Worker/CacheStorage',
    '~/Library/Application\\ Support/Quark/*/shared_proto_db',
    '~/Library/Application\\ Support/Quark/*/Service\\ Worker',
    '~/Library/Application\\ Support/Quark/ShaderCache',
    '~/Library/Application\\ Support/Quark/component_crx_cache',
    // 遨游浏览器
    '~/Library/Application\\ Support/Maxthon/*/GPUCache',
    '~/Library/Application\\ Support/Maxthon/*/Storage/ext/*/def/GPUCache',
    '~/Library/Application\\ Support/Maxthon/*/*-journal',
    '~/Library/Application\\ Support/Maxthon/*/databases/*-journal',
    '~/Library/Application\\ Support/Maxthon/*/Visited\\ Links',
    '~/Library/Application\\ Support/Maxthon/*/Top\\ Sites',
    '~/Library/Application\\ Support/Maxthon/*/History\\ Provider\\ Cache',
    '~/Library/Application\\ Support/Maxthon/*/Current\\ Tabs',
    '~/Library/Application\\ Support/Maxthon/*/Network\\ Action\\ Predictor',
    '~/Library/Application\\ Support/Maxthon/*/*.ldb',
    '~/Library/Application\\ Support/Maxthon/*/*.log',
    '~/Library/Application\\ Support/Maxthon/*/Extension\\ State',
    '~/Library/Application\\ Support/Maxthon/*/Session\\ Storage',
    '~/Library/Application\\ Support/Maxthon/*/Current\\ Session',
    '~/Library/Application\\ Support/Maxthon/*/Storage/ext',
    '~/Library/Application\\ Support/Maxthon/*/*/Cache',
    '~/Library/Application\\ Support/Maxthon/*/GrShaderCache',
    '~/Library/Application\\ Support/Maxthon/*/Service\\ Worker/CacheStorage',
    '~/Library/Application\\ Support/Maxthon/*/shared_proto_db',
    '~/Library/Application\\ Support/Maxthon/*/Service\\ Worker',
    '~/Library/Application\\ Support/Maxthon/ShaderCache',
    '~/Library/Application\\ Support/Maxthon/component_crx_cache',

    // Gecko
    // Firefox, Firefox Nightly, Firefox Developer Edition
    '~/Library/Application\\ Support/Firefox/Profiles/*/crashes',
    '~/Library/Application\\ Support/Firefox/Profiles/*/minidumps',
    '~/Library/Application\\ Support/Firefox/Profiles/*/datareporting',
    '~/Library/Application\\ Support/Firefox/Profiles/*/saved-telemetry-pings',
    '~/Library/Application\\ Support/Firefox/Profiles/*/bounce-tracking-protection.sqlite',
    '~/Library/Application\\ Support/Firefox/Profiles/*/SiteSecurityServiceState.bin',
    '~/Library/Application\\ Support/Firefox/Profiles/*/targeting.snapshot.json',
    '~/Library/Application\\ Support/Firefox/Profiles/*/favicons.sqlite',
    '~/Library/Application\\ Support/Firefox/Profiles/*/favicons.sqlite-wal',
    '~/Library/Application\\ Support/Firefox/Profiles/*/favicons.sqlite-shm',
    '~/Library/Application\\ Support/Firefox/Profiles/*/storage/default/*/cache',
    // Waterfox
    '~/Library/Application\\ Support/Waterfox/Profiles/*/crashes',
    '~/Library/Application\\ Support/Waterfox/Profiles/*/minidumps',
    '~/Library/Application\\ Support/Waterfox/Profiles/*/datareporting',
    '~/Library/Application\\ Support/Waterfox/Profiles/*/saved-telemetry-pings',
    '~/Library/Application\\ Support/Waterfox/Profiles/*/bounce-tracking-protection.sqlite',
    '~/Library/Application\\ Support/Waterfox/Profiles/*/SiteSecurityServiceState.bin',
    '~/Library/Application\\ Support/Waterfox/Profiles/*/targeting.snapshot.json',
    '~/Library/Application\\ Support/Waterfox/Profiles/*/favicons.sqlite',
    '~/Library/Application\\ Support/Waterfox/Profiles/*/favicons.sqlite-wal',
    '~/Library/Application\\ Support/Waterfox/Profiles/*/favicons.sqlite-shm',
    '~/Library/Application\\ Support/Waterfox/Profiles/*/storage/default/*/cache',
    // Zen
    '~/Library/Application\\ Support/zen/Profiles/*/crashes',
    '~/Library/Application\\ Support/zen/Profiles/*/minidumps',
    '~/Library/Application\\ Support/zen/Profiles/*/datareporting',
    '~/Library/Application\\ Support/zen/Profiles/*/saved-telemetry-pings',
    '~/Library/Application\\ Support/zen/Profiles/*/bounce-tracking-protection.sqlite',
    '~/Library/Application\\ Support/zen/Profiles/*/SiteSecurityServiceState.bin',
    '~/Library/Application\\ Support/zen/Profiles/*/targeting.snapshot.json',
    '~/Library/Application\\ Support/zen/Profiles/*/favicons.sqlite',
    '~/Library/Application\\ Support/zen/Profiles/*/favicons.sqlite-wal',
    '~/Library/Application\\ Support/zen/Profiles/*/favicons.sqlite-shm',
    '~/Library/Application\\ Support/zen/Profiles/*/storage/default/*/cache',
    // LibreWolf
    '~/Library/Application\\ Support/librewolf/Profiles/*/crashes',
    '~/Library/Application\\ Support/librewolf/Profiles/*/minidumps',
    '~/Library/Application\\ Support/librewolf/Profiles/*/datareporting',
    '~/Library/Application\\ Support/librewolf/Profiles/*/saved-telemetry-pings',
    '~/Library/Application\\ Support/librewolf/Profiles/*/bounce-tracking-protection.sqlite',
    '~/Library/Application\\ Support/librewolf/Profiles/*/SiteSecurityServiceState.bin',
    '~/Library/Application\\ Support/librewolf/Profiles/*/targeting.snapshot.json',
    '~/Library/Application\\ Support/librewolf/Profiles/*/favicons.sqlite',
    '~/Library/Application\\ Support/librewolf/Profiles/*/favicons.sqlite-wal',
    '~/Library/Application\\ Support/librewolf/Profiles/*/favicons.sqlite-shm',
    '~/Library/Application\\ Support/librewolf/Profiles/*/storage/default/*/cache',
    // Mullvad Browser
    '~/Library/Application\\ Support/MullvadBrowser/Profiles/*/crashes',
    '~/Library/Application\\ Support/MullvadBrowser/Profiles/*/minidumps',
    '~/Library/Application\\ Support/MullvadBrowser/Profiles/*/datareporting',
    '~/Library/Application\\ Support/MullvadBrowser/Profiles/*/saved-telemetry-pings',
    '~/Library/Application\\ Support/MullvadBrowser/Profiles/*/bounce-tracking-protection.sqlite',
    '~/Library/Application\\ Support/MullvadBrowser/Profiles/*/SiteSecurityServiceState.bin',
    '~/Library/Application\\ Support/MullvadBrowser/Profiles/*/targeting.snapshot.json',
    '~/Library/Application\\ Support/MullvadBrowser/Profiles/*/favicons.sqlite',
    '~/Library/Application\\ Support/MullvadBrowser/Profiles/*/favicons.sqlite-wal',
    '~/Library/Application\\ Support/MullvadBrowser/Profiles/*/favicons.sqlite-shm',
    '~/Library/Application\\ Support/MullvadBrowser/Profiles/*/storage/default/*/idb',

    // WebKit
    // Safari
    '~/Library/Containers/com.apple.Safari/Data/Library/Caches',
    '~/Library/Containers/io.te0.WebView/Data/Library/Caches/WebKit',
    '~/Library/Safari/History.db*',
    '~/Library/Safari/RecentlyClosedTabs.plist',
    '~/Library/Safari/CloudHistoryRemoteConfiguration.plist',
    // OmniWeb
    '~/Library/Containers/com.omnigroup.OmniWeb6/Data/Library/Caches/com.omnigroup.OmniWeb6',
    '~/Library/Containers/com.omnigroup.OmniWeb6/Data/Library/Caches/WebKit',
    // SigmaOS
    '~/Library/Containers/com.sigmaos.sigmaos.macos/Data/Library/Caches/com.sigmaos.sigmaos.macos',
    '~/Library/Containers/com.sigmaos.sigmaos.macos/Data/Library/Caches/WebKit'
  ],
  开发缓存: [
    // VS Code
    '~/.vscode/extensions/.obsolete',
    '~/Library/Application\\ Support/Code/WebStorage',
    '~/Library/Application\\ Support/Code/CachedData',
    '~/Library/Application\\ Support/Code/Crashpad/completed',
    '~/Library/Application\\ Support/Code/User/workspaceStorage',
    '~/Library/Application\\ Support/Code/User/History',
    // Xcode
    '~/Library/Developer/Xcode',
    '~/Library/Developer/CoreSimulator/Devices/*-*-*-*-*',
    // Shell
    '~/.bash_sessions',
    '~/.bash_history',
    '~/.zsh_sessions',
    '~/.zsh_history',
    // Npm
    '~/.npm',
    // Cargo
    '~/.cargo',
    // Swift
    '~/.swiftpm'
  ],
  用户日志: ['~/Library/Logs', '~/Library/Application\\ Support/*/logs', '~/Library/Application\\ Support/*/Code\\ Cache', '~/Library/Application\\ Support/CrashReporter'],
  系统日志: ['/Library/Logs/*.log', '/Library/Logs/*/*.log', '/Library/Logs/DiagnosticReports', '/private/var/db/DiagnosticPipeline', '/private/var/db/diagnostics/*/*', '/private/var/log'],
  下载目录: ['~/Downloads/*.dmg', '~/Downloads/*.pkg', '~/Downloads/*.app', '~/Downloads/*.xip', '~/Downloads/*.exe'],
  废纸篓: ['~/.Trash/*', '/Volumes/*/.Trashes/*']
}

// 优化项目配置表
const optimizeItems = [
  { label: '清理 DNS 缓存', cmd: 'dscacheutil -flushcache', checked: true },
  { label: '释放内存', cmd: 'purge', checked: true },
  { label: '重建快速预览缓存', cmd: 'qlmanage -r', checked: true },
  { label: '重建快速预览缩略图', cmd: 'qlmanage -r cache', checked: true },
  { label: '优化邮件索引数据库', cmd: 'sqlite3 ~/Library/Mail/V10/MailData/Envelope\\ Index "VACUUM;"', checked: true },
  { label: '清理下载历史记录', cmd: "sqlite3 ~/Library/Preferences/com.apple.LaunchServices.QuarantineEventsV* 'delete from LSQuarantineEvent'", checked: true },
  { label: '清理图标缓存', cmd: 'find /private/var/folders/ \\( -name com.apple.dock.iconcache -or -name com.apple.iconservices \\) -exec rm -rfv {} \\;', checked: true },
  { label: '清理 icon 服务文件', cmd: 'rm -rf /Library/Caches/com.apple.iconservices.store;', checked: true },
  { label: '修复 Dock 异常', cmd: 'killall Dock', checked: true },
  { label: '修复输入法异常', cmd: 'killall TextInputMenuAgent', checked: true },
  { label: '修复输入法切换异常', cmd: 'killall TextInputSwitcher', checked: true },
  { label: '修复共享异常', cmd: 'killall sharingd', checked: true },
  { label: '修复 iCloud 同步异常', cmd: 'killall bird', checked: true },
  { label: '修复 Spotlight 崩溃问题', cmd: 'killall Spotlight', checked: true },
  { label: '修复通知中心组件异常', cmd: 'killall NotificationCenter', checked: true }
]

// 初始化
async function initApp () {
  // 检测释放开启 完全磁盘访问 权限
  const hasAccess = await window.electronAPI.checkFullDiskAccess()
  if (!hasAccess) {
    const granted = confirm('⚠️ 应用需要设置「完全磁盘访问」权限才能使用完整功能。\n\n打开系统设置，请在列表中添加应用后重新启动软件。')
    if (granted) {
      // 打开系统设置
      await window.electronAPI.openFullDiskAccess()
    }
    // return // 没有权限就不继续初始化
  }

  // 从 keychain 获取保存的密码
  const savedPassword = await window.electronAPI.loadKeychainPassword()
  if (savedPassword) {
    sudoPassword = savedPassword
  }

  // 加载配置
  const config = await window.electronAPI.loadConfig()
  // 读取本地白名单
  const savedList = config && config.whiteList ? config.whiteList : []
  // 合并默认和本地白名单然后排除重复
  userWhiteList = Array.from(new Set([...defaultWhitelist, ...savedList]))

  // 渲染左侧分类菜单
  const sideMenu = document.getElementById('side-menu')
  sideMenu.innerHTML = ''
  Object.keys(categories).forEach(category => {
    sideMenu.innerHTML += `
      <div class="menu-item" id="menu-${category}" onclick="switchView('${category}')">
        <span>${category}</span>
        <span class="size-val" id="side-size-${category}">0 KB</span>
      </div>`
  })
}

window.onload = initApp

// 显示验证框
function openAuthModal () {
  document.getElementById('auth-modal').style.display = 'flex'
  document.getElementById('psw-input').focus()
}

// 隐藏验证框
function closeAuthModal () {
  document.getElementById('auth-modal').style.display = 'none'
  document.getElementById('psw-input').value = ''
}

// 回车键触发
document.getElementById('psw-input').addEventListener('keypress', event => {
  if (event.key === 'Enter') confirmPassword()
})

// sudo 密码验证
async function confirmPassword () {
  const input = document.getElementById('psw-input')
  if (!input.value) return

  // 禁用输入框和按钮，防止重复提交
  const confirmBtn = document.getElementById('auth-confirm-btn')
  const cancelBtn = document.getElementById('auth-cancel-btn')
  input.disabled = true
  confirmBtn.disabled = true
  cancelBtn.disabled = true
  confirmBtn.textContent = '验证中...'

  sudoPassword = input.value

  // 显示加载状态
  const loader = document.getElementById('loader')
  loader.style.display = 'flex'
  document.getElementById('loader-status').innerText = '权限预检中...'

  const auth = await execRoot('sudo -k -S -p "" true')
  loader.style.display = 'none'

  // 校验失败
  if (!auth.success || auth.stderr.toLowerCase().includes('incorrect')) {
    sudoPassword = ''
    // 恢复可操作状态
    input.disabled = false
    confirmBtn.disabled = false
    cancelBtn.disabled = false
    confirmBtn.textContent = '确认'
    input.value = ''
    input.focus()
    alert('❌ 验证失败：密码不正确')
  } else {
    closeAuthModal()
    // 保存密码到 keychain
    await window.electronAPI.saveKeychainPassword(sudoPassword)

    input.disabled = false
    confirmBtn.disabled = false
    cancelBtn.disabled = false
    confirmBtn.textContent = '确认'
    startScanProcess()
  }
}

// 点击扫描入口
function handleScan () {
  if (!sudoPassword) {
    openAuthModal()
  } else {
    startScanProcess()
  }
}

/**
 * @description root 权限执行命令
 * @param {string} cmd - 要执行的命令
 * @returns {Promise<Object>} 执行结果
 */
async function execRoot (cmd) {
  return await window.electronAPI.runShell(`echo "${sudoPassword}" | sudo -S ${cmd}`)
}

// 扫描
async function startScanProcess () {
  const loader = document.getElementById('loader')
  const pFill = document.getElementById('p-fill')
  const status = document.getElementById('loader-status')
  const detail = document.getElementById('loader-detail')

  // 显示加载界面
  loader.style.display = 'flex'
  // 重置进度条
  pFill.style.width = '0%'
  // 清空之前的扫描数据
  scanData = {}

  const categoryEntries = Object.entries(categories)

  // 已完成的分类数量
  let completedCategories = 0

  // 扫描所有分类
  const results = await Promise.all(
    categoryEntries.map(async ([category, paths]) => {
      // 当前分类的结果列表
      const items = []

      // 空类别直接跳过
      if (paths.length === 0) {
        completedCategories++
        // 更新进度条
        pFill.style.width = `${Math.round((completedCategories / categoryEntries.length) * 100)}%`
        return [category, items]
      }

      // 将 ~ 替换为 $HOME，让 shell 正确解析用户目录
      const joinedPaths = paths.map(p => p.replace('~', '$HOME')).join(' ')

      // 遍历目录
      // 找出哪些路径是白名单条目的父目录，需要展开扫描
      const expandedPaths = paths
        .map(p => {
          // 直接用 ~ 做前缀比较，两边格式一致
          const needsExpand = userWhiteList.some(wlPath => {
            return wlPath.startsWith(p.trimEnd() + '/')
          })
          return needsExpand ? p + '/*' : p
        })
        .join(' ')

      // 遍历目录
      const cmd = `sh -c 'for f in ${expandedPaths.replace(/~/g, '$HOME')}; do [ -e "$f" ] && du -sk "$f" 2>/dev/null; done'`

      // const cmd = `sh -c 'for f in ${joinedPaths}; do [ -e "$f" ] && du -sk "$f" 2>/dev/null; done'`

      // 执行命令，需要 root 权限
      const result = await execRoot(cmd)

      // 解析 shell 输出
      if (result.stdout) {
        // 按行拆分
        const lines = result.stdout.split('\n').filter(line => line.trim())

        for (const line of lines) {
          // du 输出是 kb\tpath
          const tabIndex = line.indexOf('\t')
          if (tabIndex === -1) continue

          // 解析大小（KB）
          const kb = parseInt(line.slice(0, tabIndex)) || 0

          // 解析路径
          const itemPath = line.slice(tabIndex + 1).trim()

          // 过滤掉特殊文件
          if (!itemPath || itemPath.endsWith('.DS_Store')) continue
          if (kb === 0) continue

          // 白名单过滤
          const isWhitelisted = userWhiteList.some(wlPath => {
            // 将 ~ 转为真实用户路径
            const normalizedWl = wlPath.replace('~', '/Users/' + itemPath.split('/')[2])

            // 完全匹配或子路径
            return itemPath === normalizedWl || itemPath.startsWith(normalizedWl + '/')
          })

          if (isWhitelisted) continue

          // 收集结果
          items.push({
            // 完整路径
            path: itemPath,
            // 文件名
            name: itemPath.split('/').pop() || itemPath,
            // 文件大小
            kb,
            // 默认选中
            checked: true
          })
        }
      } else {
        console.warn('类别为空', category, 'stderr', result.stderr)
      }

      // 当前分类处理完成
      completedCategories++

      // 更新进度条
      pFill.style.width = `${Math.round((completedCategories / categoryEntries.length) * 100)}%`

      // 更新 UI 文本
      status.innerText = `扫描完成: ${completedCategories}/${categoryEntries.length} 个类别`
      detail.innerText = `已完成: ${category}（${items.length} 个项目）`

      // 返回分类结果
      return [category, items]
    })
  )

  // 将结果数组转回对象结构
  scanData = Object.fromEntries(results)

  // 隐藏加载界面
  loader.style.display = 'none'
  document.getElementById('master-clean').style.display = ''

  // 更新统计信息
  updateStats()
  // 渲染界面
  render()
}

// 更新统计信息
function updateStats () {
  // 被选中的项目的总大小
  let grandTotal = 0

  // 遍历每个分类
  Object.keys(categories).forEach(category => {
    // 计算当前分类中已勾选项目大小的总和
    const size = (scanData[category] || []).reduce((acc, i) => (i.checked ? acc + i.kb : acc), 0)

    const sideEl = document.getElementById(`side-size-${category}`)
    sideEl.innerText = formatSize(size)
    // 累加到全局总大小
    grandTotal += size
  })

  // 更新侧边栏统计
  document.getElementById('side-total').innerText = formatSize(grandTotal)
  // 更新顶部总计
  document.getElementById('top-total-size').innerText = formatSize(grandTotal)
}

// 渲染界面
function render () {
  const body = document.getElementById('view-body')
  body.innerHTML = ''

  // 仪表盘界面
  if (currentView === 'dashboard') {
    // 外层容器
    const wrapper = document.createElement('div')
    wrapper.className = 'dashboard'

    // 分类列表容器
    const list = document.createElement('div')
    list.className = 'category-list'

    // 遍历所有分类，生成每一行分类项
    Object.keys(categories).forEach(category => {
      // 当前分类下的扫描结果
      const items = scanData[category] || []

      // 当前分类总大小
      const categorySize = items.reduce((acc, i) => acc + i.kb, 0)

      // 如果有项目，默认勾选
      const isAll = items.length > 0 && items.every(i => i.checked)

      // 当前分类是否为空
      const isEmpty = items.length === 0

      // 创建分类 dom
      const row = document.createElement('div')
      row.className = 'category-list-item' + (isEmpty ? ' is-empty' : '')
      row.innerHTML = `
        <input type="checkbox" ${isAll ? 'checked' : ''} ${isEmpty ? 'disabled' : ''}
          onchange="toggleCategory('${category}', this.checked)" />
        <span class="category-list-name">${category}</span>
        <span class="category-list-size">${isEmpty ? '—' : formatSize(categorySize)}</span>
      `

      // 点击整行时的交互
      row.addEventListener('click', event => {
        if (event.target.tagName !== 'INPUT') {
          const checkbox = row.querySelector('input[type="checkbox"]')
          if (!checkbox.disabled) {
            checkbox.checked = !checkbox.checked
            toggleCategory(category, checkbox.checked)
          }
        }
      })

      // 把当前分类行加入列表
      list.appendChild(row)
    })

    // 组装到页面
    wrapper.appendChild(list)
    body.appendChild(wrapper)
  } else if (currentView === 'optimize') {
    renderOptimize()
  } else if (currentView === 'whitelist') {
    // 渲染白名单
    renderWhiteList()
  } else {
    // 分类详情模式
    const items = scanData[currentView] || []

    // 当前分类详情页里，是否全部勾选
    const isAll = items.length > 0 && items.every(i => i.checked)

    // 渲染顶部选择区域
    body.innerHTML = `<div style="margin-bottom:15px; display:flex; align-items:center; gap:10px;">
      <input type="checkbox" ${isAll ? 'checked' : ''} onchange="toggleCategory('${currentView}', this.checked)">
      <strong>全选 / 取消全选 (${currentView})</strong>
    </div>`

    // 遍历当前分类下的每个项目，渲染文件项
    items.forEach((item, index) => {
      const div = document.createElement('div')
      div.className = 'file-item'
      div.innerHTML = `
    <input type="checkbox" ${item.checked ? 'checked' : ''} onchange="toggleFile('${currentView}', ${index})">
    <div class="file-info">
      <div class="file-name">${item.name}</div>
      <div class="file-path">${item.path}</div>
    </div>
    <div class="file-size">${formatSize(item.kb)}</div>
    <div style="display:flex; gap:8px;">
      <button class="btn-action" onclick="window.electronAPI.locateFile('${item.path}')">查看</button>
      <button class="btn-action" style="color:var(--ignore)" onclick="ignoreItem('${currentView}', ${index})">忽略</button>
    </div>`

      // 整行点击切换勾选状态
      div.addEventListener('click', event => {
        // 排除点击 checkbox 本身和操作按钮，避免误触
        if (event.target.tagName !== 'INPUT' && event.target.tagName !== 'BUTTON') {
          const checkbox = div.querySelector('input[type="checkbox"]')
          checkbox.checked = !checkbox.checked
          toggleFile(currentView, index)
        }
      })

      body.appendChild(div)
    })
  }
}

/**
 * @description 切换当前视图
 * @param {string} view - 目标视图名称
 */
function switchView (view) {
  // 记录当前正在查看的页面
  currentView = view

  // 切换按钮
  const isOptimizeView = view === 'optimize'
  document.getElementById('scan-action').style.display = isOptimizeView ? 'none' : 'flex'
  document.getElementById('optimize-action').style.display = isOptimizeView ? 'flex' : 'none'

  // master-clean 只在有扫描数据时显示，这个逻辑保持独立
  document.getElementById('master-clean').style.display = !isOptimizeView && Object.keys(scanData).length > 0 ? 'inline-flex' : 'none'

  // 先清除侧边栏所有菜单项的激活状态
  document.querySelectorAll('.sidebar .menu-item').forEach(m => m.classList.remove('active'))
  const menuId = view === 'dashboard' ? 'menu-dashboard' : view === 'whitelist' ? 'menu-whitelist' : view === 'optimize' ? 'menu-optimize' : 'menu-' + view
  document.getElementById(menuId).classList.add('active')
  // 更新页面标题
  document.getElementById('view-title').innerText = view === 'dashboard' ? '仪表板' : view === 'whitelist' ? '白名单' : view === 'optimize' ? '优化系统' : view
  // 重新渲染页面内容
  render()
}

/**
 * @description 切换分类的勾选状态
 * @param {string} category - 分类名称
 * @param {boolean} checked - 是否勾选
 */
function toggleCategory (category, checked) {
  scanData[category]?.forEach(item => (item.checked = checked))
  updateStats()
  render()
}

/**
 * @description 切换单个文件项的勾选状态
 * @param {string} category - 分类名称
 * @param {number} index - 文件索引
 */
function toggleFile (category, index) {
  scanData[category][index].checked = !scanData[category][index].checked
  updateStats()
  render()
}

// 持久化保存配置
async function persistConfig () {
  await window.electronAPI.saveConfig({ whiteList: userWhiteList })
}

/**
 * @description 忽略某个扫描项
 * @param {string} category - 分类名称
 * @param {number} index - 项目索引
 */

async function ignoreItem (category, index) {
  // 取出当前被忽略的项目
  const item = scanData[category][index]

  // 如果白名单里还没有这个路径，就加入
  if (!userWhiteList.includes(item.path)) {
    userWhiteList.push(item.path)
    // 保存到配置文件，避免下次启动丢失
    await persistConfig()
  }

  // 从当前分类扫描结果中删除这个项目
  scanData[category].splice(index, 1)

  // 更新统计与界面
  updateStats()
  render()
}

// 渲染白名单页面
function renderWhiteList () {
  const body = document.getElementById('view-body')
  body.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
      <h3 style="margin:0;">白名单</h3>
      <button class="btn-scan" onclick="manuallyAdd()">手动添加</button>
    </div>
    <div id="wl-list-container">
      ${userWhiteList.length === 0 ? '<div style="color:#ccc; text-align:center; padding:20px;">白名单为空</div>' : ''}
    </div>
  `

  // 白名单列表容器
  const container = document.getElementById('wl-list-container')

  // 遍历白名单中每个路径，生成一行显示
  userWhiteList.forEach((path, index) => {
    const div = document.createElement('div')
    div.className = 'file-item'
    div.innerHTML = `
      <div class="file-info" style="font-family:monospace; font-size:11px;">${path}</div>
      <button class="btn-action" style="color:var(--danger)" onclick="removeWhitelist(${index})">删除</button>
    `
    container.appendChild(div)
  })
}

// 手动添加白名单路径
async function manuallyAdd () {
  // 打开路径选择器
  const paths = await window.electronAPI.selectPath()

  // 如果选中了路径
  if (paths && paths.length > 0) {
    paths.forEach(path => {
      // 去重后再加入白名单
      if (!userWhiteList.includes(path)) userWhiteList.push(path)
    })
    // 保存配置
    await persistConfig()
    // 刷新白名单视图
    renderWhiteList()
  }
}

/**
 * @description 删除指定白名单项
 * @param {number} index - 白名单索引
 */
async function removeWhitelist (index) {
  // 从白名单数组中删除指定索引
  userWhiteList.splice(index, 1)
  // 保存持久化
  await persistConfig()
  // 重新渲染白名单列表
  renderWhiteList()
}

// 执行清理
async function handleClean () {
  // 收集所有被勾选项目的路径
  const paths = []

  Object.values(scanData).forEach(items =>
    items.forEach(el => {
      if (el.checked) paths.push(el.path)
    })
  )

  // 如果没有可清理项，或者用户取消确认，直接结束
  if (paths.length === 0 || !confirm(`确认清理选中的 ${paths.length} 个项目？`)) return

  // 获取加载界面元素
  const loader = document.getElementById('loader')
  const pFill = document.getElementById('p-fill')
  const status = document.getElementById('loader-status')
  const detail = document.getElementById('loader-detail')

  // 显示清理进度 UI
  loader.style.display = 'flex'
  pFill.style.width = '0%'
  status.innerText = '清理中...'

  // 分批删除
  const batchSize = 20

  // 已删除数量，用来更新进度条
  let deleted = 0

  // 按批次串行处理
  for (let i = 0; i < paths.length; i += batchSize) {
    // 当前批次的路径
    const batch = paths.slice(i, i + batchSize)

    // 批量删除
    const quotedPaths = batch.map(path => `"${path}"`).join(' ')
    await execRoot(`rm -rf ${quotedPaths}`)

    // 更新已删除数量
    deleted += batch.length

    // 更新进度
    pFill.style.width = `${Math.round((deleted / paths.length) * 100)}%`
    detail.innerText = `已删除 ${deleted} / ${paths.length} 个项目`
  }

  // 清理系统缓存
  status.innerText = '清理系统缓存...'
  detail.innerText = ''

  loader.style.display = 'none'
  alert('清理完成！')
  // 重新扫描，刷新当前数据状态
  startScanProcess()
}

/**
 * @description 将 KB 数值格式化为可读容量字符串
 * @param {number} kb - KB 大小
 * @returns {string} 格式化后的容量文本
 */
function formatSize (kb) {
  if (kb < 1024) return kb + ' KB'
  if (kb < 1024 * 1024) return (kb / 1024).toFixed(2) + ' MB'
  return (kb / (1024 * 1024)).toFixed(2) + ' GB'
}

// 渲染优化系统界面
function renderOptimize () {
  const body = document.getElementById('view-body')
  body.innerHTML = ''

  // 外层容器，和 dashboard 保持一致
  const wrapper = document.createElement('div')
  wrapper.className = 'dashboard'

  // 全选/取消全选状态
  const isAll = optimizeItems.length > 0 && optimizeItems.every(i => i.checked)

  // 顶部全选区域，写法参考分类详情模式
  const selectAllBar = document.createElement('div')
  selectAllBar.style.cssText = 'margin-bottom:15px; display:flex; align-items:center; gap:10px;'
  selectAllBar.innerHTML = `
    <input type="checkbox" ${isAll ? 'checked' : ''} onchange="toggleAllOptimize(this.checked)">
    <strong>全选 / 取消全选</strong>
  `
  body.appendChild(selectAllBar)

  // 优化项列表容器
  const list = document.createElement('div')
  list.className = 'category-list'

  // 遍历优化项数据并渲染每一行
  optimizeItems.forEach((item, index) => {
    const row = document.createElement('div')
    row.className = 'category-list-item'
    row.innerHTML = `
      <input type="checkbox" ${item.checked ? 'checked' : ''} onchange="toggleOptimizeItem(${index}, this.checked)">
      <span class="category-list-name">${item.label}</span>
    `
    // 点击整行时也可以切换选中状态
    row.addEventListener('click', event => {
      // 防止点击复选框时重复触发
      if (event.target.tagName !== 'INPUT') {
        const checkbox = row.querySelector('input[type="checkbox"]')
        checkbox.checked = !checkbox.checked

        // 同步更新数据状态
        toggleOptimizeItem(index, checkbox.checked)
      }
    })
    // 添加到列表容器
    list.appendChild(row)
  })

  // 将列表添加到外层容器
  wrapper.appendChild(list)
  // 将整体结构渲染到页面
  body.appendChild(wrapper)
}

/**
 * @description 全选/取消全选逻辑
 * @param {boolean} checked - 目标选中状态
 */
function toggleAllOptimize (checked) {
  optimizeItems.forEach(item => {
    item.checked = checked
  })
  renderOptimize()
}

/**
 * @description 切换选择状态
 * @param {number} index - 目标项索引
 * @param {boolean} checked - 目标选中状态
 */
function toggleOptimizeItem (index, checked) {
  optimizeItems[index].checked = checked
  renderOptimize()
}

// 系统优化
async function runOptimize () {
  if (!sudoPassword) {
    openAuthModal()
    return
  }
  const selected = optimizeItems.filter(i => i.checked)
  if (selected.length === 0) {
    alert('请至少选择一项优化操作')
    return
  }

  // 获取加载动画相关 UI
  const loader = document.getElementById('loader')
  const pFill = document.getElementById('p-fill')
  const status = document.getElementById('loader-status')
  const detail = document.getElementById('loader-detail')

  // 显示加载界面
  loader.style.display = 'flex'
  pFill.style.width = '0%'
  status.innerText = '正在优化系统...'

  let done = 0
  for (const item of selected) {
    detail.innerText = item.label
    await execRoot(item.cmd)
    done++
    pFill.style.width = Math.round((done / selected.length) * 100) + '%'
  }

  loader.style.display = 'none'
  alert('系统优化完成')
}
