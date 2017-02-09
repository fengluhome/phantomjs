/**
 * Created by lu on 2017/2/8.
 */
const phantom = require('phantom');

(async function () {
  const instance = await phantom.create();
  const page = await instance.createPage();
  await page.on("onResourceRequested", function (requestData) {
    console.info('Requesting', requestData.url)
  });
  var postBody = 'user=username&password=password';
  const status = await page.open('http://www.baidu.com/');
  console.log(status);

  const content = await page.property('content');
  //console.log(content);

  /**
   *对页面就行dom解析
   */
  var info = await page.evaluate(function () {
    debugger
    var imgDom = document.querySelector("#lg img");
    var rect = imgDom.getBoundingClientRect();
    return {top: rect.top, left: rect.left, width: rect.width, height: rect.height};

  });

  async function toBase64(rect) {
    page.property('clipRect', {top: rect.top, left: rect.left, width: rect.width, height: rect.height})
    var str = await page.renderBase64();

    console.log(str);

  }

  function toImg(rect) {
    page.property('clipRect', {top: rect.top, left: rect.left, width: rect.width, height: rect.height})
    page.render('google_home.jpeg', {format: 'jpeg', quality: '100'});
  }

  toBase64(info);
  toImg(info);
  instance.exit();

}());