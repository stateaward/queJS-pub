((exp)=>{
    /*
        =-=-=-=-=-= component =-=-=-=-=-=
    */
    exp.COMP.FilterColor = () => {
        const colorDict = [
            {"id": "color35", "label": "BEIGE", "className": "chip_beige" },
            {"id": "color36", "label": "BROWN", "className": "chip_brown" },
            {"id": "color37", "label": "CORAL", "className": "chip_coral" },
            {"id": "color38", "label": "EMERALD", "className": "chip_emerald" },
            {"id": "color39", "label": "GOLD", "className": "chip_gold" },
            {"id": "color40", "label": "WHITE", "className": "chip_white" },
            {"id": "color41", "label": "GREY", "className": "chip_grey" },
            {"id": "color42", "label": "BLUE", "className": "chip_blue" },
            {"id": "color43", "label": "NAVY", "className": "chip_navy" },
            {"id": "color44", "label": "GREEN", "className": "chip_green" },
            {"id": "color45", "label": "KHAKY", "className": "chip_khaky" },
            {"id": "color46", "label": "MINT", "className": "chip_mint" },
            {"id": "color47", "label": "YELLOW", "className": "chip_yellow" },
            {"id": "color48", "label": "ORANGE", "className": "chip_orange" },
            {"id": "color49", "label": "RED", "className": "chip_red" },
            {"id": "color50", "label": "PINK", "className": "chip_pink" },
            {"id": "color51", "label": "SEPIA", "className": "chip_sepia" },
            {"id": "color52", "label": "VIOLET", "className": "chip_violet" },
            {"id": "color53", "label": "WHITE<br>BRASS", "className": "chip_white_brass" },
            {"id": "color54", "label": "BLACK", "className": "chip_black" },
            {"id": "color55", "label": "STRIPE", "className": "chip_stripe" },
            {"id": "color56", "label": "ETC", "className": "chip_etc" }
        ];

        return  `
            <div class="option_set">
                <div class="tit_area">컬러</div>
                <div class="con_area medium">
                    <ul class="option_box color_chip option_4">
                        ${colorDict.map(option => $QUI.Filter.COMP.FilterColorOption(option)).join('')}
                    </ul>
                </div>
            </div>
        `;
    };
    
    exp.COMP.FilterColorOption = ({id, value, className, label}) => {
        return  `
            <li class="option" onclick="$QUI.Filter.clickFilterColor('${id}', event)">
                <input type="checkbox" name="filterColorCds" id="chk_${id}" value="${id}" group="filterValue">
                <label for="chk_${id}">
                    <span class="${className}"></span>${label}
                </label>
            </li>
        `;
    };

    /*
        =-=-=-=-=-= private =-=-=-=-=-=
    */
    // [exports] 컬러 필터 클릭
    const clickFilterColor = function(id, event){
        event?.preventDefault();
        const target = document.querySelector(`#chk_${id}`);
    
        if(target.checked == false){
            target.checked = true;
            $QUI.Filter.updateFilterFormMultiple('color', 'add', target.value);
        }else{
            target.checked = false;
            $QUI.Filter.updateFilterFormMultiple('color', 'remove', target.value);
        }
    
        return target.checked;
    }
    
    // [exports] (뒤로가기) 컬러값 수동 셋팅
    const setColorFilterByString = function(value){
        // 선택 초기화
        const checkedArr = document.querySelectorAll('.color_chip [name=filterColorCds]:checked');
        checkedArr.forEach(item => {
            item.checked = false;
        });
        
        if(value != '' && value != null){
            const colorArray = value.split(',');
            colorArray.forEach(colorId => {
                clickFilterColor(colorId, null);
            });
        }
    }

    /*
        =-=-=-=-=-= exports =-=-=-=-=-=
    */
   exp.clickFilterColor = clickFilterColor;
   exp.setColorFilterByString = setColorFilterByString;

})(window.$QUI.Filter);