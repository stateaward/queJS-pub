((exp)=>{
    /*
        =-=-=-=-=-= component =-=-=-=-=-=
    */
    exp.COMP.FilterGod = () => {
        const isBrndOtltYn = document.querySelector('#ctgryNonParams [name="brndOtltYn"]')?.value;

        return  `
            <div class="cont" data-id="filterTab-01">
                <div class="form_group row">
                    <div class="checkbox" onclick="$QUI.Filter.clickFilterGod('exclusiveGodYn', event)">
                        <input type="checkbox" name="filterGodOption" id="chk_exclusiveGodYn" group='filterValue' value="exclusiveGodYn">
                        <label for="chk_exclusiveGodYn"><span>EXCLUSIVE</span></label>
                    </div>
                    <div class="checkbox" onclick="$QUI.Filter.clickFilterGod('dcGodYn', event)">
                        <input type="checkbox" name="filterGodOption" id="chk_dcGodYn" group='filterValue' value="dcGodYn">
                        <label for="chk_dcGodYn"><span>할인상품</span></label>
                    </div>
                    <div class="checkbox" onclick="$QUI.Filter.clickFilterGod('excludeSoldoutGodYn', event)">
                        <input type="checkbox" name="filterGodOption" id="chk_excludeSoldoutGodYn" group='filterValue' value="excludeSoldoutGodYn">
                        <label for="chk_excludeSoldoutGodYn"><span>품절 상품 제외</span></label>
                    </div>
                    <div class="checkbox" onclick="$QUI.Filter.clickFilterGod('preOrderGodYn', event)">
                        <input type="checkbox" name="filterGodOption" id="chk_preOrderGodYn" group='filterValue' value="preOrderGodYn">
                        <label for="chk_preOrderGodYn"><span>PRE ORDER</span></label>
                    </div>
                    ${isBrndOtltYn == 'Y' ? `
                        <div class="checkbox" onclick="$QUI.Filter.clickFilterGod('eqlOtltYn', event)">
                            <input type="checkbox" name="filterGodOption" id="chk_eqlOtltYn" group='filterValue' value="eqlOtltYn">
                            <label for="chk_eqlOtltYn"><span>아울렛상품</span></label>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    };

    /*
        =-=-=-=-=-= private =-=-=-=-=-=
    */
    // [exports]
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