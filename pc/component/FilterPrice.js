((exp)=>{
    /*
        =-=-=-=-=-= component =-=-=-=-=-=
    */
    exp.COMP.FilterPrice = () => {
        return  `
            <div class="cont" data-id="filterTab-03">
                <input name="filterPrice" type="hidden" group="filterValue" value="0~999999999" />
                <div class="jqueryslider" data-event="jquerySlider">
                    <div class="left"><span data-event="slider-before">0</span><span class="unit">원 ~</span></div>
                    <div id="priceSlider" class="jqueryslider_range">
                        <div class="bars"></div>
                    </div>
                    <div class="right"><span data-event="slider-after">1,000,000</span><span class="unit">원 이상</span></div>
                </div>
            </div>
        `;
    };

    /*
        =-=-=-=-=-= private =-=-=-=-=-=
    */
    const priceData = [0, 50000, 100000, 200000, 300000, 400000, 500000, 1000000, 999999999];
    const MAX_DISPLAY_PRICE = 1000000; // 슬라이더에 표시될 최대 가격

    // [exports]
    const initPriceSlider = function(){
        // 가격 슬라이드 이동
        $('#priceSlider').slider({
            range: true,
            min: 0,
            max: priceData.length - 1,
            values: [0, priceData.length - 1],
            create: makeSpan,
            slide: function(event, ui) {
                updateSlideUI(priceData[ui.values[0]], priceData[ui.values[1]]);
            },
            change : function(event, ui) {
                let startPrice = priceData[ui.values[0]];
                let endPrice = priceData[ui.values[1]];

                // 시작과 끝 가격이 같을 경우 처리
                if(ui.handleIndex == 0 && startPrice == endPrice){
                    startPrice = priceData[ui.values[0]-1];
                    $('#priceSlider').slider('values', 0, ui.values[0]-1);
                }
                else if(ui.handleIndex == 1 && startPrice == endPrice){
                    endPrice = priceData[ui.values[1]+1];
                    $('#priceSlider').slider('values', 1, ui.values[1]+1);
                }

                updateSlideUI(startPrice, endPrice);
                $("[name='filterPrice']").val(startPrice + "~" + endPrice);
                setPriceFilterForm(startPrice, endPrice);
    
                if (startPrice == 0 && endPrice == priceData[priceData.length - 1]) {
                    $("#btnFilerPrice").text("가격");
                }else{
                    var sPrice = strAddComma(startPrice);
                    var ePrice = endPrice == priceData[priceData.length - 1] ? "1,000,000원 이상" : strAddComma(endPrice);
    
                    $("#btnFilerPrice").text(`${sPrice} ~ ${ePrice}`);
                }
            }
        });
    
        function makeSpan() {
            let stepValue = priceData.length - 1;
            let bars = '';
            for (let i = 0; i < stepValue; i++) {
                bars += '<span class="bar'+ i +'" style="left:' + ((i/stepValue)*100) + '%"></span>';
            }
            $('#priceSlider .bars').append(bars);
        }
    };

    function updateSlideUI(startPrice, endPrice) {
        // 가격 텍스트 업데이트
        $('[data-event="slider-before"]').text(strAddComma(startPrice));
    
        if (endPrice >= 999999999) {
            // 최대값일경우
            $('[data-event="slider-after"]').text(strAddComma(MAX_DISPLAY_PRICE));
            $('.jqueryslider .right .unit').text('원 이상');
        } else {
            $('[data-event="slider-after"]').text(strAddComma(endPrice));
            $('.jqueryslider .right .unit').text('원');
        }
    
         // 슬라이더 바 위치 계산 및 업데이트
        const startIdx = priceData.indexOf(startPrice);
        const endIdx = priceData.indexOf(endPrice);
        const changeDataStart = (startIdx / (priceData.length - 1)) * 100;
        const changeDataEnd = (endIdx / (priceData.length - 1)) * 100;
    
        // 슬라이더 바 위치 설정
        $('.ui-slider-range').css({
            'left': changeDataStart + '%',
            'width': (changeDataEnd - changeDataStart) + '%'
        });
        $('.ui-state-default').eq(0).css('left', changeDataStart + '%');
        $('.ui-state-default').eq(1).css('left', changeDataEnd + '%');
    }
    
    const setPriceFilterForm = function(sPrice, ePrice){
        const sPriceNum = Number(sPrice);
        const ePriceNum = Number(ePrice);
    
        $QUI.Filter.updateFilterForm({price:`${sPriceNum},${ePriceNum}`});
    }
    
    // [exports][뒤로가기] 가격 슬라이드 수동 설정
    const setPriceSlider = function(priceStr){
        const priceArray = priceStr.split(',');
        const sPrice = priceArray.length == 1 ? 0 : Number(priceArray[0]);
        const ePrice = priceArray.length == 1 ? 999999999 : Number(priceArray[1]);
    
        const sIdx = priceData.indexOf(sPrice);
        const eIdx = priceData.indexOf(ePrice);
    
        $('#priceSlider').slider('values', 0, sIdx);
        $('#priceSlider').slider('values', 1, eIdx);
        
        updateSlideUI(sPrice, ePrice);
    }

    /*
        =-=-=-=-=-= exports =-=-=-=-=-=
    */
    exp.initPriceSlider = initPriceSlider;
    exp.setPriceSlider = setPriceSlider;
})(window.$QUI.Filter);