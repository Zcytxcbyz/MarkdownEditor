import {AfterViewInit, Component, HostListener, OnInit} from '@angular/core';
import * as $ from 'jquery';
import 'bootstrap';
import * as Showdown from 'showdown';
import {MarkdownConverter} from '../markdown-converter';

@Component({
  selector: 'app-markdown-editor',
  templateUrl: './markdown-editor.component.html',
  styleUrls: ['./markdown-editor.component.css']
})
export class MarkdownEditorComponent implements OnInit, AfterViewInit{
  @HostListener('window:resize') onResize(): void{
    const paddingHeight = Number($('#markdown-editor').css('padding').replace('px', ''));
    const editorHeight = window.innerHeight - $('#markdown-editor-header').height() - 2 * paddingHeight - 1;
    $('#markdown-editor-editor').height(editorHeight);
  }
  constructor() { }
  ngOnInit(): void{
    this.onResize();
  }
  ngAfterViewInit(): void{
    $('[data-toggle="tooltip"]').tooltip();
  }
  EditorAreaChanged(textArea): void{
    $('#viewer-area').html(MarkdownConverter.Converter(textArea.value));
  }
  text_bold(textArea): void{
    this.SetTextStyle(textArea, '**${text}**', '加粗样式');
  }
  text_italic(textArea): void{
    this.SetTextStyle(textArea, '*${text}*', '斜体样式');
  }
  text_strikethrough(textArea): void{
    this.SetTextStyle(textArea, '~~${text}~~', '删除线样式');
  }
  text_heading(textArea, num): void{
    let prefix = '';
    for (let i = 0; i < num; ++i){
      prefix += '#';
    }
    this.setTextStyleWithWarp(textArea, prefix + ' ${text}', `标题${num}`);
  }
  text_list_ul(textArea): void{
    this.setTextStyleWithWarp(textArea, '- ${text}', '列表项');
  }
  text_list_ol(textArea): void{
    let i = textArea.selectionStart; let startPos; let endPos; let index = 0;
    for (; i >= 0 ; --i) {
      startPos = i;
      if (textArea.value.charAt(i) === '\n') { break; }
    }
    for (; i < textArea.value.length ; ++i){
      if (textArea.value.charAt(i) === '.') { endPos = i; break; }
    }
    if (i >= 0 && i <= textArea.value.length) {
      index = Number(textArea.value.slice(startPos, endPos));
      if (isNaN(index)){index = 1; }
    }
    this.setTextStyleWithWarp(textArea, index + 1 + '. ${text}', '列表项');
  }
  text_quote(textArea): void{
    this.setTextStyleWithWarp(textArea, '> ${text}', '引用');
  }
  text_underline(textArea): void{
    this.SetTextStyle(textArea, '__${text}__', '下划线样式');
  }
  text_list_tasks(textArea): void{
    this.setTextStyleWithWarp(textArea, '- [] ${text}', '列表项');
  }
  text_undo(): void{
    document.execCommand('undo');
  }
  text_redo(): void{
    document.execCommand('redo');
  }
  text_tables(textArea): void{
    this.SetTextStyle(textArea, '\n| | |\n|--|--|\n| | |\n', '\n| | |\n|--|--|\n| | |\n');
  }
  text_link(textArea, alert): void{
    alert.enable = 'true';
  }
  text_link_insert(textArea, address, describe, alert): void {
    if (describe.value === ''){
      this.setTextStyleWithWarp(textArea, `<${address.value}>`, `<${address.value}>`);
    }
    else{
      this.setTextStyleWithWarp(textArea, `[${describe.value}](${address.value})`, `[${describe.value}](${address.value})`);
    }
    describe.value = '';
    address.value = '';
    alert.enable = 'false';
  }
  text_code(textArea): void {
    this.setTextStyleWithWarp(textArea, '```\n${text}\n```', '代码块');
  }
  upload_image(file): void {

  }
  image_alert_cancel(file, alert): void{
    file.value = '';
    alert.enable = 'false';
  }
  text_image(alert): void {
    alert.enable = 'true';
  }
  text_video(alert): void {
    alert.enable = 'true';
  }
  video_alert_cancel(file, alert): void {
    file.value = '';
    alert.enable = 'false';
  }
  setTextStyleWithWarp(textArea, style, name): void{
    const selectionText = GetSelectionText(textArea);
    if (selectionText){
      this.SetTextStyle(textArea, style, name, '\n', '\n');
    }
    else{
      this.SetTextStyle(textArea, style, name, '\n');
    }
  }
  SetTextStyle(textArea, style, name, prefix= '', suffix= ''): void{
    const selectionText = GetSelectionText(textArea);
    if (selectionText == null){
      textArea.value = `${textArea.value.substr(0, textArea.selectionStart)}${prefix}${style.replace('${text}', name)}${suffix}${textArea.value.substr(textArea.selectionEnd)}`;
    }
    else{
      const styleObjectList = style.split('${text}');
      const stylePrefix = styleObjectList[0];
      const styleSuffix = styleObjectList[1];
      const startPos = textArea.selectionStart - stylePrefix.length;
      const endPos = textArea.selectionEnd + stylePrefix.length;
      const textPrefix = textArea.value.slice(startPos, textArea.selectionStart);
      const textSuffix = textArea.value.slice(textArea.selectionEnd, endPos);
      const selePrefix = selectionText.slice(0, stylePrefix.length);
      const seleSuffix = selectionText.slice(-styleSuffix.length);
      if (stylePrefix === textPrefix && styleSuffix === textSuffix){
        textArea.value = `${textArea.value.slice(0, startPos)}${prefix}${selectionText}${suffix}${textArea.value.slice(endPos)}`;
      }
      else if (stylePrefix === selePrefix && styleSuffix === seleSuffix){
        textArea.value = `${textArea.value.slice(0, textArea.selectionStart)}${prefix}${selectionText.slice(stylePrefix.length, -styleSuffix.length)}${suffix}${textArea.value.slice(textArea.selectionEnd)}`;
      }
      else{
        textArea.value = `${textArea.value.substr(0, textArea.selectionStart)}${prefix}${style.replace('${text}', selectionText)}${suffix}${textArea.value.substr(textArea.selectionEnd)}`;
      }
    }
    this.EditorAreaChanged(textArea);
    textArea.focus();
  }

  text_link_cancel(address, describe, alert): void {
    address.value = '';
    describe.value = '';
    alert.enable = 'false';
  }
}

function GetSelectionText(textArea): string{
  const startPos = textArea.selectionStart;
  const endPos = textArea.selectionEnd;
  if (startPos === endPos) { return null; }
  else { return textArea.value.slice(startPos, endPos); }
}

