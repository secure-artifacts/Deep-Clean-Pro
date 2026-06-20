const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  runShell: cmd => ipcRenderer.invoke('run-shell', cmd),
  locateFile: path => ipcRenderer.invoke('locate-file', path),
  selectPath: () => ipcRenderer.invoke('select-path'),
  saveConfig: data => ipcRenderer.invoke('save-config', data),
  loadConfig: () => ipcRenderer.invoke('load-config'),
  checkFullDiskAccess: () => ipcRenderer.invoke('check-full-disk-access'),
  openFullDiskAccess: () => ipcRenderer.invoke('open-full-disk-access'),
  saveKeychainPassword: password => ipcRenderer.invoke('save-keychain-password', password),
  loadKeychainPassword: () => ipcRenderer.invoke('load-keychain-password'),
  clearKeychainPassword: () => ipcRenderer.invoke('clear-keychain-password')
})
