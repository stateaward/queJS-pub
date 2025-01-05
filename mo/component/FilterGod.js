((exp)=>{
    /*
        =-=-=-=-=-= component =-=-=-=-=-=
    */
    exp.COMP.FilterGod = () => {
        const isBrndOtltYn = document.querySelector('#ctgryNonParams [name="brndOtltYn"]')?.value;

        return  `
            <div class="option_set">
                <div class="tit_area">상품 정보</div>
                <div class="con_area medium">
                    <ul class="option_box option_2">
                        <li class="option" onclick="$QUI.Filter.clickFilterGod('exclusiveGodYn', event)">
                            <input id="chk_exclusiveGodYn" type="checkbox" name="filterGodOption" group="filterValue" value="exclusiveGodYn">
                            <label for="chk_exclusiveGodYn">EXCLUSIVE</label>
                        </li>
                        <li class="option" onclick="$QUI.Filter.clickFilterGod('dcGodYn', event)">
                            <input id="chk_dcGodYn" type="checkbox" name="filterGodOption" group="filterValue" value="dcGodYn">
                            <label for="chk_dcGodYn">할인상품</label>
                        </li>
                        <li class="option" onclick="$QUI.Filter.clickFilterGod('excludeSoldoutGodYn', event)">
                            <input id="chk_excludeSoldoutGodYn" type="checkbox" name="filterGodOption" group="filterValue" value="excludeSoldoutGodYn">
                            <label for="chk_excludeSoldoutGodYn">품절 상품 제외</label>
                        </li>
                        <li class="option" onclick="$QUI.Filter.clickFilterGod('preOrderGodYn', event)">
                            <input id="chk_preOrderGodYn" type="checkbox" name="filterGodOption" group="filterValue" value="preOrderGodYn">
                            <label for="chk_preOrderGodYn">PRE ORDER</label>
                        </li>
                        ${isBrndOtltYn == 'Y' ? `
                            <li class="option" onclick="$QUI.Filter.clickFilterGod('eqlOtltYn', event)">
                                <input id="chk_eqlOtltYn" type="checkbox" name="filterGodOption" group="filterValue" value="eqlOtltYn">
                                <label for="chk_eqlOtltYn">아울렛상품</label>
                            </li>
                        ` : ''}
                    </ul>
                </div>
            </div>
        `;
    };

    /*
        =-=-=-=-=-= private =-=-=-=-=-=
    */
    const clickFilterGod = function(value, event){
        event?.preventDefault(); // 기본 동작 방지
        
        if($QFn.getCurrentInfo().page_name == 'EXCLUSIVE' && value == 'exclusiveGodYn') return;
    
        const target = document.querySelector(`#chk_${value}`);
    
        if(target.checked == false){
            target.checked = true;
            $QUI.Filter.updateFilterForm({[value]:'Y'});
        }else{
            target.checked = false;
            $QUI.Filter.updateFilterForm({[value]:'N'});
        }
    
        return target.checked;
    }

    /*
        =-=-=-=-=-= exports =-=-=-=-=-=
    */
   exp.clickFilterGod = clickFilterGod;

})(window.$QUI.Filter);