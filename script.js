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
    // Safari
    '~/Library/Containers/com.apple.Safari/Data/Library/Caches',
    '~/Library/Containers/io.te0.WebView/Data/Library/Caches/WebKit',
    '~/Library/Safari/History.db*',
    '~/Library/Safari/RecentlyClosedTabs.plist',
    '~/Library/Safari/CloudHistoryRemoteConfiguration.plist',
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
    '~/Library/Application\\ Support/Arc/User\\ Data/*/component_crx_cache'
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
  document.getElementById('master-clean').style.display = 'block'

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

  // 先清除侧边栏所有菜单项的激活状态
  document.querySelectorAll('.sidebar .menu-item').forEach(m => m.classList.remove('active'))
  const menuId = view === 'dashboard' || view === 'whitelist' ? `menu-${view}` : `menu-${view}`
  document.getElementById(menuId).classList.add('active')
  // 更新页面标题
  document.getElementById('view-title').innerText = view === 'dashboard' ? '深度清理' : view === 'whitelist' ? '白名单管理' : view
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

  // 清理下载历史记录，清理 DNS 缓存，释放内存
  await Promise.all([
    // 清理 DNS 缓存
    execRoot('dscacheutil -flushcache'),
    // 释放内存
    execRoot('purge'),
    // 重建快速预览缓存
    execRoot('qlmanage -r'),
    // 重建快速预览缩略图
    execRoot('qlmanage -r cache'),
    // 优化邮件索引数据库
    execRoot('sqlite3 ~/Library/Mail/V10/MailData/Envelope\\ Index "VACUUM;"'),
    // 清理下载历史记录
    execRoot("sqlite3 ~/Library/Preferences/com.apple.LaunchServices.QuarantineEventsV* 'delete from LSQuarantineEvent'"),
    // 修复 Dock 异常
    execRoot('killall Dock'),
    // 修复输入法和切换异常
    execRoot('killall TextInputMenuAgent'),
    execRoot('killall TextInputSwitcher'),
    // 修复共享移除
    execRoot('killall sharingd'),
    // 修复 iCloud 同步异常
    execRoot('killall bird'),
    // 修复通知中心组件异常
    execRoot('killall NotificationCenter'),
    // 修复 Spotlight 崩溃问题
    execRoot('killall Spotlight')
  ])

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
