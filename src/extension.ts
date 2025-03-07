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
import {ReviewController} from './ReviewController';
export function activate(context: vscode.ExtensionContext) {
	const controller = new ReviewController(context);
	
	context.subscriptions.push(
	  vscode.commands.registerCommand(
		'codeReview.showPanel',
		() => controller.showReviewPanel()
	  )
	);
  }