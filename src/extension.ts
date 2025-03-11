// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
// import * as vscode from 'vscode';
// import { IssueController } from './IssueController'; // 确保路径正确

// export function activate(context: vscode.ExtensionContext) {
// 	const controller = new IssueController(context);
	
// 	context.subscriptions.push(
// 	  vscode.commands.registerCommand('codeReview.addIssue', controller.addIssue),
// 	  vscode.commands.registerCommand('codeReview.showIssues', controller.showIssuePanel),
// 	  vscode.commands.registerCommand('codeReview.toggleIssues', controller.toggleDecorations)
// 	);
//   }

// This method is called when your extension is deactivated
export function deactivate() {}


import * as vscode from 'vscode';
import { ReviewController } from './ReviewController';

export function activate(context: vscode.ExtensionContext) {
	console.log('Activating Code Review extension');
	const controller = new ReviewController(context);
	
	// 注册命令
	const showPanelCommand = vscode.commands.registerCommand('codeReview.showPanel', async () => {
		const editor = vscode.window.activeTextEditor;
		if (!editor || !editor.selection) {
			vscode.window.showInformationMessage('请先选择要评审的代码');
			return;
		}
		if (editor.selection.isEmpty) {
			vscode.window.showInformationMessage('请先选择要评审的代码');
			return;
		}
		await controller.showReviewPanel();
	});

	context.subscriptions.push(showPanelCommand);
}