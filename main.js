const electron = require('electron');
const url = require('url');
const path = require('path');

const {
    app,
    BrowserWindow,
    Menu
} = electron;

let mainWindow = null;
let serversWindow = null;
let tablesWindow = null;

// Listen for the app to be ready
// vscode-fold=0
function createWindow() {
    mainWindow = new BrowserWindow({
        title: "Sincronizador / Replicador",
        x: 0,
        y: 10,
        autoHideMenuBar: true,
        // minimizable: false,
        resizable: false,
        icon: path.join(__dirname, 'build/icon.ico')
    });

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'mainWindow.html'),
        protocol: 'file:',
        slashes: true
    }));

    // Built menu from template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);

    // Insert menu
    Menu.setApplicationMenu(mainMenu);

    if (process.env.NODE_ENV !== 'production') {
        mainWindow.webContents.openDevTools();
    }

    function openSyncsWindow() {
        event.sender.send('openSyncsWindow');
    };
};

// Create menu template
// vscode-fold=1
const mainMenuTemplate = [{
        label: 'Aplicativo',
        submenu: [{
                label: 'Configuração',
                submenu: [{
                        label: 'Servidores',
                        accelerator: process.platform === 'darwin' ? 'Command+S' : 'Ctrl+S',
                        click(item, focusedWindow) {
                            if (focusedWindow) openServersWindow();
                        }
                    },
                    {
                        label: 'Tabelas',
                        accelerator: process.platform === 'darwin' ? 'Command+T' : 'Ctrl+T',
                        click(item, focusedWindow) {
                            if (focusedWindow) openTablesWindow();
                        }
                    },
                    {
                        label: 'Sincronização',
                        accelerator: process.platform === 'darwin' ? 'Command+Y' : 'Ctrl+Y',
                        click(item, focusedWindow) {
                            if (focusedWindow)
                                focusedWindow.webContents.send('openSyncsWindow');
                        }
                    }
                ]
            },
            {
                label: 'Recarregar',
                accelerator: 'CmdOrCtrl+R',
                click(item, focusedWindow) {
                    if (focusedWindow) focusedWindow.reload()
                }
            }
        ]
    },
    {
        label: 'Sair',
        click() {
            app.quit();
        }
    }
];

// Listen for the app to be ready
// vscode-fold=2
app.on('ready', createWindow);

app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow()
    }
});

// Open developer tools if not in production
// vscode-fold=3
if (process.env.NODE_ENV !== 'production') {
    mainMenuTemplate.push({
        label: 'Ferramentas',
        submenu: [{
            label: 'Toggle Dev Tools',
            accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
            click(item, focusedWindow) {
                if (focusedWindow) focusedWindow.webContents.toggleDevTools()
            }
        }]
    })
}

// vscode-fold=4
function openServersWindow() {
    if (serversWindow) {
        serversWindow.focus()
        return;
    }

    serversWindow = new BrowserWindow({
        title: "Conexão com Servidores",
        minimizable: false,
        parent: mainWindow,
        fullscreenable: false,
        icon: path.join(__dirname, 'build/icon.ico')
    });

    serversWindow.setMenu(null);

    serversWindow.loadURL('file://' + __dirname + '/servers.html');

    serversWindow.on('closed', function () {
        mainWindow.reload();
        serversWindow = null;
    });

    // Open developer tools if not in production
    // if (process.env.NODE_ENV !== 'production') {
    //     serversWindow.webContents.openDevTools();
    // }
};

// vscode-fold=5
function openTablesWindow() {

    if (tablesWindow) {
        tablesWindow.focus()
        return;
    }

    tablesWindow = new BrowserWindow({
        title: "Tabelas",
        minimizable: false,
        parent: mainWindow,
        fullscreenable: false,
        icon: path.join(__dirname, 'build/icon.ico')
    });

    tablesWindow.setMenu(null);

    tablesWindow.loadURL('file://' + __dirname + '/tables.html');

    tablesWindow.on('closed', function () {
        mainWindow.reload();
        tablesWindow = null;
    });

    // Open developer tools if not in production
    // if (process.env.NODE_ENV !== 'production') {
    //     tablesWindow.webContents.openDevTools();
    // }
};