(function(){
    function init(el){
        var g = {
            styl: '.style-scope.' + el.is,
            prop: {class: 'style-scope ' + el.is}
        };
        function gtag(name){
            return $('<'+name+' />').prop(g.prop);
        }
        function toggle(s){
            var j=s.indexOf('style-scope');
            return 0==j?'asc '+s:(('asc'===s.substr(0,3)?'dsc':'asc') + s.substr(3));
        }
        function sortCol(name,flag){
            for(var key=0;key<el.bits.cols.length;key++){
                if(el.bits.cols[key]==name)break;
            }
            el.bits.rows.sort(function(a,b){
                function cmp(x,y){
                    return x>y?1:(x<y?-1:0);
                };
                return (flag?1:-1)*cmp(a[key],b[key]);
            });
        }
        function head(cols){
            var tr=gtag('tr');
            for(var j in cols){
                var th=gtag('th').text(cols[j]);
                th.on('click',function(e){
                    var hc=$(e.target);
                    var dirs = toggle(hc.prop('class'));
	            hc.prop({class:dirs});
                    sortCol(e.currentTarget.textContent,'asc'==dirs.substr(0,3)?true:false);
                    body(g.tbody.empty(),el.bits.rows);
                });
                tr.append(th);
            }
            return gtag('thead').append(tr);
        }
        function body(parent,rows){
            for(var j in rows){
                var tr=gtag('tr');
                var r = rows[j];
                for(var k in r){
                    tr.append(gtag('td').text(r[k]));
                }
                parent.append(tr);
            }
        }
        function python(url,cb){
            $.ajax({
                url: url,
                dataType: "text",
                success: function(json){
	            var obj=$.parseJSON(json);
                    cb(obj);
                },
                error: function() {
	            alert('got some error');
                }
            });
        }
        python(el.url,function(x){
            el.bits = x;
            g.tbody = gtag('tbody');
            body(g.tbody,x.rows);
            var c=$('#g3-container'+g.styl);
            c.append(gtag('table').append(head(x.cols)).append(g.tbody));
        });
    }
    Polymer({
        is : "g3-table",
        properties:{
            id:{
                type: String
            },
            url:{
                type: String,
                value: null
            },
            bits:{
                type: Object
            }
        },
        ready: function(){
            init(this); //strive to be thisless
        }
    });
})();
