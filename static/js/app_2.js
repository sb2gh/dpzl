self = "undefined" != typeof window ? window : "undefined" != typeof WorkerGlobalScope && self instanceof WorkerGlobalScope ? self : {};
var Prism = function() {
    var e = /\blang(?:uage)?-(?!\*)(\w+)\b/i,
        t = self.Prism = {
            util: {
                encode: function(e) {
                    return e instanceof n ? new n(e.type, t.util.encode(e.content), e.alias) : "Array" === t.util.type(e) ? e.map(t.util.encode) : e.replace(/&/g, "&").replace(/</g, "<").replace(/\u00a0/g, " ")
                },
                type: function(e) {
                    return Object.prototype.toString.call(e).match(/\[object (\w+)\]/)[1]
                },
                clone: function(e) {
                    var n = t.util.type(e);
                    switch (n) {
                        case "Object":
                            var a = {};
                            for (var r in e) e.hasOwnProperty(r) && (a[r] = t.util.clone(e[r]));
                            return a;
                        case "Array":
                            return e.map(function(e) {
                                return t.util.clone(e)
                            })
                    }
                    return e
                }
            },
            languages: {
                extend: function(e, n) {
                    var a = t.util.clone(t.languages[e]);
                    for (var r in n) a[r] = n[r];
                    return a
                },
                insertBefore: function(e, n, a, r) {
                    r = r || t.languages;
                    var i = r[e];
                    if (2 == arguments.length) {
                        a = arguments[1];
                        for (var s in a) a.hasOwnProperty(s) && (i[s] = a[s]);
                        return i
                    }
                    var l = {};
                    for (var o in i)
                        if (i.hasOwnProperty(o)) {
                            if (o == n)
                                for (var s in a) a.hasOwnProperty(s) && (l[s] = a[s]);
                            l[o] = i[o]
                        }
                    return t.languages.DFS(t.languages, function(t, n) {
                        n === r[e] && t != e && (this[t] = l)
                    }), r[e] = l
                },
                DFS: function(e, n, a) {
                    for (var r in e) e.hasOwnProperty(r) && (n.call(e, r, e[r], a || r), "Object" === t.util.type(e[r]) ? t.languages.DFS(e[r], n) : "Array" === t.util.type(e[r]) && t.languages.DFS(e[r], n, r))
                }
            },
            highlightAll: function(e, n) {
                for (var a, r = document.querySelectorAll('code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'), i = 0; a = r[i++];) t.highlightElement(a, e === !0, n)
            },
            highlightElement: function(a, r, i) {
                for (var s, l, o = a; o && !e.test(o.className);) o = o.parentNode;
                if (o && (s = (o.className.match(e) || [, ""])[1], l = t.languages[s]), l) {
                    a.className = a.className.replace(e, "").replace(/\s+/g, " ") + " language-" + s, o = a.parentNode, /pre/i.test(o.nodeName) && (o.className = o.className.replace(e, "").replace(/\s+/g, " ") + " language-" + s);
                    var g = a.textContent;
                    if (g) {
                        g = g.replace(/^(?:\r?\n|\r)/, "");
                        var u = {
                            element: a,
                            language: s,
                            grammar: l,
                            code: g
                        };
                        if (t.hooks.run("before-highlight", u), r && self.Worker) {
                            var c = new Worker(t.filename);
                            c.onmessage = function(e) {
                                u.highlightedCode = n.stringify(JSON.parse(e.data), s), t.hooks.run("before-insert", u), u.element.innerHTML = u.highlightedCode, i && i.call(u.element), t.hooks.run("after-highlight", u)
                            }, c.postMessage(JSON.stringify({
                                language: u.language,
                                code: u.code
                            }))
                        } else u.highlightedCode = t.highlight(u.code, u.grammar, u.language), t.hooks.run("before-insert", u), u.element.innerHTML = u.highlightedCode, i && i.call(a), t.hooks.run("after-highlight", u)
                    }
                }
            },
            highlight: function(e, a, r) {
                var i = t.tokenize(e, a);
                return n.stringify(t.util.encode(i), r)
            },
            tokenize: function(e, n) {
                var a = t.Token,
                    r = [e],
                    i = n.rest;
                if (i) {
                    for (var s in i) n[s] = i[s];
                    delete n.rest
                }
                e: for (var s in n)
                    if (n.hasOwnProperty(s) && n[s]) {
                        var l = n[s];
                        l = "Array" === t.util.type(l) ? l : [l];
                        for (var o = 0; o < l.length; ++o) {
                            var g = l[o],
                                u = g.inside,
                                c = !!g.lookbehind,
                                p = 0,
                                d = g.alias;
                            g = g.pattern || g;
                            for (var f = 0; f < r.length; f++) {
                                var m = r[f];
                                if (r.length > e.length) break e;
                                if (!(m instanceof a)) {
                                    g.lastIndex = 0;
                                    var h = g.exec(m);
                                    if (h) {
                                        c && (p = h[1].length);
                                        var y = h.index - 1 + p,
                                            h = h[0].slice(p),
                                            b = h.length,
                                            v = y + b,
                                            w = m.slice(0, y + 1),
                                            k = m.slice(v + 1),
                                            P = [f, 1];
                                        w && P.push(w);
                                        var x = new a(s, u ? t.tokenize(h, u) : h, d);
                                        P.push(x), k && P.push(k), Array.prototype.splice.apply(r, P)
                                    }
                                }
                            }
                        }
                    }
                return r
            },
            hooks: {
                all: {},
                add: function(e, n) {
                    var a = t.hooks.all;
                    a[e] = a[e] || [], a[e].push(n)
                },
                run: function(e, n) {
                    var a = t.hooks.all[e];
                    if (a && a.length)
                        for (var r, i = 0; r = a[i++];) r(n)
                }
            }
        },
        n = t.Token = function(e, t, n) {
            this.type = e, this.content = t, this.alias = n
        };
    if (n.stringify = function(e, a, r) {
            if ("string" == typeof e) return e;
            if ("Array" === t.util.type(e)) return e.map(function(t) {
                return n.stringify(t, a, e)
            }).join("");
            var i = {
                type: e.type,
                content: n.stringify(e.content, a, r),
                tag: "span",
                classes: ["token", e.type],
                attributes: {},
                language: a,
                parent: r
            };
            if ("comment" == i.type && (i.attributes.spellcheck = "true"), e.alias) {
                var s = "Array" === t.util.type(e.alias) ? e.alias : [e.alias];
                Array.prototype.push.apply(i.classes, s)
            }
            t.hooks.run("wrap", i);
            var l = "";
            for (var o in i.attributes) l += o + '="' + (i.attributes[o] || "") + '"';
            return "<" + i.tag + ' class="' + i.classes.join(" ") + '" ' + l + ">" + i.content + "</" + i.tag + ">"
        }, !self.document) return self.addEventListener ? (self.addEventListener("message", function(e) {
        var n = JSON.parse(e.data),
            a = n.language,
            r = n.code;
        self.postMessage(JSON.stringify(t.util.encode(t.tokenize(r, t.languages[a])))), self.close()
    }, !1), self.Prism) : self.Prism;
    var a = document.getElementsByTagName("script");
    return a = a[a.length - 1], a && (t.filename = a.src, document.addEventListener && !a.hasAttribute("data-manual") && document.addEventListener("DOMContentLoaded", t.highlightAll)), self.Prism
}();
"undefined" != typeof module && module.exports && (module.exports = Prism), Prism.languages.markup = {
        comment: /<!--[\w\W]*?-->/g,
        prolog: /<\?.+?\?>/,
        doctype: /<!DOCTYPE.+?>/,
        cdata: /<!\[CDATA\[[\w\W]*?]]>/i,
        tag: {
            pattern: /<\/?[\w:-]+\s*(?:\s+[\w:-]+(?:=(?:("|')(\\?[\w\W])*?\1|[^\s'">=]+))?\s*)*\/?>/gi,
            inside: {
                tag: {
                    pattern: /^<\/?[\w:-]+/i,
                    inside: {
                        punctuation: /^<\/?/,
                        namespace: /^[\w-]+?:/
                    }
                },
                "attr-value": {
                    pattern: /=(?:('|")[\w\W]*?(\1)|[^\s>]+)/gi,
                    inside: {
                        punctuation: /=|>|"/g
                    }
                },
                punctuation: /\/?>/g,
                "attr-name": {
                    pattern: /[\w:-]+/g,
                    inside: {
                        namespace: /^[\w-]+?:/
                    }
                }
            }
        },
        entity: /&#?[\da-z]{1,8};/gi
    }, Prism.hooks.add("wrap", function(e) {
        "entity" === e.type && (e.attributes.title = e.content.replace(/&/, "&"))
    }), Prism.languages.css = {
        comment: /\/\*[\w\W]*?\*\//g,
        atrule: {
            pattern: /@[\w-]+?.*?(;|(?=\s*\{))/gi,
            inside: {
                punctuation: /[;:]/g
            }
        },
        url: /url\((?:(["'])(\\\n|\\?.)*?\1|.*?)\)/gi,
        selector: /[^\{\}\s][^\{\};]*(?=\s*\{)/g,
        string: /("|')(\\\n|\\?.)*?\1/g,
        property: /(\b|\B)[\w-]+(?=\s*:)/gi,
        important: /\B!important\b/gi,
        punctuation: /[\{\};:]/g,
        "function": /[-a-z0-9]+(?=\()/gi
    }, Prism.languages.markup && (Prism.languages.insertBefore("markup", "tag", {
        style: {
            pattern: /<style[\w\W]*?>[\w\W]*?<\/style>/gi,
            inside: {
                tag: {
                    pattern: /<style[\w\W]*?>|<\/style>/gi,
                    inside: Prism.languages.markup.tag.inside
                },
                rest: Prism.languages.css
            },
            alias: "language-css"
        }
    }), Prism.languages.insertBefore("inside", "attr-value", {
        "style-attr": {
            pattern: /\s*style=("|').*?\1/gi,
            inside: {
                "attr-name": {
                    pattern: /^\s*style/gi,
                    inside: Prism.languages.markup.tag.inside
                },
                punctuation: /^\s*=\s*['"]|['"]\s*$/,
                "attr-value": {
                    pattern: /.+/gi,
                    inside: Prism.languages.css
                }
            },
            alias: "language-css"
        }
    }, Prism.languages.markup.tag)), Prism.languages.clike = {
        comment: [{
            pattern: /(^|[^\\])\/\*[\w\W]*?\*\//g,
            lookbehind: !0
        }, {
            pattern: /(^|[^\\:])\/\/.*?(\r?\n|$)/g,
            lookbehind: !0
        }],
        string: /("|')(\\\n|\\?.)*?\1/g,
        "class-name": {
            pattern: /((?:(?:class|interface|extends|implements|trait|instanceof|new)\s+)|(?:catch\s+\())[a-z0-9_\.\\]+/gi,
            lookbehind: !0,
            inside: {
                punctuation: /(\.|\\)/
            }
        },
        keyword: /\b(if|else|while|do|for|return|in|instanceof|function|new|try|throw|catch|finally|null|break|continue)\b/g,
        "boolean": /\b(true|false)\b/g,
        "function": {
            pattern: /[a-z0-9_]+\(/gi,
            inside: {
                punctuation: /\(/
            }
        },
        number: /\b-?(0x[\dA-Fa-f]+|\d*\.?\d+([Ee]-?\d+)?)\b/g,
        operator: /[-+]{1,2}|!|<=?|>=?|={1,3}|&{1,2}|\|?\||\?|\*|\/|~|\^|%/g,
        ignore: /&(lt|gt|amp);/gi,
        punctuation: /[{}[\];(),.:]/g
    }, Prism.languages.javascript = Prism.languages.extend("clike", {
        keyword: /\b(break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|false|finally|for|function|get|if|implements|import|in|instanceof|interface|let|new|null|package|private|protected|public|return|set|static|super|switch|this|throw|true|try|typeof|var|void|while|with|yield)\b/g,
        number: /\b-?(0x[\dA-Fa-f]+|\d*\.?\d+([Ee][+-]?\d+)?|NaN|-?Infinity)\b/g,
        "function": /(?!\d)[a-z0-9_$]+(?=\()/gi
    }), Prism.languages.insertBefore("javascript", "keyword", {
        regex: {
            pattern: /(^|[^/])\/(?!\/)(\[.+?]|\\.|[^/\r\n])+\/[gim]{0,3}(?=\s*($|[\r\n,.;})]))/g,
            lookbehind: !0
        }
    }), Prism.languages.markup && Prism.languages.insertBefore("markup", "tag", {
        script: {
            pattern: /<script[\w\W]*?>[\w\W]*?<\/script>/gi,
            inside: {
                tag: {
                    pattern: /<script[\w\W]*?>|<\/script>/gi,
                    inside: Prism.languages.markup.tag.inside
                },
                rest: Prism.languages.javascript
            },
            alias: "language-javascript"
        }
    }),
    function() {
        if (self.Prism && self.document && document.querySelector) {
            var e = {
                js: "javascript",
                html: "markup",
                svg: "markup",
                xml: "markup",
                py: "python",
                rb: "ruby",
                ps1: "powershell",
                psm1: "powershell"
            };
            Array.prototype.slice.call(document.querySelectorAll("pre[data-src]")).forEach(function(t) {
                var n = t.getAttribute("data-src"),
                    a = (n.match(/\.(\w+)$/) || [, ""])[1],
                    r = e[a] || a,
                    i = document.createElement("code");
                i.className = "language-" + r, t.textContent = "", i.textContent = "Loading…", t.appendChild(i);
                var s = new XMLHttpRequest;
                s.open("GET", n, !0), s.onreadystatechange = function() {
                    4 == s.readyState && (s.status < 400 && s.responseText ? (i.textContent = s.responseText, Prism.highlightElement(i)) : i.textContent = s.status >= 400 ? "✖ Error " + s.status + " while fetching file: " + s.statusText : "✖ Error: File does not exist or is empty")
                }, s.send(null)
            })
        }
    }(), Prism.hooks.add("after-highlight", function(e) {
        var t = e.element.parentNode;
        if (t && /pre/i.test(t.nodeName) && -1 !== t.className.indexOf("line-numbers")) {
            var n, a = 1 + e.code.split("\n").length;
            lines = new Array(a), lines = lines.join("<span></span>"), n = document.createElement("span"), n.className = "line-numbers-rows", n.innerHTML = lines, t.hasAttribute("data-start") && (t.style.counterReset = "linenumber " + (parseInt(t.getAttribute("data-start"), 10) - 1)), e.element.appendChild(n)
        }
    }), Prism.languages.python = {
        comment: {
            pattern: /(^|[^\\])#.*?(\r?\n|$)/g,
            lookbehind: !0
        },
        string: /"""[\s\S]+?"""|'''[\s\S]+?'''|("|')(\\?.)*?\1/g,
        keyword: /\b(as|assert|break|class|continue|def|del|elif|else|except|exec|finally|for|from|global|if|import|in|is|lambda|pass|print|raise|return|try|while|with|yield)\b/g,
        "boolean": /\b(True|False)\b/g,
        number: /\b-?(0[box])?(?:[\da-f]+\.?\d*|\.\d+)(?:e[+-]?\d+)?j?\b/gi,
        operator: /[-+]|<=?|>=?|!|={1,2}|&{1,2}|\|?\||\?|\*|\/|~|\^|%|\b(or|and|not)\b/g,
        punctuation: /[{}[\];(),.:]/g
    }, Prism.hooks.add("before-highlight", function(e) {
        e.element.setAttribute("data-language", e.language)
    });