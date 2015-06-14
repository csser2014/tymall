(function(win,doc){
    var s = doc.createElement("script"), h = doc.getElementsByTagName("head")[0];
    if (!win.alimamatk_show) {
        s.charset = 'UTF-8';
        s.async = true;
        s.src = "http://a.alimama.cn/tkapi.js";
        s.kslite = "";
        h.insertBefore(s, h.firstChild);
    }
    var o = {
        pid: "mm_31546992_0_0"
    }
    win.alimamatk_onload = win.alimamatk_onload || [];
    win.alimamatk_onload.push(o);
})(window,document);