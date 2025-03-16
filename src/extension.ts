
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