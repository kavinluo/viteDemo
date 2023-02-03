// pdf内容
var docDefinition = {
  content: [],
  // 样式
  styles: {},
  // 默认样式
  defaultStyle: {},
};

// 生成pdf内容
function builderDocDefinition(call) {
  html2canvas(document.getElementById('formTable'), {
    width: 942,
    height: 1036,
    useCORS: true,
    onrendered: function (canvas) {
      var dataUrl = canvas.toDataURL('image/png');
      docDefinition.content[0] = {
        image: dataUrl,
        fit: [520, 760]
        // width: 520,
        // height: 760,
      };
      html2canvas(document.getElementById('pictureBox'),{
        width: 940,
        height: 1022,
        useCORS: true,
        onrendered: function (canvas) {
          var picUrl = canvas.toDataURL('image/png');
          docDefinition.content[1] = {
            pageBreak: 'before', // 分页
            image: picUrl,
            fit: [520, 760]
          };
          call && call()
        }
      })
    }
  })
}

// 打印pdf
function printPDF() {
  builderDocDefinition(function () {
    pdfMake.createPdf(docDefinition).print();
  })
}

// 下载pdf
function downPDF() {
  builderDocDefinition(function () {
    pdfMake.createPdf(docDefinition).download(regObj.userName + '-进修申请表.pdf');
  })
}
