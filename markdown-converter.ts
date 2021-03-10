import * as Showdown from 'showdown';

export class MarkdownConverter{
  static Converter(text: string): string{
    const style = `
    #viewer-area table,th,td{
      border: 1px gray solid;
    }
    #viewer-area th,td{
      padding: 10px;
    }
    #viewer-area th{
      text-align: center;
      background-color: lightgray;
    }
    #viewer-area blockquote{
      border-left: 8px solid #dddfe4;
      padding: 16px;
      padding-left: 1.5em;
      background: #eef0f4;
    }
    #viewer-area blockquote p{
      margin-bottom: 0;
    }
    #viewer-area pre{
      padding: 8px;
      border: 1px gray solid;
    }
    `;
    const converter = new Showdown.Converter();
    converter.setOption('customizedHeaderId', 'true');
    converter.setOption('parseImgDimensions', 'true');
    converter.setOption('strikethrough', 'true');
    converter.setOption('tables', 'true');
    converter.setOption('ghCodeBlocks', 'true');
    converter.setOption('tasklists', 'true');
    converter.setOption('smoothLivePreview', 'true');
    converter.setOption('simpleLineBreaks', 'true');
    converter.setOption('backslashEscapesHTMLTags', 'true');
    converter.setOption('emoji', 'true');
    converter.setOption('underline', 'true');
    return converter.makeHtml(text) + `<style>${style}</style>`;
  }
}
