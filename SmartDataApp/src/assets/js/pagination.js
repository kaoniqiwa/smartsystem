(function(global) {
    var CustomPagination = function(el, options) {
        this.el = typeof el === "string" ? document.querySelector(el) : el;
        var default_options = {
            next_prev_links: "yes",
            inupt_forward: "yes",
            total: 10,
            count: 6,
            changePage: function(pageNum) {}
        };
        if (options) {
            for (var key in options) {
                default_options[key] = options[key]
            }
        }
        this.options = default_options;
        this.current_page = 1;
        this.times = 1;
        this.init()
    };
    CustomPagination.prototype = {
        init: function() {
            var that = this;
            this.destroy();
            var links = this.options.next_prev_links,
            prev_link_html = "",
            next_link_html = "";
            if (links && links.toLowerCase() === "yes") {
                prev_link_html = '<a class="prev-page mdi mdi-chevron-left" href="javascript:void(0)"></a>';
                next_link_html = '<a class="next-page mdi mdi-chevron-right" href="javascript:void(0)"></a>'
            }
            var inputs = this.options.inupt_forward,
            input_html = "";
            if (inputs && inputs.toLowerCase() === "yes") {
                input_html = '<div class="page-to">跳至<input type="text"   id="page_input" />页<span class="go">确定</span></div>'
            }
            var totals = parseInt(this.options.total),
            counts = parseInt(this.options.count),
            show_pages_html = "";
            if (totals) {
                var page_li_html = "";
                if (totals > counts) {
                    for (var i = 1,
                    len1 = counts; i < len1; i++) {
                        if (i === 1) {
                            page_li_html += '<li class="current-page">' + i + "</li>"
                        } else {
                            page_li_html += "<li>" + i + "</li>"
                        }
                    }
                    show_pages_html = "<ul>" + page_li_html + '<li class="ellipsis">…</li><li>' + totals + "</li>" + "</ul>"
                } else {
                    for (var j = 0,
                    len2 = totals; j < len2; j++) {
                        if (j === 0) {
                            page_li_html += '<li class="current-page">' + (j + 1) + "</li>"
                        } else {
                            page_li_html += "<li>" + (j + 1) + "</li>"
                        }
                    }
                    show_pages_html = "<ul>" + page_li_html + "</ul>"
                }
            }
            var custom_pagination_html = "";
            if (totals && counts) {
                custom_pagination_html = '<div class="custom-pagination">' + prev_link_html + show_pages_html + next_link_html + input_html + "</div>";
                this.el.innerHTML = custom_pagination_html;
                this.positionCenter();
                this.bindClickPage();
                if (links && links.toLowerCase() === "yes") {
                    that.addEvent(this.el.firstChild.querySelector(".prev-page"), "click",
                    function(e) { 
                        e = e.target ? e.target: e.srcElement;
                        if (!e.hasAttribute("disabled")) {
                            that.prevPage()
                        }
                    });
                    that.addEvent(this.el.firstChild.querySelector(".next-page"), "click",
                    function(e) {
                        e = e.target ? e.target: e.srcElement;
                        if (!e.hasAttribute("disabled")) {
                            that.nextPage()
                        }
                    })
                }
                if (inputs && inputs.toLowerCase() === "yes") {
                    that.addEvent(this.el.firstChild.querySelector(".go"), "click",
                    function(e) {
                        that.searchInput()
                    })
                }
            }
            this.disablePreNext();
            this.options.changePage(this.current_page)
        },
        reGeneratePageLetter: function() {
            var ul = this.el.firstChild.getElementsByTagName("ul")[0];
            ul.innerHTML = "";
            var end = this.current_page;
            var start = end - (this.options.count - 1);
            var checked = end - 1;
            var totals = parseInt(this.options.total);
            var counts = end;
            var page_li_html = "";
            if (totals > counts) {
                for (var i = start,
                len1 = counts; i < len1; i++) {
                    page_li_html += "<li>" + i + "</li>"
                }
                ul.innerHTML = page_li_html + '<li class="ellipsis">…</li><li>' + totals + "</li>"
            }
            this.positionCenter();
            this.bindClickPage();
            this.times--;
            ul.childNodes[(this.options.count - 1) - 1].click()
        },
        reGeneratePageBigger: function() {
            var ul = this.el.firstChild.getElementsByTagName("ul")[0];
            ul.innerHTML = "";
            var end = this.current_page;
            var start = end + 1;
            var totals = parseInt(this.options.total);
            var counts = parseInt(this.options.count) + end;
            var page_li_html = "";
            if (totals > counts) {
                for (var i = start,
                len1 = counts; i < len1; i++) {
                    page_li_html += "<li>" + i + "</li>"
                }
                ul.innerHTML = page_li_html + '<li class="ellipsis">…</li><li>' + totals + "</li>"
            } else {
                for (var j = end,
                len2 = totals; j < len2; j++) {
                    page_li_html += "<li>" + (j + 1) + "</li>"
                }
                ul.innerHTML = page_li_html
            }
            this.positionCenter();
            this.bindClickPage();
            this.times++;
            ul.childNodes[0].click()
        },
        prevPage: function() {
            var currentx_select = this.el.querySelector(".current-page");
            var pre_select = currentx_select.previousElementSibling || currentx_select.previousSibling;
            var should_to_page = this.current_page - 1;
            if (this.options.total > this.options.count) {
                var can_to_page = this.times * (this.options.count - 1) - (this.options.count - 1) + 1;
                if (should_to_page < can_to_page) {
                    this.reGeneratePageLetter()
                } else {
                    pre_select.click()
                }
            } else {
                pre_select.click()
            }
        },
        nextPage: function() {
            var currentx_select = this.el.querySelector(".current-page");
            var next_select = currentx_select.nextElementSibling || currentx_select.nextSibling;
            var should_to_page = this.current_page + 1;
            if (this.options.total > this.options.count) {
                var can_to_page = this.times * (this.options.count - 1);
                if (should_to_page > can_to_page) {
                    if (should_to_page === this.options.total) {
                        var arr = currentx_select.parentNode.childNodes;
                        var ellipsis = false;
                        for (var i = 0; i < arr.length; i++) {
                            if (arr[i].getAttribute("class") === "ellipsis") {
                                ellipsis = true;
                                break
                            }
                        }
                        if (!ellipsis) {
                            next_select.click();
                            return false
                        }
                    }
                    this.reGeneratePageBigger()
                } else {
                    next_select.click()
                }
            } else {
                next_select.click()
            }
        },
        destroy: function() {
            this.el.innerHTML = ""
        },
        disablePreNext: function() {
            if (this.options.total && this.options.count) {
                var links = this.options.next_prev_links;
                if (links && links.toLowerCase() === "yes") {
                    var prev = this.el.firstChild.querySelector(".prev-page");
                    if (this.current_page === 1) {
                        prev.style.cssText = "cursor: not-allowed;";
                        prev.setAttribute("disabled", true)
                    } else {
                        prev.removeAttribute("style");
                        prev.removeAttribute("disabled")
                    }
                    var next = this.el.firstChild.querySelector(".next-page");
                    if (this.current_page === this.options.total) {
                        next.style.cssText = "cursor: not-allowed;";
                        next.setAttribute("disabled", true)
                    } else {
                        next.removeAttribute("style");
                        next.removeAttribute("disabled")
                    }
                }
            }
        },
        positionCenter: function() {
            var w = parseInt(this.el.firstChild.offsetWidth);
            if (w) {
                var margin = "margin: 0 0 0 -" + Math.floor(w / 2) + "px;";
                this.el.firstChild.style.cssText = margin
            }
        },
        bindClickPage: function() {
            var that = this;
            var ul = this.el.firstChild.getElementsByTagName("ul")[0];
            var lis = ul.querySelectorAll("li");
            for (var l = 0; l < lis.length; l++) {
                if (lis[l].getAttribute("class") !== "ellipsis") { (function(l) {
                        that.addEvent(lis[l], "click",
                        function(e) {
                            var li_event = e.target ? e.target: e.srcElement;
                            var new_page = parseInt(li_event.innerHTML);
                            if (new_page !== that.current_page) {
                                if (new_page === that.options.total) {
                                    var judgeEllipsis = li_event.previousElementSibling || li_event.previousSibling;
                                    if (judgeEllipsis.getAttribute("class") === "ellipsis") {
                                        that.clickEndPage();
                                        return false
                                    }
                                }
                                li_event.setAttribute("class", "current-page");
                                var siblings = that.siblings(li_event);
                                for (var k = 0; k < siblings.length; k++) {
                                    siblings[k].removeAttribute("class")
                                }
                                that.current_page = new_page;
                                that.options.changePage(that.current_page);
                                that.disablePreNext()
                            }
                        })
                    })(l)
                }
            }
        },
        clickEndPage: function() {
            var totals = this.options.total;
            var counts = this.options.count;
            var times = Math.ceil(totals / (counts - 1));
            var remainder = totals % (counts - 1);
            var page_count = 0;
            if (remainder === 1) {
                times -= 1;
                page_count = counts
            } else {
                if (remainder === 0) {
                    page_count = counts - 1
                } else {
                    page_count = remainder
                }
            }
            var ul = this.el.firstChild.getElementsByTagName("ul")[0];
            ul.innerHTML = "";
            var page_li_html = "";
            for (var j = totals - page_count,
            len2 = totals; j < len2; j++) {
                page_li_html += "<li>" + (j + 1) + "</li>"
            }
            ul.innerHTML = page_li_html;
            this.positionCenter();
            this.bindClickPage();
            this.times = times;
            ul.childNodes[page_count - 1].click()
        },
        searchInput: function() {
            var input = this.el.firstChild.querySelector("input");
            var input_val = input.value;
            if (!(/(^[1-9]\d*$)/.test(input_val))) {
                input_val = 1;               
            }
            if (input_val) {
                input_val = parseInt(input_val);
                if (input_val < 0 || input_val === 0) {
                    input_val = 1
                } else {
                    if (input_val > this.options.total) {
                        input_val = this.options.total
                    }
                }
                var total = this.options.total;
                var count = this.options.count;
                var ul = this.el.firstChild.getElementsByTagName("ul")[0];
                if (total > count) {
                    var all_times = Math.ceil(total / (count - 1));
                    var remainder = total % (count - 1);
                    if (remainder === 1) {
                        all_times -= 1
                    }
                    if (total === input_val) {
                        this.clickEndPage()
                    } else {
                        var c_times = this.times;
                        var c_page = this.current_page;
                        var t_times = Math.ceil(input_val / (count - 1));
                        var t_remainder = input_val % (count - 1);
                        var t_page = input_val;
                        if (t_remainder === 0) {
                            t_remainder = count - 1
                        }
                        var page_li_html = "";
                        if (t_times < all_times) {
                            if (t_times === c_times) {
                                ul.childNodes[t_remainder - 1].click()
                            } else {
                                var start2 = (t_times - 1) * (count - 1);
                                var end2 = t_times * (count - 1);
                                for (var i = start2 + 1,
                                len1 = end2 + 1; i < len1; i++) {
                                    page_li_html += "<li>" + i + "</li>"
                                }
                                ul.innerHTML = page_li_html + '<li class="ellipsis">…</li><li>' + total + "</li>";
                                this.positionCenter();
                                this.bindClickPage();
                                this.times = t_times;
                                ul.childNodes[t_remainder - 1].click()
                            }
                        } else {
                            var start1 = (t_times - 1) * (count - 1);
                            for (var j = start1,
                            len2 = total; j < len2; j++) {
                                page_li_html += "<li>" + (j + 1) + "</li>"
                            }
                            ul.innerHTML = page_li_html;
                            this.positionCenter();
                            this.bindClickPage();
                            this.times = t_times;
                            ul.childNodes[t_remainder - 1].click()
                        }
                    }
                } else {
                    if (this.current_page !== input_val) {
                        ul.childNodes[input_val - 1].click()
                    }
                }
               input.value = ""
            }
        },
        addEvent: function(elem, type, fn) {
            if (elem.attachEvent) {
                elem.attachEvent("on" + type, fn);
                return
            }
            if (elem.addEventListener) {
                elem.addEventListener(type, fn, false)
            }
        },
        siblings: function(currentNode) {
            var siblings = [];
            var elseLi = currentNode.parentNode.children;
            for (var i = 0,
            elseLil = elseLi.length; i < elseLil; i++) {
                if (elseLi[i] !== currentNode && elseLi[i].getAttribute("class") !== "ellipsis") {
                    siblings.push(elseLi[i])
                }
            }
            return siblings
        }
    };
    if (typeof module !== "undefined" && module.exports) {
        module.exports = CustomPagination
    }
    if (typeof define === "function") {
        define(function() {
            return CustomPagination
        })
    }
    global.CustomPagination = CustomPagination
})(this);