import { fstat } from 'fs';
import * as vscode from 'vscode';
import { SidebarProvider } from "./SidebarProvider";
const fs = require('fs');
const path = require("path");

export function activate(context: vscode.ExtensionContext) {
  const sidebarProvider = new SidebarProvider(context.extensionUri);

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider("vstodo-sidebar", sidebarProvider)
  );
}