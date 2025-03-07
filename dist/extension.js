/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 0:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
// import * as vscode from 'vscode';
// import { IssueController } from './IssueController'; // 确保路径正确
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.deactivate = deactivate;
exports.activate = activate;
// export function activate(context: vscode.ExtensionContext) {
// 	const controller = new IssueController(context);
// 	context.subscriptions.push(
// 	  vscode.commands.registerCommand('codeReview.addIssue', controller.addIssue),
// 	  vscode.commands.registerCommand('codeReview.showIssues', controller.showIssuePanel),
// 	  vscode.commands.registerCommand('codeReview.toggleIssues', controller.toggleDecorations)
// 	);
//   }
// This method is called when your extension is deactivated
function deactivate() { }
const vscode = __importStar(__webpack_require__(1));
const ReviewController_1 = __webpack_require__(2);
function activate(context) {
    const controller = new ReviewController_1.ReviewController(context);
    context.subscriptions.push(vscode.commands.registerCommand('codeReview.showPanel', () => controller.showReviewPanel()));
}


/***/ }),

/***/ 1:
/***/ ((module) => {

module.exports = require("vscode");

/***/ }),

/***/ 2:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ReviewController = void 0;
const vscode = __importStar(__webpack_require__(1));
const gitUtils_1 = __webpack_require__(3);
const ReviewPanel_1 = __webpack_require__(6);
const ReviewStore_1 = __webpack_require__(7);
class ReviewController {
    context;
    store;
    constructor(context) {
        this.context = context;
        this.store = new ReviewStore_1.ReviewStore(context);
    }
    async showReviewPanel() {
        const editor = vscode.window.activeTextEditor;
        if (!editor)
            return;
        const document = editor.document;
        const selection = editor.selection;
        const committer = await gitUtils_1.GitHelper.getLineCommitter(document.uri.fsPath, selection.start.line + 1);
        const codeSelection = {
            filePath: document.uri.fsPath,
            startLine: selection.start.line + 1,
            endLine: selection.end.line + 1,
            codeContent: document.getText(selection),
            committer
        };
        const comments = this.store.getCommentsByFile(document.uri.fsPath)
            .filter(c => c.startLine === codeSelection.startLine &&
            c.endLine === codeSelection.endLine);
        ReviewPanel_1.ReviewPanel.show(this.context, codeSelection, comments);
    }
}
exports.ReviewController = ReviewController;


/***/ }),

/***/ 3:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GitHelper = void 0;
const child_process = __importStar(__webpack_require__(4));
const util = __importStar(__webpack_require__(5));
const path = __importStar(__webpack_require__(27));
const exec = util.promisify(child_process.exec);
class GitHelper {
    static async getGitRoot(filePath) {
        try {
            const { stdout } = await exec('git rev-parse --show-toplevel');
            return stdout.trim();
        }
        catch (error) {
            console.error('Error getting git root:', error);
            throw error;
        }
    }
    static async getLineCommitter(filePath, line) {
        try {
            // Get git repository root
            const gitRoot = await this.getGitRoot(filePath);
            console.log(`Git root: ${gitRoot}`);
            // Convert file path to be relative to git root
            const relativePath = path.relative(gitRoot, filePath);
            console.log(`Relative path: ${relativePath}`);
            // Change to git root directory before executing git blame
            process.chdir(gitRoot);
            const command = `git blame -L ${line},${line} --porcelain "${relativePath}"`;
            console.log(`Executing command: ${command}`);
            const { stdout, stderr } = await exec(command);
            console.log(`Git blame output: ${stdout}`);
            if (stderr) {
                console.error(`Git blame error: ${stderr}`);
            }
            const result = stdout.split('\n')[0].split(' ')[1];
            console.log(`Extracted committer: ${result}`);
            return result;
        }
        catch (error) {
            console.error('Error in getLineCommitter:', error);
            return 'Unknown';
        }
    }
}
exports.GitHelper = GitHelper;


/***/ }),

/***/ 4:
/***/ ((module) => {

module.exports = require("child_process");

/***/ }),

/***/ 5:
/***/ ((module) => {

module.exports = require("util");

/***/ }),

/***/ 6:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ReviewPanel = void 0;
const vscode = __importStar(__webpack_require__(1));
const ReviewStore_1 = __webpack_require__(7);
class ReviewPanel {
    panel;
    static currentPanel;
    constructor(context, panel, selection, comments) {
        this.panel = panel;
        this.panel.webview.html = this.getWebviewContent(selection, comments);
        this.setupMessageHandler(context);
        panel.onDidDispose(() => {
            ReviewPanel.currentPanel = undefined;
        });
    }
    static show(context, selection, comments) {
        if (ReviewPanel.currentPanel) {
            ReviewPanel.currentPanel.panel.reveal();
            return;
        }
        const panel = vscode.window.createWebviewPanel('codeReview', 'Code Review', vscode.ViewColumn.Two, { enableScripts: true });
        ReviewPanel.currentPanel = new ReviewPanel(context, panel, selection, comments);
    }
    setupMessageHandler(context) {
        this.panel.webview.onDidReceiveMessage(async (message) => {
            if (message.command === 'submitComment') {
                const store = new ReviewStore_1.ReviewStore(context);
                await store.addComment({
                    filePath: message.filePath,
                    startLine: message.startLine,
                    endLine: message.endLine,
                    committer: message.committer,
                    content: message.content
                });
                this.panel.dispose();
            }
        });
    }
    getWebviewContent(selection, comments) {
        return `
        <html>
        <body>
          <h3>Reviewing ${selection.filePath}</h3>
          <p>Lines: ${selection.startLine}-${selection.endLine}</p>
          <p>Committer: ${selection.committer}</p>
          
          <div>
            <textarea id="commentInput" rows="4" cols="50"></textarea>
            <button onclick="submitComment()">Submit</button>
          </div>
  
          <h4>Previous Comments (${comments.length}):</h4>
          <ul>
            ${comments.map(c => `
              <li>
                <strong>${c.committer}</strong> (${new Date(c.createdAt).toLocaleString()}):
                <p>${c.content}</p>
              </li>
            `).join('')}
          </ul>
  
          <script>
            const vscode = acquireVsCodeApi();
            function submitComment() {
              const input = document.getElementById('commentInput');
              vscode.postMessage({
                command: 'submitComment',
                content: input.value
              });
            }
          </script>
        </body>
        </html>
      `;
    }
}
exports.ReviewPanel = ReviewPanel;


/***/ }),

/***/ 7:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ReviewStore = void 0;
class ReviewStore {
    context;
    key = 'codeReviewComments';
    constructor(context) {
        this.context = context;
    }
    async addComment(comment) {
        const comments = this.getAllComments();
        const newComment = {
            ...comment,
            id: crypto.randomUUID(),
            createdAt: new Date()
        };
        await this.context.workspaceState.update(this.key, [...comments, newComment]);
        return newComment;
    }
    getCommentsByFile(filePath) {
        return this.getAllComments().filter(c => c.filePath === filePath);
    }
    getAllComments() {
        return this.context.workspaceState.get(this.key) || [];
    }
}
exports.ReviewStore = ReviewStore;


/***/ }),

/***/ 27:
/***/ ((module) => {

module.exports = require("path");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(0);
/******/ 	module.exports = __webpack_exports__;
/******/ 	
/******/ })()
;
//# sourceMappingURL=extension.js.map