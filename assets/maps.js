var bbENVmap;

function ENV_initMap() {
    bbENVmap.intialize();
}

function ENV_map() {
    var t = this;
    bbENVmap = this;
    console.log(this.constructor.name);
    this.vars = {};
      this.data = [];
    this.map = '';
    this.view = function(ops) {
        var dfs = {
            'token': 'Envora_free',
            'name': 'ENV_maps_',
            'api': 'AIzaSyCHk1k1Xj_gzxjh10jN873yGvzxxF6qXbI_ji',
            'get_map': '',
            'get_list': '',
            'get_search': '',
            'display_stt': true,
            'center': true,
            'replace_market': false,
            'zoom': 8,
            'callback_google': 'ENV_initMap',
            'callback_search': function() {},
            'callback': function() {},
            'callback_remap': function() {},
            'callback_list_click': function() {},
            'icon_default': '',
            'data': [
                { 'lat': -25.363, 'lng': 131.044, 'name': 'Chau len ba', 'address': '', 'phone': '' }
            ]
        };
        ops = $.extend({}, dfs, ops);
        ops.nf = 'bbENVmap';
        ops.re = $('.' + ops.name + 'head_already').size();
        //ops.nf=t.constructor.name;
        //console.log(ops.data);
          this.data = ops.data;
        if (!ops.re) {
            t.vars = ops;

        } else {
            t.vars.re = ops.re;
            t.vars.data = ops.data;
            t.vars.replace_market = ops.replace_market;
            t.vars.callback_remap = ops.callback_remap;
        }

        get_token();
        $(ops.get_map).addClass(ops.name + '_div');
        var vv = { 'lat': 0, 'lng': 0, 'count': 0 };

        for (var i = 0; i < ops.data.length; i++) {
            ops.data[i].lat = parseFloat(ops.data[i].lat);
            ops.data[i].lng = parseFloat(ops.data[i].lng);
            vv.lat += ops.data[i].lat;
            vv.lng += ops.data[i].lng;
            vv.count++;
        }
        vv.lat = vv.lat / vv.count;
        vv.lng = vv.lng / vv.count;
        t.vars.mk_center = vv;

        if (!t.vars.re)
            ahead();
        else
            t.intialize();

    }

    function get_token() {
        if (t.vars.token == 'Envora_free') t.vars.api = 'AIzaSyCHk1k1Xj_gzxjh10jN873yGvzxxF6qXbI';
    }

    function ahead() {
        var ss = '&sensor=false&v=3&libraries=geometry';
        if (!t.vars.get_search) ss = '';
        var s = "<script src='https://maps.googleapis.com/maps/api/js?key=" + t.vars.api + ss + "&callback=" + t.vars.callback_google + "'  async defer></script>";
        $('head').append(s);
        addStyle();
    }

    function center_data() {
        t.setCenter(t.vars.mk_center.lat, t.vars.mk_center.lng);
    }

    function addStyle() {
        var s = '',
            n = t.vars.name;
        s += "." + n + "_div {min-height:300px;min-width:300px;}";
        s += "." + n + "_div img{max-height:inherit !important;} ";
        s += "." + n + "_div " + n + "html {}";
        s += "." + n + "html .lat,." + n + "html .lng{display:none;}";
        s += "." + n + "_div_search input {}";
        s += "." + n + "_div_search span:before {content:'Search';}";
        s = "<style id='" + t.vars.name + "head' >" + s + "</style>";
        $('head').append(s);
    }

    function add_list(d, stt) {
        return "<div onclick='" + t.vars.nf + ".select_market(" + stt + ")'>" + t.view_html(d, 'elist') + "</div>";
    }
    this.select_market = function(num) {
        t.vars.callback_list_click(t.vars.mk[num]);
        new google.maps.event.trigger(t.vars.mk[num], 'click');
        t.setCenter(t.vars.data[num].lat, t.vars.data[num].lng);

        //$(t.vars.mk[num]).trigger('click');
    }
    this.setCenter = function(a, b, c) {
        if (!c) c = new google.maps.LatLng(a, b);
        t.map.setCenter(c);
    }
    this.config = function() {}

    this.intialize = function() {
          this.view_maps(t);
        if (t.vars.get_search) {
            document.querySelector(t.vars.get_search).innerHTML = t.form_search();
        }
        if (t.vars.callback_remap) {
            t.vars.callback_remap();
        }
    }
    this.view_maps = function(obj) {
        obj.config();
        
        var vv = { 's': '' };
        if (!obj.vars.re) {
            vv.center = { lat: obj.vars.mk_center.lat, lng: obj.vars.mk_center.lng };
            if (obj.vars.center) {
                if (typeof obj.vars.center == 'object') {
                    vv.center = obj.vars.center;
                }
            }
            obj.map = new google.maps.Map(document.querySelector(obj.vars.get_map), {
                center: vv.center,
                zoom: t.vars.zoom,
            });
            $('#' + obj.vars.name + 'head').addClass(obj.vars.name + 'head_already');
            obj.vars.mk = [];
            obj.vars.window = [];
            obj.vars.exist = [];
        } else {
            center_data();
        }
        
        if (obj.vars.replace_market) {
            for (var i = 0; i < obj.vars.mk.length; i++) {
                obj.vars.mk[i].setMap(null);
            }
            obj.vars.mk = [];
            obj.vars.window = [];
            obj.vars.exist = [];
        }

        var di = obj.vars.data,
            d, df = {},
            ex;
        var count_m = obj.vars.mk.length;
        if (obj.vars.icon_default) df = { 'icon': obj.vars.icon_default };
        $.each(obj.vars.data, function(i, d) {

            //d=di[i];
            var kk = {};
            d.lat = parseFloat(d.lat);
            d.lng = parseFloat(d.lng);
            kk.id = d.lat + '_' + d.lng;

            if (obj.vars.exist.indexOf(kk.id) == -1) {
                obj.vars.exist.push(kk.id);
                //var ci=count_m+i;
                var ci = obj.vars.exist.length - 1;
                ex = {
                    position: { 'lat': d.lat, 'lng': d.lng },
                    map: obj.map,
                    title: d.name,
                };
                if (obj.vars.display_stt) ex.label = (ci + 1).toString();
                ex = $.extend({}, ex, df);
                obj.vars.mk[ci] = new google.maps.Marker(ex);
                obj.vars.window[ci] = new google.maps.InfoWindow({
                    content: obj.view_html(d)
                });
                obj.vars.mk[ci].addListener('click', function() {
                    for (var j = 0; j < obj.vars.exist.length; j++)
                        obj.vars.window[j].close();
                    obj.vars.window[ci].open(obj.map, obj.vars.mk[ci]);
                });
            }
            vv.s += add_list(d, obj.vars.exist.indexOf(kk.id));


        });
        if (obj.vars.get_list) {
            $(obj.vars.get_list).addClass(obj.vars.name + 'list');
            document.querySelector(obj.vars.get_list).innerHTML = vv.s;
        }
        
    }
    this.form_search = function() {
        var name = t.vars.name + '_input_search';
        return "<div class='" + t.vars.name + "_div_search'><input type='text' id='" + name + "'><span class='btn' onclick='" + t.vars.nf + ".search_near($(\"#" + name + "\").val())'></span></div>";
    }
    this.view_market = function(d) {

    }
    this.view_html = function(dd, cl) {
        var d = $.extend({}, {}, dd);
        var s = '';
        if (!cl) cl = 'window';
        $.each(d, function(k, v) {
            s += "<div class='" + k + "'>" + v + "</div>";
        })
        s = "<div class='" + t.vars.name + cl + ' ' + t.vars.name + "html'>" + s + "</div>";
        return s;
    }
    this.icon_type = function(type, ops) {
        function load(m, ob) {
            var vv = {};
            for (var i = 0; i < m.length; i++) {
                vv[m[i]] = ob[m[i]];
            }
        }
        if (type == 'image') {
            var m = ['url'];
            return load(m, ops);
        }
        if (type == 'image_custome') {
            var m = ['url', 'size', 'origin', 'anchor'];
            return load(m, ops);
        }
    }
    this.search_near = function(string, callback) {
//         if(!string)return false;
        string = string.toLowerCase();
        var calc_space=function(latLngA, latLngB)
        {
          return google.maps.geometry.spherical.computeDistanceBetween(latLngA, latLngB);
        }

        var a=null;
        var rt=-1;
        var list=[];
        for(var i=0;i<t.vars.data.length;i++)
        {
          list.push(new google.maps.LatLng(t.vars.data[i].lat, t.vars.data[i].lng));
        }

        var geocoder=new google.maps.Geocoder();
        geocoder.geocode({'address':string},function(results, status){

            //-------------------------------
          
            var new_search = t;
            
            
            var di = [], di_count = 0;
            
            $.each(bbENVmap.data, function(i, d) {
              
              if($(d.text).text().toLowerCase().indexOf(string) != -1){
                di_count++;
                  di.push(d);
              }

            });
          if( di_count == 0){
              alert(string + ' not found!');
            return false;
          }
              
              new_search.vars.data = di;
              bbENVmap.view_maps(new_search);
//           }
        });

    }

    $(document).on('keyup', '#ENV_maps__input_search', function(e){
//       var string = $(this).val();
//       if(!string) return false;
//       console.log( string );
    })
}