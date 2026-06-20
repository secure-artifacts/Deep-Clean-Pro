const { app, BrowserWindow, ipcMain, shell, dialog } = require('electron')
const path = require('path')
const { exec } = require('child_process')
const fs = require('fs')
const keytar = require('keytar')

app.setName('Deep Clean Pro')
const keychainService = 'Deep Clean Pro'
const keychainAccount = 'boot-password'

// 配置目录路径
const configDir = path.join(app.getPath('userData'))
// 配置文件完整路径
const configFile = path.join(configDir, 'config.json')

// 创建主窗口
function createWindow () {
  const win = new BrowserWindow({
    width: 1300,
    height: 869,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true
    }
  })
  win.loadFile('index.html')
}

// 保存配置配置
ipcMain.handle('save-config', (event, data) => {
  try {
    if (!fs.existsSync(configDir)) fs.mkdirSync(configDir, { recursive: true })
    // 写入文件
    fs.writeFileSync(configFile, JSON.stringify(data))
    return true
  } catch (error) {
    console.error('Save config failed', error)
    return false
  }
})

// 读取配置
ipcMain.handle('load-config', () => {
  try {
    if (fs.existsSync(configFile)) {
      const data = fs.readFileSync(configFile, 'utf-8')
      return JSON.parse(data)
    }
  } catch (error) {
    console.error('Load config failed', error)
  }
  return null
})

// 执行 shell 命令
ipcMain.handle('run-shell', async (event, cmd) => {
  return new Promise(resolve => {
    // maxBuffer 设置为 30MB
    // 避免输出过大导致缓冲区溢出
    exec(cmd, { maxBuffer: 1024 * 1024 * 30 }, (error, stdout, stderr) => {
      resolve({
        success: !error,
        stdout: stdout || '',
        stderr: stderr || ''
      })
    })
  })
})

// 在系统文件管理器中定位文件
ipcMain.handle('locate-file', (event, path) => {
  if (!path) return
  // 格式化路径
  const fullPath = path.replace(/\\ /g, ' ').replace('~', app.getPath('home')).replace(/\/\*$/, '')
  // 在 Finder 中打开
  shell.showItemInFolder(fullPath)
})

// 打开路径选择器
ipcMain.handle('select-path', async () => {
  // 调起原生文件选择对话框
  const result = await dialog.showOpenDialog({ properties: ['openFile', 'openDirectory', 'multiSelections'] })
  return result.filePaths
})

// 创建窗口
app.whenReady().then(createWindow)

// 检测完全磁盘访问权限
ipcMain.handle('check-full-disk-access', () => {
  try {
    fs.readFileSync('/Library/Preferences/com.apple.TimeMachine.plist')
    return true
  } catch (e) {
    return false
  }
})

// 打开系统设置的完全磁盘访问页
ipcMain.handle('open-full-disk-access', () => {
  shell.openExternal('x-apple.systempreferences:com.apple.preference.security?Privacy_AllFiles')
})

// 保存到 keychain
ipcMain.handle('save-keychain-password', async (event, password) => {
  try {
    if (!password) return false
    await keytar.setPassword(keychainService, keychainAccount, password)
    return true
  } catch (error) {
    console.error('Save keychain password failed', error)
    return false
  }
})

// 读取 keychain
ipcMain.handle('load-keychain-password', async () => {
  try {
    const password = await keytar.getPassword(keychainService, keychainAccount)
    return password || ''
  } catch (error) {
    console.error('Load keychain password failed', error)
    return ''
  }
})

// 删除 keychain
ipcMain.handle('clear-keychain-password', async () => {
  try {
    return await keytar.deletePassword(keychainService, keychainAccount)
  } catch (error) {
    console.error('Delete keychain password failed', error)
    return false
  }
})
