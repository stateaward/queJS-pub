((exp)=>{
    /*
        [queJS Function] product.js
        : 상품 관련 함수(기존 레거시 코드)
    */
    /*
        =-=-=-=-=-= private =-=-=-=-=-=
    */
    const setEqualEvent = function(){
        // 좋아요 클릭시
        $(document).on("click", ".button_toggle.equal, .button_equal", function(e) {
            // 로그인 체크
            comm.chkLogin().then((loginTf)=> {
                if (!loginTf) {
                    // 로그인 알럿 후 이동
                    showAlert2("로그인 후 이용가능합니다.", "알림", () => comm.goLogin());
                    return false;
                }
    
                // 이퀄 (좋아요)
                comm.setEqual($(this), function() {}, "B");
                var EqualChk = $(this).attr('godno');
                if($(this).hasClass("is_active")){
                    $('button[godno='+EqualChk+']').removeClass('is_active');
                    $('.button_equal[godno='+EqualChk+']').removeClass('is_active');
                }else{
                    $('button[godno='+EqualChk+']').addClass('is_active');
                    $('.button_equal[godno='+EqualChk+']').addClass('is_active');
                }
            });
        });
    }
    
    const goProductDetail = function(obj){
        // 구글 GA : Product Click
        var product = new Object();
        var actionList = new Object();
        var products = new Array();
        var dimension = new Object();
        var metric = new Object();
        var step ='click';

        try {
            product.id = $(obj).attr("godNo");
            product.name = $(obj).attr("godNm");
            product.brand = $(obj).attr("brndNm");
            product.category = $("input[name='fullDspNm']")?.val();
            product.position = $(obj).attr('tagIndex');

            actionList.currencyCode ='KRW';
            actionList.list = $("input[name='fullDspNm']")?.val()?.replaceAll('/','_');

            dimension.action = 'Click';
            dimension.category ='Ecommerce';

            products.push(product);
            GPGA.EcommerceSet(step, products, actionList, dimension, metric);
            GA4?.ECOMMERCE?.selectItem(obj); // 구글 GA4 전자상거래 - 상품선택

            // 이벤트 태깅
            GPGA.EVENT.setLabel(product.name);
        }
        catch (e) {
            console.log('goProductDetail 함수 ERROR');
            console.log(e.message);
        }
    
        setTimeout(function() {
            if ($(obj).attr("reviewViewYn") == "Y"){
                location.href='/product/'+$(obj).attr("godNo")+'/detail?reviewViewYn=Y';
            }
            else{
                location.href='/product/'+$(obj).attr("godNo")+'/detail';
            }
        }, 200);
    }

    /*
        =-=-=-=-=-= exports =-=-=-=-=-=
    */
    exp.PRODUCT = exp.PRODUCT || {};
    exp.PRODUCT.setEqualEvent = setEqualEvent;
    exp.PRODUCT.goProductDetail = goProductDetail;
})(window.$QFn);