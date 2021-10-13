! function(e) {
	function checkNeedToConvertCurrency() {
        return (window.show_multiple_currencies && Currency.currentCurrency != shopCurrency) || window.show_auto_currency;
    }
    function t(t) {
        this.headerSearch = e(t), this.headerSearchForm = this.headerSearch.find(".header-search__form"), this.headerInput = this.headerSearch.find(".header-search__input"), this.headerSearchResults = this.headerSearch.find(".header-search__results-wrapper"), this.searchResultsTemplate = Template7.compile(e("#search-results-template").html()), this.PopularProducts = this.headerSearch.find(".header-search__product"), this.searchMode = "product", this.searchTrending = e(".quickSearchResultsWrap .header-search__trending .item-tag"), this.trending = e(".header-search__trending"), this.searchWrapper = this.headerSearch.find(".quickSearchResultsWrap"), this.headerInput.focus(function(t) {
            t.stopPropagation(), e(this).closest(".header-search").find(".quickSearchResultsWrap").show(), e(".highlight").on("click", function(t) {
                t.preventDefault();
                var h = e(t.target).attr("href");
                window.location.href = h
            })
        }), e(document).mouseup(function(t) {
            var h = e(".search-form");
            h.is(t.target) || 0 !== h.has(t.target).length || h.find(".quickSearchResultsWrap").hide()
        }), this.headerInput.on("focusin", e.proxy(this._focusin, this)), this.headerInput.on("keyup", e.proxy(this._initSearch, this))
    }
    t.prototype._initSearch = function(t) {
        var h = e(t.target);
        13 != (t.keyCode ? t.keyCode : t.which) && (clearTimeout(h.data("timeout")), h.data("timeout", setTimeout(e.proxy(this._doSearch, this), 250)))
    }, t.prototype._doSearch = function(e) {
        if ("" === this.headerInput.val().trim()) return this.headerSearchResults.empty(), this.searchTrending.show(), this.PopularProducts.show(), this.searchWrapper.show(), void this.trending.show();
        this.headerSearchResults.html(this.searchResultsTemplate({
            is_loading: !0
        })), this.headerInput.val().length > 2 ? (this.searchWrapper.hide(), this._doCompleteSearch()) : (this.headerSearchResults.html(this.searchResultsTemplate({
            is_show: !1
        })), this.searchTrending.show(), this.PopularProducts.show(), this.searchWrapper.show()), "none" == this.searchTrending.css("display") ? this.trending.hide() : this.trending.show()
    }, t.prototype._doCompleteSearch = function(t) {
        var h = this;
        e.ajax({
            method: "GET",
            url: window.router + "/search?view=json",
            dataType: "json",
            data: {
                q: this.headerInput.val() + "*",
                type: this.searchMode
            }
        }).then(function(t) {
            h.headerSearchResults.html(h.searchResultsTemplate({
                is_show: !0,
                is_loading: !1,
                results: t.results,
                has_results: t.results.length > 0,
                results_count: t.results_count,
                results_label: t.results_label,
                results_url: t.url + "&type=" + h.searchMode
            })), h.PopularProducts.hide();
            var r = h.headerInput.val().toLowerCase();
            if (checkNeedToConvertCurrency()) {
                Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), 'span.money', 'money_format');
            }
            t && t.length ? (h.searchTrending.filter(function(t) {
                e(this).toggle(e(this).find(".highlight span").text().toLowerCase().indexOf(r) > -1)
            }), h.trending.show()) : h.trending.hide(), h.searchWrapper.show()
        })
    }, e.fn.Search = function(h) {
        var r = !1,
            s = arguments;
        return "string" == typeof h && (r = h), this.each(function() {
            var a = e.data(this, "plugin_Search");
            a || r ? r && callMethod(a, r, Array.prototype.slice.call(s, 1)) : e.data(this, "plugin_Search", new t(this, h))
        })
    }, e("[data-ajax-search]").Search()
}(jQuery)